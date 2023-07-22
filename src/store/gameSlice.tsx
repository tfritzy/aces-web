import { createSlice } from "@reduxjs/toolkit";
import { Card } from "Game/Types";

export enum GameState {
  None,
  Lobby,
  TurnSummary,
  Playing,
}

type Game = {
  id: string;
  state: GameState;
  round: number;
  turn: number;
  pile: Card[];
  deckSize: number;
};

const initialGameState: Game = {
  id: "",
  state: GameState.None,
  pile: [],
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
    incrementRound: (state) => {
      state.round++;
    },
    setTurn: (state, action) => {
      const turn = action.payload;
      state.turn = turn;
    },
    setGameId: (state, action) => {
      const id = action.payload;
      state.id = id;
    },
  },
});

export const {
  setGameId,
  setState,
  addToPile,
  removeTopFromPile,
  setDeckSize,
  incrementRound,
  setTurn,
  setPile,
} = gameSlice.actions;
