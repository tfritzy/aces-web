import React from "react";
import "./index.css";
import { Board } from "Game/Board";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { GameMenu } from "GameMenu/GameMenu";
import { useDispatch } from "react-redux";
import Cookies from "universal-cookie";
import { generateId } from "helpers/generateId";
import { setToken, setUserId } from "store/selfSlice";

const players = [
  {
    displayName: "Wolf",
    score: 0,
    total: 54,
  },
  {
    displayName: "Bruce",
    score: 84,
    total: 86,
  },
  {
    displayName: "Sue",
    score: 23,
    total: 42,
  },
  {
    displayName: "Tyler",
    score: 42,
    total: 124,
  },
];

const router = createBrowserRouter([
  {
    path: "/",
    element: <GameMenu />,
  },
  {
    path: "game/:gameId",
    element: <Board />,
  },
]);

export const App = (): JSX.Element => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    const cookies = new Cookies();
    let token = cookies.get("token");
    if (!token) {
      token = generateId("tkn", 12);
      cookies.set("token", token, { path: "/" });
    }
    dispatch(setToken(token));

    let playerId = cookies.get("playerId");
    if (!playerId) {
      playerId = generateId("plyr", 12);
      cookies.set("playerId", playerId, { path: "/" });
    }
    dispatch(setUserId(playerId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="">
      <div className="w-full h-screen bg-white dark:bg-gray-900">
        <base href="/" />
        <RouterProvider router={router} />
      </div>
    </div>
  );
};
