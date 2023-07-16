type ModalProps = {
  width?: "small" | "medium";
  children: React.ReactNode;
};

export const Modal = (props: ModalProps) => {
  const width = props.width ?? "medium";
  const widthClass = width === "medium" ? "w-80" : "w-64";

  return (
    <div className="grid place-content-center h-screen text-gray-800 dark:text-white">
      <div className={`${widthClass}`}>
        <div className="rounded-md drop-shadow-xl border w-80 bg-white border-gray-200 dark:border-gray-700 dark:bg-gray-800">
          {props.children}
        </div>
      </div>
    </div>
  );
};
