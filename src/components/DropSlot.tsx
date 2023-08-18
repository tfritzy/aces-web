import { cardHeight } from "Constants";

export const DropSlot = () => {
  return (
    <div className="absolute" style={{ height: cardHeight }}>
      <div
        key={"spacer"}
        className={`absolute px-[1px] bg-slate-300 h-[100%] -translate-x-[8px] rounded text-slate-500`}
      >
        ↓
      </div>
    </div>
  );
};
