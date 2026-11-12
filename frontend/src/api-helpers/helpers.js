import api from "./api";

const errorMessage = (err) =>
  err.response?.data?.message ||
  (err.request
    ? "Cannot reach the server. Please try again later."
    : err.message || "Something went wrong");

// Always resolves with response data or throws an Error with a readable message
const unwrap = async (request) => {
  try {
    const res = await request;
    return res.data;
  } catch (err) {
    throw new Error(errorMessage(err));
  }
};

const toPayload = (d) => ({
  title: d.title,
  description: d.description,
  location: d.location,
  image: d.imageUrl,
  date: d.date,
});

export const getAllPosts = () => unwrap(api.get("/posts"));

export const sendAuthRequest = (isSignup, { name, email, password }) =>
  unwrap(
    api.post(
      `/user/${isSignup ? "signup" : "login"}`,
      isSignup ? { name, email, password } : { email, password }
    )
  );

export const addPost = (data) => unwrap(api.post("/posts", toPayload(data)));

export const getPostDetails = (id) => unwrap(api.get(`/posts/${id}`));

export const postUpdate = (data, id) =>
  unwrap(api.put(`/posts/${id}`, toPayload(data)));

export const postDelete = (id) => unwrap(api.delete(`/posts/${id}`));

export const getUserDetails = () => unwrap(api.get("/user/me"));
