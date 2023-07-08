import React from "react";

type Icon = "error";

type ToastProps = {
  message: string;
  icon: Icon;
};

const getIcon = (icon: Icon) => {
  switch (icon) {
    case "error":
      return (
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
      );
    default:
      return "text-blue-600 dark:text-blue-500";
  }
};

export const Toast = (props: ToastProps) => (
  <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
    <div
      id="toast-simple"
      className="flex items-center w-full max-w-xs p-4 space-x-4 text-gray-500 bg-white divide-x divide-gray-200 rounded-lg shadow dark:text-gray-400 dark:divide-gray-700 space-x dark:bg-gray-800"
      role="alert"
    >
      <svg
        className="w-5 h-5 text-blue-600 dark:text-blue-500 rotate-45"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 18 20"
      >
        {getIcon(props.icon)}
      </svg>
      <div className="pl-4 text-sm font-normal">{props.message}</div>
    </div>
  </div>
);
