import { createSlice } from "@reduxjs/toolkit";
import { Card } from "Game/Types";

export enum GameState {
  Invalid,
  Setup,
  Playing,
  Finished,
  TurnSummary,
}

type Game = {
  id: string;
  state: GameState;
  round: number;
  turn: number;
  pile: Card[];
  hand: Card[];
  deckSize: number;
};

const initialGameState: Game = {
  id: "",
  state: GameState.Invalid,
  pile: [],
  hand: [],
  deckSize: 0,
  round: 0,
  turn: 0,
};

export const gameSlice = createSlice({
  name: "game",
  initialState: initialGameState,
  reducers: {
    setState: (state, action: { payload: GameState }) => {
      state.state = action.payload;
    },
    addToPile: (state, action: { payload: Card }) => {
      state.pile.push(action.payload);
    },
    removeTopFromPile: (state) => {
      state.pile.pop();
    },
    setPile: (state, action: { payload: Card[] }) => {
      state.pile = action.payload;
    },
    setDeckSize: (state, action: { payload: number }) => {
      state.deckSize = action.payload;
    },
    setRound: (state, action: { payload: number }) => {
      state.round = action.payload;
    },
    setTurn: (state, action: { payload: number }) => {
      state.turn = action.payload;
    },
    setGameId: (state, action: { payload: string }) => {
      state.id = action.payload;
    },
    setHand: (state, action: { payload: Card[] }) => {
      state.hand = action.payload;
    },
  },
});

export const {
  setGameId,
  setState,
  addToPile,
  removeTopFromPile,
  setDeckSize,
  setRound,
  setTurn,
  setHand,
  setPile,
} = gameSlice.actions;
