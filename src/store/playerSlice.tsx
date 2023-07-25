import { createSlice } from "@reduxjs/toolkit";

type Player = {
  displayName: string;
  roundScores: number[];
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
        roundScores: [],
        totalScore: 0,
      });
    },
    updatePlayer: (state, action) => {
      const { displayName, totalScore } = action.payload;

      const player = state.players.find(
        (player) => player.displayName === displayName
      );

      if (player) {
        player.totalScore = totalScore;
      }
    },
    setPlayers: (state, action) => {
      state.players = action.payload;
    },
  },
});

export const { addPlayer, updatePlayer, setPlayers } = playersSlice.actions;
