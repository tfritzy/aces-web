export const Cardback = () => {
  const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  const img = isDark ? (
    <img src="Icons/Cardbacks/red2.svg" alt="cardback" />
  ) : (
    <img src="Icons/Cardbacks/red1.svg" alt="cardback" />
  );

  return <div className="pointer-events-none"> {img}</div>;
};
