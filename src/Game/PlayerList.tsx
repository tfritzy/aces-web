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

  return (
    <div
      className="flex flex-row items-center space-x-4"
      key={props.displayName}
    >
      {turn === props.index && (
        <div className="rounded-full bg-emerald-300 w-4 h-4" />
      )}
      <div className="rounded-full flex flex-row items-center justify-between bg-slate-50 w-64 shadow-sm p-1 dark:bg-gray-700">
        <div className="shadow-sm w-12 h-12 rounded-full">
          <div className="overflow-hidden w-12 h-12 rounded-full bg-white dark:bg-gray-600">
            <img
              src={getDefaultAvatar(props.index)}
              className="rounded-full w-10 h-12 mx-auto translate-y-2 -translate-x-1"
              alt="avatar"
            />
          </div>
        </div>

        <div className="text-left">{props.displayName}</div>

        <div className="font-bold">{props.score}</div>
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
      <div className="flex flex-col space-y-3 p-4 items-center">
        {playerStatuses}
      </div>
    </div>
  );
};
