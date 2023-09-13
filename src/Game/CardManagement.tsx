import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/store";
import { PlayingCard } from "./PlayingCard";
import React from "react";
import { MouseContext } from "./MouseContext";
import { cardHeight, cardWidth } from "Constants";
import {
  DECK_HELD_INDEX,
  PILE_HELD_INDEX,
  setDropSlotIndex,
} from "store/cardManagementSlice";
import { Cardback } from "components/Cardback";
import { Card, cardBack } from "./Types";

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

function getInsertSlot(hoveredIndex: number | null, heldIndex: number | null) {
  let insertSlot = hoveredIndex;
  if (insertSlot !== null && heldIndex !== null && insertSlot >= heldIndex) {
    insertSlot++;
  }
  return insertSlot;
}

function getHoveredIndex(
  x: number,
  numCards: number,
  center: number,
  distBetweenCards: number,
  currentHeldIndex: number | null
) {
  let left = center - distBetweenCards * (numCards / 2) - cardWidth / 2;
  let i = 0;
  while (
    x >
    left + (currentHeldIndex === i ? distBetweenCards * 2 : distBetweenCards)
  ) {
    left += currentHeldIndex === i ? distBetweenCards * 2 : distBetweenCards;
    i++;
  }

  i = Math.min(i, numCards);
  i = Math.max(i, 0);

  return i;
}

const dockHeight = cardHeight + 100;
const dockYPercent = 0.75;
const deckPercentFromTop = 0.2;

type CardManagementProps = {
  onDrop: (dropIndex?: number) => void;
  buttons: React.ReactNode;
};

export const CardManagement = (props: CardManagementProps) => {
  const hand = useSelector((state: RootState) => state.game.hand);
  const pile = useSelector((state: RootState) => state.game.pile);
  const deckSize = useSelector((state: RootState) => state.game.deckSize);
  const heldIndex = useSelector(
    (state: RootState) => state.cardManagement.heldIndex
  );
  const mousePos = React.useContext(MouseContext);
  const selfRef = React.useRef<HTMLDivElement>(null);
  const [windowDimensions, setWindowDimensions] = React.useState(
    getWindowDimensions()
  );
  const hoveredIndexRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const cards: JSX.Element[] = [];

  const dockCenterY = windowDimensions.height * dockYPercent;
  const dockTop = dockCenterY - dockHeight / 2;
  const dockBottom = dockCenterY + dockHeight / 2;
  const deckY = windowDimensions.height * deckPercentFromTop;
  const deckCenterX = windowDimensions.width / 2 - cardWidth - 25;
  const pileX = windowDimensions.width / 2 + 25;
  const isHoveringHand = mousePos.y > dockTop && mousePos.y < dockBottom;
  const isHoveringPile =
    mousePos.x > pileX &&
    mousePos.x < pileX + cardWidth &&
    mousePos.y > deckY &&
    mousePos.y < deckY + cardHeight;

  const isHoldingCardInHand = heldIndex !== null && heldIndex >= 0;
  let numCards = hand.length - (isHoldingCardInHand ? 0 : 1);
  const distBetweenCards = 50;
  let hoveredIndex: number | null = null;
  if (isHoveringHand && heldIndex !== null) {
    hoveredIndex = getHoveredIndex(
      mousePos.x,
      numCards,
      windowDimensions.width / 2,
      distBetweenCards,
      hoveredIndexRef.current
    );
    hoveredIndexRef.current = hoveredIndex;
  }

  const numCardSlots = numCards + (hoveredIndex !== null ? -1 : 0);
  const insertSlot = getInsertSlot(hoveredIndex, heldIndex);
  const handCards = React.useMemo(() => {
    let x =
      windowDimensions.width / 2 -
      distBetweenCards * (numCardSlots / 2) -
      cardWidth / 2;
    const buffer: JSX.Element[] = [];

    hand.forEach((card, index) => {
      if (index === insertSlot) {
        x += distBetweenCards;
      }

      if (index !== heldIndex) {
        buffer.push(
          <PlayingCard
            card={card}
            index={index}
            targetX={x}
            targetY={dockCenterY - cardHeight / 2}
            key={card.type + "-" + card.deck}
            z={index + 1}
          />
        );
        x += distBetweenCards;
      }
    });

    return buffer;
  }, [
    dockCenterY,
    hand,
    heldIndex,
    insertSlot,
    numCardSlots,
    windowDimensions.width,
  ]);
  cards.push(...handCards);

  const pileCards = React.useMemo(() => {
    const pileStartY = deckY;
    const buffer: JSX.Element[] = [];

    for (let i = 0; i < pile.length; i++) {
      if (heldIndex === PILE_HELD_INDEX && i === pile.length - 1) {
        continue;
      }

      buffer.push(
        <PlayingCard
          card={pile[i]}
          index={PILE_HELD_INDEX}
          targetX={pileX}
          targetY={pileStartY - i * 1}
          key={pile[i].type + "-" + pile[i].deck}
          z={i}
        />
      );
    }

    return buffer;
  }, [deckY, heldIndex, pile, pileX]);
  cards.push(...pileCards);

  const deckCards = React.useMemo(() => {
    const deckStartY = deckY;
    const buffer: JSX.Element[] = [];

    for (let i = 0; i < deckSize; i++) {
      if (heldIndex === DECK_HELD_INDEX && i === deckSize - 1) {
        continue;
      }

      buffer.push(
        <PlayingCard
          card={cardBack}
          index={DECK_HELD_INDEX}
          targetX={deckCenterX}
          targetY={deckStartY - i * 1}
          key={"deck-" + i}
          z={i}
        />
      );
    }

    return buffer;
  }, [deckCenterX, deckY, deckSize, heldIndex]);
  cards.push(...deckCards);

  let heldCard: Card | null = null;
  let key: string | null = null;
  if (heldIndex === PILE_HELD_INDEX) {
    heldCard = pile.length ? pile[pile.length - 1] : null;
    key = heldCard ? heldCard.type + "-" + heldCard.deck : null;
  } else if (heldIndex === DECK_HELD_INDEX) {
    heldCard = cardBack;
    key = "deck-" + (deckSize - 1);
  } else if (heldIndex !== null && heldIndex >= 0) {
    heldCard = hand[heldIndex];
    key = heldCard.type + "-" + heldCard.deck;
  }

  if (heldCard) {
    cards.push(
      <PlayingCard
        card={heldCard}
        index={-1}
        targetX={mousePos.x - cardWidth / 2}
        targetY={mousePos.y - cardHeight / 2}
        z={insertSlot ?? 80}
        key={key}
        skipLerp
        opacity={isHoveringHand ? 0.6 : 1}
      />
    );
  }

  const handleMouseUp = () => {
    if (isHoveringHand && heldIndex !== null && hoveredIndex !== null) {
      props.onDrop(hoveredIndex);
    }

    if (isHoveringPile && heldIndex !== null) {
      props.onDrop(PILE_HELD_INDEX);
    }
  };

  return (
    <div ref={selfRef} onMouseUp={handleMouseUp}>
      {cards}

      {isHoveringPile && <div className="bg-red-200">PILE</div>}

      {isHoveringHand && <div className="bg-green-200">Hand</div>}

      {props.buttons}
    </div>
  );
};
