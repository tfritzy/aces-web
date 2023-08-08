type ModalProps = {
  shown: boolean;
  width?: "w-96" | "w-80" | "w-64" | "min-w-max";
  children: React.ReactNode;
  onClose?: () => void;
};

export const Modal = (props: ModalProps) => {
  return (
    <div
      className={`fixed w-full min-w-screen min-h-screen z-50 flex items-center justify-center transition-opacity bg-black ${
        props.shown
          ? "bg-opacity-20 opacity-100"
          : "bg-opacity-0 opacity-0 pointer-events-none"
      }`}
      onClick={props.onClose}
    >
      {props.shown && (
        <div className="text-gray-800 dark:text-white pointer-events-auto">
          <div className={props.width}>
            <div className="rounded-md drop-shadow-xl border bg-white border-gray-200 dark:border-gray-700 dark:bg-gray-800">
              {props.children}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
