import { useAutoAnimate } from "@formkit/auto-animate/react";
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
  const [parent] = useAutoAnimate();
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
    <div
      className="flex flex-row items-center space-x-3"
      key={props.player.id}
      ref={parent}
    >
      {turn === props.index && (
        <div
          key="arrow"
          className="relative bg-violet-50 border border-violet-300 rounded text-md text-violet-700 px-2 py-1 flex flex-row items-center space-x-2 dark:bg-violet-500 dark:text-white dark:border-violet-400"
        >
          {isSelf && (
            <div className="absolute top-0 right-[7px]">
              <div className="absolute w-2 h-2 rounded-full bg-amber-300" />
              <div className="absolute w-2 h-2 rounded-full bg-amber-300 animate-ping" />
            </div>
          )}
          <div>{turnPhaseString}</div>
        </div>
      )}

      <div
        className={`rounded-lg flex flex-row space-x-1 items-center bg-slate-50 border border-gray-300 dark:border-gray-500 dark:bg-gray-700 pl-3 overflow-hidden ${
          isSelf ? "pr-6" : "pr-3"
        }`}
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

        <div className="text-gray-800 dark:text-white">
          {props.player.displayName}
        </div>

        {isSelf && (
          <div className="relative">
            <div className="absolute rotate-[45deg] bg-violet-100 w-16 text-center -top-[21px] -right-[44px] text-sm text-violet-700 border border-violet-200 dark:bg-violet-600 dark:text-violet-100 dark:border-violet-400">
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
    <div className="absolute top-2 left-2">
      <div className="flex flex-col space-y-3 p-4">{playerStatuses}</div>
    </div>
  );
};
