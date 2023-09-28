import React from "react";

import { API_URL } from "Constants";
import { CopyBox } from "components/CopyBox";
import { Modal } from "components/Modal";
import { Button } from "components/Button";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetAll } from "store/gameSlice";
import { getDefaultAvatar } from "helpers/getDefaultAvatar";
import { Player } from "store/playerSlice";

type LobbyProps = {
  gameId: string;
  players: Player[];
  token: string;
  onError: (error: string) => void;
  shown: boolean;
};

export const Lobby = (props: LobbyProps) => {
  const [startGamePending, setStartGamePending] = React.useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleExitLobby = () => {
    dispatch(resetAll());
    navigate("/");
  };

  const handleStartGame = () => {
    setStartGamePending(true);
    fetch(`${API_URL}/api/start_game`, {
      method: "POST",
      headers: {
        token: props.token,
        "game-id": props.gameId,
      },
    }).then(async (res) => {
      if (!res.ok) {
        setStartGamePending(false);
        const body = await res.text();
        props.onError(body);
      }
    });
  };

  const currentdomain = window.location.hostname;

  return (
    <Modal shown={props.shown} width="w-72">
      <div className="text-gray-700 dark:text-white divide-y divide-gray-200 dark:divide-gray-600">
        <div className="p-3 text-lg font-semibold">Lobby</div>

        <div className="flex flex-col space-y-4 p-3 pb-5">
          <div>
            <div className="mb-2">Invite by link</div>
            <CopyBox text={`${currentdomain}/${props.gameId}/join`} />
          </div>

          <div>
            <div className="mb-2">Invite by code</div>
            <CopyBox text={props.gameId} />
          </div>

          <div className="">
            <div className="flex flex-col space-y-2">
              <span>Players</span>
              {props.players.map((player, i) => {
                const icon = getDefaultAvatar(player.id);

                return (
                  <div className="flex flex-row items-center border border-gray-200 dark:border-gray-600 rounded px-2 w-full">
                    <div className="overflow-hidden w-12 h-12">
                      <img
                        src={icon}
                        className="w-10 h-12 mx-auto translate-y-2 -translate-x-1"
                        alt="avatar"
                      />
                    </div>
                    <div className="text-left truncate">
                      {player.displayName}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-row justify-end p-3 space-x-2">
          <Button onClick={handleExitLobby} text="Back" type="secondary" />

          <Button
            onClick={handleStartGame}
            pending={startGamePending}
            text="Start Game"
            type="primary"
          />
        </div>
      </div>
    </Modal>
  );
};
