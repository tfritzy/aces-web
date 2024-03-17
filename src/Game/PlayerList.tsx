import { getDefaultAvatar } from "helpers/getDefaultAvatar";
import { useSelector } from "react-redux";
import { TurnPhase } from "store/gameSlice";
import { Player } from "store/playerSlice";
import { RootState } from "store/store";

type PlayerStatusProps = {
  player: Player;
  score: number;
  index: number;
};

export const PlayerStatus = (props: PlayerStatusProps) => {
  const turn = useSelector((state: RootState) => state.game.turn);
  const self = useSelector((state: RootState) => state.self);
  const turnPhase = useSelector((state: RootState) => state.game.turnPhase);

  const isSelf = props.player.id === self.id;
  let turnPhaseString;
  if (turnPhase === TurnPhase.Drawing) {
    turnPhaseString = "Drawing…";
  } else if (turnPhase === TurnPhase.Discarding) {
    turnPhaseString = "Discarding…";
  } else {
    turnPhaseString = "Ending…";
  }

  return (
    <div className="flex flex-row items-center space-x-3" key={props.player.id}>
      <div
        className={`rounded-lg flex flex-row space-x-1 items-center pl-3 overflow-hidden ${
          isSelf ? "pr-7" : "pr-3"
        } ${
          turn === props.index
            ? "border-rose-400 dark:border-rose-600 bg-rose-200 dark:bg-rose-900"
            : ""
        } border-gray-300 dark:border-gray-500 bg-slate-50 border dark:bg-gray-700`}
      >
        <div className="w-12 h-12 rounded-lg">
          <div className="overflow-hidden w-12 h-12 rounded-lg">
            <img
              src={getDefaultAvatar(props.player.id)}
              className="rounded-lg w-10 h-12 mx-auto translate-y-2 -translate-x-1"
              alt="avatar"
            />
          </div>
        </div>

        <div>
          <div className="text-gray-800 dark:text-white">
            {props.player.displayName}
          </div>
          {turn === props.index && (
            <div className="text-gray-800 dark:text-gray-200 text-xs">
              {turnPhaseString}
            </div>
          )}
        </div>

        {isSelf && (
          <div className="relative">
            <div className="absolute rotate-[45deg] bg-rose-100 w-16 text-center -top-[21px] -right-[44px] text-sm text-rose-700 border border-rose-200 dark:bg-rose-600 dark:text-white dark:border-rose-400">
              You
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const PlayerList = () => {
  const players = useSelector((state: RootState) => state.players.players);

  const playerStatuses = players.map((p, i) => {
    return (
      <PlayerStatus
        player={p}
        score={p.totalScore}
        index={i}
        key={p.displayName}
      />
    );
  });

  return (
    <div className="absolute -top-2 -left-1">
      <div className="flex flex-col space-y-2 p-4">{playerStatuses}</div>
    </div>
  );
};
