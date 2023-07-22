import { createSlice } from "@reduxjs/toolkit";

type Player = {
  displayName: string;
  roundScore: number;
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
    addPlayer: (state, action) => {
      const { displayName } = action.payload;

      state.players.push({
        displayName,
        roundScore: 0,
        totalScore: 0,
      });
    },
    updatePlayer: (state, action) => {
      const { displayName, roundScore, totalScore } = action.payload;

      const player = state.players.find(
        (player) => player.displayName === displayName
      );

      if (player) {
        player.roundScore = roundScore;
        player.totalScore = totalScore;
      }
    },
  },
});

export const { addPlayer, updatePlayer } = playersSlice.actions;
