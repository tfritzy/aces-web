import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { Board } from "Game/Board";
import "./index.css";
import { SignIn } from "SignInMenu/SignIn";
import { GameMenu } from "GameMenu/GameMenu";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<SignIn />}>
        <Route index element={<SignIn />} />
        <Route path="menu" element={<GameMenu />} />
        <Route path="game" element={<Board />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
