import React from "react";
import "./index.css";
import { GameMenu } from "GameMenu/GameMenu";
import { isSwitchStatement } from "typescript";
import { Board } from "Game/Board";
import { Lobby } from "Lobby/Lobby";
import { API_URL } from "Constants";

export enum AppState {
  MENU,
  LOBBY,
  GAME,
}

const generatePlayerId = () => {
  return "player_" + Math.random().toString(9).substring(2, 6);
};

export const App = () => {
  const [state, setState] = React.useState<AppState>(AppState.MENU);
  const [gameId, setGameId] = React.useState<string>("");
  const [displayName, setDisplayName] = React.useState<string>(
    generatePlayerId()
  );

  const openWebsocket = async () => {
    console.log("opening websocket");
    let res = await fetch(`${API_URL}/api/negotiate`, {
      headers: {
        "user-id": displayName,
      },
    });
    let url = await res.json();
    let ws = new WebSocket(url.url);
    ws.onopen = () => console.log("websocket connected");
    ws.onmessage = (event) => {
      console.log("recieved event", event);
    };
  };

  const handleGameEnter = async (gameId: string) => {
    setGameId(gameId);
    setState(AppState.LOBBY);
    await openWebsocket();
  };

  switch (state) {
    case AppState.MENU:
      return (
        <GameMenu
          displayName={displayName}
          setDisplayName={setDisplayName}
          onGameEnter={handleGameEnter}
        />
      );
    case AppState.LOBBY:
      return <Lobby gameId={gameId} />;
    case AppState.GAME:
      return <Board />;
  }
};
