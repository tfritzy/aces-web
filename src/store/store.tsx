import { configureStore } from "@reduxjs/toolkit";
import { playersSlice } from "store/playerSlice";
import { gameSlice } from "store/gameSlice";
import { selfSlice } from "store/selfSlice";
import { cardManagementSlice } from "store/cardManagementSlice";

export const store = configureStore({
  reducer: {
    players: playersSlice.reducer,
    game: gameSlice.reducer,
    self: selfSlice.reducer,
    cardManagement: cardManagementSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
