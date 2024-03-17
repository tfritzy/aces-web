import { red, black, borderedRed, borderedBlack } from "Constants";
import { getSuitIcon, getValueIcon } from "Game/PlayingCard";
import { Card, CardType, Suit } from "Game/Types";

type MinicardProps = {
  card: Card;
};

const getCardColor = (card: Card) => {
  switch (card.suit) {
    case Suit.CLUBS:
    case Suit.SPADES:
      return borderedBlack;
    case Suit.DIAMONDS:
    case Suit.HEARTS:
      return borderedRed;
    case Suit.SUITLESS:
      if (card.type === CardType.JOKER_A) return borderedRed;
      if (card.type === CardType.JOKER_B) return borderedBlack;
      return borderedBlack;
  }
};

export const Minicard = (props: MinicardProps) => {
  return (
    <div
      className={`w-6 h-8 relative border rounded ${getCardColor(props.card)} `}
    >
      <div className="text-sm absolute top-0 left-1">
        {getValueIcon(props.card).slice(0, 2)}
      </div>
      <div className="text-xs absolute bottom-0 right-[2px]">
        {getSuitIcon(props.card.suit)}
      </div>
    </div>
  );
};
