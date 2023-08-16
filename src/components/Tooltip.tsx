type TooltipProps = {
  text: string;
  trigger: React.ReactNode;
};

export const Tooltip = (props: TooltipProps) => {
  return (
    <>
      <div data-tooltip-target="tooltip-default">{props.trigger}</div>

      <div
        id="tooltip-default"
        role="tooltip"
        className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
      >
        {props.text}
        <div className="tooltip-arrow" data-popper-arrow></div>
      </div>
    </>
  );
};
