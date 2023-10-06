import { createSlice } from "@reduxjs/toolkit";
import { Card } from "Game/Types";

export const DECK_HELD_INDEX = -2;
export const PILE_HELD_INDEX = -1;

type CardManagement = {
  heldIndex: number | null;
  dropSlotIndex: number | null;
  disabled: boolean;
  onTheWayOut: Card[];
};

const initialState: CardManagement = {
  heldIndex: null,
  dropSlotIndex: null,
  disabled: false,
  onTheWayOut: [],
};

export const cardManagementSlice = createSlice({
  name: "cardManagement",
  initialState: initialState,
  reducers: {
    resetCards: () => {
      return initialState;
    },
    setHeldIndex: (state, action: { payload: number | null }) => {
      state.heldIndex = action.payload;
    },
    setDropSlotIndex: (state, action: { payload: number | null }) => {
      state.dropSlotIndex = action.payload;
    },
    setDisabled: (state, action: { payload: boolean }) => {
      state.disabled = action.payload;
    },
    setOnTheWayOut: (state, action: { payload: Card[] }) => {
      state.onTheWayOut = action.payload;
    },
  },
});

export const {
  setHeldIndex,
  setDropSlotIndex,
  resetCards,
  setDisabled,
  setOnTheWayOut,
} = cardManagementSlice.actions;
