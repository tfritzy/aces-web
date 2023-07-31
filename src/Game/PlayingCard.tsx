import * as React from "react";
import { CardType } from "./Types";
import { Suit, Card, CardValue } from "Game/Types";
import { NULL_HELD_INDEX } from "Game/Board";

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

const themedBlack = "text-black dark:text-emerald-400";
const themedRed = "text-red-600 dark:text-amber-400";
const themedBorderBlack = "border-black dark:border-emerald-400";
const themedBorderRed = "border-red-600 dark:border-amber-400";
const cardBackground = "bg-gray-50 dark:bg-slate-950";

const getCardColor = (card: Card, border?: boolean) => {
  switch (card.suit) {
    case Suit.CLUBS:
    case Suit.SPADES:
      return border ? themedBorderBlack : themedBlack;
    case Suit.DIAMONDS:
    case Suit.HEARTS:
      return border ? themedBorderRed : themedRed;
    case Suit.SUITLESS:
      if (card.type === CardType.JOKER_A)
        return border ? themedBorderRed : themedRed;
      if (card.type === CardType.JOKER_B)
        return border ? themedBorderBlack : themedBlack;
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
  const className = `flex h-full text-lg font-mono leading-3 select-none items-center ${flex} w-4`;
  const suitIndicator = (
    <div className="text-xs">{getSuitIcon(props.card)}</div>
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
      <div className="flex flex-row w-full px-2">
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
        {getValueIcon(card)[0]}
      </div>
    );
  }

  return face;
};

type PlayingCardProps = {
  card: Card;
  index: number;
  heldIndex: number;
  setHeldIndex: (index: number) => void;
  setDropSlotIndex?: (index: number) => void;
  onDrop?: (e: React.DragEvent) => void;
};

export const PlayingCard = (props: PlayingCardProps) => {
  const card = props.card;
  const isHeld = props.heldIndex === props.index;
  const handleDragStart = (e: React.DragEvent) => {
    props.setHeldIndex(props.index);
  };

  const handleDragEndCapture = () => {
    props.setHeldIndex(NULL_HELD_INDEX);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    if (props.index >= 0) {
      const targetBounds = e.currentTarget.getBoundingClientRect();
      const targetCenter = targetBounds.left + targetBounds.width / 2;
      const side = e.clientX < targetCenter ? 0 : 1;

      props.setDropSlotIndex?.(props.index + side);
    } else {
      props.setDropSlotIndex?.(props.index);
    }

    e.preventDefault();
  };

  const heldClasses = isHeld ? "opacity-30" : "";

  let cardElement: JSX.Element;
  if (card.type === CardType.SPACER) {
    cardElement = (
      <div
        className={`border-dashed border w-32 h-40 p-2 mx-1 rounded-md border-gray-700 dark:border-white`}
      />
    );
  } else if (card.type === CardType.CARD_BACK) {
    cardElement = (
      <div
        className={`drop-shadow-md bg-gradient-to-r from-cyan-300 to-blue-300 border-gray-200 border-solid border w-32 h-40 p-2 mx-1 rounded-md`}
      />
    );
  } else {
    const color = getCardColor(card);
    cardElement = (
      <div
        className={`${color} ${cardBackground} cursor-pointer drop-shadow-md border-gray-500 border-solid border flex w-32 h-40 p-2 mx-1 rounded-md  dark:border-gray-600 dark:drop-shadow-lg overflow-hidden`}
      >
        {/* <div className="fill-red-500">
          <img
            src="/Textures/HexGrid.svg"
            alt=""
            className="absolute top-0 left-0 w-full h-full"
          />
        </div> */}

        <CardCol card={card} />
        <CardFace card={card} />
        <CardCol card={card} reverse />
      </div>
    );
  }

  return (
    <div className={heldClasses}>
      <div
        draggable={!!card}
        onDragStart={handleDragStart}
        onDragOver={handleDragEnter}
        onDragEndCapture={handleDragEndCapture}
        id={props.index.toString()}
        onDrop={props.onDrop}
      >
        {cardElement}
      </div>
    </div>
  );
};
