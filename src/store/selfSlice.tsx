import { createSlice } from "@reduxjs/toolkit";

type Self = {
  displayName: string;
  id: string;
};

const initialGameState: Self = {
  displayName: "",
  id: "",
};

export const selfSlice = createSlice({
  name: "self",
  initialState: initialGameState,
  reducers: {
    setDisplayName: (state, action) => {
      const displayName = action.payload;
      state.displayName = displayName;
    },
    setUserId: (state, action) => {
      const id = action.payload;
      state.id = id;
    },
  },
});

export const { setDisplayName, setUserId } = selfSlice.actions;
