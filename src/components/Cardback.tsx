export const Cardback = () => {
  return (
    <div className="pointer-events-none">
      <div className="p-2">
        <img
          className="dark:hidden"
          src="Icons/Cardbacks/red1.svg"
          alt="cardback"
        />
        <img
          className="hidden dark:block"
          src="Icons/Cardbacks/red2.svg"
          alt="cardback"
        />
      </div>
    </div>
  );
};
