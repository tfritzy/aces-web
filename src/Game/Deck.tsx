import React from "react";

import { DECK_HELD_INDEX } from "Game/Board";
import { PlayingCard } from "Game/PlayingCard";
import { CardType, getCard } from "Game/Types";

type DeckProps = {
  heldIndex: number;
  setHeldIndex: (index: number) => void;
};

export const Deck = (props: DeckProps) => {
  return (
    <PlayingCard
      card={getCard(CardType.ACE_OF_CLUBS, 0)}
      index={DECK_HELD_INDEX}
      heldIndex={props.heldIndex}
      setHeldIndex={props.setHeldIndex}
    />
  );
};
