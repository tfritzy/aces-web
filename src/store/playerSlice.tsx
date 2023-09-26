import { createSlice } from "@reduxjs/toolkit";
import { Card } from "Game/Types";

export type Player = {
  id: string;
  displayName: string;
  scorePerRound: number[];
  totalScore: number;
  mostRecentGroupedCards: Card[][];
  mostRecentUngroupedCards: Card[];
};

interface PlayersState {
  players: Player[];
}

const initialPlayersState: PlayersState = {
  players: [],
};

export const playersSlice = createSlice({
  name: "players",
  initialState: initialPlayersState,
  reducers: {
    addPlayer: (state, action: { payload: Player }) => {
      const player = action.payload;
      if (!player.scorePerRound) {
        player.scorePerRound = [];
      }
      state.players.push(player);
    },
    updatePlayer: (
      state,
      action: {
        payload: {
          playerId: string;
          totalScore: number;
          roundScore: number;
          groupedCards: Card[][];
          ungroupedCards: Card[];
        };
      }
    ) => {
      const player = state.players.find(
        (player) => player.id === action.payload.playerId
      );

      if (player) {
        player.totalScore = action.payload.totalScore;
        player.mostRecentGroupedCards = action.payload.groupedCards;
        player.mostRecentUngroupedCards = action.payload.ungroupedCards;

        if (!player.scorePerRound) {
          player.scorePerRound = [];
        }

        player.scorePerRound.push(action.payload.roundScore);
      }
    },
    setPlayers: (state, action: { payload: Player[] }) => {
      state.players = action.payload;
      state.players.forEach((player) => {
        if (!player.scorePerRound) {
          player.scorePerRound = [];
        }
        if (!player.mostRecentGroupedCards) {
          player.mostRecentGroupedCards = [];
        }
        if (!player.mostRecentUngroupedCards) {
          player.mostRecentUngroupedCards = [];
        }
      });
    },
  },
});

export const { addPlayer, updatePlayer, setPlayers } = playersSlice.actions;
