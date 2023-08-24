import { cardHeight } from "Constants";

export const DropSlot = () => {
  return (
    <div
      className="absolute px-[1px] bg-violet-300 h-[100%] -translate-x-[8px] rounded text-violet-500 flex flex-col justify-between"
      style={{ height: cardHeight }}
    >
      <div>↓</div>

      <div>↑</div>
    </div>
  );
};
