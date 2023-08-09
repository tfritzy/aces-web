import React from "react";

type AlertProps = {
  shown: boolean;
  message: string;
  close: () => void;
};

export const Alert = (props: AlertProps) => {
  const shownProps = props.shown
    ? "opacity-100 pointer-events-auto bottom-1/2"
    : "opacity-0 pointer-events-none bottom-[45%]";

  React.useEffect(() => {
    if (props.shown) {
      setTimeout(() => {
        props.close();
      }, 2000);
    }
  }, [props.shown]);

  return (
    <div
      className={`flex flex-row space-x-2 items-center justify-center fixed left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-md z-50 bg-emerald-500 text-white text-center px-4 p-2 text-lg font-semibold transition-all ${shownProps}`}
    >
      <svg
        width="24px"
        height="24px"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        color="white"
      >
        <path
          d="M12 6v6h6"
          stroke="white"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
        <path
          d="M21.888 10.5C21.164 5.689 17.013 2 12 2 6.477 2 2 6.477 2 12s4.477 10 10 10c4.1 0 7.625-2.468 9.168-6"
          stroke="white"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
        <path
          d="M17 16h4.4a.6.6 0 01.6.6V21"
          stroke="white"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
      </svg>
      <div>{props.message}</div>
    </div>
  );
};
