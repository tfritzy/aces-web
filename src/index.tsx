import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "store/store";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

// Calculate the viewport height in a 'dynamic' way and set a CSS variable with the value
function setVHVariable() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
}

// Initial setup
setVHVariable();
// Make sure to re-calculate on resize
window.addEventListener("resize", setVHVariable);

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
