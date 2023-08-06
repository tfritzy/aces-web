import * as React from "react";
import { Card } from "Game/Types";
import { PlayingCard } from "Game/PlayingCard";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/store";
import { NULL_HELD_INDEX, setDropSlotIndex } from "store/cardManagementSlice";
import { DropSlot } from "components/DropSlot";

type DockProps = {
  cards: Card[];
  onDrop: (index: number) => void;
  buttons: React.ReactNode;
};

export const Dock = (props: DockProps) => {
  const [parent] = useAutoAnimate({ duration: 150 });
  const dispatch = useDispatch();
  const heldIndex = useSelector(
    (state: RootState) => state.cardManagement.heldIndex
  );
  const dropSlotIndex = useSelector(
    (state: RootState) => state.cardManagement.dropSlotIndex
  );

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

  const playingCards = [];
  for (let i = 0; i < props.cards.length; i++) {
    if (i === heldIndex) {
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
        onDrop={props.onDrop}
      />
    );
  }

  if (
    heldIndex !== NULL_HELD_INDEX &&
    dropSlotIndex !== null &&
    dropSlotIndex >= 0
  ) {
    playingCards.splice(dropSlotIndex, 0, <DropSlot drop={handleDrop} />);
  }

  let heldCard = undefined;
  if (heldIndex >= 0) {
    const card = props.cards[heldIndex];

    if (card) {
      heldCard = (
        <PlayingCard
          isHeld
          key={card.type + "-" + card.deck}
          index={heldIndex}
          card={card}
          onDrop={props.onDrop}
        />
      );
    } else {
      console.error("The held card is null");
    }
  }

  return (
    <div className="w-full fixed bottom-[12%]" onMouseLeave={handleMouseExit}>
      <div className="relative">
        {props.buttons}
        <div
          className="flex justify-center bg-white py-6 shadow-inner border-2 border-gray-100 dark:bg-gray-800 dark:border-gray-600"
          ref={parent}
        >
          {playingCards}
        </div>
        {heldCard}
      </div>
    </div>
  );
};
