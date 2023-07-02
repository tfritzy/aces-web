import React, { useEffect, useState } from "react";
import { Board } from "Game/Board";
import { API_URL } from "Constants";
import { Lobby } from "Game/Lobby";
import { Message, MessageType } from "Game/Messages";

type GameProps = {
  displayName: string;
  gameId: string;
};

export const Game = (props: GameProps): JSX.Element => {
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [websocket, setWebsocket] = React.useState<WebSocket | null>(null);
  const [players, setPlayers] = useState<string[]>([]);

  const handleMessage = (message: Message) => {
    console.log("handling message", message);
    switch (message.type) {
      case MessageType.JoinGame:
        setPlayers([...players, message.displayName]);
        break;
      default:
        console.error("unhandled message", message);
    }
  };

  useEffect(() => {
    const openWebsocket = async (displayName: string, gameId: string) => {
      let res = await fetch(`${API_URL}/api/negotiate`, {
        headers: {
          "user-id": displayName,
          "game-id": gameId,
        },
      });
      let url = await res.json();
      let ws = new WebSocket(url.url);
      ws.onopen = () => console.log("websocket connected");
      ws.onmessage = (event) => {
        console.log("recieved message", event);
        handleMessage(JSON.parse(event.data));
      };

      // Sleep for a bit so that the connection resolves and the player is known to pub sub.
      await new Promise((resolve) => setTimeout(resolve, 2000));

      let joinResp = await fetch(`${API_URL}/api/join_game_group`, {
        method: "POST",
        headers: {
          "user-id": displayName,
          "game-id": gameId,
        },
      });
      console.log("joined game group", joinResp);

      return ws;
    };

    openWebsocket(props.displayName, props.gameId).then((websocket) =>
      setWebsocket(websocket)
    );
  }, []);

  return (
    <div>
      <Lobby gameId={props.gameId} players={players} />
      <Board />
    </div>
  );
};
