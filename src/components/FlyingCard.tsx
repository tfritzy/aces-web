import { getSuitIcon } from "Game/PlayingCard";
import { Suit } from "Game/Types";

const themedBlack = `border-slate-200 text-slate-300 dark:border-slate-700 dark:text-slate-700`;
const themedRed = `border-rose-100 dark:border-rose-800 text-rose-200 dark:text-rose-800`;

const getCardColor = (suit: Suit) => {
  switch (suit) {
    case Suit.CLUBS:
    case Suit.SPADES:
      return themedBlack;
    case Suit.DIAMONDS:
    case Suit.HEARTS:
      return themedRed;
  }
};

type FlyingCardProps = {
  suit: Suit;
  reverse?: boolean;
};

export const FlyingCard = (props: FlyingCardProps) => {
  return (
    <div className="absolute">
      <div
        className={`w-52 h-72 relative border-4 rounded-lg text-5xl font-serif ${getCardColor(
          props.suit
        )} ${props.reverse ? "-rotate-[135deg]" : "rotate-45"}`}
      >
        <div className="asbolute pl-5 pt-3">A</div>
        <div className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 text-7xl">
          {getSuitIcon(props.suit)}
        </div>
        <div className="absolute bottom-4 right-5">A</div>
      </div>
    </div>
  );
};
