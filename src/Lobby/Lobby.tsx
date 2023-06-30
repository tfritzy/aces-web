type LobbyProps = {
  gameId: string;
};

export const Lobby = (props: LobbyProps) => {
  return (
    <div className="grid place-content-center h-screen h-48 text-white">
      <div className="flex flex-col space-y-4">
        Lobby for game {props.gameId}
        <button>Start Game</button>
      </div>
    </div>
  );
};
