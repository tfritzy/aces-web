import { Card } from "./Types";

export enum EventType {
  Invalid,
  JoinGame,
  StartGame,
  DrawFromDeck,
  DrawFromPile,
  Discard,
  AdvanceTurn,
  PlayerWentOut,
  AdvanceRound,
  GameEndEvent,
}

export type JoinGameEvent = {
  type: EventType.JoinGame;
  displayName: string;
};

export type StartGameEvent = {
  type: EventType.StartGame;
};

export type TurnStartEvent = {
  type: EventType.AdvanceTurn;
  turnIndex: number;
};

export type RoundStartEvent = {
  type: EventType.AdvanceRound;
  round: number;
};

export type DiscardEvent = {
  type: EventType.Discard;
  card: Card;
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
