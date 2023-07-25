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
  i: number;
  displayName: string;
};

export type StartGameEvent = {
  type: EventType.StartGame;
  i: number;
};

export type AdvanceTurnEvent = {
  type: EventType.AdvanceTurn;
  i: number;
  turn: number;
};

export type AdvanceRoundEvent = {
  type: EventType.AdvanceRound;
  i: number;
  round: number;
};

export type DiscardEvent = {
  type: EventType.Discard;
  i: number;
  card: Card;
  player: string;
};

export type DrawFromDeckEvent = {
  type: EventType.DrawFromDeck;
  i: number;
  player: string;
};

export type DrawFromPileEvent = {
  type: EventType.DrawFromPile;
  i: number;
  player: string;
};

export type PlayerWentOutEvent = {
  type: EventType.PlayerWentOut;
  i: number;
  player: string;
};

export type PlayerDoneForRoundEvent = {
  type: EventType.PlayerDoneForRound;
  i: number;
  displayName: string;
  roundScore: number;
  totalScore: number;
};

export type Message =
  | JoinGameEvent
  | StartGameEvent
  | AdvanceTurnEvent
  | AdvanceRoundEvent
  | DiscardEvent
  | DrawFromDeckEvent
  | DrawFromPileEvent
  | PlayerWentOutEvent
  | PlayerDoneForRoundEvent;
