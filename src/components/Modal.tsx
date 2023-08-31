type ModalProps = {
  shown: boolean;
  width?: string;
  children: React.ReactNode;
  onClose?: () => void;
};

export const Modal = (props: ModalProps) => {
  return (
    <div
      className={`fixed w-full min-w-screen min-h-screen z-50 flex items-center justify-center transition-opacity ${
        props.shown
          ? "bg-opacity-20 opacity-100"
          : "bg-opacity-0 opacity-0 pointer-events-none"
      }`}
    >
      {props.shown && (
        <div className="text-gray-800 dark:text-white pointer-events-auto">
          <div className={props.width}>
            <div className="rounded-md shadow-lg shadow-[#00000044] border bg-white border-gray-300 dark:border-gray-700 dark:bg-gray-800">
              {props.children}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
