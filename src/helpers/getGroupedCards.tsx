import { Card, CardValue } from "Game/Types";

enum StreakType {
  None,
  StraightAsc,
  StraightDesc,
  Same,
}

enum StepDir {
  Asc,
  Desc,
}

function GetStreakType(cardA: Card, cardB: Card, wild: CardValue): StreakType {
  if (IsWild(cardA, wild) || IsWild(cardB, wild)) {
    return StreakType.None;
  }

  if (cardA.value === cardB.value) {
    return StreakType.Same;
  }

  if (IsInDirection(cardA, cardB, StepDir.Asc)) {
    return StreakType.StraightAsc;
  }

  if (IsInDirection(cardA, cardB, StepDir.Desc)) {
    return StreakType.StraightDesc;
  }

  return StreakType.None;
}

function AreNStepApart(
  card1: Card,
  card2: Card,
  dir: StepDir,
  n: number
): boolean {
  if (card1.suit !== card2.suit) {
    return false;
  }

  const neededDelta = dir === StepDir.Asc ? n : -n;

  const startValue =
    card1.value === CardValue.ACE && dir === StepDir.Asc ? 0 : card1.value;

  const endValue =
    card2.value === CardValue.ACE && dir === StepDir.Desc ? 0 : card2.value;

  return endValue - startValue === neededDelta;
}

function IsInDirection(card1: Card, card2: Card, dir: StepDir): boolean {
  if (card1.suit !== card2.suit) {
    return false;
  }

  const startValue =
    card1.value === CardValue.ACE && dir === StepDir.Asc ? 0 : card1.value;

  const endValue =
    card2.value === CardValue.ACE && dir === StepDir.Desc ? 0 : card2.value;

  const neededVal = dir === StepDir.Asc ? 1 : -1;
  return Math.sign(endValue - startValue) === neededVal;
}

function ContinuesStreak(
  prevCard: Card,
  card: Card,
  streakType: StreakType,
  gap: number,
  wild: CardValue
): boolean {
  if (IsWild(card, wild) || IsWild(prevCard, wild)) {
    return true;
  }

  if (streakType === StreakType.Same) {
    return prevCard.value === card.value;
  }

  if (streakType === StreakType.StraightAsc) {
    return AreNStepApart(prevCard, card, StepDir.Asc, gap);
  }

  if (streakType === StreakType.StraightDesc) {
    return AreNStepApart(prevCard, card, StepDir.Desc, gap);
  }

  return false;
}

export function isWild(card: Card, round: number) {
  const wild = GetWildForRound(round);
  return card.value === wild || card.value === CardValue.JOKER;
}

function IsWild(card: Card, wild: CardValue): boolean {
  return card.value === wild || card.value === CardValue.JOKER;
}

function GetGroupSizeAtIndex(cards: Card[], wild: CardValue): number[] {
  const groupSizeAtIndex: number[] = new Array(cards.length);

  for (let i = 0; i < cards.length - 1; i++) {
    let size = 1;
    let streak = StreakType.None;
    let firstRealIndex = -1;

    while (i + size < cards.length) {
      const j = i + size;

      if (!IsWild(cards[j - 1], wild) && firstRealIndex === -1) {
        firstRealIndex = j - 1;
      }

      if (streak === StreakType.None && firstRealIndex !== -1) {
        streak = GetStreakType(cards[firstRealIndex], cards[j], wild);
      }

      if (
        ContinuesStreak(cards[j - 1], cards[j], streak, 1, wild) &&
        (firstRealIndex === -1 ||
          ContinuesStreak(
            cards[firstRealIndex],
            cards[j],
            streak,
            j - firstRealIndex,
            wild
          ))
      ) {
        size += 1;
      } else {
        break;
      }
    }

    groupSizeAtIndex[i] = size;
  }

  groupSizeAtIndex[cards.length - 1] = 1;

  return groupSizeAtIndex;
}

interface Group {
  Index: number;
  Size: number;
}

function GetBestGroups(
  groupsPerIndex: number[],
  index: number,
  groups: Group[],
  best: number[]
): Group[] {
  if (index >= groupsPerIndex.length) {
    return groups;
  }

  const currentGrouped = groups.reduce((acc, g) => acc + g.Size, 0);
  if (best[index] > currentGrouped) {
    return groups;
  }

  let mostGrouped = 0;
  let bestGroups: Group[] = [];
  for (let i = groupsPerIndex[index]; i > 0; i--) {
    const groupClone = [...groups];

    if (i > 2) {
      groupClone.push({ Index: index, Size: i });
    }

    const iGroups = GetBestGroups(groupsPerIndex, index + i, groupClone, best);
    const grouped = iGroups.reduce((acc, g) => acc + g.Size, 0);
    if (grouped > mostGrouped) {
      mostGrouped = grouped;
      bestGroups = iGroups;
    }
  }

  best[index] = mostGrouped;

  return bestGroups;
}

function GetWildForRound(round: number): CardValue {
  if (round < 12) {
    return round + 2;
  }

  return CardValue.INVALID;
}

export function getGroups(hand: Card[], round: number): boolean[] {
  const groupSizes = GetGroupSizeAtIndex(hand, GetWildForRound(round));
  const bestGroups = GetBestGroups(groupSizes, 0, [], new Array(hand.length));
  const grouped = new Array(hand.length).fill(false);

  for (const group of bestGroups) {
    for (let i = group.Index; i < group.Index + group.Size; i++) {
      grouped[i] = true;
    }
  }

  return grouped;
}