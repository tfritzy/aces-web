import React from "react";

import { DECK_HELD_INDEX } from "Game/Board";
import { PlayingCard } from "Game/PlayingCard";
import { cardBack } from "./Types";

type DeckProps = {
  heldIndex: number;
  setHeldIndex: (index: number) => void;
  mousePos: { x: number; y: number };
};

export const Deck = (props: DeckProps) => {
  return (
    <PlayingCard
      card={cardBack}
      index={DECK_HELD_INDEX}
      isHeld={props.heldIndex === DECK_HELD_INDEX}
      setHeldIndex={props.setHeldIndex}
      mousePos={props.mousePos}
    />
  );
};
