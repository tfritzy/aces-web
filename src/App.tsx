import React from "react";
import "./index.css";
import { GameMenu } from "GameMenu/GameMenu";
import { isSwitchStatement } from "typescript";
import { Board } from "Game/Board";
import { Lobby } from "Lobby/Lobby";

export enum AppState {
  MENU,
  LOBBY,
  GAME,
}

export const App = () => {
  const [state, setState] = React.useState<AppState>(AppState.MENU);
  const [gameId, setGameId] = React.useState<string>("");

  switch (state) {
    case AppState.MENU:
      return <GameMenu setState={setState} setGameId={setGameId} />;
    case AppState.LOBBY:
      return <Lobby gameId={gameId} />;
    case AppState.GAME:
      return <Board />;
  }
};
