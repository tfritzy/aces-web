type ModalProps = {
  shown: boolean;
  width?: string;
  children: React.ReactNode;
  onClose?: () => void;
};

export const Modal = (props: ModalProps) => {
  return (
    <div
      className={`fixed bg-[#00000022] left-[50%] top-[50%] transform -translate-x-1/2 -translate-y-1/2 w-full h-full flex justify-center items-center z-50 transition-all duration-300 ease-in-out ${
        props.shown
          ? "bg-opacity-20 opacity-100"
          : "bg-opacity-0 opacity-0 pointer-events-none"
      }`}
      onClick={props.onClose}
    >
      {props.shown && (
        <div
          className="text-gray-800 opacity-100 dark:text-white pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className={props.width}>
            <div className="rounded-md shadow-lg shadow-[#00000033] border bg-white border-gray-300 dark:border-gray-700 dark:bg-gray-800">
              {props.children}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
