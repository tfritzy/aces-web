import { createSlice } from "@reduxjs/toolkit";
import { Card } from "Game/Types";
import { getGroups } from "helpers/getGroupedCards";

export enum GameState {
  Invalid,
  Setup,
  Playing,
  Finished,
  TurnSummary,
}

export enum TurnPhase {
  Invalid,
  Drawing,
  Discarding,
  Ending,
}

type Game = {
  id: string;
  state: GameState;
  round: number;
  turn: number;
  pile: Card[];
  hand: Card[];
  deckSize: number;
  turnPhase: TurnPhase;
};

const initialGameState: Game = {
  id: "",
  state: GameState.Invalid,
  pile: [],
  hand: [],
  deckSize: 0,
  round: 0,
  turn: 0,
  turnPhase: TurnPhase.Drawing,
};

export const gameSlice = createSlice({
  name: "game",
  initialState: initialGameState,
  reducers: {
    resetAll: () => {
      return initialGameState;
    },
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
      const groups = getGroups(action.payload, state.round);
      for (let i = 0; i < groups.length; i++) {
        action.payload[i] = { ...action.payload[i], isGrouped: groups[i] };
      }

      state.hand = action.payload;
    },
    setTurnPhase: (state, action: { payload: TurnPhase }) => {
      state.turnPhase = action.payload;
    },
  },
});

export const {
  resetAll,
  setGameId,
  setState,
  addToPile,
  removeTopFromPile,
  setDeckSize,
  setRound,
  setTurn,
  setHand,
  setPile,
  setTurnPhase,
} = gameSlice.actions;
