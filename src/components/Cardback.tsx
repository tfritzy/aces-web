export const Cardback = () => {
  const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  const img = isDark ? (
    <div className="rounded-md overflow-hidden">
      <img src="Icons/Cardbacks/red2.svg" alt="cardback" />
    </div>
  ) : (
    <img src="Icons/Cardbacks/red1.svg" alt="cardback" />
  );

  return img;
};
