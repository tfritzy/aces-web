import React from "react";
import "./index.css";
import { Board } from "Game/Board";
import { RoundSummary } from "Game/RoundSummary";
import { Toast } from "components/Toast";
import { Provider } from "react-redux";
import { store } from "store/store";

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

export const App = (): JSX.Element => {
  return (
    <div className="dark">
      <div className="w-full h-screen bg-white dark:bg-slate-900">
        <Provider store={store}>
          <Board />
        </Provider>
      </div>
    </div>
  );
};
