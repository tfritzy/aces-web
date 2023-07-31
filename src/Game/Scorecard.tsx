import { Modal } from "components/Modal";
import { useSelector } from "react-redux";
import { RootState } from "store/store";

export const Scorecard = () => {
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
              {p.scorePerRound[i]}
            </td>
          );
        })}
      </tr>
    );
  }

  return (
    <Modal width="min-w-max">
      <table className="table-auto">
        <thead>
          <th className={cellClasses} colSpan={players.length + 1}>
            Scorecard
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
