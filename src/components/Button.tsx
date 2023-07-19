import { CSSProperties } from "react";
import ScaleLoader from "react-spinners/ScaleLoader";

type ButtonProps = {
  onClick: () => void;
  text: string;
  type: "primary" | "secondary";
  pending?: boolean;
};

export const Button = (props: ButtonProps) => {
  const typeClasses =
    props.type === "primary"
      ? "bg-emerald-500 border-emerald-600 text-white hover:border-emerald-200 "
      : "bg-white border-gray-200 text-gray-800 hover:border-black";

  return (
    <div className="h-min">
      <button
        onClick={props.onClick}
        className={`flex items-center flex-row text-sm rounded-md drop-shadow border font-semibold w-fit ${typeClasses} space-x-1 disabled:opacity-50 px-2 py-1`}
        disabled={props.pending}
      >
        {props.pending && (
          <svg width="15" height="15">
            <circle
              cx="7.5"
              cy="7.5"
              r="6"
              stroke="white"
              strokeWidth="1"
              fill="none"
              strokeDasharray="30, 200"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                repeatCount="indefinite"
                dur=".75s"
                values="0 7.5 7.5;360 7.5 7.5"
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
