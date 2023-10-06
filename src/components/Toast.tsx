import React from "react";

type ToastType = "error" | "info";

export type ToastProps = {
  message: string;
  type: ToastType;
  id: string;
};

const getColorClasses = (type: ToastType) => {
  switch (type) {
    case "error":
      return "bg-rose-400 text-white stroke-white dark:bg-gray-800 dark:text-rose-400 dark:stroke-rose-400";
    case "info":
      return "bg-gray-50 text-gray-800 dark:text-white stroke-gray-800 dark:stroke-white dark:bg-gray-800 dark:text-gray-200 dark:stroke-gray-200";
    default:
      return "black";
  }
};

const getIcon = (type: ToastType) => {
  switch (type) {
    case "error":
      return (
        <svg
          width="16px"
          height="16px"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={getColorClasses(type)}
        >
          <path
            d="M20.043 21H3.957c-1.538 0-2.5-1.664-1.734-2.997l8.043-13.988c.77-1.337 2.699-1.337 3.468 0l8.043 13.988C22.543 19.336 21.58 21 20.043 21zM12 9v4"
            className={getColorClasses(type)}
            strokeWidth="1.5"
            strokeLinecap="round"
          ></path>
          <path
            d="M12 17.01l.01-.011"
            className={getColorClasses(type)}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </svg>
      );
    case "info":
      return (
        <svg
          width="16px"
          height="16px"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={getColorClasses(type)}
        >
          <path
            d="M12 11.5v5M12 7.51l.01-.011M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"
            className={getColorClasses(type)}
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
      className={`flex flex-row items-center h-min p-2 px-3 rounded-md shadow-md text-black dark:text-gray-400 divide-gray-700 space-x border border-gray-300 dark:border-gray-700 w-min pointer-events-auto ${getColorClasses(
        props.type
      )}`}
      role="alert"
      key={props.id}
    >
      {getIcon(props.type)}

      <div className={`${getColorClasses(props.type)} pl-2 text-md min-w-max`}>
        {props.message}
      </div>
    </div>
  );
};
