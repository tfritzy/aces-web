import React from "react";
import { Board } from "Game/Board";
import "./index.css";
import { SignIn } from "Menu/SignIn";

export const App = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false);

  if (isAuthenticated) {
    return <Board />;
  }

  return <SignIn setIsAuthenticated={setIsAuthenticated} />;
};
