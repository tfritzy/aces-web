export enum EventType {
  Invalid,
  JoinGame,
  StartGame,
  TurnStart,
  RoundStart,
  Discard,
  DrawFromDeck,
  DrawFromPile,
}

export type JoinGameEvent = {
  type: EventType.JoinGame;
  name: string;
};

export type StartGameEvent = {
  type: EventType.StartGame;
};

export type TurnStartEvent = {
  type: EventType.TurnStart;
  turnIndex: number;
};

export type RoundStartEvent = {
  type: EventType.RoundStart;
  round: number;
};

export type DiscardEvent = {
  type: EventType.Discard;
  card: number;
  player: string;
};

export type DrawFromDeckEvent = {
  type: EventType.DrawFromDeck;
};

export type DrawFromPileEvent = {
  type: EventType.DrawFromPile;
  player: string;
};

export type Message =
  | JoinGameEvent
  | StartGameEvent
  | TurnStartEvent
  | RoundStartEvent
  | DiscardEvent
  | DrawFromDeckEvent
  | DrawFromPileEvent;
