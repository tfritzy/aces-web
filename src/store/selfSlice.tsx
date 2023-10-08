import { createSlice } from "@reduxjs/toolkit";

type Self = {
  displayName: string;
  id: string;
  token: string;
  darkMode: boolean;
};

const initialGameState: Self = {
  displayName: "",
  id: "",
  token: "",
  darkMode: false,
};

export const selfSlice = createSlice({
  name: "self",
  initialState: initialGameState,
  reducers: {
    setDisplayName: (state, action: { payload: string }) => {
      state.displayName = action.payload;
    },
    setUserId: (state, action: { payload: string }) => {
      state.id = action.payload;
    },
    setToken: (state, action: { payload: string }) => {
      state.token = action.payload;
    },
    setDarkMode: (state, action: { payload: boolean }) => {
      state.darkMode = action.payload;
    },
  },
});

export const { setDisplayName, setUserId, setToken, setDarkMode } =
  selfSlice.actions;
