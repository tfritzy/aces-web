import React from "react";
import "./index.css";
import { GameMenu } from "GameMenu/GameMenu";
import { Game } from "Game/Game";

export enum AppState {
  MENU,
  GAME,
}

const generatePlayerId = () => {
  return "player_" + Math.random().toString(9).substring(2, 6);
};

export const App = (): JSX.Element => {
  const [state, setState] = React.useState<AppState>(AppState.MENU);
  const [gameId, setGameId] = React.useState<string>("");
  const [displayName, setDisplayName] = React.useState<string>(
    generatePlayerId()
  );

  const handleGameEnter = async (gameId: string) => {
    setGameId(gameId);
    setState(AppState.GAME);
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
    case AppState.GAME:
      return <Game displayName={displayName} gameId={gameId} />;
    default:
      return <div>Invalid state</div>;
  }
};
