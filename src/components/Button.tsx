type ButtonProps = {
  onClick: () => void;
  text: JSX.Element | string;
  type: "primary" | "secondary";
  pending?: boolean;
  size?: "small" | "jumbo";
};

export const Button = (props: ButtonProps) => {
  const typeClasses =
    props.type === "primary"
      ? "bg-blue-500 border-blue-600 text-white hover:border-blue-800 dark:hover:border-blue-300"
      : "bg-white dark:bg-slate-700 border-gray-400 dark:border-slate-500 text-gray-800 dark:text-white hover:border-black";

  const sizeClasses =
    !props.size || props.size === "small"
      ? "px-2 py-1 text-sm"
      : "py-2 text-md font-semibold w-full text-center";

  return (
    <div className="h-min">
      <button
        onClick={props.onClick}
        className={`flex justify-center rounded-md drop-shadow border ${typeClasses} ${sizeClasses} space-x-1 disabled:opacity-50 px-2 py-1 hover:shadow-md`}
        disabled={props.pending}
      >
        {props.pending && (
          <svg width="12" height="12">
            <circle
              cx="6"
              cy="6"
              r="5"
              strokeWidth="1"
              fill="none"
              strokeDasharray="20, 200"
              className="stroke-current"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                repeatCount="indefinite"
                dur=".75s"
                values="0 6 6;360 6 6"
                keyTimes="0;1"
              ></animateTransform>
            </circle>
          </svg>
        )}

        {!props.pending && <div className="text-center">{props.text}</div>}
      </button>
    </div>
  );
};
