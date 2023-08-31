import {
  GameState,
  TurnPhase,
  addToPile,
  removeTopFromPile,
  setDeckSize,
  setGameId,
  setHand,
  setPile,
  setRound,
  setState,
  setTurn,
  setTurnPhase,
} from "store/gameSlice";
import { Lobby } from "./Lobby";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "store/store";
import { Toasts, useToasts } from "components/Toasts";
import { generateId } from "helpers/generateId";
import { Board } from "./Board";
import { EventType, Message } from "./Events";
import { ToastProps } from "components/Toast";
import { addPlayer, setPlayers, updatePlayer } from "store/playerSlice";
import { SchemaCard, parseCard } from "./Types";
import { API_URL } from "Constants";
import { useEffect } from "react";
import React from "react";
import { OpenWebsocketModal } from "./OpenWebsocketModal";
import { Alert } from "components/Alert";
import { useParams } from "react-router-dom";
import { Modal } from "components/Modal";
import { LoadingState } from "components/LoadingState";

const handleMessage = (
  message: Message,
  dispatch: AppDispatch,
  addToast: (props: ToastProps) => void,
  setAlertMessage: (message: string) => void,
  state: RootState,
  handleError: (response: Response) => void
) => {
  console.log("Handling message", message);
  switch (message.type) {
    case EventType.JoinGame:
      dispatch(
        addPlayer({
          id: message.playerId,
          displayName: message.displayName,
          scorePerRound: [],
          totalScore: 0,
          mostRecentGroupedCards: [],
          mostRecentUngroupedCards: [],
        })
      );
      break;
    case EventType.StartGame:
      console.log("Reconnect by start game");
      reconnect(state.self.token, dispatch, state.game.id, handleError);
      break;
    case EventType.DrawFromDeck:
      if (message.playerId !== state.self.id) {
        dispatch(setDeckSize(state.game.deckSize - 1));
      }
      dispatch(setTurnPhase(TurnPhase.Discarding));
      break;
    case EventType.DrawFromPile:
      if (message.playerId !== state.self.id) {
        dispatch(removeTopFromPile());
      }
      dispatch(setTurnPhase(TurnPhase.Discarding));
      break;
    case EventType.Discard:
      if (message.playerId !== state.self.id) {
        const card = parseCard(message.card);
        dispatch(addToPile(card));
      }
      dispatch(setTurnPhase(TurnPhase.Ending));
      break;
    case EventType.AdvanceRound:
      dispatch(setRound(message.round));
      dispatch(setState(GameState.TurnSummary));
      dispatch(setTurnPhase(TurnPhase.Drawing));
      break;
    case EventType.AdvanceTurn:
      dispatch(setTurn(message.turn));
      if (state.self.id === state.players.players[message.turn].id) {
        addToast({
          message: "It's your turn",
          type: "info",
          id: generateId("toast", 12),
        });
      }
      dispatch(setTurnPhase(TurnPhase.Drawing));
      break;
    case EventType.PlayerWentOut:
      if (message.playerId !== state.self.id) {
        const displayName =
          state.players.players.find((p) => p.id === message.playerId)
            ?.displayName || "A player";
        setAlertMessage(`${displayName} went out! You have one more turn.`);
      }
      break;
    case EventType.PlayerDoneForRound:
      dispatch(
        updatePlayer({
          playerId: message.playerId,
          roundScore: message.roundScore,
          totalScore: message.totalScore,
          groupedCards: message.groupedCards.map((g) => g.map(parseCard)),
          ungroupedCards: message.ungroupedCards.map(parseCard),
        })
      );
      break;
    default:
      console.error("unhandled message", message);
  }
};

const reconnect = async (
  token: string,
  dispatch: ReturnType<typeof useDispatch>,
  gameId: string,
  handleError: (r: Response) => void
) => {
  let gameState = await fetch(`${API_URL}/api/get_game_state`, {
    headers: {
      token: token,
      "game-id": gameId,
    },
  });

  if (!gameState.ok) {
    await handleError(gameState);
  } else {
    const state = await gameState.json();
    dispatch(setGameId(gameId));
    dispatch(setState(state.state));
    dispatch(setRound(state.round));
    dispatch(setTurn(state.turn));
    dispatch(setPile(state.pile.map((c: SchemaCard) => parseCard(c))));
    dispatch(setDeckSize(state.deckSize));
    dispatch(setState(state.state));
    dispatch(setHand(state.hand.map((c: SchemaCard) => parseCard(c))));
    dispatch(setTurnPhase(state.turnPhase));

    // TODO: Score
    dispatch(
      setPlayers(
        state.players.map((p: any) => ({
          id: p.id,
          displayName: p.displayName,
          scorePerRound: p.scorePerRound,
          totalScore: p.score,
          mostRecentGroupedCards: p.mostRecentGroupedCards.map((g: any) =>
            g.map(parseCard)
          ),
          mostRecentUngroupedCards: p.mostRecentUngroupedCards.map(parseCard),
        }))
      )
    );
  }
};

export const Game = () => {
  const rootState = useSelector((state: RootState) => state);
  const game = useSelector((state: RootState) => state.game);
  const self = useSelector((state: RootState) => state.self);
  const players = useSelector((state: RootState) => state.players.players);
  const gameId = useParams().gameId || "";

  const { toasts, addToast } = useToasts();
  const dispatch = useDispatch();
  const [alertMessage, setAlertMessage] = React.useState<string | undefined>(
    undefined
  );
  const [websocket, setWebsocket] = React.useState<
    WebSocket | null | undefined
  >(undefined);
  const [alertMessageShown, setAlertMessageShown] =
    React.useState<boolean>(false);

  const [recentMessage, setRecentMessage] =
    React.useState<MessageEvent<any> | null>(null);

  const setAlertMessageAndShow = React.useCallback((message: string) => {
    setAlertMessage(message);
    setAlertMessageShown(true);
  }, []);

  useEffect(() => {
    if (game.state === GameState.Invalid && self.token) {
      console.log("Reconnect 1");
      reconnect(self.token, dispatch, gameId, handleError);
    }

    // Going for a mount effect, but token starts null.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [self.token]);

  const handleError = React.useCallback(
    async (response: Response) => {
      if (response.status.toString().startsWith("4")) {
        let body = await response.text();
        addToast({
          message: body,
          type: "error",
          id: generateId("toast", 12),
        });
      } else {
        addToast({
          message: "Something went wrong.",
          type: "error",
          id: generateId("toast", 12),
        });
      }
    },
    [addToast]
  );

  useEffect(() => {
    if (recentMessage) {
      const message = JSON.parse(recentMessage.data);
      setRecentMessage(null);
      handleMessage(
        message,
        dispatch,
        addToast,
        setAlertMessageAndShow,
        rootState,
        handleError
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recentMessage]);

  let content;
  if (!websocket) {
    content = (
      <OpenWebsocketModal
        playerToken={self.token}
        gameId={game.id}
        onMessage={setRecentMessage}
        websocket={websocket}
        onSuccess={(ws) => setWebsocket(ws)}
      />
    );
  } else if (game.state === GameState.Invalid) {
    content = (
      <Modal shown>
        <LoadingState text={"Fetching game state..."} />
      </Modal>
    );
  } else if (game.state === GameState.Setup) {
    content = (
      <Lobby
        shown={game.state === GameState.Setup}
        key="lobby"
        token={self.token}
        gameId={gameId}
        players={players}
        onError={(message) => {
          addToast({
            message: message,
            id: generateId("toast", 5),
            type: "error",
          });
        }}
        onClose={() => {}}
      />
    );
  } else {
    content = <Board reconnect={reconnect} />;
  }

  return (
    <div className="flex flex-col items-center">
      <Toasts toasts={toasts} key="toasts" />
      {content}

      <Alert
        close={() => setAlertMessageShown(false)}
        shown={alertMessageShown}
        message={alertMessage || ""}
      />
    </div>
  );
};
