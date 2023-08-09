type DropSlotProps = {
  drop?: (e: React.MouseEvent) => void;
};

export const DropSlot = (props: DropSlotProps) => {
  return (
    <div
      key={"spacer"}
      className={`border-dashed border w-32 h-44 p-2 mx-1 rounded-md border-gray-700 dark:border-white select-none`}
      onMouseUp={props.drop}
    />
  );
};
