import * as React from "react";
import { CardType, TransitionType } from "./Types";
import { Suit, Card, CardValue } from "Game/Types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/store";
import {
  setDropSlotIndex,
  setHeldIndex,
  setOnTheWayOut,
} from "store/cardManagementSlice";
import { cardHeight, cardWidth, red, black } from "Constants";
import { isWild } from "helpers/getGroupedCards";
import { Cardback } from "components/Cardback";
import { setDeck, setPile } from "store/gameSlice";
import { CardManagement } from "./CardManagement";

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

export const getSuitIcon = (suit: Suit): JSX.Element | undefined => {
  switch (suit) {
    case Suit.CLUBS:
      return <div className="font-bold">♣</div>;
    case Suit.DIAMONDS:
      return <div>♦</div>;
    case Suit.HEARTS:
      return <div>♥</div>;
    case Suit.SPADES:
      return <div>♠</div>;
    case Suit.SUITLESS:
      return (
        <div>
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 31 31"
          >
            <g>
              <g>
                <path
                  d="M28.405,14.7c-0.479,0-0.897,0.228-1.172,0.576c-1.56-1.127-4.992-2.994-7.975-0.271c0,0-3.021-4.168-0.982-7.569
			c0.246,0.178,0.547,0.286,0.875,0.286c0.827,0,1.5-0.671,1.5-1.5s-0.673-1.5-1.5-1.5c-0.828,0-1.502,0.671-1.502,1.5
			c0,0.168,0.032,0.327,0.084,0.478c-2.141,0.819-5.836,2.858-6.39,7.307c0,0-3.429-4.541-8.573-1.594
			c-0.265-0.425-0.732-0.711-1.27-0.711c-0.829,0-1.501,0.672-1.501,1.5s0.672,1.5,1.501,1.5c0.828,0,1.499-0.672,1.499-1.5
			c0-0.047-0.01-0.091-0.014-0.137c1.794,0.14,4.67,1.726,5.461,10.151l0.09,0.688c0,0.707,2.858,1.279,6.382,1.279
			c3.526,0,6.383-0.574,6.383-1.279c0,0,0.229-5.78,5.611-7.623c0.041,0.791,0.688,1.423,1.491,1.423c0.83,0,1.5-0.673,1.5-1.5
			C29.907,15.371,29.235,14.7,28.405,14.7z"
                />
              </g>
            </g>
          </svg>
        </div>
      );
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

const cardBackground = "bg-gray-50 dark:bg-gray-950";

const getCardColor = (card: Card) => {
  switch (card.suit) {
    case Suit.CLUBS:
    case Suit.SPADES:
      return black;
    case Suit.DIAMONDS:
    case Suit.HEARTS:
      return red;
    case Suit.SUITLESS:
      if (card.type === CardType.JOKER_A) return red;
      if (card.type === CardType.JOKER_B) return black;
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
  const className = `flex space-y-1 h-full text-lg leading-5 select-none items-center ${flex} w-4`;
  const valueIcon = getValueIcon(props.card);

  return (
    <div className={className}>
      <div className={`${cardBackground}`}>
        {valueIcon.map((c) => (
          <div className="text-center font-semibold h-[18px]" key={c}>
            {c}
          </div>
        ))}
      </div>

      <div className={`${cardBackground} text-md`}>
        {getSuitIcon(props.card.suit)}
      </div>
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
            <div className={i > counts[0] / 2 - 1 ? "rotate-180" : ""} key={i}>
              {getSuitIcon(card.suit)}
            </div>
          ))}
        </div>

        <div className="flex grow flex-col items-center justify-evenly justify-items-stretch text-3xl">
          {Array.from({ length: counts[1] }).map((_, i) => (
            <div className={i > counts[1] / 2 - 1 ? "rotate-180" : ""} key={i}>
              {getSuitIcon(card.suit)}
            </div>
          ))}
        </div>

        <div className="flex grow flex-col items-center justify-evenly justify-items-stretch text-3xl">
          {Array.from({ length: counts[2] }).map((_, i) => (
            <div className={i > counts[2] / 2 - 1 ? "rotate-180" : ""} key={i}>
              {getSuitIcon(card.suit)}
            </div>
          ))}
        </div>
      </div>
    );
  } else {
    face = (
      <div className="w-full h-full flex justify-center items-center text-center align-middle">
        <div className="w-[50px] h-[50px] text-6xl">
          {getSuitIcon(card.suit)}
        </div>
      </div>
    );
  }

  return <div className="flex grow">{face}</div>;
};

type CardBodyProps = {
  card: Card;
  isGrouped: boolean;
  isWild: boolean;
  shadow?: string;
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
          <div
            className={`absolute top-3 right-3 uppercase text-xs font-mono rotate-180 ${getCardColor(
              card
            )}`}
          >
            wild
          </div>
        )}

        {props.isWild && (
          <div
            className={`absolute bottom-3 left-3 uppercase text-xs font-mono ${getCardColor(
              card
            )}`}
          >
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
      className={`${
        props.isGrouped
          ? "border-2 border-emerald-400 dark:border-emerald-400 shadow-emerald-200 dark:shadow-emerald-600 shadow-md"
          : ""
      } ${getCardColor(
        card
      )} ${cardBackground} cursor-pointer border-gray-400 dark:border-gray-700 border-solid border rounded-lg overflow-hidden select-none relative font-serif dark:shadow-[#00000055] ${
        props.shadow
      }`}
      style={{ height: cardHeight, width: cardWidth }}
    >
      {contents}
    </div>
  );
};

type PlayingCardProps = {
  card: Card;
  index: number;
  shadow?: string;
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
  const handleDragStart = React.useCallback(() => {
    dispatch(setHeldIndex(props.index));
    dispatch(setDropSlotIndex(props.index));
  }, [dispatch, props]);

  const handleGrab = React.useCallback(() => {
    if (!selfRef.current) {
      return;
    }

    if (props.heldIndex === null) {
      handleDragStart();
    }
  }, [props.heldIndex, handleDragStart]);

  const handleMouseUp = React.useCallback(
    (e: React.MouseEvent) => {
      if (props.heldIndex === null && card.type !== CardType.SPINNER) {
        e.stopPropagation();
        handleDragStart();
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
      onMouseDown={handleGrab}
      onTouchStart={handleGrab}
      ref={selfRef}
      style={{
        zIndex: props.z,
        opacity: props.opacity ?? 1,
      }}
    >
      <CardBody
        card={card}
        shadow={props.shadow}
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
  const game = useSelector((state: RootState) => state.game);
  const isGrouped = props.index >= 0 && game.hand[props.index].isGrouped;
  const wild = isWild(props.card, game.round);
  const dispatch = useDispatch();
  const cardManagement = useSelector(
    (state: RootState) => state.cardManagement
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
        setLeft(() => targetPos.current.x);
        setTop(() => targetPos.current.y);
        leftRef.current = targetPos.current.x;
        topRef.current = targetPos.current.y;
        cancelAnimationFrame(requestRef.current);

        if (props.card.needsTransition === TransitionType.FlyInToPile) {
          const cardIndex = game.pile.findIndex((c) => c.id === props.card.id);
          if (cardIndex !== -1) {
            const card = { ...game.pile[cardIndex] };
            card.needsTransition = undefined;
            const newPile = [...game.pile];
            newPile[newPile.length - 1] = card;
            dispatch(setPile(newPile));
          }
        } else if (props.card.needsTransition === TransitionType.FlyOutOfPile) {
          const newOnTheWayOut = cardManagement.onTheWayOut.filter(
            (c) => c.id !== props.card.id
          );
          dispatch(setOnTheWayOut(newOnTheWayOut));
        } else if (props.card.needsTransition === TransitionType.FlyOutOfDeck) {
          const newOnTheWayOut = cardManagement.onTheWayOut.filter(
            (c) => c.id !== props.card.id
          );
          dispatch(setOnTheWayOut(newOnTheWayOut));
        }
      }
    }
  };

  React.useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
    // Intentionally short list.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.targetX, props.targetY, props.card.needsTransition]);

  React.useEffect(() => {
    targetPos.current = { x: props.targetX, y: props.targetY };

    if (
      props.card.needsTransition === TransitionType.FlyOutOfDeck ||
      props.card.needsTransition === TransitionType.FlyOutOfPile
    ) {
      targetPos.current = { x: props.targetX, y: props.targetY - 800 };
    }

    if (props.skipLerp) {
      leftRef.current = props.targetX;
      topRef.current = props.targetY;
    }
  }, [
    props.targetX,
    props.targetY,
    props.skipLerp,
    props.card.needsTransition,
  ]);

  React.useEffect(() => {
    if (props.card.needsTransition === TransitionType.FlyInToPile) {
      leftRef.current = props.targetX;
      topRef.current = props.targetY - 800;
      setLeft(() => props.targetX);
      setTop(() => props.targetY - 800);
    }
    // Intentionally short list.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.card.needsTransition]);

  const card = React.useMemo(
    () => (
      <PlayingCard
        card={props.card}
        index={props.index}
        z={props.index}
        shadow={props.shadow}
        opacity={props.opacity}
        isGrouped={isGrouped}
        isWild={wild}
        heldIndex={cardManagement.heldIndex}
      />
    ),
    [
      cardManagement.heldIndex,
      isGrouped,
      props.card,
      props.shadow,
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
