import { createSlice } from "@reduxjs/toolkit";
import { fetchWithAuth } from '../lib/fetchWithAuth';

const initialState = {
  email: localStorage.getItem("email") || null,
  access_token: localStorage.getItem("access_token") || null,
  refresh_token: localStorage.getItem("refresh_token") || null,
  isAuthenticated: !!localStorage.getItem("access_token"),
  user: null
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    login: (state, action) => {
      // Ensure onboarding_complete is false by default if not present
      const user = {
        ...action.payload.user,
        onboarding_complete: action.payload.user?.onboarding_complete ?? false
      };
      state.user = user;
      state.access_token = action.payload.access_token;
      state.refresh_token = action.payload.refresh_token;
      state.email = action.payload.email;
      state.isAuthenticated = true;
      localStorage.setItem("access_token", action.payload.access_token);
      localStorage.setItem("refresh_token", action.payload.refresh_token);
      localStorage.setItem("email", action.payload.email);
      localStorage.setItem("user", JSON.stringify(user));
    },
    logout: (state) => {
      state.user = null;
      state.access_token = null;
      state.refresh_token = null;
      state.email = null;
      state.isAuthenticated = false;
      localStorage.clear();
    },
    updateUser: (state, action) => {
      // Ensure onboarding_complete is false by default if not present
      const user = {
        ...action.payload,
        onboarding_complete: action.payload?.onboarding_complete ?? false
      };
      state.user = user;
      localStorage.setItem("user", JSON.stringify(user));
    },
    setToken: (state, action) => {
      state.access_token = action.payload;
      state.isAuthenticated = !!action.payload;
      if (action.payload) {
        localStorage.setItem("access_token", action.payload);
      } else {
        localStorage.removeItem("access_token");
      }
    },
  },
});

export const { login, logout, updateUser, setToken } = authSlice.actions;

// Thunk for fetching current user
export const fetchCurrentUser = () => async (dispatch, getState) => {
  const { access_token } = getState().auth;
  if (!access_token) return;

  try {
    const response = await fetchWithAuth(
      "https://bichance-production-a30f.up.railway.app/api/v1/users/me",
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    if (response.ok) {
      const userData = await response.json();
      console.log("Fetched user data:", userData);
      dispatch(updateUser(userData));
    } else {
      // Token might be invalid, logout
      dispatch(logout());
    }
  } catch (error) {
    console.error("Failed to fetch current user:", error);
    // Don't logout on network errors, just log the error
  }
};

export default authSlice.reducer;
