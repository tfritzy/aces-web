type ButtonProps = {
  onClick: () => void;
  text: string;
  type: "primary" | "secondary";
};

export const Button = (props: ButtonProps) => {
  const typeClasses =
    props.type === "primary"
      ? "bg-emerald-500 border-emerald-600 text-white hover:border-emerald-200 "
      : "bg-white border-gray-200 text-gray-800 hover:border-black";

  return (
    <button
      onClick={props.onClick}
      className={`text-sm rounded-md drop-shadow border px-2 p-1 font-semibold  ${typeClasses}`}
    >
      {props.text}
    </button>
  );
};
