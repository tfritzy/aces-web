import * as React from "react";
import { CardType } from "Types";
import { PlayingCard } from "PlayingCard";

export const Dock = () => {
  const [heldIndex, setHeldIndex] = React.useState<number | null>(null);
  const [dropSlotIndex, setDropSlotIndex] = React.useState<number | null>(null);
  const [cards, setCards] = React.useState<CardType[]>([
    CardType.ACE_OF_CLUBS,
    CardType.KING_OF_DIAMONDS,
    CardType.QUEEN_OF_HEARTS,
  ]);

  const handleSetHeldIndex = (index: number | null) => {
    if (index != null) {
      // let numInvalidBeforeIndex = 0;
      // let numInvalidAfterIndex = 0;
      // cards.forEach((card, i) => {
      //   if (card === CardType.INVALID) {
      //     if (i <= index) {
      //       numInvalidBeforeIndex++;
      //     } else if (i >= index) {
      //       numInvalidAfterIndex++;
      //     }
      //   }
      // });

      console.log("Cards before", cards);

      // const filtered = cards.filter((card) => card !== CardType.INVALID);
      // setCards(filtered);

      setHeldIndex(index);
    } else {
      setHeldIndex(index);
    }
  };

  const handleSetDropSlotIndex = (index: number | null) => {
    if (heldIndex == null || index == null) {
      return;
    }

    if (index - heldIndex === 0 || index - heldIndex === 1) {
      setDropSlotIndex(null);
      return;
    }

    setDropSlotIndex(index);
  };

  const playingCards = cards.map((card, index) => {
    return (
      <PlayingCard
        key={card + "-" + index}
        index={index}
        card={card}
        heldIndex={heldIndex}
        setHeldIndex={handleSetHeldIndex}
        setDropSlotIndex={handleSetDropSlotIndex}
      />
    );
  });

  if (dropSlotIndex !== null) {
    playingCards.splice(
      dropSlotIndex,
      0,
      <div
        key={"drop-" + dropSlotIndex}
        className="card-in w-32 h-40 rounded-md border-dashed border-2 p-2 mx-1"
      />
    );
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();

    if (dropSlotIndex === null || heldIndex === null) {
      return;
    }

    const indexMod = heldIndex > dropSlotIndex ? 1 : 0;
    cards.splice(dropSlotIndex, 0, CardType.INVALID);
    cards[dropSlotIndex] = cards[heldIndex + indexMod];
    cards[heldIndex + indexMod] = CardType.INVALID;
    const filteredCards = cards.filter(
      (card, i) => card !== CardType.INVALID || i === heldIndex + indexMod
    );

    setCards([...filteredCards]);
    setDropSlotIndex(null);
    setHeldIndex(null);
  };

  return (
    <div
      className="absolute bottom-0 left-0 bg-slate-500 w-full flex flex-row"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {playingCards}
    </div>
  );
};
