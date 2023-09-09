import { useSelector } from "react-redux";
import { RootState } from "store/store";
import { PlayingCard } from "./PlayingCard";
import React from "react";
import { MouseContext } from "./MouseContext";
import { cardHeight, cardWidth } from "Constants";
import { DECK_HELD_INDEX, PILE_HELD_INDEX } from "store/cardManagementSlice";
import { Cardback } from "components/Cardback";
import { cardBack } from "./Types";

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

function getHoveredIndex(
  x: number,
  numCards: number,
  center: number,
  distBetweenCards: number
) {
  let left =
    center -
    distBetweenCards * (numCards / 2) -
    distBetweenCards / 2 -
    cardWidth / 2;
  let i = 0;
  while (x > left + distBetweenCards) {
    left += distBetweenCards;
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
  const deckCenterX = windowDimensions.width / 2 - cardWidth;
  const pileX = windowDimensions.width / 2;
  const isHoveringHand = mousePos.y > dockTop && mousePos.y < dockBottom;
  const isHoveringPile =
    mousePos.x > pileX &&
    mousePos.x < pileX + cardWidth &&
    mousePos.y > deckY &&
    mousePos.y < deckY + cardHeight;

  const isHoldingCardInHand = heldIndex !== null && heldIndex >= 0;
  let numCards = hand.length - (isHoldingCardInHand ? 0 : 1);
  let hoveredIndex: number | null = null;
  const distBetweenCards = 45;
  if (isHoveringHand && isHoldingCardInHand) {
    hoveredIndex = getHoveredIndex(
      mousePos.x,
      numCards,
      windowDimensions.width / 2,
      distBetweenCards
    );
  }

  const numCardSlots = numCards + (hoveredIndex !== null ? 1 : 0);
  let insertSlot = hoveredIndex;
  if (insertSlot !== null && heldIndex !== null && insertSlot >= heldIndex) {
    insertSlot++;
  }
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
            z={index}
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
          key={i === deckSize - 1 ? cardBack.type + "-" + cardBack.deck : i}
          z={i}
        />
      );
    }

    return buffer;
  }, [deckCenterX, deckY, deckSize, heldIndex]);
  cards.push(...deckCards);

  let heldCard;
  if (heldIndex === PILE_HELD_INDEX) {
    heldCard = pile.length ? pile[pile.length - 1] : null;
  } else if (heldIndex === DECK_HELD_INDEX) {
    heldCard = cardBack;
  } else if (heldIndex !== null && heldIndex >= 0) {
    heldCard = hand[heldIndex];
  }

  if (heldCard) {
    cards.push(
      <PlayingCard
        card={heldCard}
        index={-1}
        targetX={mousePos.x - cardWidth / 2}
        targetY={mousePos.y - cardHeight / 2}
        z={hoveredIndex ?? 80}
        key={heldCard.type + "-" + heldCard.deck}
        skipLerp
      />
    );
  }

  const handleMouseUp = () => {
    console.log("Mouse up", isHoveringHand, heldIndex, hoveredIndex);
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
    </div>
  );
};
