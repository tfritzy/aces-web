type ModalProps = {
  width?: "w-96" | "w-80" | "w-64" | "min-w-max";
  children: React.ReactNode;
};

export const Modal = (props: ModalProps) => {
  return (
    <div className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 z-40">
      <div className="text-gray-800 dark:text-white">
        <div className={props.width}>
          <div className="rounded-md drop-shadow-xl border bg-white border-gray-200 dark:border-gray-700 dark:bg-gray-800">
            {props.children}
          </div>
        </div>
      </div>
    </div>
  );
};
