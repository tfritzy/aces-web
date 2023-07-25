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
    setState: (state, action) => {
      const newState = action.payload;
      state.state = newState;
    },
    addToPile: (state, action) => {
      const card = action.payload;
      state.pile.push(card);
    },
    removeTopFromPile: (state) => {
      state.pile.pop();
    },
    setPile: (state, action) => {
      const pile = action.payload;
      state.pile = pile;
    },
    setDeckSize: (state, action) => {
      const size = action.payload;
      state.deckSize = size;
    },
    setRound: (state, action) => {
      state.round = action.payload;
    },
    setTurn: (state, action) => {
      const turn = action.payload;
      state.turn = turn;
    },
    setGameId: (state, action) => {
      const id = action.payload;
      state.id = id;
    },
    setHand: (state, action) => {
      const hand = action.payload;
      state.hand = hand;
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
