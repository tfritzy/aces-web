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
import { Card } from "./Types";

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

const dockYPercent = 0.75;
const handPadding = 6;
const dockHeight = cardHeight + handPadding * 2;

type CardManagementProps = {
  onDrop: (dropIndex?: number) => void;
  buttons: JSX.Element;
};

export const CardManagement = (props: CardManagementProps) => {
  const dispatch = useDispatch();
  const hand = useSelector((state: RootState) => state.game.hand);
  const pile = useSelector((state: RootState) => state.game.pile);
  const deck = useSelector((state: RootState) => state.game.deck);
  const deckSize = useSelector((state: RootState) => state.game.deck.length);
  const cardManagement = useSelector(
    (state: RootState) => state.cardManagement
  );
  const heldIndex = cardManagement.heldIndex;
  const dropSlotIndex = cardManagement.dropSlotIndex;
  const mousePos = React.useContext(MouseContext);
  const selfRef = React.useRef<HTMLDivElement>(null);
  const [windowDimensions, setWindowDimensions] = React.useState(
    getWindowDimensions()
  );
  const needsCardsResize = React.useRef(false);
  const handWidth = Math.min(windowDimensions.width * 0.95, 1300);

  React.useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
      needsCardsResize.current = true;
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const cards: JSX.Element[] = [];

  const mobileHeight = windowDimensions.height < 600;
  const mobileWidth = windowDimensions.width < 500;
  const dockCenterY = mobileWidth
    ? windowDimensions.height - dockHeight / 2
    : windowDimensions.height * dockYPercent;
  const dockTop = dockCenterY - dockHeight / 2;
  const dockBottom = dockCenterY + dockHeight / 2;
  const deckY = mobileHeight
    ? cardHeight / 2 - 10
    : dockCenterY - cardHeight - windowDimensions.height * 0.3;
  const deckCenterX = windowDimensions.width / 2 - cardWidth - 25;
  const pileX = windowDimensions.width / 2 + 25;
  const isHoveringHand = mousePos.y > dockTop && mousePos.y < dockBottom;
  const isHoveringPile =
    mousePos.x > pileX - 50 &&
    mousePos.x < pileX + cardWidth + 50 &&
    mousePos.y > deckY - 50 &&
    mousePos.y < deckY + cardHeight + 50;

  let numCardSlots = hand.length;
  if (heldIndex !== null && heldIndex >= 0) {
    numCardSlots -= 1;
  }

  if (dropSlotIndex !== null) {
    numCardSlots += 1;
  }

  let insertSlot: number | null = null;
  const distBetweenCards = Math.min(
    (handWidth - handPadding * 2 - cardWidth) / (numCardSlots - 1),
    cardWidth + 10
  );
  const handStartX =
    distBetweenCards === cardWidth + 10
      ? windowDimensions.width / 2 - (numCardSlots / 2) * distBetweenCards
      : windowDimensions.width / 2 - handWidth / 2 + handPadding;
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
    let x = handStartX;
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
            targetY={dockCenterY - cardHeight / 2 - handPadding * 3}
            key={card.id}
            z={index + 1}
            shadow="shadow-sm"
            skipLerp={needsCardsResize.current}
          />
        );
        x += distBetweenCards;
      }
    });

    return buffer;
  }, [distBetweenCards, dockCenterY, hand, handStartX, heldIndex, insertSlot]);
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
            key={pile[i].id}
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
            key={pile[i].id}
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
            card={deck[i]}
            index={DECK_HELD_INDEX}
            targetX={deckCenterX}
            targetY={deckStartY - i}
            key={deck[i].id}
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
              left: deckCenterX,
              top: deckStartY - i,
              width: cardWidth,
              height: cardHeight,
            }}
            key={deck[i].id}
          ></div>
        );
      }
    }

    return buffer;
  }, [deckY, deckSize, heldIndex, deck, deckCenterX]);
  cards.push(...deckCards);

  const onTheWayOutCards = React.useMemo(() => {
    const buffer: JSX.Element[] = [];
    for (let i = 0; i < cardManagement.onTheWayOut.length; i++) {
      buffer.push(
        <AnimatedPlayingCard
          card={cardManagement.onTheWayOut[i]}
          index={-1}
          targetX={deckCenterX}
          targetY={deckY - i}
          key={cardManagement.onTheWayOut[i].id}
          z={i}
          shadow="shadow-sm"
          skipLerp={needsCardsResize.current}
        />
      );
    }

    return buffer;
  }, [cardManagement.onTheWayOut, deckCenterX, deckY]);
  cards.push(...onTheWayOutCards);

  let heldCard: Card | null = null;
  if (heldIndex === PILE_HELD_INDEX) {
    heldCard = pile.length ? pile[pile.length - 1] : null;
  } else if (heldIndex === DECK_HELD_INDEX) {
    heldCard = deck[deck.length - 1];
  } else if (heldIndex !== null && heldIndex >= 0) {
    heldCard = hand[heldIndex];
  }

  if (heldCard) {
    cards.push(
      <AnimatedPlayingCard
        card={heldCard}
        index={-1}
        targetX={mousePos.x - cardWidth / 2}
        targetY={mousePos.y - cardHeight / 2}
        z={dropSlotIndex ?? 80}
        key={heldCard.id}
        skipLerp
        shadow="shadow-lg"
        opacity={isHoveringHand ? 0.5 : 1}
      />
    );
  }

  const handleMouseUp = (e: React.SyntheticEvent) => {
    if (isHoveringHand && heldIndex !== null && dropSlotIndex !== null) {
      props.onDrop(dropSlotIndex);
    }

    if (isHoveringPile && heldIndex !== null) {
      props.onDrop(PILE_HELD_INDEX);
    }
  };

  needsCardsResize.current = false;

  return (
    <div ref={selfRef} onMouseUp={handleMouseUp} onTouchEnd={handleMouseUp}>
      <div
        style={{
          position: "fixed",
          top: dockCenterY - cardHeight / 2 - 25,
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <div
          className="relative rounded-lg border border-gray-200 dark:border-gray-800 shadow-[0_0_6px_#00000006_inset] dark:shadow-[0_0_6px_#00000066_inset]"
          style={{
            height: dockHeight,
            width: handWidth,
          }}
        >
          <div className="absolute -top-11 right-0 w-[100%]">
            {props.buttons}
          </div>
        </div>
      </div>

      <div
        className="border rounded-lg shadow-[0_0_6px_#00000006_inset] dark:shadow-[0_0_6px_#00000055_inset] dark:border-gray-800"
        style={{
          position: "fixed",
          left: deckCenterX - 10,
          top: deckY - 10,
          width: cardWidth + 20,
          height: cardHeight + 20,
        }}
      >
        <div className="absolute text-center -top-8 w-full text-gray-400 text-md">
          Deck
        </div>
      </div>

      <div
        className="border rounded-lg shadow-[0_0_6px_#00000006_inset] dark:shadow-[0_0_6px_#00000055_inset] dark:border-gray-800"
        style={{
          position: "fixed",
          left: pileX - 10,
          top: deckY - 10,
          width: cardWidth + 20,
          height: cardHeight + 20,
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
