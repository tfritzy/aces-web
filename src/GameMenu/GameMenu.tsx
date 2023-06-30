import { AppState } from "App";
import { API_URL } from "Constants";
import React, { useEffect, useState } from "react";

type GameMenuProps = {
  setState: (state: AppState) => void;
  setGameId: (gameId: string) => void;
};

const generatePlayerId = () => {
  return "player_" + Math.random().toString(9).substring(2, 6);
};

export const GameMenu = (props: GameMenuProps) => {
  const [displayName, setDisplayName] = useState(generatePlayerId());
  const [joinGameInput, setJoinGameInput] = useState("");

  const openWebsocket = async () => {
    let res = await fetch(`${API_URL}/api/negotiate`, {
      headers: {
        "user-id": displayName,
      },
    });
    let url = await res.json();
    let ws = new WebSocket(url.url);
    ws.onopen = () => console.log("connected");
    ws.onmessage = (event) => {
      console.log("recieved event", event);
    };
  };

  const handleCreateGame = async () => {
    console.log("creating game");
    fetch(`${API_URL}/api/create_game`, {
      method: "POST",
      headers: {
        "user-id": displayName,
      },
    }).then(async (res) => {
      console.log("created game", res);
      if (res.ok) {
        const body = await res.json();
        console.log("created game", body);
        // handleGameEnter(body.Id);
      }
    });
  };

  const handleJoinGame = () => {
    handleGameEnter(joinGameInput);
  };

  const handleGameEnter = async (gameId: string) => {
    await openWebsocket();
    props.setState(AppState.LOBBY);
    props.setGameId(gameId);
  };

  return (
    <div className="grid place-content-center h-screen h-48 text-white">
      <div className="flex flex-col space-y-12">
        <button onClick={handleCreateGame}>Create Game</button>

        <div className="flex flex-col">
          <div className="text-black">
            <input
              type="text"
              value={joinGameInput}
              placeholder="AIE-JCS"
              onChange={(e) => setJoinGameInput(e.target.value)}
            />
          </div>

          <button onClick={handleJoinGame}>Join Game</button>
        </div>

        <div>
          <div>Display name</div>
          <div className="text-black">
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
