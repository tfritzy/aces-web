import * as React from "react";
import { CardType } from "./Types";
import { Suit, cardMap, Card, CardValue } from "Game/Types";
import { transform } from "typescript";
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
  }
};

const getValueIcon = (card: Card) => {
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
    default:
      return "";
  }
};

type CardColProps = {
  card: Card;
  reverse?: boolean;
};

const CardCol = (props: CardColProps) => {
  const flex = props.reverse ? "flex-col-reverse space-y-reverse" : "flex-col";
  const className = `flex h-full text-lg leading-3 space-y-2 select-none ${flex}`;
  const suitIndicator = getSuitIcon(props.card);
  const valueIcon = getValueIcon(props.card);

  return (
    <div className={className}>
      <div>{valueIcon}</div>
      <div>{suitIndicator}</div>
    </div>
  );
};

type CardFaceProps = {
  card: Card;
};

const CardFace = (props: CardColProps) => {
  const face = getValueIcon(props.card);

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
    const targetBounds = e.currentTarget.getBoundingClientRect();
    const targetCenter = targetBounds.left + targetBounds.width / 2;
    const side = e.clientX < targetCenter ? 0 : 1;

    props.setDropSlotIndex?.(props.index + side);
    e.preventDefault();
  };

  if (!card || card.type == CardType.INVALID) {
    return <div className="card-out w-32 h-40"></div>;
  }

  const heldClasses = isHeld ? "opacity-20 bg-black" : "";
  const color =
    card.suit == Suit.CLUBS || card.suit == Suit.SPADES
      ? "text-zinc-800"
      : "text-red-700";

  return (
    <div className={heldClasses}>
      <div
        draggable="true"
        onDragStart={handleDragStart}
        onDragOver={handleDragEnter}
        onDragEndCapture={handleDragEndCapture}
        id={props.index.toString()}
      >
        <div
          className={`${color} bg-slate-50 cursor-pointer rounded-md border-solid border-2 flex w-32 h-40 p-2 mx-1`}
        >
          <CardCol card={card} />
          <CardFace card={card} />
          <CardCol card={card} reverse />
        </div>
      </div>
    </div>
  );
};
