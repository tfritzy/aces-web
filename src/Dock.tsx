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

  const handleSetDropSlotIndex = (index: number | null) => {
    console.log("Set drop slot index", heldIndex, index);
    if (heldIndex && index && Math.abs(index - heldIndex) < 2) {
      return;
    }

    setDropSlotIndex(index);
  };

  const handleSetHeldIndex = (index: number | null) => {
    console.log("Set held index", index);
    setHeldIndex(index);
  };

  const handleDragStart = React.useCallback(
    (e: React.DragEvent) => {
      const filteredCards = cards.filter((card) => card !== CardType.INVALID);
      setCards(filteredCards);
    },
    [setCards, cards]
  );

  const playingCards = React.useMemo(() => {
    const divs = cards.map((card, index) => (
      <PlayingCard
        key={index}
        index={index}
        card={card}
        onDragStart={handleDragStart}
        heldIndex={heldIndex}
        setHeldIndex={handleSetHeldIndex}
        setDropSlotIndex={handleSetDropSlotIndex}
      />
    ));

    if (dropSlotIndex !== null) {
      divs.splice(
        dropSlotIndex,
        0,
        <div
          key={-1}
          className="card-in w-32 h-40 rounded-md border-dashed border-2"
        />
      );
    }

    return divs;
  }, [cards, dropSlotIndex]);

  const handleDragOver = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = React.useCallback(
    (e: React.DragEvent) => {
      console.log("Handle drop", heldIndex, dropSlotIndex);
      e.preventDefault();

      if (dropSlotIndex === null || heldIndex === null) {
        return;
      }

      cards.splice(dropSlotIndex, 0, cards[heldIndex]);
      cards[heldIndex] = CardType.INVALID;
      setCards([...cards]);
      setDropSlotIndex(null);
    },
    [dropSlotIndex, heldIndex]
  );

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
