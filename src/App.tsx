import React from "react";
import "./index.css";
import { Board } from "Game/Board";

export const App = (): JSX.Element => {
  return (
    <div className="w-full h-screen bg-gray-900">
      <Board />
    </div>
  );
};
