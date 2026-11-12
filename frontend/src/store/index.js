import { createSlice, configureStore } from "@reduxjs/toolkit";

const read = (key) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const token = read("token");
const userId = read("userId");

const initialState = {
  isLoggedIn: Boolean(token && userId),
  token: token && userId ? token : null,
  userId: token && userId ? userId : null,
  name: token && userId ? read("userName") : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, { payload }) {
      state.isLoggedIn = true;
      state.token = payload.token;
      state.userId = payload.user.id;
      state.name = payload.user.name;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.token = null;
      state.userId = null;
      state.name = null;
    },
  },
});

export const authActions = authSlice.actions;

export const store = configureStore({ reducer: { auth: authSlice.reducer } });

// Keep the session in localStorage so a page refresh doesn't log the user out
store.subscribe(() => {
  const { isLoggedIn, token, userId, name } = store.getState().auth;
  try {
    if (isLoggedIn) {
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("userName", name || "");
    } else {
      ["token", "userId", "userName"].forEach((k) => localStorage.removeItem(k));
    }
  } catch {
    /* storage unavailable (private mode): session just won't persist */
  }
});
