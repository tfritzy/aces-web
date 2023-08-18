import React from "react";

import { PlayingCard } from "Game/PlayingCard";
import { cardBack } from "./Types";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import { DECK_HELD_INDEX } from "store/cardManagementSlice";

type DeckProps = {
  heldIndex: number;
  setHeldIndex: (index: number) => void;
};

export const Deck = (props: DeckProps) => {
  const deckSize = useSelector((state: RootState) => state.game.deckSize);

  const cards = Array.from({ length: deckSize / 2 }, (_, i) => {
    let shadow = "";
    if (i < 1) {
      shadow = "shadow-lg rounded-md";
    } else if (i < 3) {
      shadow = "shadow-md rounded-md";
    } else if (i < 5) {
      shadow = "shadow-sm rounded-md";
    }

    return (
      <div className="relative" key={i}>
        <div
          style={{ position: "absolute", top: -1 * i + "px" }}
          className={shadow}
        >
          <PlayingCard isHeld={false} card={cardBack} index={DECK_HELD_INDEX} />
        </div>
      </div>
    );
  });

  return <div className={`w-32 h-44 rounded-md`}>{cards}</div>;
};
