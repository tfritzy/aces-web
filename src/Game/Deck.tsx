import React from "react";

import { DECK_HELD_INDEX } from "Game/Board";
import { PlayingCard } from "Game/PlayingCard";
import { cardBack } from "./Types";

type DeckProps = {
  heldIndex: number;
  setHeldIndex: (index: number) => void;
};

export const Deck = (props: DeckProps) => {
  return (
    <PlayingCard
      card={cardBack}
      index={DECK_HELD_INDEX}
      heldIndex={props.heldIndex}
      setHeldIndex={props.setHeldIndex}
    />
  );
};
