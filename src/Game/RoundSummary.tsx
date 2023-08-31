import React from "react";

import { Modal } from "components/Modal";
import autoAnimate from "@formkit/auto-animate";
import { Button } from "components/Button";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import { Player } from "store/playerSlice";
import { getUnicodeForCard } from "helpers/getUnicodeForCard";
import { Minicard } from "components/Minicard";

type SummaryPlayer = Player & {
  placement: number;
  prevPlacement: number;
  roundScore: number;
};

type RoundSummaryProps = {
  onContinue: () => void;
  shown: boolean;
};

export const RoundSummary = (props: RoundSummaryProps) => {
  const game = useSelector((state: RootState) => state.game);
  const gamePlayers = useSelector((state: RootState) => state.players.players);

  const parent = React.useRef(null);
  React.useEffect(() => {
    parent.current &&
      autoAnimate(parent.current, {
        duration: 250,
      });
  }, [parent]);

  const [sortedPlayers, setSortedPlayers] = React.useState<SummaryPlayer[]>([]);

  React.useEffect(() => {
    const players = gamePlayers.map((p) => ({
      ...p,
      roundScore: p.scorePerRound[game.round - 1] || 0,
      placement: 0,
      prevPlacement: 0,
    }));

    players.sort((a, b) => {
      const prevA = a.totalScore - a.roundScore;
      const prevB = b.totalScore - b.roundScore;
      return prevA - prevB;
    });

    players.forEach((p, i) => {
      p.prevPlacement = i + 1;
    });

    players.sort((a, b) => {
      return a.totalScore - b.totalScore;
    });

    players.forEach((p, i) => {
      p.placement = i + 1;
    });

    setSortedPlayers(players);
  }, [game.round, gamePlayers, props.shown]);

  const getChevron = (p: SummaryPlayer) => {
    if (p.placement === p.prevPlacement) {
      return "";
    }

    if (p.placement < p.prevPlacement) {
      return <div className="text-sm text-blue-400">▲</div>;
    }

    return <div className="text-sm text-red-400">▼</div>;
  };

  return (
    <Modal width="w-[700px]" shown={props.shown} onClose={props.onContinue}>
      <div className="divide-solid divide-y divide-gray-300 dark:divide-gray-600">
        <div className="font-semibold text-2xl text-center p-2">{`Round ${game.round} results`}</div>

        <div className="px-1 py-4">
          <table className="w-full">
            <thead>
              <tr className="border-b dark:border-neutral-500">
                <th key="rank" className="px-3 py-2 text-left"></th>
                <th key="player" className="px-3 py-2 text-left">
                  Player
                </th>
                <th key="grouped" className="px-3 py-2 text-left">
                  Grouped
                </th>
                <th key="ungrouped" className="px-3 py-2 text-left">
                  Ungrouped
                </th>
                <th key="round" className="px-3 py-2 text-left">
                  Round
                </th>
                <th key="total" className="px-3 py-2 text-left">
                  Total
                </th>
              </tr>
            </thead>

            <tbody>
              {sortedPlayers.map((p, i) => {
                const icon = "Icons/characters/" + (i % 5) + ".png";

                return (
                  <tr className="border-b dark:border-neutral-500" key={p.id}>
                    <td key="placement" className="px-3 py-2">
                      <div className="font-bold text-xl leading-none text-center px-2 pr-4">
                        {p.placement}
                        {getChevron(p)}
                      </div>
                    </td>

                    <td key="player" className="px-3 py-2">
                      <div>
                        <div className="flex flex-row items-center border border-gray-200 dark:border-gray-700 rounded px-2 max-w-max">
                          <div className="overflow-hidden w-12 h-12 ">
                            <img
                              src={icon}
                              className="rounded-full w-10 h-12 mx-auto translate-y-2 -translate-x-1"
                              alt="avatar"
                            />
                          </div>
                          <div className="text-left truncate">
                            {p.displayName}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td key="grouped" className="px-3 py-2">
                      <div className="flex flex-row flex-wrap">
                        {p.mostRecentGroupedCards.map((g) => (
                          <div className="flex flex-row">
                            {g.map((c) => (
                              <div className="m-[1px]">
                                <Minicard card={c} />
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </td>

                    <td key="ungrouped" className="px-3 py-2">
                      <div className="flex flex-row flex-wrap">
                        {p.mostRecentUngroupedCards.map((c) => (
                          <div className="m-[1px]">
                            <Minicard card={c} />
                          </div>
                        ))}
                      </div>
                    </td>

                    <td key="round" className="px-3 py-2">
                      <div>{p.roundScore}</div>
                    </td>

                    <td key="total" className="px-3 py-2">
                      <div>{p.totalScore}</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end p-2">
          <Button onClick={props.onContinue} text="Next round" type="primary" />
        </div>
      </div>
    </Modal>
  );
};
