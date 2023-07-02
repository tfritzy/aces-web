export enum MessageType {
  Invalid,
  JoinGame,
  StartGame,
  TurnStart,
  RoundStart,
  Discard,
  DrawFromDeck,
  DrawFromPile,
}

export type JoinGameMessage = {
  type: MessageType.JoinGame;
  displayName: string;
};

export type StartGameMessage = {
  type: MessageType.StartGame;
};

export type TurnStartMessage = {
  type: MessageType.TurnStart;
};

export type RoundStartMessage = {
  type: MessageType.RoundStart;
};

export type DiscardMessage = {
  type: MessageType.Discard;
  card: string;
};

export type DrawFromDeckMessage = {
  type: MessageType.DrawFromDeck;
};

export type DrawFromPileMessage = {
  type: MessageType.DrawFromPile;
};

export type Message =
  | JoinGameMessage
  | StartGameMessage
  | TurnStartMessage
  | RoundStartMessage
  | DiscardMessage
  | DrawFromDeckMessage
  | DrawFromPileMessage;
