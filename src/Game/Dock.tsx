import * as React from "react";
import { Card, CardType } from "Game/Types";
import { PlayingCard } from "Game/PlayingCard";

type DockProps = {
  heldIndex: number;
  setHeldIndex: (index: number) => void;
  cards: Card[];
  onDrop: (e: React.DragEvent) => void;
  dropSlotIndex: number | null;
  setDropSlotIndex: (index: number | null) => void;
};

export const Dock = (props: DockProps) => {
  const playingCards = props.cards.map((card, index) => {
    if (card.type === CardType.INVALID) {
      return <div className="card-out w-32 h-40"></div>;
    }

    return (
      <PlayingCard
        key={card + "-" + index}
        index={index}
        card={card}
        heldIndex={props.heldIndex}
        setHeldIndex={props.setHeldIndex}
        setDropSlotIndex={props.setDropSlotIndex}
      />
    );
  });

  if (props.dropSlotIndex && props.dropSlotIndex >= 0) {
    const existingCardId =
      props.cards[props.dropSlotIndex].type +
      "-" +
      props.cards[props.dropSlotIndex].deck;
    playingCards.splice(
      props.dropSlotIndex,
      0,
      <div
        key={"drop-" + existingCardId}
        className="card-in w-32 h-40 rounded-md border-dashed border-2 p-2 mx-1"
      />
    );
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div
      className="absolute bottom-0 left-0 bg-slate-500 w-full flex flex-row"
      onDrop={props.onDrop}
      onDragOver={handleDrag}
    >
      {playingCards}
    </div>
  );
};
