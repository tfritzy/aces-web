export const getDefaultAvatar = (playerId: string) => {
  const hash = playerId
    .split("")
    .map((c) => c.charCodeAt(0))
    .reduce((a, b) => a + b, 0);

  return "Icons/characters/" + (hash % 5) + ".png";
};
