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
  playerId: string;
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
  playerId: string;
};

export type DrawFromDeckEvent = {
  type: EventType.DrawFromDeck;
  i: number;
  playerId: string;
};

export type DrawFromPileEvent = {
  type: EventType.DrawFromPile;
  i: number;
  playerId: string;
};

export type PlayerWentOutEvent = {
  type: EventType.PlayerWentOut;
  i: number;
  playerId: string;
};

export type PlayerDoneForRoundEvent = {
  type: EventType.PlayerDoneForRound;
  i: number;
  playerId: string;
  roundScore: number;
  totalScore: number;
  groupedCards: Card[][];
  ungroupedCards: Card[];
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
