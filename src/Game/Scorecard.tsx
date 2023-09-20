import { Button } from "components/Button";
import { Modal } from "components/Modal";
import React from "react";
import { useSelector } from "react-redux";
import { Player } from "store/playerSlice";
import { RootState } from "store/store";

export const ScorecardButton = () => {
  const [scorecardShown, setScorecardShown] = React.useState(false);

  return (
    <>
      <Button
        onClick={() => setScorecardShown(!scorecardShown)}
        type="secondary"
        text={
          <svg
            width="24px"
            height="24px"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.5 4H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2.5"
              strokeWidth="1.5"
              strokeLinecap="round"
              className="stroke-gray-600 dark:stroke-white"
            ></path>
            <path
              d="M8 6.4V4.5a.5.5 0 01.5-.5c.276 0 .504-.224.552-.496C9.2 2.652 9.774 1 12 1s2.8 1.652 2.948 2.504c.048.272.276.496.552.496a.5.5 0 01.5.5v1.9a.6.6 0 01-.6.6H8.6a.6.6 0 01-.6-.6z"
              strokeWidth="1.5"
              strokeLinecap="round"
              className="stroke-gray-600 dark:stroke-white"
            ></path>
          </svg>
        }
      />
      <Scorecard
        shown={scorecardShown}
        onClose={() => setScorecardShown(false)}
      />
    </>
  );
};

type ScorecardProps = {
  onClose: () => void;
  shown: boolean;
};

export const Scorecard = (props: ScorecardProps) => {
  const players: (Player | null)[] = [
    ...useSelector((state: RootState) => state.players.players),
  ];
  while (players.length < 4) {
    players.push(null);
  }

  const cellClasses = "py-1 px-2 border border-gray-200 dark:border-gray-700 ";
  const numRounds = 12;
  const rows = [];
  for (let i = 0; i < numRounds; i++) {
    rows.push(
      <tr key={i}>
        <td className={`${cellClasses} text-gray-500 dark:text-gray-300`}>
          {i + 1}
        </td>
        {players.map((p, j) => {
          const score = p?.scorePerRound && p.scorePerRound[i];

          return (
            <td
              className={`${cellClasses} text-right ${
                score ?? "text-gray-300 dark:text-gray-500"
              }`}
              key={j}
            >
              {score === 0}
              {score ?? "—"}
            </td>
          );
        })}
      </tr>
    );
  }

  return (
    <Modal width="min-w-max" shown={props.shown} onClose={props.onClose}>
      <div className="flex flex-col">
        <div className="relative">
          <h1 className="text-2xl font-bold text-center px-4 py-2">
            Scorecard
          </h1>
          <button
            onClick={props.onClose}
            className="absolute right-2 top-1 text-red-600 dark:text-red-400"
          >
            🗙
          </button>
        </div>

        <div className="">
          <table className="table-auto">
            <thead>
              <tr>
                <th className={cellClasses}></th>
                {players.map((p, i) => {
                  return (
                    <th
                      className={`${cellClasses} text-sm font-normal`}
                      key={i}
                    >
                      {p?.displayName}
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody>{rows}</tbody>

            <tr key="total">
              <td className={`${cellClasses} text-gray-500 dark:text-gray-300`}>
                Total
              </td>
              {players.map((p, j) => {
                const totalScore = p?.scorePerRound?.reduce(
                  (acc, cur) => acc + cur,
                  0
                );

                return (
                  <td
                    className={`${cellClasses} text-right ${
                      totalScore ?? "text-gray-300 dark:text-gray-500"
                    }`}
                    key={j}
                  >
                    {totalScore ?? "—"}
                  </td>
                );
              })}
            </tr>
          </table>
        </div>
      </div>
    </Modal>
  );
};
