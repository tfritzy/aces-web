import { getDefaultAvatar } from "helpers/getDefaultAvatar";
import { useSelector } from "react-redux";
import { RootState } from "store/store";

type PlayerStatusProps = {
  displayName: string;
  score: number;
  index: number;
};

export const PlayerStatus = (props: PlayerStatusProps) => {
  const turn = useSelector((state: RootState) => state.game.turn);
  const self = useSelector((state: RootState) => state.self);

  return (
    <div
      className="flex flex-row items-center space-x-3"
      key={props.displayName}
    >
      {turn === props.index && (
        <div className="text-3xl text-emerald-300">➜</div>
      )}
      <div className="rounded-lg flex flex-row space-x-1 items-center bg-slate-50  shadow-sm border border-gray-200 dark:border-gray-500 dark:bg-gray-700 px-4 overflow-hidden">
        <div className="w-12 h-12 rounded-lg">
          <div className="overflow-hidden w-12 h-12 rounded-lg">
            <img
              src={getDefaultAvatar(props.index)}
              className="rounded-lg w-10 h-12 mx-auto translate-y-2 -translate-x-1"
              alt="avatar"
            />
          </div>
        </div>

        <div className="text-gray-800 dark:text-white">{props.displayName}</div>

        {props.displayName === self.displayName && (
          <div className="relative">
            <div className="absolute rotate-[40deg] bg-emerald-300 w-16 text-center -top-6 -right-9 text-sm text-emerald-700">
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
        displayName={p.displayName}
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
