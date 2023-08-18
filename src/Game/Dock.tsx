import * as React from "react";
import { Card } from "Game/Types";
import { PlayingCard } from "Game/PlayingCard";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/store";
import {
  NULL_HELD_INDEX,
  setDropSlotIndex,
  setMousePos,
} from "store/cardManagementSlice";
import { DropSlot } from "components/DropSlot";

type DockProps = {
  cards: Card[];
  onDrop: (index: number) => void;
  buttons: React.ReactNode;
};

export const Dock = (props: DockProps) => {
  const [parent] = useAutoAnimate({ duration: 125 });
  const dispatch = useDispatch();
  const heldIndex = useSelector(
    (state: RootState) => state.cardManagement.heldIndex
  );
  const dropSlotIndex = useSelector(
    (state: RootState) => state.cardManagement.dropSlotIndex
  );
  const handSize = useSelector((state: RootState) => state.game.hand.length);

  const handleDrop = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (dropSlotIndex === null) {
        return;
      }

      props.onDrop(dropSlotIndex);
    },
    [dropSlotIndex, props]
  );

  const handleMouseExit = React.useCallback(
    (e: React.MouseEvent) => {
      dispatch(setDropSlotIndex(null));
    },
    [dispatch]
  );

  const handleMouseMove = (e: React.MouseEvent) => {
    dispatch(setMousePos({ x: e.clientX, y: e.clientY }));
    dispatch(setDropSlotIndex(handSize));
    e.stopPropagation();
  };

  const playingCards = [];
  for (let i = 0; i < props.cards.length; i++) {
    const card = props.cards[i];
    if (i === heldIndex) {
      playingCards.push(
        <div className="opacity-50" key={card.type + "-" + card.deck}>
          <PlayingCard isHeld={false} index={i} card={card} hasPadding />
        </div>
      );
      continue;
    }

    playingCards.push(
      <PlayingCard
        isHeld={false}
        key={card.type + "-" + card.deck}
        index={i}
        card={card}
        hasPadding
      />
    );
  }

  if (dropSlotIndex === handSize && heldIndex !== NULL_HELD_INDEX) {
    playingCards.push(
      <div key={"drop-slot"}>
        <DropSlot />
      </div>
    );
  }

  return (
    <div onMouseLeave={handleMouseExit} onMouseUp={handleDrop}>
      {props.buttons}
      <div className="p-2 bg-white border border-gray-200 rounded shadow-inner dark:bg-gray-800 dark:border-gray-700">
        <div
          className={`grid grid-cols-8 grid-rows-2 ${
            heldIndex !== NULL_HELD_INDEX ? "cursor-pointer" : ""
          }`}
          ref={parent}
          onMouseMove={handleMouseMove}
        >
          {playingCards}
        </div>
      </div>
    </div>
  );
};
