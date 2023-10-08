import { Spinner } from "./Spinner";

type ButtonProps = {
  onClick: () => void;
  text: JSX.Element | string;
  type: "primary" | "secondary";
  pending?: boolean;
  size?: "small" | "jumbo";
  disabled?: boolean;
};

export const Button = (props: ButtonProps) => {
  const typeClasses =
    props.type === "primary"
      ? "bg-rose-500 dark:bg-rose-700 border-rose-800 text-white hover:border-rose-800 dark:border-rose-500 dark:hover:border-rose-400 shadow-rose-500/50"
      : "bg-white dark:bg-slate-700 border-gray-400 dark:border-slate-500 text-gray-800 dark:text-white hover:border-gray-500";

  const sizeClasses =
    !props.size || props.size === "small"
      ? "px-2 py-1 text-sm"
      : "py-2 text-md w-full text-center";

  return (
    <div className="h-min">
      <button
        onClick={props.onClick}
        className={`flex font-semibold justify-center items-center rounded-md hover:drop-shadow border ${typeClasses} ${sizeClasses} space-x-1 disabled:opacity-50 px-2 py-1 shadow-sm transition-all`}
        disabled={props.pending || props.disabled}
      >
        {props.pending && <Spinner />}

        <div className="text-center">{props.text}</div>
      </button>
    </div>
  );
};
