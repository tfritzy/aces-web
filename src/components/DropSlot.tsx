import { cardHeight } from "Constants";

export const DropSlot = () => {
  return (
    <div
      className="absolute px-[1px] bg-rose-300 h-[100%] -translate-x-[8px] rounded text-rose-500 flex flex-col justify-between z-30"
      style={{ height: cardHeight }}
    >
      <div>↓</div>

      <div>↑</div>
    </div>
  );
};
