import React from "react";

import { DECK_HELD_INDEX } from "Game/Board";
import { PlayingCard } from "Game/PlayingCard";
import { CardType, getCard } from "Game/Types";

const cardBack = getCard(CardType.CARD_BACK, 0);

type DeckProps = {
  heldIndex: number;
  setHeldIndex: (index: number) => void;
};

export const Deck = (props: DeckProps) => {
  console.log("card back", cardBack);

  return (
    <PlayingCard
      card={cardBack}
      index={DECK_HELD_INDEX}
      heldIndex={props.heldIndex}
      setHeldIndex={props.setHeldIndex}
    />
  );
};
