import { useAutoAnimate } from "@formkit/auto-animate/react";
import { getDefaultAvatar } from "helpers/getDefaultAvatar";
import { useSelector } from "react-redux";
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

  const isSelf = props.player.id === self.id;

  return (
    <div
      className="flex flex-row items-center space-x-3"
      key={props.player.id}
      ref={parent}
    >
      {turn === props.index && (
        <div key="arrow" className="text-3xl text-blue-300">
          ➜
        </div>
      )}
      <div
        className={`rounded-lg flex flex-row space-x-1 items-center bg-slate-50  shadow-md border border-gray-300 dark:border-gray-500 dark:bg-gray-700 pl-3 pr-5 overflow-hidden ${
          isSelf ? "pr-5" : "pr-3"
        }`}
      >
        <div className="w-12 h-12 rounded-lg">
          <div className="overflow-hidden w-12 h-12 rounded-lg">
            <img
              src={getDefaultAvatar(props.index)}
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
            <div className="absolute rotate-[40deg] bg-blue-300 w-16 text-center -top-[22px] -right-[40px] text-sm text-blue-700">
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
