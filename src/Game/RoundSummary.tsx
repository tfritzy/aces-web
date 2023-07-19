import React from "react";

import { Modal } from "components/Modal";
import autoAnimate from "@formkit/auto-animate";
import { Button } from "components/Button";

type PlayerProp = {
  displayName: string;
  roundScore: number;
  totalScore: number;
};

type Player = {
  displayName: string;
  roundScore: number;
  totalScore: number;
  placement: number;
  prevPlacement: number;
};

type RoundSummaryProps = {
  players: PlayerProp[];
  round: number;
};

export const RoundSummary = (props: RoundSummaryProps) => {
  const parent = React.useRef(null);
  React.useEffect(() => {
    parent.current &&
      autoAnimate(parent.current, {
        duration: 250,
      });
  }, [parent]);

  const [sortedPlayers, setSortedPlayers] = React.useState<Player[]>([]);

  React.useEffect(() => {
    const players = props.players.map((p) => ({
      displayName: p.displayName,
      roundScore: p.roundScore,
      totalScore: p.totalScore,
      placement: 0,
      prevPlacement: 0,
    }));

    players.sort((a, b) => {
      return a.roundScore - b.roundScore;
    });

    players.forEach((p, i) => {
      p.placement = i + 1;
    });

    players.sort((a, b) => {
      const prevA = a.totalScore - a.roundScore;
      const prevB = b.totalScore - b.roundScore;
      return prevA - prevB;
    });

    players.forEach((p, i) => {
      p.prevPlacement = i + 1;
    });

    setSortedPlayers(players);

    setTimeout(() => {
      const newPlayers = [...players];
      newPlayers.sort((a, b) => a.placement - b.placement);
      setSortedPlayers(newPlayers);
      console.log("updated", players);
    }, 1000);

    console.log("init", players);
  }, [props.players]);

  const getChevron = (p: Player) => {
    if (p.placement === p.prevPlacement) {
      return "";
    }

    if (p.placement < p.prevPlacement) {
      return <div className="text-sm text-emerald-400">▲</div>;
    }

    return <div className="text-sm text-red-400">▼</div>;
  };

  return (
    <Modal width="small">
      <div className="divide-solid divide-y divide-gray-300 dark:divide-gray-600">
        <div className="font-semibold text-2xl text-center p-2">{`Round ${props.round} results`}</div>

        <div className="flex flex-col space-y-3 p-4 items-center" ref={parent}>
          {sortedPlayers.map((p, i) => {
            const icon = "Icons/characters/" + (i % 5) + ".png";
            return (
              <div
                className="flex flex-row items-center space-x-4"
                key={p.displayName}
              >
                <div>
                  <div className="font-bold text-xl leading-none">
                    {p.placement}
                  </div>
                  {getChevron(p)}
                </div>
                <div className="rounded-full grid grid-cols-4 items-center justify-between bg-slate-50 w-64 shadow-sm p-1 dark:bg-gray-700">
                  <div className="shadow-sm w-12 h-12 rounded-full">
                    <div className="overflow-hidden w-12 h-12 rounded-full bg-white dark:bg-gray-600">
                      <img
                        src={icon}
                        className="rounded-full w-10 h-12 mx-auto translate-y-2 -translate-x-1"
                        alt="avatar"
                      />
                    </div>
                  </div>

                  <div className="text-left">{p.displayName}</div>

                  <div className="text-center">
                    <div className="text-xs leading-none">Round</div>
                    <div className="font-bold">{p.roundScore}</div>
                  </div>

                  <div className="text-center">
                    <div className="text-xs leading-none">Total</div>
                    <div className="font-bold">{p.totalScore}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end p-2">
          <Button
            onClick={() => {
              console.log("clicked");
            }}
            text="Next round"
            type="primary"
          />
        </div>
      </div>
    </Modal>
  );
};
