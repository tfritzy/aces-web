import { createSlice } from "@reduxjs/toolkit";

export const NULL_HELD_INDEX = -3;
export const DECK_HELD_INDEX = -2;
export const PILE_HELD_INDEX = -1;

type CardManagement = {
  heldIndex: number;
  dropSlotIndex: number | null;
  mousePos: { x: number; y: number };
};

const initialState: CardManagement = {
  heldIndex: NULL_HELD_INDEX,
  dropSlotIndex: null,
  mousePos: { x: 0, y: 0 },
};

export const cardManagementSlice = createSlice({
  name: "cardManagement",
  initialState: initialState,
  reducers: {
    setHeldIndex: (state, action: { payload: number }) => {
      state.heldIndex = action.payload;
    },
    setDropSlotIndex: (state, action: { payload: number | null }) => {
      state.dropSlotIndex = action.payload;
    },
    setMousePos: (state, action: { payload: { x: number; y: number } }) => {
      state.mousePos = action.payload;
    },
  },
});

export const { setHeldIndex, setDropSlotIndex, setMousePos } =
  cardManagementSlice.actions;
