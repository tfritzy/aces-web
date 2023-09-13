export const Cardback = () => {
  const isDark = false;

  const img = isDark ? (
    <img src="Icons/Cardbacks/red2.svg" alt="cardback" />
  ) : (
    <div className="p-2">
      <img src="Icons/Cardbacks/red1.svg" alt="cardback" />
    </div>
  );

  return <div className="pointer-events-none"> {img}</div>;
};
