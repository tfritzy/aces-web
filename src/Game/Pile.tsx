import { useSelector } from "react-redux";
import { PILE_HELD_INDEX } from "./Board";
import { spacerCard } from "./Types";
import { RootState } from "store/store";
import { PlayingCard } from "./PlayingCard";

type PileProps = {
  setHeldIndex: (index: number) => void;
  heldIndex: number;
  mousePos: { x: number; y: number };
  handleDrop: (index: number) => void;
  dropSlotIndex: number | null;
  setDropSlotIndex: (index: number | null) => void;
};

export const Pile = (props: PileProps) => {
  const { setHeldIndex, heldIndex, mousePos, handleDrop, setDropSlotIndex } =
    props;
  const game = useSelector((state: RootState) => state.game);

  return (
    <div>
      {heldIndex === PILE_HELD_INDEX && (
        <PlayingCard
          isHeld
          card={game.pile[game.pile.length - 1]}
          index={PILE_HELD_INDEX}
          heldIndex={heldIndex}
          setHeldIndex={setHeldIndex}
          mousePos={mousePos}
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
        heldIndex={props.heldIndex}
        setHeldIndex={setHeldIndex}
        setDropSlotIndex={setDropSlotIndex}
        onDrop={handleDrop}
        mousePos={mousePos}
      />
    </div>
  );
};
