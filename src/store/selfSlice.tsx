import { createSlice } from "@reduxjs/toolkit";

type Self = {
  displayName: string;
  id: string;
  token: string;
};

const initialGameState: Self = {
  displayName: "",
  id: "",
  token: "",
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
  },
});

export const { setDisplayName, setUserId, setToken } = selfSlice.actions;
