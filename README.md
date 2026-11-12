# Travel Diaries with MUI

Share travel diaries with photos, location and date. Users sign up, log in, and can add, edit and delete their own diaries; everyone can browse all diaries.

**Stack:** React 18, Redux Toolkit, MUI, React Router, Axios / Node.js, Express, MongoDB (Mongoose), JWT.

## Run locally

Requirements: Node.js 18+ and a MongoDB instance (local or Atlas).

```bash
# backend
cd backend
cp .env.example .env      # fill in MONGODB_URI and JWT_SECRET
npm install
npm run dev               # http://localhost:5000

# frontend (second terminal)
cd frontend
cp .env.example .env      # REACT_APP_API_URL, default http://localhost:5000
npm install
npm start                 # http://localhost:3000
```

## Tests

```bash
cd backend && npm test                      # API tests, needs MongoDB (uses MONGODB_URI or a local "travel-diaries-test" db, which it wipes)
cd frontend && CI=true npm test             # UI tests
```

## API

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/user/signup` | no | Create account, returns `{ token, user }` |
| POST | `/user/login` | no | Returns `{ token, user }` |
| GET | `/user/me` | yes | Own profile with posts |
| GET | `/user/:id` | no | Public profile (name and posts) |
| GET | `/posts` | no | All posts, newest first |
| GET | `/posts/:id` | no | One post |
| POST | `/posts` | yes | Create post (author taken from the token) |
| PUT | `/posts/:id` | yes, owner | Update post |
| DELETE | `/posts/:id` | yes, owner | Delete post |

Protected routes expect `Authorization: Bearer <token>`.

## Notes

- Passwords are hashed with bcrypt and never returned by the API.
- Login and signup are rate limited; CORS is restricted by `CLIENT_URL`.
- Images are stored as URLs, there is no file upload.
