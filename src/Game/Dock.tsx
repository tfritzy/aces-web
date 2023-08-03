import * as React from "react";
import { Card } from "Game/Types";
import { PlayingCard } from "Game/PlayingCard";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { NULL_HELD_INDEX } from "./Board";

type DockProps = {
  heldIndex: number;
  setHeldIndex: (index: number) => void;
  cards: Card[];
  onDrop: (index: number) => void;
  dropSlotIndex: number | null;
  setDropSlotIndex: (index: number | null) => void;
  buttons: React.ReactNode;
  mousePos: { x: number; y: number };
};

export const Dock = (props: DockProps) => {
  const [parent] = useAutoAnimate({ duration: 150 });

  const handleDrop = React.useCallback(
    (e: React.MouseEvent) => {
      if (!props.dropSlotIndex) {
        return;
      }

      props.onDrop(props.dropSlotIndex);
    },
    [props]
  );

  const playingCards = [];
  for (let i = 0; i < props.cards.length; i++) {
    if (i === props.heldIndex) {
      playingCards.push(<div />);
      continue;
    }

    const card = props.cards[i];
    playingCards.push(
      <PlayingCard
        isHeld={false}
        key={card.type + "-" + card.deck}
        index={i}
        card={card}
        heldIndex={props.heldIndex}
        setHeldIndex={props.setHeldIndex}
        setDropSlotIndex={props.setDropSlotIndex}
        mousePos={props.mousePos}
        onDrop={props.onDrop}
      />
    );
  }

  if (
    props.heldIndex !== NULL_HELD_INDEX &&
    props.dropSlotIndex !== null &&
    props.dropSlotIndex >= 0
  ) {
    playingCards.splice(
      props.dropSlotIndex,
      0,
      <div
        onClick={handleDrop}
        key="drop-slot"
        className="w-32 h-40 rounded-md border-dashed border border-gray-500 p-2 mx-1"
      />
    );
  }

  let heldCard = undefined;
  if (props.heldIndex >= 0) {
    const card = props.cards[props.heldIndex];
    heldCard = (
      <PlayingCard
        isHeld
        key={card.type + "-" + card.deck}
        index={props.heldIndex}
        card={card}
        heldIndex={props.heldIndex}
        setHeldIndex={props.setHeldIndex}
        setDropSlotIndex={props.setDropSlotIndex}
        mousePos={props.mousePos}
        onDrop={props.onDrop}
      />
    );
  }

  return (
    <div className="w-full">
      {props.buttons}
      <div
        className="flex justify-center bg-white p-4 shadow-inner border border-gray-100 dark:bg-gray-800 dark:border-gray-600"
        ref={parent}
      >
        {playingCards}
      </div>
      {heldCard}
    </div>
  );
};
