import React from "react";

type ModalProps = {
  shown: boolean;
  width?: string;
  children: React.ReactNode;
  onClose?: () => void;
};

export const Modal = (props: ModalProps) => {
  // Close on escape
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        props.onClose?.();
      }
    };

    if (props.shown) {
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [props.shown]);

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
            <div className="relative rounded-md shadow-lg shadow-[#00000033] border bg-white border-gray-300 dark:border-gray-700 dark:bg-gray-800">
              {props.children}
              {props.onClose && (
                <button
                  onClick={props.onClose}
                  className="absolute text-md right-3 top-2 text-gray-700 dark:text-gray-300 hover:text-red-300"
                >
                  🗙
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
