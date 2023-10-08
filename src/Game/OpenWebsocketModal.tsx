import { API_URL } from "Constants";
import { Button } from "components/Button";
import { LoadingState } from "components/LoadingState";
import { Modal } from "components/Modal";
import { Spinner } from "components/Spinner";
import { Warning } from "components/Warning";
import React from "react";

const openWebsocket = async (
  playerToken: string,
  gameId: string,
  onMessage: (message: MessageEvent<any>) => void
) => {
  let res = await fetch(`${API_URL}/api/negotiate`, {
    headers: {
      "user-id": playerToken,
      "game-id": gameId,
    },
  });

  if (!res.ok) {
    return null;
  }

  let url = await res.json();
  let ws = new WebSocket(url.url);
  ws.onmessage = (message) => {
    onMessage(message);
  };

  return ws;
};

type OpenWebsocketModalProps = {
  playerToken: string;
  gameId: string;
  onMessage: (message: MessageEvent<any>) => void;
  websocket: WebSocket | null | undefined;
  onSuccess: (ws: WebSocket) => void;
};

export const OpenWebsocketModal = (props: OpenWebsocketModalProps) => {
  const [errored, setErrored] = React.useState(false);
  const [pending, setPending] = React.useState(false);

  const connect = () => {
    if (pending) {
      return;
    }

    setPending(true);
    setErrored(false);
    openWebsocket(props.playerToken, props.gameId, props.onMessage).then(
      (ws) => {
        setPending(false);
        if (ws) {
          props.onSuccess(ws);
        } else {
          setErrored(true);
        }
      }
    );
  };

  React.useEffect(() => {
    if (!props.playerToken) {
      return;
    }

    // Only initially automatically connect. Otherwise require user to click.
    if (!props.websocket) {
      connect();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.playerToken]);

  if (props.websocket?.readyState === WebSocket.OPEN) {
    return null;
  }

  let content = null;
  if (errored) {
    content = (
      <div className="flex flex-col items-center space-y-3">
        <Warning />
        <div className="text-center">Failed to connnect</div>
        <Button
          onClick={() => {
            connect();
          }}
          text="Retry"
          type="primary"
        />
      </div>
    );
  } else if (props.websocket?.readyState === WebSocket.CONNECTING || pending) {
    content = <LoadingState text="Establishing connection..." />;
  } else if (props.websocket?.readyState === WebSocket.CLOSING) {
    content = (
      <div className="flex flex-col items-center space-y-3">
        <Spinner />
        <div className="text-center">Closing connection...</div>
      </div>
    );
  } else if (props.websocket?.readyState === WebSocket.CLOSED) {
    content = (
      <div className="flex flex-col items-center space-y-3">
        <Warning />
        <div className="text-center">Lost connection to server</div>
        <Button
          onClick={() => {
            connect();
          }}
          text="Reconnect"
          type="primary"
        />
      </div>
    );
  }

  return (
    <Modal shown>
      <div className="px-10 py-6 flex flex-col items-center space-y-2">
        {content}
      </div>
    </Modal>
  );
};
