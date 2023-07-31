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
  buttons: React.ReactNode;
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
    <div className="absolute w-full bottom-10">
      {props.buttons}
      <div
        className="flex justify-center bg-white p-4 shadow-inner border border-gray-100 dark:bg-gray-800 dark:border-gray-600"
        onDrop={props.onDrop}
        onDragOver={handleDrag}
        ref={parent}
      >
        {playingCards}
      </div>
    </div>
  );
};
