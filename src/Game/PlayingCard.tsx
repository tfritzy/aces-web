import * as React from "react";
import { CardType } from "./Types";
import { Suit, Card, CardValue } from "Game/Types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/store";
import { setDropSlotIndex, setHeldIndex } from "store/cardManagementSlice";
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
import { random } from "lodash";

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
          <div
            className="text-center leading-none uppercase font-semibold"
            key={c}
          >
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

type CardBodyProps = {
  card: Card;
  hasShadow: boolean;
  isGrouped: boolean;
  isWild: boolean;
};

const CardBody = (props: CardBodyProps) => {
  const card = props.card;

  let contents;
  if (card.type === CardType.CARD_BACK || card.type === CardType.SPINNER) {
    contents = <Cardback />;
  } else {
    contents = (
      <>
        {props.isWild && (
          <div className="absolute bottom-1 left-2 uppercase text-xs font-mono text-gray-500">
            wild
          </div>
        )}

        <div className="flex flex-row p-2 h-[100%]">
          <CardCol card={card} />
          <CardFace card={card} />
          <CardCol card={card} reverse />
        </div>
      </>
    );
  }

  return (
    <div
      className={`${getCardColor(
        card
      )} ${cardBackground} cursor-pointer border-gray-400 dark:border-gray-700 border-solid border rounded-lg overflow-hidden select-none relative font-serif ${
        props.isGrouped ? "ring-2 ring-emerald-200" : ""
      } ${props.hasShadow ? "shadow-md" : ""}`}
      style={{ height: cardHeight, width: cardWidth }}
    >
      {contents}
    </div>
  );
};

type PlayingCardProps = {
  card: Card;
  index: number;
  hasShadow?: boolean;
  z: number;
  opacity?: number;
};

type PerformanceBoostProps = {
  isWild: boolean;
  isGrouped: boolean;
  heldIndex: number | null;
};

export const PlayingCard = (
  props: PlayingCardProps & PerformanceBoostProps
) => {
  const dispatch = useDispatch();
  const selfRef = React.useRef<HTMLDivElement>(null);
  const card = props.card;
  const handleDragStart = React.useCallback(
    (e: React.MouseEvent) => {
      dispatch(setHeldIndex(props.index));
      dispatch(setDropSlotIndex(props.index));
    },
    [dispatch, props]
  );

  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent) => {
      if (!selfRef.current) {
        return;
      }

      if (props.heldIndex === null && e.buttons === 1) {
        handleDragStart(e);
      }
    },
    [props.heldIndex, handleDragStart]
  );

  const handleMouseUp = React.useCallback(
    (e: React.MouseEvent) => {
      if (props.heldIndex === null && card.type !== CardType.SPINNER) {
        e.stopPropagation();
        handleDragStart(e);
      }
    },
    [card.type, props.heldIndex, handleDragStart]
  );

  if (!card) {
    console.error("Trying to render a null card");
    return null;
  }

  return (
    <div
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      ref={selfRef}
      style={{
        zIndex: props.z,
        opacity: props.opacity ?? 1,
      }}
    >
      <CardBody
        card={card}
        hasShadow={props.hasShadow || false}
        isGrouped={props.isGrouped}
        isWild={props.isWild}
      />
    </div>
  );
};

type AnimationProps = {
  targetX: number;
  targetY: number;
  skipLerp?: boolean;
};

export const AnimatedPlayingCard = (
  props: AnimationProps & PlayingCardProps
) => {
  const targetPos = React.useRef({ x: props.targetX, y: props.targetY });
  const [left, setLeft] = React.useState(props.targetX);
  const [top, setTop] = React.useState(props.targetY);
  const leftRef = React.useRef(props.targetX);
  const topRef = React.useRef(props.targetY);
  const requestRef = React.useRef(0);
  const round = useSelector((state: RootState) => state.game.round);
  const hand = useSelector((state: RootState) => state.game.hand);
  const isGrouped = props.index >= 0 && hand[props.index].isGrouped;
  const wild = isWild(props.card, round);
  const heldIndex = useSelector(
    (state: RootState) => state.cardManagement.heldIndex
  );

  const animate = () => {
    if (leftRef.current !== undefined) {
      const deltaX = targetPos.current.x - leftRef.current;
      const deltaY = targetPos.current.y - topRef.current;
      const newX = leftRef.current + deltaX * 0.12;
      const newY = topRef.current + deltaY * 0.12;
      leftRef.current = newX;
      topRef.current = newY;
      setLeft(() => newX);
      setTop(() => newY);

      if (Math.abs(deltaX) > 0.1 || Math.abs(deltaY) > 0.1) {
        requestRef.current = requestAnimationFrame(animate);
      } else {
        cancelAnimationFrame(requestRef.current);
      }
    }
  };

  React.useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
    // Intentionally short list.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.targetX, props.targetY]);

  React.useEffect(() => {
    targetPos.current = { x: props.targetX, y: props.targetY };

    if (props.skipLerp) {
      leftRef.current = props.targetX;
      topRef.current = props.targetY;
    }
  }, [props.targetX, props.targetY, props.skipLerp]);

  const card = React.useMemo(
    () => (
      <PlayingCard
        card={props.card}
        index={props.index}
        z={props.index}
        hasShadow={props.hasShadow}
        opacity={props.opacity}
        isGrouped={isGrouped}
        isWild={wild}
        heldIndex={heldIndex}
      />
    ),
    [
      heldIndex,
      isGrouped,
      props.card,
      props.hasShadow,
      props.index,
      props.opacity,
      wild,
    ]
  );

  return (
    <div
      style={{
        position: "absolute",
        left: props.skipLerp ? props.targetX : left,
        top: props.skipLerp ? props.targetY : top,
      }}
    >
      {card}
    </div>
  );
};
