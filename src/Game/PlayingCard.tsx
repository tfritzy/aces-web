import * as React from "react";
import { CardType } from "./Types";
import { Suit, Card, CardValue } from "Game/Types";
import { NULL_HELD_INDEX } from "Game/Board";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/store";
import { setDropSlotIndex, setHeldIndex } from "store/cardManagementSlice";
import { DropSlot } from "components/DropSlot";

// How many icons are in each column of the face of the non-face cards.
const cardSuitColPlacements = {
  [CardValue.TWO]: [0, 2, 0],
  [CardValue.THREE]: [0, 3, 0],
  [CardValue.FOUR]: [2, 0, 2],
  [CardValue.FIVE]: [2, 1, 2],
  [CardValue.SIX]: [3, 0, 3],
  [CardValue.SEVEN]: [3, 1, 3],
  [CardValue.EIGHT]: [4, 0, 4],
  [CardValue.NINE]: [4, 1, 4],
  [CardValue.TEN]: [4, 2, 4],
} as const;

const getSuitIcon = (card: Card) => {
  switch (card.suit) {
    case Suit.CLUBS:
      return "♣";
    case Suit.DIAMONDS:
      return "♦";
    case Suit.HEARTS:
      return "♥";
    case Suit.SPADES:
      return "♠";
    case Suit.SUITLESS:
      return "";
  }
};

const getValueIcon = (card: Card): string[] => {
  switch (card.value) {
    case CardValue.TWO:
      return ["2"];
    case CardValue.THREE:
      return ["3"];
    case CardValue.FOUR:
      return ["4"];
    case CardValue.FIVE:
      return ["5"];
    case CardValue.SIX:
      return ["6"];
    case CardValue.SEVEN:
      return ["7"];
    case CardValue.EIGHT:
      return ["8"];
    case CardValue.NINE:
      return ["9"];
    case CardValue.TEN:
      return ["10"];
    case CardValue.JACK:
      return ["J"];
    case CardValue.QUEEN:
      return ["Q"];
    case CardValue.KING:
      return ["K"];
    case CardValue.ACE:
      return ["A"];
    case CardValue.JOKER:
      return ["J", "o", "k", "e", "r"];
    default:
      return [""];
  }
};

const themedBlack = "text-black dark:text-emerald-300";
const themedRed = "text-red-600 dark:text-amber-300";
const cardBackground = "bg-gray-50 dark:bg-slate-950";

const getCardColor = (card: Card) => {
  switch (card.suit) {
    case Suit.CLUBS:
    case Suit.SPADES:
      return themedBlack;
    case Suit.DIAMONDS:
    case Suit.HEARTS:
      return themedRed;
    case Suit.SUITLESS:
      if (card.type === CardType.JOKER_A) return themedRed;
      if (card.type === CardType.JOKER_B) return themedBlack;
      return "text-gray-400";
  }
};

type CardColProps = {
  card: Card | undefined;
  reverse?: boolean;
};

const CardCol = (props: CardColProps) => {
  if (!props.card || props.card.type === CardType.INVALID) {
    return null;
  }

  const flex = props.reverse ? "flex-col -rotate-180" : "flex-col";
  const className = `flex h-full text-lg leading-5 select-none items-center ${flex} w-4`;
  const suitIndicator = (
    <div className="text-md">{getSuitIcon(props.card)}</div>
  );
  const valueIcon = getValueIcon(props.card);

  return (
    <div className={className}>
      <div className={`${cardBackground}`}>
        {valueIcon.map((c) => (
          <div key={c}>{c}</div>
        ))}
      </div>

      <div className={`${cardBackground}`}>{suitIndicator}</div>
    </div>
  );
};

type CardFaceProps = {
  card?: Card;
};

const CardFace = (props: CardFaceProps): JSX.Element | null => {
  const card = props.card;
  if (!card || card.type === CardType.INVALID) {
    return null;
  }

  let face: JSX.Element;
  if (card.value < 10) {
    const counts =
      cardSuitColPlacements[card.value as keyof typeof cardSuitColPlacements];

    face = (
      <div className="flex flex-row w-full px-1">
        <div className="flex flex-col grow items-center justify-evenly text-2xl">
          {Array.from({ length: counts[0] }).map((_, i) => (
            <div className={i >= counts[0] / 2 ? "rotate-180" : ""} key={i}>
              {getSuitIcon(card)}
            </div>
          ))}
        </div>

        <div className="flex flex-col grow items-center justify-evenly text-2xl">
          {Array.from({ length: counts[1] }).map((_, i) => (
            <div className={i >= counts[1] / 2 ? "rotate-180" : ""} key={i}>
              {getSuitIcon(card)}
            </div>
          ))}
        </div>

        <div className="flex flex-col grow items-center justify-evenly text-2xl">
          {Array.from({ length: counts[2] }).map((_, i) => (
            <div className={i >= counts[2] / 2 ? "rotate-180" : ""} key={i}>
              {getSuitIcon(card)}
            </div>
          ))}
        </div>
      </div>
    );
  } else {
    face = (
      <div className="w-full h-full flex justify-center items-center text-5xl">
        {getSuitIcon(card)}
      </div>
    );
  }

  return face;
};

type PlayingCardProps = {
  card: Card;
  index: number;
  isHeld: boolean;
  onDrop?: (index: number) => void;
};

export const PlayingCard = (props: PlayingCardProps) => {
  const dispatch = useDispatch();
  const heldIndex = useSelector(
    (state: RootState) => state.cardManagement.heldIndex
  );
  const cardManagement = useSelector(
    (state: RootState) => state.cardManagement
  );
  const mousePos = useSelector(
    (state: RootState) => state.cardManagement.mousePos
  );
  const selfRef = React.useRef<HTMLDivElement>(null);
  const card = props.card;
  const handleDragStart = React.useCallback(
    (e: React.MouseEvent) => {
      dispatch(setHeldIndex(props.index));
      dispatch(setDropSlotIndex(props.index));
    },
    [dispatch, props]
  );

  const handleMouseMove = (e: React.MouseEvent) => {
    // if (e.buttons === 1 && heldIndex === NULL_HELD_INDEX) {
    //   handleDragStart(e);
    // }

    if (!selfRef.current) {
      return;
    }

    if (props.index >= 0) {
      const targetBounds = selfRef.current?.getBoundingClientRect();
      const targetCenter = targetBounds.left + targetBounds.width / 2;
      const side = e.clientX < targetCenter ? 0 : 1;

      dispatch(setDropSlotIndex(props.index + side));
    } else {
      dispatch(setDropSlotIndex(props.index));
    }
  };

  const handleMouseUp = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (cardManagement.heldIndex !== NULL_HELD_INDEX) {
        if (props.index === cardManagement.heldIndex) {
          dispatch(setHeldIndex(NULL_HELD_INDEX));
        } else {
          props.onDrop?.(props.index);
        }
      } else if (card.type !== CardType.SPACER) {
        handleDragStart(e);
      }
    },
    [card.type, cardManagement.heldIndex, dispatch, handleDragStart, props]
  );

  const heldClasses = props.isHeld ? `fixed pointer-events-none z-40` : "";

  let cardElement: JSX.Element;
  if (!card) {
    console.error("Trying to render a null card");
    return null;
  }

  if (card.type === CardType.SPACER) {
    cardElement = <DropSlot />;
  } else if (card.type === CardType.CARD_BACK) {
    cardElement = (
      <div id={props.index.toString()} onMouseMove={handleMouseMove}>
        <div
          className={`drop-shadow-md bg-gradient-to-r from-cyan-200 dark:from-cyan-600 to-emerald-200 dark:to-emerald-600 border-gray-400 dark:border-gray-700 border-solid border w-32 h-44 p-2 rounded-md select-none`}
        />
      </div>
    );
  } else {
    const color = getCardColor(card);
    cardElement = (
      <div id={props.index.toString()} onMouseMove={handleMouseMove}>
        <div
          className={`${color} ${cardBackground} cursor-pointer drop-shadow-md border-gray-400 dark:border-gray-700 border-solid border flex w-32 h-44 p-2 mx-1 rounded-md overflow-hidden select-none`}
        >
          <CardCol card={card} />
          <CardFace card={card} />
          <CardCol card={card} reverse />
        </div>
      </div>
    );
  }

  return (
    <div
      id={card.type + "-" + card.deck}
      className={heldClasses}
      onMouseUp={handleMouseUp}
      style={
        props.isHeld
          ? {
              top: mousePos.y - 80,
              left: mousePos.x - 64,
            }
          : undefined
      }
      ref={selfRef}
    >
      {cardElement}
    </div>
  );
};
