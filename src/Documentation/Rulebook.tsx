import { PlayingCard } from "Game/PlayingCard";
import { CardType, parseCard } from "Game/Types";
import { Minicard } from "components/Minicard";

const SmolCard = (props: {
  type: CardType;
  grouped?: boolean;
  wild?: boolean;
  size?: "m" | "s";
}) => {
  const size =
    props.size === "s" ? "scale-[.5] w-[70px]" : "scale-[.8] w-[110px]";
  return (
    <div className={size}>
      <PlayingCard
        card={parseCard({ type: props.type, deck: 0 })}
        isGrouped={props.grouped ?? false}
        isWild={props.wild ?? false}
        heldIndex={-1}
        index={0}
        z={0}
      />
    </div>
  );
};

const IconCard = (props: { type: CardType }) => {
  return <Minicard card={parseCard({ type: props.type, deck: 0 })} />;
};

export const Rulebook = () => {
  return (
    <div className="text-gray-800 dark:text-white">
      <h1 className="text-3xl">Aces</h1>
      <br />
      <p>
        Aces is a multiplayer card game where you refine your hand into groups
        of cards as efficiently as possible.
      </p>
      <div className="w-[100px] mt-4">
        <a
          href="/lobby"
          className="flex font-semibold justify-center items-center hover:drop-shadow border py-1 rounded-full bg-rose-500 dark:bg-rose-700 border-rose-800 text-white hover:border-rose-800 dark:border-rose-500 dark:hover:border-rose-400 shadow-rose-500/50"
        >
          Play
        </a>
      </div>

      <br />
      <br />

      <h2 className="text-2xl">Rules</h2>
      <br />

      <h3 className="text-xl mb-2">Grouping</h3>
      <p>
        Cards form a group when they either have the same value, or are in an
        unbroken sequence of the same suit.
      </p>
      <div className="flex flex-row">
        <SmolCard type={CardType.THREE_OF_CLUBS} />
        <SmolCard type={CardType.THREE_OF_SPADES} />
        <SmolCard type={CardType.THREE_OF_HEARTS} />
        <div className="px-4" />

        <SmolCard type={CardType.NINE_OF_SPADES} />
        <SmolCard type={CardType.TEN_OF_SPADES} />
        <SmolCard type={CardType.JACK_OF_SPADES} />
        <SmolCard type={CardType.QUEEN_OF_SPADES} />
      </div>
      <br />

      <p>Groups must contain at least three cards.</p>
      <div className="flex flex-row">
        <SmolCard type={CardType.KING_OF_CLUBS} />
        <SmolCard type={CardType.KING_OF_SPADES} />
        <SmolCard type={CardType.KING_OF_HEARTS} />
      </div>

      <br />

      <p>You can have any number of groups in your hand.</p>
      <div className="flex flex-row flex-wrap">
        <SmolCard type={CardType.ACE_OF_SPADES} />
        <SmolCard type={CardType.TWO_OF_SPADES} />
        <SmolCard type={CardType.THREE_OF_SPADES} />
        <SmolCard type={CardType.FOUR_OF_SPADES} />

        <div className="px-4" />

        <SmolCard type={CardType.THREE_OF_CLUBS} />
        <SmolCard type={CardType.THREE_OF_SPADES} />
        <SmolCard type={CardType.JOKER_A} />

        <div className="px-4" />
      </div>
      <br />

      <h3 className="text-xl mb-2">Rounds</h3>

      <p>
        There are 12 rounds, and each round the number of cards you’re dealt
        increases by one. Round one starts with three cards, and round ten ends
        with 15.
      </p>
      <br />

      <div className="flex flex-col space-y-1">
        <div className="flex flex-row items-center space-x-1">
          <div>Round 3</div>
          <div className="px-2" />
          <IconCard type={CardType.ACE_OF_SPADES} />
          <IconCard type={CardType.ACE_OF_SPADES} />
          <IconCard type={CardType.ACE_OF_SPADES} />
        </div>
        <div className="flex flex-row items-center space-x-1">
          <div>Round 4</div>
          <div className="px-2" />
          <IconCard type={CardType.ACE_OF_SPADES} />
          <IconCard type={CardType.ACE_OF_SPADES} />
          <IconCard type={CardType.ACE_OF_SPADES} />
          <IconCard type={CardType.ACE_OF_SPADES} />
        </div>
        <div className="flex flex-row items-center space-x-1">
          <div>Round 5</div>
          <div className="px-2" />
          <IconCard type={CardType.ACE_OF_SPADES} />
          <IconCard type={CardType.ACE_OF_SPADES} />
          <IconCard type={CardType.ACE_OF_SPADES} />
          <IconCard type={CardType.ACE_OF_SPADES} />
          <IconCard type={CardType.ACE_OF_SPADES} />
        </div>
        <div className="flex flex-row items-center space-x-1">
          <div>Round 6</div>
          <div className="px-2" />
          <IconCard type={CardType.ACE_OF_SPADES} />
          <IconCard type={CardType.ACE_OF_SPADES} />
          <IconCard type={CardType.ACE_OF_SPADES} />
          <IconCard type={CardType.ACE_OF_SPADES} />
          <IconCard type={CardType.ACE_OF_SPADES} />
          <IconCard type={CardType.ACE_OF_SPADES} />
        </div>
        <div className="flex flex-row items-center space-x-1">
          <div>Round 7</div>
          <div className="px-2" />
          <div>ect...</div>
        </div>
      </div>

      <br />

      <p>
        The cards corresponding to each round is “Wild.” So for round 1 threes
        are wild, for round 2 fours are wild and so on. In the final round Aces
        are wild.
      </p>
      <br />
      <div className="flex flex-col space-y-1">
        <div className="flex flex-row items-center space-x-1">
          <div>Round 3</div>
          <div className="px-2" />
          <IconCard type={CardType.THREE_OF_CLUBS} />
          <IconCard type={CardType.THREE_OF_SPADES} />
          <IconCard type={CardType.THREE_OF_HEARTS} />
          <IconCard type={CardType.THREE_OF_DIAMONDS} />
        </div>
        <div className="flex flex-row items-center space-x-1">
          <div>Round 4</div>
          <div className="px-2" />
          <IconCard type={CardType.FOUR_OF_CLUBS} />
          <IconCard type={CardType.FOUR_OF_SPADES} />
          <IconCard type={CardType.FOUR_OF_HEARTS} />
          <IconCard type={CardType.FOUR_OF_DIAMONDS} />
        </div>
        <div className="flex flex-row items-center space-x-1">
          <div>Round 5</div>
          <div className="px-2" />
          <IconCard type={CardType.FIVE_OF_CLUBS} />
          <IconCard type={CardType.FIVE_OF_SPADES} />
          <IconCard type={CardType.FIVE_OF_HEARTS} />
          <IconCard type={CardType.FIVE_OF_DIAMONDS} />
        </div>
        <div className="flex flex-row items-center space-x-1">
          <div>Round 6</div>
          <div className="px-2" />
          <IconCard type={CardType.SIX_OF_CLUBS} />
          <IconCard type={CardType.SIX_OF_SPADES} />
          <IconCard type={CardType.SIX_OF_HEARTS} />
          <IconCard type={CardType.SIX_OF_DIAMONDS} />
        </div>
        <div className="flex flex-row items-center space-x-1">
          <div>Round 7</div>
          <div className="px-2" />
          <div>ect...</div>
        </div>
      </div>
      <br />

      <p>
        Wilds act as if they are whatever card is needed to continue the group.
        So if you have two threes and a joker, the joker acts as a three.
      </p>

      <div className="flex flex-row flex-wrap">
        <SmolCard type={CardType.THREE_OF_CLUBS} />
        <SmolCard type={CardType.THREE_OF_SPADES} />
        <SmolCard type={CardType.JOKER_A} wild />

        <div className="px-4" />

        <SmolCard type={CardType.KING_OF_HEARTS} wild />
        <SmolCard type={CardType.TWO_OF_SPADES} />
        <SmolCard type={CardType.THREE_OF_SPADES} />
        <SmolCard type={CardType.KING_OF_SPADES} wild />

        <div className="px-4" />
      </div>
      <br />

      <p>
        Once all your cards are in a group you can “Go out” at the end of your
        turn. This gives other players one last turn before the round ends.
      </p>

      <div>
        <div className="flex flex-row flex-wrap">
          <SmolCard type={CardType.SIX_OF_CLUBS} grouped />
          <SmolCard type={CardType.SIX_OF_SPADES} grouped />
          <SmolCard type={CardType.JOKER_A} wild={true} grouped />
          <div className="px-4" />
          <SmolCard type={CardType.NINE_OF_CLUBS} grouped />
          <SmolCard type={CardType.NINE_OF_SPADES} grouped />
          <SmolCard type={CardType.NINE_OF_HEARTS} grouped />
        </div>
      </div>
      <br />

      <h3 className="text-xl mb-2">Scoring</h3>

      <p>
        Once the round is over, you are scored based on the cards you didn’t
        manage to group. You want as low of a score as possible. In the this
        example, the player is given score by the Ace, Five, and Nine.
      </p>

      <div>
        <div className="flex flex-row flex-wrap">
          <SmolCard type={CardType.JACK_OF_CLUBS} grouped />
          <SmolCard type={CardType.QUEEN_OF_CLUBS} grouped />
          <SmolCard type={CardType.KING_OF_CLUBS} grouped />
          <SmolCard type={CardType.ACE_OF_CLUBS} grouped />
          <div className="px-4" />
          <SmolCard type={CardType.ACE_OF_HEARTS} />
          <SmolCard type={CardType.FIVE_OF_SPADES} />
          <SmolCard type={CardType.NINE_OF_HEARTS} />
        </div>
      </div>
      <br />

      <p>
        Cards give more score the higher their value. Twos through tens give
        their written value, face cards give ten, aces give 20, and jokers give
        50.
      </p>
      <br />
      <div className="flex flex-col space-y-1">
        <div className="flex flex-row items-center space-x-1">
          <div className="w-[82px]">3 points</div>
          <IconCard type={CardType.THREE_OF_CLUBS} />
          <IconCard type={CardType.THREE_OF_SPADES} />
          <IconCard type={CardType.THREE_OF_HEARTS} />
          <IconCard type={CardType.THREE_OF_DIAMONDS} />
        </div>
        <div className="flex flex-row items-center space-x-1">
          <div className="w-[82px]">4 points</div>
          <IconCard type={CardType.FOUR_OF_CLUBS} />
          <IconCard type={CardType.FOUR_OF_SPADES} />
          <IconCard type={CardType.FOUR_OF_HEARTS} />
          <IconCard type={CardType.FOUR_OF_DIAMONDS} />
        </div>
        <div className="flex flex-row items-center space-x-1">
          <div className="w-[82px]">5 points</div>
          <IconCard type={CardType.FIVE_OF_CLUBS} />
          <IconCard type={CardType.FIVE_OF_SPADES} />
          <IconCard type={CardType.FIVE_OF_HEARTS} />
          <IconCard type={CardType.FIVE_OF_DIAMONDS} />
        </div>
        <div className="flex flex-row items-center space-x-1">
          <div className="w-[82px]">6 points</div>
          <IconCard type={CardType.SIX_OF_CLUBS} />
          <IconCard type={CardType.SIX_OF_SPADES} />
          <IconCard type={CardType.SIX_OF_HEARTS} />
          <IconCard type={CardType.SIX_OF_DIAMONDS} />
        </div>
        <div className="flex flex-row items-center space-x-1">
          <div className="w-[82px]">7 points</div>
          <IconCard type={CardType.SEVEN_OF_CLUBS} />
          <IconCard type={CardType.SEVEN_OF_SPADES} />
          <IconCard type={CardType.SEVEN_OF_HEARTS} />
          <IconCard type={CardType.SEVEN_OF_DIAMONDS} />
        </div>
        <div className="flex flex-row items-center space-x-1">
          <div className="w-[82px]">8 points</div>
          <IconCard type={CardType.EIGHT_OF_CLUBS} />
          <IconCard type={CardType.EIGHT_OF_SPADES} />
          <IconCard type={CardType.EIGHT_OF_HEARTS} />
          <IconCard type={CardType.EIGHT_OF_DIAMONDS} />
        </div>
        <div className="flex flex-row items-center space-x-1">
          <div className="w-[82px]">9 points</div>
          <IconCard type={CardType.NINE_OF_CLUBS} />
          <IconCard type={CardType.NINE_OF_SPADES} />
          <IconCard type={CardType.NINE_OF_HEARTS} />
          <IconCard type={CardType.NINE_OF_DIAMONDS} />
        </div>
        <div className="flex flex-row items-center space-x-1">
          <div className="w-[82px]">10 points</div>
          <IconCard type={CardType.TEN_OF_CLUBS} />
          <IconCard type={CardType.TEN_OF_SPADES} />
          <IconCard type={CardType.TEN_OF_HEARTS} />
          <IconCard type={CardType.TEN_OF_DIAMONDS} />
        </div>
        <div className="flex flex-row items-center space-x-1">
          <div className="w-[82px]">10 points</div>
          <IconCard type={CardType.JACK_OF_CLUBS} />
          <IconCard type={CardType.JACK_OF_SPADES} />
          <IconCard type={CardType.JACK_OF_HEARTS} />
          <IconCard type={CardType.JACK_OF_DIAMONDS} />
        </div>
        <div className="flex flex-row items-center space-x-1">
          <div className="w-[82px]">10 points</div>
          <IconCard type={CardType.JACK_OF_CLUBS} />
          <IconCard type={CardType.JACK_OF_SPADES} />
          <IconCard type={CardType.JACK_OF_HEARTS} />
          <IconCard type={CardType.JACK_OF_DIAMONDS} />
        </div>
        <div className="flex flex-row items-center space-x-1">
          <div className="w-[82px]">10 points</div>
          <IconCard type={CardType.QUEEN_OF_CLUBS} />
          <IconCard type={CardType.QUEEN_OF_SPADES} />
          <IconCard type={CardType.QUEEN_OF_HEARTS} />
          <IconCard type={CardType.QUEEN_OF_DIAMONDS} />
        </div>
        <div className="flex flex-row items-center space-x-1">
          <div className="w-[82px]">10 points</div>
          <IconCard type={CardType.KING_OF_CLUBS} />
          <IconCard type={CardType.KING_OF_SPADES} />
          <IconCard type={CardType.KING_OF_HEARTS} />
          <IconCard type={CardType.KING_OF_DIAMONDS} />
        </div>
        <div className="flex flex-row items-center space-x-1">
          <div className="w-[82px]">20 points</div>
          <IconCard type={CardType.ACE_OF_CLUBS} />
          <IconCard type={CardType.ACE_OF_SPADES} />
          <IconCard type={CardType.ACE_OF_HEARTS} />
          <IconCard type={CardType.ACE_OF_DIAMONDS} />
        </div>
        <div className="flex flex-row items-center space-x-1">
          <div className="w-[82px]">50 points</div>
          <IconCard type={CardType.JOKER_A} />
          <IconCard type={CardType.JOKER_B} />
        </div>
      </div>
      <br />

      <p>
        At the end of the game, the score of each player in each round is
        totaled, and the player with the lowest wins.
      </p>
      <br />

      <div className="flex flex-row justify-center">
        <div className="w-[200px] mt-4">
          <a
            href="/lobby"
            className="flex font-semibold justify-center items-center hover:drop-shadow border py-2 rounded-full bg-rose-500 dark:bg-rose-700 border-rose-800 text-white hover:border-rose-800 dark:border-rose-500 dark:hover:border-rose-400 shadow-rose-500/50"
          >
            Play
          </a>
        </div>
      </div>
    </div>
  );
};
