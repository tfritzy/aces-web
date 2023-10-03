import { Tooltip } from "components/Tooltip";
import { useSelector } from "react-redux";
import { TurnPhase } from "store/gameSlice";
import { RootState } from "store/store";

const highlighted =
  "px-2 py-1 bg-rose-100 dark:bg-rose-600 rounded text-rose-600 font-semibold border border-rose-300 dark:border-rose-400 dark:text-white";
const nonHighlighted =
  "px-2 py-1 rounded bg-gray-50 text-gray-500 font-semibold border dark:bg-gray-700 dark:border-gray-500 dark:text-gray-200";
const disabledStyling = " opacity-50";

export const TurnFlowchart = () => {
  const phase = useSelector((state: RootState) => state.game.turnPhase);
  const game = useSelector((state: RootState) => state.game);
  const canGoOut = game.hand.length > 0 && game.hand.every((c) => c.isGrouped);

  return (
    <div className="flex flex-col items-center border p-3 rounded dark:border-gray-700">
      <div
        className={phase === TurnPhase.Drawing ? highlighted : nonHighlighted}
      >
        Draw
      </div>
      <div className="text-lg text-gray-800 dark:text-white">↓</div>
      <div
        className={
          phase === TurnPhase.Discarding ? highlighted : nonHighlighted
        }
      >
        Discard
      </div>
      <div className="flex flex-row space-x-8">
        <div className="text-lg text-gray-800 dark:text-white">↙</div>
        <div className="text-lg text-gray-800 dark:text-white">↘</div>
      </div>
      <div
        data-tooltip-target="go-out-tooltip"
        className="flex flex-row items-center space-x-2"
      >
        <Tooltip
          trigger={
            <div
              className={
                "transition-all " +
                (phase === TurnPhase.Ending ? highlighted : nonHighlighted) +
                (!canGoOut ? disabledStyling : "")
              }
            >
              Go out
            </div>
          }
          text="You can't go out until all your cards are grouped."
        />

        <div
          className={phase === TurnPhase.Ending ? highlighted : nonHighlighted}
        >
          End turn
        </div>
      </div>
    </div>
  );
};
