import React from "react";
import "./index.css";
import { Board } from "Game/Board";
import { Provider } from "react-redux";
import { store } from "store/store";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { GameMenu } from "GameMenu/GameMenu";

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
    element: (
      <Provider store={store}>
        <GameMenu />
      </Provider>
    ),
  },
  {
    path: "game/:gameId",
    element: (
      <div className="w-full h-screen bg-white dark:bg-slate-900">
        <Provider store={store}>
          <Board />
        </Provider>
      </div>
    ),
  },
]);

export const App = (): JSX.Element => {
  return <RouterProvider router={router} />;
};
