import React, { useEffect, useState } from "react";
import { Board } from "./Board";

const negotiate = async () => {
  // negotiate
  let res = await fetch(`${window.location.origin}/api/negotiate`, {
    credentials: "include",
  });
  let url = await res.json();
  // connect
  let ws = new WebSocket(url.url);
  ws.onopen = () => console.log("connected");
  ws.onmessage = (event) => {
    console.log("recieved message", event.data);
  };
};

export const Game = () => {
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);

  useEffect(() => {
    negotiate();
  }, []);

  if (isGameStarted) {
    return <Board />;
  }
};
