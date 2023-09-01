import * as React from "react";
import { CardType } from "./Types";
import { Suit, Card, CardValue } from "Game/Types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/store";
import {
  NULL_HELD_INDEX,
  setDropSlotIndex,
  setHeldIndex,
} from "store/cardManagementSlice";
import { DropSlot } from "components/DropSlot";
import {
  cardHeight,
  cardWidth,
  darkModeBlack,
  darkModeRed,
  lightModeBlack,
  lightModeRed,
} from "Constants";
import { isWild } from "helpers/getGroupedCards";
import { MouseContext } from "./MouseContext";
import { Cardback } from "components/Cardback";

// How many icons are in each column of the face of the non-face cards.
const cardSuitColPlacements = {
  [CardValue.TWO]: [0, 2, 0],
  [CardValue.THREE]: [0, 3, 0],
  [CardValue.FOUR]: [2, 0, 2],
  [CardValue.FIVE]: [2, 1, 2],
  [CardValue.SIX]: [3, 0, 3],
  [CardValue.SEVEN]: [2, 3, 2],
  [CardValue.EIGHT]: [4, 0, 4],
  [CardValue.NINE]: [4, 1, 4],
  [CardValue.TEN]: [4, 2, 4],
} as const;

export const getSuitIcon = (suit: Suit) => {
  switch (suit) {
    case Suit.CLUBS:
      return "♣";
    case Suit.DIAMONDS:
      return "♦";
    case Suit.HEARTS:
      return "♥";
    case Suit.SPADES:
      return "♠";
    case Suit.SUITLESS:
      return "◌";
  }
};

export const getValueIcon = (card: Card): string[] => {
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

const themedBlack = `text-${lightModeBlack} dark:text-${darkModeBlack} stroke-${lightModeBlack} dark:stroke-${darkModeBlack} fill-${lightModeBlack} dark:fill-${darkModeBlack}`;
const themedRed = `text-${lightModeRed} dark:text-${darkModeRed} stroke-${lightModeRed} dark:stroke-${darkModeRed} fill-${lightModeRed} dark:fill-${darkModeRed}`;
const cardBackground = "bg-gray-50 dark:bg-gray-950";

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
    <div className="text-md">{getSuitIcon(props.card.suit)}</div>
  );
  const valueIcon = getValueIcon(props.card);

  return (
    <div className={className}>
      <div className={`${cardBackground}`}>
        {valueIcon.map((c) => (
          <div className="text-center leading-none uppercase" key={c}>
            {c}
          </div>
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
      <div className="flex grow flex-row w-full px-1">
        <div className="flex grow flex-col items-center justify-evenly justify-items-stretch text-3xl">
          {Array.from({ length: counts[0] }).map((_, i) => (
            <div className={i >= counts[0] / 2 ? "rotate-180" : ""} key={i}>
              {getSuitIcon(card.suit)}
            </div>
          ))}
        </div>

        <div className="flex grow flex-col items-center justify-evenly justify-items-stretch text-3xl">
          {Array.from({ length: counts[1] }).map((_, i) => (
            <div className={i >= counts[1] / 2 ? "rotate-180" : ""} key={i}>
              {getSuitIcon(card.suit)}
            </div>
          ))}
        </div>

        <div className="flex grow flex-col items-center justify-evenly justify-items-stretch text-3xl">
          {Array.from({ length: counts[2] }).map((_, i) => (
            <div className={i >= counts[2] / 2 ? "rotate-180" : ""} key={i}>
              {getSuitIcon(card.suit)}
            </div>
          ))}
        </div>
      </div>
    );
  } else {
    face = (
      <div className="w-full h-full flex justify-center items-center text-center align-middle text-6xl">
        {getSuitIcon(card.suit)}
      </div>
    );
  }

  return <div className="flex grow">{face}</div>;
};

type PlayingCardProps = {
  card: Card;
  index: number;
  isHeld: boolean;
  onDrop?: (index?: number) => void;
  hasShadow?: boolean;
};

export const PlayingCard = (props: PlayingCardProps) => {
  const dispatch = useDispatch();
  const hand = useSelector((state: RootState) => state.game.hand);
  const round = useSelector((state: RootState) => state.game.round);
  const cardManagement = useSelector(
    (state: RootState) => state.cardManagement
  );
  const mousePos = React.useContext(MouseContext);
  const selfRef = React.useRef<HTMLDivElement>(null);
  const card = props.card;
  const handleDragStart = React.useCallback(
    (e: React.MouseEvent) => {
      dispatch(setHeldIndex(props.index));
      dispatch(setDropSlotIndex(props.index));
    },
    [dispatch, props]
  );
  const isGrouped = props.index >= 0 && hand[props.index].isGrouped;
  const wild = isWild(card, round);

  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent) => {
      if (!selfRef.current) {
        return;
      }

      if (cardManagement.heldIndex === NULL_HELD_INDEX && e.buttons === 1) {
        handleDragStart(e);
      }

      e.stopPropagation();
      if (props.index >= 0) {
        const targetBounds = selfRef.current?.getBoundingClientRect();
        const targetCenter = targetBounds.left + targetBounds.width / 2;
        const side = e.clientX < targetCenter ? 0 : 1;

        dispatch(setDropSlotIndex(props.index + side));
      } else {
        dispatch(setDropSlotIndex(props.index));
      }
    },
    [cardManagement.heldIndex, dispatch, handleDragStart, props.index]
  );

  const handleMouseUp = React.useCallback(
    (e: React.MouseEvent) => {
      if (props.isHeld) {
        return;
      }

      if (cardManagement.heldIndex !== NULL_HELD_INDEX) {
        if (props.index === cardManagement.heldIndex) {
          e.stopPropagation();
          dispatch(setHeldIndex(NULL_HELD_INDEX));
        } else if (props.onDrop) {
          e.stopPropagation();
          props.onDrop?.(props.index);
        }
      } else if (card.type !== CardType.SPINNER) {
        e.stopPropagation();
        handleDragStart(e);
      }
    },
    [card.type, cardManagement.heldIndex, dispatch, handleDragStart, props]
  );

  const heldClasses = props.isHeld
    ? `fixed pointer-events-none z-40 drop-shadow-xl opacity-50`
    : "";

  let cardElement = React.useMemo(() => {
    if (card.type === CardType.CARD_BACK) {
      return (
        <div id={props.index.toString()}>
          <div
            className={`bg-white dark:bg-gray-950 border-gray-400 dark:border-gray-700 stroke-gray-500 fill-gray-500 dark:stroke-gray-100 dark:fill-gray-100 border-solid border rounded-lg select-none cursor-pointer p-2 ${
              props.hasShadow ? "shadow-md" : ""
            }`}
            style={{ width: cardWidth, height: cardHeight }}
          >
            <Cardback />
          </div>
        </div>
      );
    } else if (card.type === CardType.SPINNER) {
      return (
        <div id={props.index.toString()}>
          <div
            className={`bg-white dark:bg-gray-900 border-gray-400 dark:border-gray-700 stroke-slate-400 border-solid border rounded-lg select-none p-[7px] flex justify-center animate-pulse items-center cursor-pointer ${
              props.hasShadow ? "shadow-md" : ""
            }`}
            style={{ width: cardWidth, height: cardHeight }}
          ></div>
        </div>
      );
    } else {
      return (
        <div id={props.index.toString()}>
          <div
            className={`${getCardColor(
              card
            )} ${cardBackground} cursor-pointer border-gray-400 dark:border-gray-700 border-solid border rounded-lg overflow-hidden select-none relative font-serif ${
              isGrouped ? "ring-2 ring-emerald-200" : ""
            } ${props.hasShadow ? "shadow-md" : ""}`}
            style={{ height: cardHeight, width: cardWidth }}
          >
            {wild && (
              <div className="absolute top-1 right-2 uppercase text-xs font-mono text-gray-500">
                wild
              </div>
            )}

            <div className="flex flex-row p-2 h-[100%]">
              <CardCol card={card} />
              <CardFace card={card} />
              <CardCol card={card} reverse />
            </div>
          </div>
        </div>
      );
    }
  }, [card, isGrouped, props.hasShadow, props.index, wild]);

  if (!card) {
    console.error("Trying to render a null card");
    return null;
  }

  return (
    <div onMouseUp={handleMouseUp} onMouseMove={handleMouseMove} ref={selfRef}>
      {cardManagement.dropSlotIndex === props.index &&
        cardManagement.heldIndex !== NULL_HELD_INDEX &&
        !props.isHeld &&
        props.index >= 0 && <DropSlot key="drop-slot" />}
      <div
        id={card.type + "-" + card.deck}
        className={`${heldClasses}`}
        style={
          props.isHeld
            ? {
                top: mousePos.y - 80,
                left: mousePos.x - 64,
              }
            : undefined
        }
      >
        {cardElement}
      </div>
    </div>
  );
};
