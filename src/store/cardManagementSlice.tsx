import { createSlice } from "@reduxjs/toolkit";

export const NULL_HELD_INDEX = -3;
export const DECK_HELD_INDEX = -2;
export const PILE_HELD_INDEX = -1;

type CardManagement = {
  heldIndex: number;
  dropSlotIndex: number | null;
  disabled: boolean;
};

const initialState: CardManagement = {
  heldIndex: NULL_HELD_INDEX,
  dropSlotIndex: null,
  disabled: false,
};

export const cardManagementSlice = createSlice({
  name: "cardManagement",
  initialState: initialState,
  reducers: {
    resetCards: () => {
      return initialState;
    },
    setHeldIndex: (state, action: { payload: number }) => {
      state.heldIndex = action.payload;
    },
    setDropSlotIndex: (state, action: { payload: number | null }) => {
      state.dropSlotIndex = action.payload;
    },
    setDisabled: (state, action: { payload: boolean }) => {
      state.disabled = action.payload;
    },
  },
});

export const { setHeldIndex, setDropSlotIndex, resetCards, setDisabled } =
  cardManagementSlice.actions;
