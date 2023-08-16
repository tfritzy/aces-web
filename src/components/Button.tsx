import { Spinner } from "./Spinner";

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
      ? "bg-blue-500 border-blue-600 text-white hover:border-blue-800 dark:border-blue-400 dark:hover:border-blue-300"
      : "bg-white dark:bg-slate-700 border-gray-400 dark:border-slate-500 text-gray-800 dark:text-white hover:border-gray-500";

  const sizeClasses =
    !props.size || props.size === "small"
      ? "px-2 py-1 text-sm"
      : "py-2 text-md font-semibold w-full text-center";

  return (
    <div className="h-min">
      <button
        onClick={props.onClick}
        className={`flex justify-center items-center rounded-md drop-shadow border ${typeClasses} ${sizeClasses} space-x-1 disabled:opacity-50 px-2 py-1 hover:shadow-md transition-all`}
        disabled={props.pending}
      >
        {props.pending && <Spinner />}

        <div className="text-center">{props.text}</div>
      </button>
    </div>
  );
};
