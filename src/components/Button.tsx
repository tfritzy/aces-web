type ButtonProps = {
  onClick: () => void;
  text: string;
  type: "primary" | "secondary";
  pending?: boolean;
};

export const Button = (props: ButtonProps) => {
  const typeClasses =
    props.type === "primary"
      ? "bg-emerald-400 border-emerald-500 text-white hover:border-emerald-200 "
      : "bg-white border-gray-200 text-gray-800 hover:border-black";

  return (
    <div className="h-min">
      <button
        onClick={props.onClick}
        className={`flex items-center flex-row text-sm rounded-md drop-shadow border font-semibold w-fit ${typeClasses} space-x-1 disabled:opacity-50 px-2 py-1`}
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

        <div>{props.text}</div>
      </button>
    </div>
  );
};
