import { useSelector } from "react-redux";
import { RootState } from "store/store";
import { PlayingCard } from "./PlayingCard";
import { PILE_HELD_INDEX } from "store/cardManagementSlice";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { cardHeight, cardWidth } from "Constants";

type PileProps = {
  handleDrop: (index?: number) => void;
};

const shadowSizes = ["shadow-lg", "shadow-md", "shadow-sm", "", ""];

export const Pile = (props: PileProps) => {
  const [parent] = useAutoAnimate({ duration: 75 });
  const heldIndex = useSelector(
    (state: RootState) => state.cardManagement.heldIndex
  );
  const { handleDrop } = props;
  const game = useSelector((state: RootState) => state.game);
  const actualPileSize =
    game.pile.length - (heldIndex === PILE_HELD_INDEX ? 1 : 0);

  if (game.pile.length === 0) {
    return (
      <div
        className="border border-dashed border-gray-300 dark:border-gray-500"
        onMouseUp={() => handleDrop(PILE_HELD_INDEX)}
        key="slot"
        style={{ width: cardWidth, height: cardHeight }}
      />
    );
  }

  return (
    <>
      <div style={{ height: cardHeight, width: cardWidth }} ref={parent}>
        {game.pile.map((card, index) => {
          if (index === game.pile.length - 1 && heldIndex === PILE_HELD_INDEX) {
            return null;
          }

          let shadow = 3;
          if (index < 1) {
            shadow = 0;
          } else if (index < 3) {
            shadow = 1;
          } else if (index < 5) {
            shadow = 2;
          }

          if (actualPileSize < 7) {
            shadow += 1;
          }

          return (
            <div className="relative" key={index}>
              <div
                style={{ position: "absolute", top: -1 * index + "px" }}
                className={shadowSizes[shadow] + " rounded-xl"}
              >
                <PlayingCard
                  isHeld={false}
                  card={card}
                  index={PILE_HELD_INDEX}
                  key={card.type + "-" + card.deck}
                  onDrop={handleDrop}
                  targetX={500}
                  targetY={500}
                />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
