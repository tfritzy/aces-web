import React from "react";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { GameMenu } from "GameMenu/GameMenu";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "universal-cookie";
import { generateId } from "helpers/generateId";
import { setDarkMode, setToken, setUserId } from "store/selfSlice";
import { Background } from "components/Background";
import { Game } from "Game/Game";
import { RootState } from "store/store";
import { LandingPage } from "Documentation/LandingPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/lobby",
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
  const darkMode = useSelector((state: RootState) => state.self.darkMode);

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

    const systemDarkMode = window.matchMedia("(prefers-color-scheme: dark)");
    const darkModeCookie = cookies.get("darkMode");
    if (darkModeCookie) {
      dispatch(setDarkMode(darkModeCookie === "true"));
    } else {
      dispatch(setDarkMode(systemDarkMode.matches));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={darkMode ? "dark" : ""}>
      <Background />
      <div className="w-full h-screen bg-gray-50 dark:bg-slate-900">
        <base href="/" />
        <RouterProvider router={router} />
      </div>
    </div>
  );
};
