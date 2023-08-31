import { Suit } from "Game/Types";
import { FlyingCard } from "./FlyingCard";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import { GameState } from "store/gameSlice";

export const Background = () => {
  const gameState = useSelector((state: RootState) => state.game.state);

  const showGraphic =
    gameState === GameState.Invalid || gameState === GameState.Setup;

  const elements = React.useMemo(
    () => (
      <ul
        className="background"
        // style={{ boxShadow: "0 0 200px rgba(0,0,0,0.9) inset" }}
      >
        {Array.from(Array(3).keys()).map((i) => (
          <li
            style={{
              left: (i + 5) * 225 - 1360,
              bottom: (i + 5) * 225,
              animationDuration: "45s",
            }}
            key={"0_" + i}
          >
            <FlyingCard suit={Suit.CLUBS} />
          </li>
        ))}

        {Array.from(Array(5).keys()).map((i) => (
          <li
            style={{
              left: (i + 3) * 225 - 1020,
              bottom: (i + 3) * 225,
              animationDuration: "50s",
              animationDirection: "reverse",
            }}
            key={"1_" + i}
          >
            <FlyingCard suit={Suit.DIAMONDS} reverse />
          </li>
        ))}

        {Array.from(Array(7).keys()).map((i) => (
          <li
            style={{
              left: (i + 1) * 225 - 680,
              bottom: (i + 1) * 225,
              animationDuration: "43s",
              animationDirection: "reverse",
            }}
            key={"2_" + i}
          >
            <FlyingCard suit={Suit.SPADES} reverse />
          </li>
        ))}

        {Array.from(Array(8).keys()).map((i) => (
          <li
            style={{
              left: i * 225 - 340,
              bottom: i * 225,
              animationDuration: "44s",
            }}
            key={"3_" + i}
          >
            <FlyingCard suit={Suit.HEARTS} />
          </li>
        ))}

        {Array.from(Array(10).keys()).map((i) => (
          <li
            style={{
              left: (i - 2) * 225,
              bottom: (i - 2) * 225,
              animationDuration: "56s",
            }}
            key={"4_" + i}
          >
            <FlyingCard suit={Suit.CLUBS} />
          </li>
        ))}

        {Array.from(Array(10).keys()).map((i) => (
          <li
            style={{
              left: (i - 1) * 225 + 340,
              bottom: (i - 1) * 225,
              animationDuration: "46s",
            }}
            key={"5_" + i}
          >
            <FlyingCard suit={Suit.DIAMONDS} />
          </li>
        ))}

        {Array.from(Array(10).keys()).map((i) => (
          <li
            style={{
              left: (i - 1) * 225 + 680,
              bottom: (i - 1) * 225,
              animationDuration: "53s",

              animationDirection: "reverse",
            }}
            key={"6_" + i}
          >
            <FlyingCard suit={Suit.SPADES} reverse />
          </li>
        ))}

        {Array.from(Array(10).keys()).map((i) => (
          <li
            style={{
              left: (i - 1) * 225 + 1020,
              bottom: (i - 1) * 225,
              animationDuration: "57s",
            }}
            key={"7_" + i}
          >
            <FlyingCard suit={Suit.HEARTS} />
          </li>
        ))}

        {Array.from(Array(8).keys()).map((i) => (
          <li
            style={{
              left: (i - 1) * 225 + 1360,
              bottom: (i - 1) * 225,
              animationDuration: "42s",
            }}
            key={"8_" + i}
          >
            <FlyingCard suit={Suit.CLUBS} />
          </li>
        ))}

        {Array.from(Array(6).keys()).map((i) => (
          <li
            style={{
              left: i * 225 + 1700,
              bottom: i * 225,
              animationDuration: "51s",
              animationDirection: "reverse",
            }}
            key={"9_" + i}
          >
            <FlyingCard suit={Suit.DIAMONDS} reverse />
          </li>
        ))}

        {Array.from(Array(10).keys()).map((i) => (
          <li
            style={{
              left: i * 225 + 2040,
              bottom: i * 225,
              animationDuration: "44s",
            }}
            key={"10_" + i}
          >
            <FlyingCard suit={Suit.SPADES} />
          </li>
        ))}

        {Array.from(Array(2).keys()).map((i) => (
          <li
            style={{
              left: i * 225 + 2380,
              bottom: i * 225,
              animationDuration: "41s",
            }}
            key={"10_" + i}
          >
            <FlyingCard suit={Suit.SPADES} />
          </li>
        ))}
      </ul>
    ),
    []
  );

  if (showGraphic) {
    return elements;
  } else {
    return null;
  }
};
