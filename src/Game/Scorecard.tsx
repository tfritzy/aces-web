import { Modal } from "components/Modal";
import { useSelector } from "react-redux";
import { RootState } from "store/store";

type ScorecardProps = {
  onClose: () => void;
  shown: boolean;
};

export const Scorecard = (props: ScorecardProps) => {
  const players = useSelector((state: RootState) => state.players.players);

  const cellClasses = "py-1 px-2 border border-gray-400";
  const numRounds = 10;
  const rows = [];
  for (let i = 0; i < numRounds; i++) {
    rows.push(
      <tr key={i}>
        <td className={cellClasses}>{i + 1}</td>
        {players.map((p, j) => {
          return (
            <td className={cellClasses} key={j}>
              {p.scorePerRound && p.scorePerRound[i]}
            </td>
          );
        })}
      </tr>
    );
  }

  return (
    <Modal width="min-w-max" shown={props.shown} onClose={props.onClose}>
      <table className="table-auto">
        <thead>
          <th className={cellClasses} colSpan={players.length + 1}>
            Scorecard
            {
              <button
                className="absolute top-1 right-2 text-red-500"
                onClick={props.onClose}
              >
                🗙
              </button>
            }
          </th>
        </thead>
        <thead>
          <tr>
            <th className={cellClasses}></th>
            {players.map((p, i) => {
              return (
                <th className={cellClasses} key={i}>
                  {p.displayName}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </Modal>
  );
};
