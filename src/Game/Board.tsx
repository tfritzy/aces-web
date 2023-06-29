import React, { useState } from "react";
import { Dock } from "Game/Dock";
import { Deck } from "Game/Deck";
import { Card, CardType, getCard } from "Game/Types";

export const NULL_HELD_INDEX = -3;
export const DECK_HELD_INDEX = -2;
export const PILE_HELD_INDEX = -1;

export const Board = () => {
  const [canPickup, setCanPickup] = React.useState<boolean>(true);
  const [heldIndex, setHeldIndex] = React.useState<number>(NULL_HELD_INDEX);
  const [dropSlotIndex, setDropSlotIndex] = React.useState<number | null>(null);
  const [pile, setPile] = useState<Card[]>([
    getCard(CardType.ACE_OF_HEARTS, 0),
    getCard(CardType.TWO_OF_SPADES, 0),
  ]);
  const [deck, setDeck] = useState<Card>(getCard(CardType.ACE_OF_HEARTS, 0));
  const [heldCards, setHeldCards] = React.useState<Card[]>([
    getCard(CardType.ACE_OF_CLUBS, 0),
    getCard(CardType.TWO_OF_HEARTS, 1),
    getCard(CardType.THREE_OF_DIAMONDS, 2),
  ]);

  const handleSetDropSlotIndex = (index: number | null) => {
    if (!canPickup) {
      return;
    }

    if (heldIndex == null || index == null) {
      return;
    }

    if (index - heldIndex === 0 || index - heldIndex === 1) {
      setDropSlotIndex(null);
      return;
    }

    setDropSlotIndex(index);
  };

  const getDroppedCard = (heldIndex: number): Card | undefined => {
    if (heldIndex === DECK_HELD_INDEX) {
      return deck;
    } else if (heldIndex === PILE_HELD_INDEX) {
      return pile.pop();
    } else {
      return heldCards[heldIndex];
    }
  };

  const cleanupInvalidCards = () => {
    const numInvalidBeforeIndex = [];
    let sum = 0;
    for (let i = 0; i < heldCards.length; i++) {
      numInvalidBeforeIndex.push(sum);
      if (heldCards[i].type === CardType.INVALID) {
        sum++;
      }
    }

    const now = Date.now();
    const invalidCards = heldCards.filter(
      (card) =>
        card.createdTimeMs &&
        card.type === CardType.INVALID &&
        now - card.createdTimeMs > 150
    );

    invalidCards.forEach((card) => {
      heldCards.splice(heldCards.indexOf(card), 1);
    });
    setHeldCards([...heldCards]);

    setCanPickup(true);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();

    if (dropSlotIndex === null || heldIndex === null) {
      return;
    }

    const dropCard = getDroppedCard(heldIndex);
    if (!dropCard) {
      return;
    }

    const indexMod = heldIndex > dropSlotIndex ? 1 : 0;
    const dummyCard = {
      type: CardType.INVALID,
      deck: 0,
      points: 0,
      suit: 0,
      value: 0,
      createdTimeMs: Date.now(),
    };
    heldCards.splice(dropSlotIndex, 0, dropCard);
    heldCards[heldIndex + indexMod] = dummyCard;

    setHeldCards([...heldCards]);
    setDropSlotIndex(null);
    setHeldIndex(NULL_HELD_INDEX);
    setCanPickup(false);

    setTimeout(cleanupInvalidCards, 200);
  };

  const handleSetHeldIndex = (index: number) => {
    if (!canPickup) {
      return;
    }

    setHeldIndex(index);
  };

  return (
    <div className="w-full h-full" id="board">
      <Deck heldIndex={heldIndex} setHeldIndex={setHeldIndex} />
      <Dock
        heldIndex={heldIndex}
        setHeldIndex={handleSetHeldIndex}
        onDrop={handleDrop}
        cards={heldCards}
        dropSlotIndex={dropSlotIndex}
        setDropSlotIndex={handleSetDropSlotIndex}
      />
    </div>
  );
};
