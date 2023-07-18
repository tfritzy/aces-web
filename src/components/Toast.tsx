import React from "react";

type ToastType = "error" | "info";

export type ToastProps = {
  message: string;
  type: ToastType;
  id: string;
};

const getColor = (type: ToastType) => {
  switch (type) {
    case "error":
      return "#f56e6e";
    case "info":
      return "#5eead4";
    default:
      return "black";
  }
};

const getIcon = (type: ToastType) => {
  switch (type) {
    case "error":
      return (
        <svg
          width="20px"
          height="20px"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          color={getColor(type)}
        >
          <path
            d="M20.043 21H3.957c-1.538 0-2.5-1.664-1.734-2.997l8.043-13.988c.77-1.337 2.699-1.337 3.468 0l8.043 13.988C22.543 19.336 21.58 21 20.043 21zM12 9v4"
            stroke={getColor(type)}
            strokeWidth="1.5"
            strokeLinecap="round"
          ></path>
          <path
            d="M12 17.01l.01-.011"
            stroke={getColor(type)}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </svg>
      );
    case "info":
      return (
        <svg
          width="20px"
          height="20px"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          color={getColor(type)}
        >
          <path
            d="M12 11.5v5M12 7.51l.01-.011M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"
            stroke={getColor(type)}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </svg>
      );
    default:
      return "text-blue-600 dark:text-blue-500";
  }
};

export const Toast = (props: ToastProps) => {
  return (
    <div
      id="toast-simple"
      className="flex flex-row items-center h-min p-3 rounded-lg shadow text-gray-400 divide-gray-700 space-x bg-gray-800 my-2 border border-gray-700"
      role="alert"
      key={props.id}
    >
      {getIcon(props.type)}

      <div
        style={{ color: getColor(props.type) }}
        className="pl-4 text-sm font-normal"
      >
        {props.message}
      </div>
    </div>
  );
};
