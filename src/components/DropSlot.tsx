import { cardHeight } from "Constants";

export const DropSlot = () => {
  return (
    <div className="absolute" style={{ height: cardHeight }}>
      <div
        key={"spacer"}
        className={`absolute px-[1px] bg-violet-300 h-[100%] -translate-x-[13px] rounded text-violet-500`}
      >
        ↓
      </div>
    </div>
  );
};
