import { useSelector } from "react-redux";
import { spacerCard } from "./Types";
import { RootState } from "store/store";
import { PlayingCard } from "./PlayingCard";
import { PILE_HELD_INDEX } from "store/cardManagementSlice";

type PileProps = {
  handleDrop: (index: number) => void;
};

export const Pile = (props: PileProps) => {
  const heldIndex = useSelector(
    (state: RootState) => state.cardManagement.heldIndex
  );
  const { handleDrop } = props;
  const game = useSelector((state: RootState) => state.game);

  return (
    <div className="w-32 h-44">
      {game.pile.map((card, index) => {
        if (index === game.pile.length - 1 && heldIndex === PILE_HELD_INDEX) {
          return (
            <PlayingCard
              isHeld
              card={card}
              index={PILE_HELD_INDEX}
              key={card.type + "-" + card.deck}
            />
          );
        }

        return (
          <div className="relative">
            <div style={{ position: "absolute", top: -1 * index + "px" }}>
              <PlayingCard
                isHeld={false}
                card={card}
                index={PILE_HELD_INDEX}
                key={card.type + "-" + card.deck}
                onDrop={handleDrop}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
