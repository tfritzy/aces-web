import { createSlice } from "@reduxjs/toolkit";

type Settings = {
  dark?: boolean;
};

const initialSettingsState: Settings = {};

export const settingsSlice = createSlice({
  name: "settings",
  initialState: initialSettingsState,
  reducers: {
    setDarkMode: (state, action: { payload: boolean }) => {
      state.dark = action.payload;
    },
  },
});

export const { setDarkMode } = settingsSlice.actions;
