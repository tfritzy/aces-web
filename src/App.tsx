import React from "react";
import "./index.css";
import { Board } from "Game/Board";
import { RoundSummary } from "Game/RoundSummary";

// const players = [
//   {
//     displayName: "Wolf",
//     score: 0,
//     total: 54,
//   },
//   {
//     displayName: "Bruce",
//     score: 84,
//     total: 86,
//   },
//   {
//     displayName: "Sue",
//     score: 23,
//     total: 42,
//   },
//   {
//     displayName: "Tyler",
//     score: 42,
//     total: 124,
//   },
// ];

export const App = (): JSX.Element => {
  return (
    <div className="">
      <div className="w-full h-screen bg-white dark:bg-slate-900">
        <Board />
      </div>
    </div>
  );
};
