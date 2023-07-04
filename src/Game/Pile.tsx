import React from "react";

import { PILE_HELD_INDEX } from "Game/Board";
import { PlayingCard } from "Game/PlayingCard";
import { Card } from "Game/Types";

type PileProps = {
  heldIndex: number;
  setHeldIndex: (index: number) => void;
  cards: Card[];
};

export const Pile = (props: PileProps) => {
  return (
    <PlayingCard
      card={props.cards[props.cards.length - 1]}
      index={PILE_HELD_INDEX}
      heldIndex={props.heldIndex}
      setHeldIndex={props.setHeldIndex}
    />
  );
};
