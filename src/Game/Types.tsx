export type Card = {
  type: CardType;
  suit: Suit;
  value: CardValue;
  points: number;
  deck: number;
  createdTimeMs?: number;
};

export enum CardType {
  INVALID,

  TWO_OF_DIAMONDS,
  THREE_OF_DIAMONDS,
  FOUR_OF_DIAMONDS,
  FIVE_OF_DIAMONDS,
  SIX_OF_DIAMONDS,
  SEVEN_OF_DIAMONDS,
  EIGHT_OF_DIAMONDS,
  NINE_OF_DIAMONDS,
  TEN_OF_DIAMONDS,
  JACK_OF_DIAMONDS,
  QUEEN_OF_DIAMONDS,
  KING_OF_DIAMONDS,
  ACE_OF_DIAMONDS,

  TWO_OF_HEARTS,
  THREE_OF_HEARTS,
  FOUR_OF_HEARTS,
  FIVE_OF_HEARTS,
  SIX_OF_HEARTS,
  SEVEN_OF_HEARTS,
  EIGHT_OF_HEARTS,
  NINE_OF_HEARTS,
  TEN_OF_HEARTS,
  JACK_OF_HEARTS,
  QUEEN_OF_HEARTS,
  KING_OF_HEARTS,
  ACE_OF_HEARTS,

  TWO_OF_CLUBS,
  THREE_OF_CLUBS,
  FOUR_OF_CLUBS,
  FIVE_OF_CLUBS,
  SIX_OF_CLUBS,
  SEVEN_OF_CLUBS,
  EIGHT_OF_CLUBS,
  NINE_OF_CLUBS,
  TEN_OF_CLUBS,
  JACK_OF_CLUBS,
  QUEEN_OF_CLUBS,
  KING_OF_CLUBS,
  ACE_OF_CLUBS,

  TWO_OF_SPADES,
  THREE_OF_SPADES,
  FOUR_OF_SPADES,
  FIVE_OF_SPADES,
  SIX_OF_SPADES,
  SEVEN_OF_SPADES,
  EIGHT_OF_SPADES,
  NINE_OF_SPADES,
  TEN_OF_SPADES,
  JACK_OF_SPADES,
  QUEEN_OF_SPADES,
  KING_OF_SPADES,
  ACE_OF_SPADES,

  JOKER_A,
  JOKER_B,
}

export enum Suit {
  CLUBS,
  DIAMONDS,
  HEARTS,
  SPADES,
}

export enum CardValue {
  TWO,
  THREE,
  FOUR,
  FIVE,
  SIX,
  SEVEN,
  EIGHT,
  NINE,
  TEN,
  JACK,
  QUEEN,
  KING,
  ACE,
  JOKER,
}

const valueMap = {
  [CardValue.TWO]: 2,
  [CardValue.THREE]: 3,
  [CardValue.FOUR]: 4,
  [CardValue.FIVE]: 5,
  [CardValue.SIX]: 6,
  [CardValue.SEVEN]: 7,
  [CardValue.EIGHT]: 8,
  [CardValue.NINE]: 9,
  [CardValue.TEN]: 10,
  [CardValue.JACK]: 10,
  [CardValue.QUEEN]: 10,
  [CardValue.KING]: 10,
  [CardValue.ACE]: 20,
  [CardValue.JOKER]: 50,
};

const getCards = () => {
  const cards: Card[] = [];
  (Object.keys(CardValue) as Array<keyof typeof CardValue>).forEach((value) => {
    {
      (Object.keys(Suit) as Array<keyof typeof Suit>).forEach((suit) => {
        cards.push({
          type: CardType[`${value}_OF_${suit}` as keyof typeof CardType],
          suit: Suit[suit],
          value: CardValue[value],
          points: valueMap[CardValue[value]],
          deck: 0,
        });
      });
    }
  });
  return cards;
};

export const cards = getCards();

export const cardMap: Map<CardType, Card> = new Map(
  cards.map((card) => [card.type, card])
);

export const getCard = (card: CardType, deck: number): Card => {
  const cardObj = cardMap.get(card);
  return {
    ...cardObj,
    deck,
  } as Card;
};
