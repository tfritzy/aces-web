import * as React from "react";
import { CardType } from "./Types";
import { Suit, Card, CardValue } from "Game/Types";
import { NULL_HELD_INDEX } from "Game/Board";

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

const getValueIcon = (card: Card): string => {
  switch (card.value) {
    case CardValue.TWO:
      return "2";
    case CardValue.THREE:
      return "3";
    case CardValue.FOUR:
      return "4";
    case CardValue.FIVE:
      return "5";
    case CardValue.SIX:
      return "6";
    case CardValue.SEVEN:
      return "7";
    case CardValue.EIGHT:
      return "8";
    case CardValue.NINE:
      return "9";
    case CardValue.TEN:
      return "10";
    case CardValue.JACK:
      return "J";
    case CardValue.QUEEN:
      return "Q";
    case CardValue.KING:
      return "K";
    case CardValue.ACE:
      return "A";
    case CardValue.JOKER:
      return "JOKER";
    default:
      return "";
  }
};

const getCardColor = (card: Card) => {
  switch (card.suit) {
    case Suit.CLUBS:
    case Suit.SPADES:
      return "text-black";
    case Suit.DIAMONDS:
    case Suit.HEARTS:
      return "text-red-600";
    case Suit.SUITLESS:
      if (card.type === CardType.JOKER_A) return "text-red-600";
      if (card.type === CardType.JOKER_B) return "text-black";
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
  const className = `flex h-full text-lg leading-3 space-y-1 select-none items-center ${flex}`;
  const suitIndicator = getSuitIcon(props.card);
  const valueIcon = getValueIcon(props.card);

  return (
    <div className={className}>
      {valueIcon.split("").map((c) => (
        <div key={c}>{c}</div>
      ))}

      <div>{suitIndicator}</div>
    </div>
  );
};

type CardFaceProps = {
  card?: Card;
};

const CardFace = (props: CardFaceProps) => {
  if (!props.card || props.card.type === CardType.INVALID) {
    return null;
  }

  const face = getValueIcon(props.card)[0];

  return (
    <div className="grow text-4xl select-none">
      <div className="h-full flex justify-center items-center">{face}</div>
    </div>
  );
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
        className={`drop-shadow-md bg-gradient-to-r from-cyan-300 to-blue-300 border-gray-800 border-solid border w-32 h-40 p-2 mx-1 rounded-md`}
      />
    );
  } else {
    const color = getCardColor(card);
    cardElement = (
      <div
        className={`${color} cursor-pointer drop-shadow-md bg-gray-50 border-gray-500 border-solid border flex w-32 h-40 p-2 mx-1 rounded-md`}
      >
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
