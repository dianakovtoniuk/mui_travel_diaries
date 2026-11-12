import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import request from "supertest";

process.env.JWT_SECRET = "test-secret";
process.env.MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/travel-diaries-test";

const { default: app } = await import("../app.js");

const post = {
  title: "Lisbon",
  description: "Tram 28 and pastel de nata",
  image: "https://example.com/lisbon.jpg",
  location: "Lisbon, Portugal",
  date: "2024-05-01",
};

let tokenA, tokenB, postId, userAId;

before(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  await mongoose.connection.dropDatabase();
});

after(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

test("health check and unknown route", async () => {
  await request(app).get("/health").expect(200);
  await request(app).get("/nope").expect(404);
});

test("signup validates input", async () => {
  await request(app).post("/user/signup").send({}).expect(422);
  await request(app)
    .post("/user/signup")
    .send({ name: "A", email: "bad", password: "123456" })
    .expect(422);
  await request(app)
    .post("/user/signup")
    .send({ name: "A", email: "a@a.com", password: "123" })
    .expect(422);
});

test("signup, duplicate email, login", async () => {
  const a = await request(app)
    .post("/user/signup")
    .send({ name: "Anna", email: "Anna@Test.com", password: "secret1" })
    .expect(201);
  assert.ok(a.body.token);
  assert.equal(a.body.user.email, "anna@test.com");
  assert.equal(a.body.user.password, undefined);
  tokenA = a.body.token;
  userAId = a.body.user.id;

  await request(app)
    .post("/user/signup")
    .send({ name: "Anna2", email: "anna@test.com", password: "secret1" })
    .expect(409);

  await request(app)
    .post("/user/login")
    .send({ email: "anna@test.com", password: "wrong" })
    .expect(401);
  await request(app)
    .post("/user/login")
    .send({ email: "nobody@test.com", password: "secret1" })
    .expect(401);

  const ok = await request(app)
    .post("/user/login")
    .send({ email: "anna@test.com", password: "secret1" })
    .expect(200);
  assert.ok(ok.body.token);

  const b = await request(app)
    .post("/user/signup")
    .send({ name: "Bob", email: "bob@test.com", password: "secret2" })
    .expect(201);
  tokenB = b.body.token;
});

test("write routes require a valid token", async () => {
  await request(app).post("/posts").send(post).expect(401);
  await request(app)
    .post("/posts")
    .set("Authorization", "Bearer garbage")
    .send(post)
    .expect(401);
  await request(app).get("/user/me").expect(401);
});

test("create post validates and stores", async () => {
  await request(app)
    .post("/posts")
    .set("Authorization", `Bearer ${tokenA}`)
    .send({ ...post, title: "   " })
    .expect(422);
  await request(app)
    .post("/posts")
    .set("Authorization", `Bearer ${tokenA}`)
    .send({ ...post, image: "javascript:alert(1)" })
    .expect(422);

  const res = await request(app)
    .post("/posts")
    .set("Authorization", `Bearer ${tokenA}`)
    .send(post)
    .expect(201);
  postId = res.body.post._id;
  assert.equal(res.body.post.user, userAId);
});

test("public listing never exposes passwords or emails", async () => {
  const list = await request(app).get("/posts").expect(200);
  assert.equal(list.body.posts.length, 1);
  assert.equal(list.body.posts[0].user.name, "Anna");
  assert.equal(list.body.posts[0].user.password, undefined);
  assert.equal(list.body.posts[0].user.email, undefined);

  const users = await request(app).get("/user").expect(200);
  assert.equal(JSON.stringify(users.body).includes("password"), false);
  assert.equal(JSON.stringify(users.body).includes("@"), false);
});

test("profile returns own posts and email, no password", async () => {
  const me = await request(app)
    .get("/user/me")
    .set("Authorization", `Bearer ${tokenA}`)
    .expect(200);
  assert.equal(me.body.user.email, "anna@test.com");
  assert.equal(me.body.user.password, undefined);
  assert.equal(me.body.user.posts.length, 1);
  assert.equal(me.body.user.posts[0].title, "Lisbon");
});

test("only the owner can edit or delete", async () => {
  await request(app)
    .put(`/posts/${postId}`)
    .set("Authorization", `Bearer ${tokenB}`)
    .send({ title: "Hacked" })
    .expect(403);
  await request(app)
    .delete(`/posts/${postId}`)
    .set("Authorization", `Bearer ${tokenB}`)
    .expect(403);

  const upd = await request(app)
    .put(`/posts/${postId}`)
    .set("Authorization", `Bearer ${tokenA}`)
    .send({ title: "Lisbon 2024" })
    .expect(200);
  assert.equal(upd.body.post.title, "Lisbon 2024");
  assert.equal(upd.body.post.location, "Lisbon, Portugal");
});

test("bad ids and missing posts", async () => {
  await request(app).get("/posts/not-an-id").expect(400);
  await request(app).get("/posts/64b7f0f0f0f0f0f0f0f0f0f0").expect(404);
  await request(app)
    .delete("/posts/64b7f0f0f0f0f0f0f0f0f0f0")
    .set("Authorization", `Bearer ${tokenA}`)
    .expect(404);
});

test("delete removes post and unlinks it from the user", async () => {
  await request(app)
    .delete(`/posts/${postId}`)
    .set("Authorization", `Bearer ${tokenA}`)
    .expect(200);
  await request(app).get(`/posts/${postId}`).expect(404);

  const me = await request(app)
    .get("/user/me")
    .set("Authorization", `Bearer ${tokenA}`)
    .expect(200);
  assert.equal(me.body.user.posts.length, 0);
});
