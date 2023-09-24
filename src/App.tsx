import React from "react";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { GameMenu } from "GameMenu/GameMenu";
import { useDispatch } from "react-redux";
import Cookies from "universal-cookie";
import { generateId } from "helpers/generateId";
import { setToken, setUserId } from "store/selfSlice";
import { Background } from "components/Background";
import { Game } from "Game/Game";

const router = createBrowserRouter([
  {
    path: "/",
    element: <GameMenu shown />,
  },
  {
    path: "/:gameId",
    element: <Game />,
  },
  {
    path: "/:gameId/join",
    element: <GameMenu shown isJoinSpecificMenu />,
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
    <div className="select-none dark">
      <div className="w-full h-screen bg-gray-50 dark:bg-slate-900">
        <base href="/" />
        <Background />
        <RouterProvider router={router} />
      </div>
    </div>
  );
};
