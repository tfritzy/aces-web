import React from "react";
import "./index.css";
import { GameMenu } from "GameMenu/GameMenu";
import { Game } from "Game/Game";
import Cookies from "universal-cookie";

export enum AppState {
  MENU,
  GAME,
}

const generateId = (prefix: string, length: number) => {
  return (
    prefix +
    "_" +
    Math.random()
      .toString(9)
      .substring(2, 2 + length)
  );
};

export const App = (): JSX.Element => {
  const [state, setState] = React.useState<AppState>(AppState.MENU);
  const [gameId, setGameId] = React.useState<string>("");
  const [userId, setUserId] = React.useState<string>("");
  const [players, setPlayers] = React.useState<string[]>([]);
  const [displayName, setDisplayName] = React.useState<string>(
    generateId("player", 4)
  );

  const handleGameEnter = async (gameId: string, players: string[]) => {
    setGameId(gameId);
    setPlayers(players);
    setState(AppState.GAME);
  };

  React.useEffect(() => {
    const cookies = new Cookies();
    let id = cookies.get("unique-id");
    if (!id) {
      id = generateId("uniq", 12);
      cookies.set("unique-id", id, { path: "/" });
    }
    setUserId(id);
  }, []);

  switch (state) {
    case AppState.MENU:
      return (
        <GameMenu
          userId={userId}
          displayName={displayName}
          setDisplayName={setDisplayName}
          onGameEnter={handleGameEnter}
        />
      );
    case AppState.GAME:
      return (
        <Game
          userId={userId}
          displayName={displayName}
          gameId={gameId}
          initialPlayers={players}
        />
      );
    default:
      return <div>Invalid state</div>;
  }
};
