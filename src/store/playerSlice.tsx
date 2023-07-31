import { createSlice } from "@reduxjs/toolkit";

export type Player = {
  id: string;
  displayName: string;
  scorePerRound: number[];
  totalScore: number;
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
      state.players.push(action.payload);
    },
    updatePlayer: (
      state,
      action: {
        payload: { playerId: string; totalScore: number; roundScore: number };
      }
    ) => {
      const player = state.players.find(
        (player) => player.id === action.payload.playerId
      );

      if (player) {
        player.totalScore = action.payload.totalScore;

        if (!player.scorePerRound) {
          player.scorePerRound = [];
        }

        player.scorePerRound.push(action.payload.roundScore);
      }
    },
    setPlayers: (state, action) => {
      state.players = action.payload;
    },
  },
});

export const { addPlayer, updatePlayer, setPlayers } = playersSlice.actions;
