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
    <div>
      {heldIndex === PILE_HELD_INDEX && (
        <PlayingCard
          isHeld
          card={game.pile[game.pile.length - 1]}
          index={PILE_HELD_INDEX}
        />
      )}

      <PlayingCard
        isHeld={false}
        card={
          game.pile[
            game.pile.length - (heldIndex === PILE_HELD_INDEX ? 2 : 1)
          ] || spacerCard
        }
        index={PILE_HELD_INDEX}
        onDrop={handleDrop}
      />
    </div>
  );
};
