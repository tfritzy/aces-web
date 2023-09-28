import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/store";
import { AnimatedPlayingCard } from "./PlayingCard";
import React from "react";
import { MouseContext } from "./MouseContext";
import { cardHeight, cardWidth } from "Constants";
import {
  DECK_HELD_INDEX,
  PILE_HELD_INDEX,
  setDropSlotIndex,
} from "store/cardManagementSlice";
import { Card, cardBack } from "./Types";

const shadowSizes = [
  "shadow-md shadow-[#00000033]",
  "shadow-md",
  "shadow-sm",
  "",
  "",
];

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

function getInsertSlot(hoveredIndex: number | null, heldIndex: number | null) {
  let insertSlot = hoveredIndex;
  if (
    insertSlot !== null &&
    heldIndex !== null &&
    heldIndex >= 0 &&
    insertSlot >= heldIndex
  ) {
    insertSlot++;
  }
  return insertSlot;
}

function getHoveredIndex(
  x: number,
  numCards: number,
  center: number,
  distBetweenCards: number
) {
  let left = center - distBetweenCards * (numCards / 2);
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
const deckPercentFromTop = 0.27;

type CardManagementProps = {
  onDrop: (dropIndex?: number) => void;
  buttons: JSX.Element;
};

export const CardManagement = (props: CardManagementProps) => {
  const dispatch = useDispatch();
  const hand = useSelector((state: RootState) => state.game.hand);
  const pile = useSelector((state: RootState) => state.game.pile);
  const deckSize = useSelector((state: RootState) => state.game.deckSize);
  const heldIndex = useSelector(
    (state: RootState) => state.cardManagement.heldIndex
  );
  const dropSlotIndex = useSelector(
    (state: RootState) => state.cardManagement.dropSlotIndex
  );
  const mousePos = React.useContext(MouseContext);
  const selfRef = React.useRef<HTMLDivElement>(null);
  const [windowDimensions, setWindowDimensions] = React.useState(
    getWindowDimensions()
  );
  const needsCardsResize = React.useRef(false);

  React.useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
      needsCardsResize.current = true;
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

  let numCardSlots = hand.length;
  if (heldIndex !== null && heldIndex >= 0) {
    numCardSlots -= 1;
  }

  if (dropSlotIndex !== null) {
    numCardSlots += 1;
  }

  let insertSlot: number | null = null;
  const distBetweenCards = Math.min(900 / numCardSlots, cardWidth + 10);
  if (isHoveringHand && heldIndex !== null) {
    const hoveredIndex = getHoveredIndex(
      mousePos.x,
      numCardSlots,
      windowDimensions.width / 2,
      distBetweenCards
    );
    insertSlot = getInsertSlot(hoveredIndex, heldIndex);
    if (hoveredIndex !== dropSlotIndex) {
      dispatch(setDropSlotIndex(hoveredIndex));
    }
  } else if (dropSlotIndex !== null) {
    dispatch(setDropSlotIndex(null));
  }

  const handCards = React.useMemo(() => {
    let x = windowDimensions.width / 2 - distBetweenCards * (numCardSlots / 2);
    const buffer: JSX.Element[] = [];

    hand.forEach((card, index) => {
      if (index === insertSlot) {
        x += distBetweenCards;
      }

      if (index !== heldIndex) {
        buffer.push(
          <AnimatedPlayingCard
            card={card}
            index={index}
            targetX={x}
            targetY={dockCenterY - cardHeight / 2}
            key={card.type + "-" + card.deck}
            z={index + 1}
            shadow="shadow-sm"
            skipLerp={needsCardsResize.current}
          />
        );
        x += distBetweenCards;
      }
    });

    return buffer;
  }, [
    distBetweenCards,
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

      let shadow = 3;
      if (i < 1) {
        shadow = 0;
      } else if (i < 2) {
        shadow = 1;
      } else if (i < 3) {
        shadow = 2;
      }

      if (pile.length < 5) {
        shadow += 1;
      }

      if (pile.length < 2) {
        shadow += 1;
      }

      if (i >= pile.length - 2) {
        buffer.push(
          <AnimatedPlayingCard
            card={pile[i]}
            index={PILE_HELD_INDEX}
            targetX={pileX}
            targetY={pileStartY - i}
            key={pile[i].type + "-" + pile[i].deck}
            z={i}
            shadow={shadowSizes[shadow]}
            skipLerp={needsCardsResize.current}
          />
        );
      } else {
        buffer.push(
          <div
            className={`absolute cursor-pointer border-gray-400 dark:border-gray-700 border-solid border rounded-lg overflow-hidden ${shadowSizes[shadow]}`}
            style={{
              left: pileX,
              top: pileStartY - i,
              width: cardWidth,
              height: cardHeight,
            }}
          ></div>
        );
      }
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

      let shadow = 3;
      if (i < 1) {
        shadow = 0;
      } else if (i < 2) {
        shadow = 1;
      } else if (i < 3) {
        shadow = 2;
      }

      if (deckSize < 5) {
        shadow += 1;
      }

      if (i >= deckSize - 2) {
        buffer.push(
          <AnimatedPlayingCard
            card={cardBack}
            index={DECK_HELD_INDEX}
            targetX={deckCenterX}
            targetY={deckStartY - i}
            key={"deck-" + i}
            z={i}
            shadow={shadowSizes[shadow]}
            skipLerp
          />
        );
      } else {
        buffer.push(
          <div
            className={`absolute cursor-pointer border-gray-400 dark:border-gray-700 border-solid border rounded-lg overflow-hidden ${shadowSizes[shadow]}`}
            style={{
              left: deckCenterX,
              top: deckStartY - i,
              width: cardWidth,
              height: cardHeight,
            }}
          ></div>
        );
      }
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
      <AnimatedPlayingCard
        card={heldCard}
        index={-1}
        targetX={mousePos.x - cardWidth / 2}
        targetY={mousePos.y - cardHeight / 2}
        z={dropSlotIndex ?? 80}
        key={key}
        skipLerp
        shadow="drop-shadow-lg"
        opacity={isHoveringHand ? 0.5 : 1}
      />
    );
  }

  const handleMouseUp = () => {
    if (isHoveringHand && heldIndex !== null && dropSlotIndex !== null) {
      props.onDrop(dropSlotIndex);
    }

    if (isHoveringPile && heldIndex !== null) {
      props.onDrop(PILE_HELD_INDEX);
    }
  };

  needsCardsResize.current = false;

  return (
    <div ref={selfRef} onMouseUp={handleMouseUp}>
      <div
        style={{
          position: "fixed",
          top: dockCenterY - cardHeight / 2 - 25,
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <div
          className="relative w-[950px] rounded-lg border border-gray-300 dark:border-gray-700 shadow-[0_0_10px_#00000011_inset] dark:shadow-[0_0_10px_#00000099_inset]"
          style={{
            height: cardHeight + 50,
          }}
        >
          <div className="absolute -top-11 right-0">{props.buttons}</div>
        </div>
      </div>

      <div
        className="border-2 rounded-lg shadow-[0_0_10px_#00000011_inset] dark:shadow-[0_0_10px_#00000099_inset] dark:border-gray-800"
        style={{
          position: "fixed",
          left: deckCenterX - 15,
          top: deckY - 15,
          width: cardWidth + 30,
          height: cardHeight + 30,
        }}
      >
        <div className="absolute text-center -top-8 w-full text-gray-400 text-md">
          Deck
        </div>
      </div>

      <div
        className="border-2 rounded-lg shadow-[0_0_10px_#00000011_inset] dark:shadow-[0_0_10px_#00000099_inset] dark:border-gray-800"
        style={{
          position: "fixed",
          left: pileX - 15,
          top: deckY - 15,
          width: cardWidth + 30,
          height: cardHeight + 30,
        }}
      >
        <div className="absolute text-center -top-8 w-full text-gray-400 text-md">
          Pile
        </div>
      </div>

      {cards}

      <div style={{ position: "absolute", top: dockCenterY - 150 }}></div>
    </div>
  );
};
