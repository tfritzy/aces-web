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
  PlayerDoneForRound,
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
  player: string;
};

export type DrawFromPileEvent = {
  type: EventType.DrawFromPile;
  player: string;
};

export type PlayerWentOutEvent = {
  type: EventType.PlayerWentOut;
  player: string;
};

export type PlayerDoneForRoundEvent = {
  type: EventType.PlayerDoneForRound;
  displayName: string;
  roundScore: number;
  totalScore: number;
};

export type Message =
  | JoinGameEvent
  | StartGameEvent
  | TurnStartEvent
  | RoundStartEvent
  | DiscardEvent
  | DrawFromDeckEvent
  | DrawFromPileEvent
  | PlayerWentOutEvent
  | PlayerDoneForRoundEvent;
