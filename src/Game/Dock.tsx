import * as React from "react";
import { Card, CardType } from "Game/Types";
import { PlayingCard } from "Game/PlayingCard";
import autoAnimate from "@formkit/auto-animate";

type DockProps = {
  heldIndex: number;
  setHeldIndex: (index: number) => void;
  cards: Card[];
  onDrop: (e: React.DragEvent) => void;
  dropSlotIndex: number | null;
  setDropSlotIndex: (index: number | null) => void;
};

export const Dock = (props: DockProps) => {
  const parent = React.useRef(null);

  React.useEffect(() => {
    parent.current &&
      autoAnimate(parent.current, {
        duration: 150,
      });
  }, [parent]);

  const playingCards = props.cards.map((card, index) => {
    if (card.type === CardType.INVALID) {
      return null;
    }

    return (
      <PlayingCard
        key={card.type + "-" + card.deck}
        index={index}
        card={card}
        heldIndex={props.heldIndex}
        setHeldIndex={props.setHeldIndex}
        setDropSlotIndex={props.setDropSlotIndex}
      />
    );
  });

  if (props.dropSlotIndex !== null && props.dropSlotIndex >= 0) {
    playingCards.splice(
      props.dropSlotIndex,
      0,
      <div
        key="drop-slot"
        className="w-32 h-40 rounded-md border-dashed border border-gray-500 p-2 mx-1"
      />
    );
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div
      className="absolute bottom-10 flex items-stretch w-screen bg-white p-4 shadow-inner"
      onDrop={props.onDrop}
      onDragOver={handleDrag}
      ref={parent}
    >
      {playingCards}
    </div>
  );
};
