import React from "react";

type CopyBoxProps = {
  text: string;
};

const copyIcon = (
  <svg
    width="24px"
    height="24px"
    strokeWidth="1.5"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    color="#000000"
  >
    <path
      d="M19.4 20H9.6a.6.6 0 01-.6-.6V9.6a.6.6 0 01.6-.6h9.8a.6.6 0 01.6.6v9.8a.6.6 0 01-.6.6z"
      className="stroke-gray-800 dark:stroke-white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M15 9V4.6a.6.6 0 00-.6-.6H4.6a.6.6 0 00-.6.6v9.8a.6.6 0 00.6.6H9"
      className="stroke-gray-800 dark:stroke-white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
  </svg>
);

const checkIcon = (
  <svg
    width="24px"
    height="24px"
    strokeWidth="1.5"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    color="#10b981"
  >
    <path
      d="M5 13l4 4L19 7"
      stroke="#10b981"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
  </svg>
);

export const CopyBox = (props: CopyBoxProps) => {
  const [copied, setCopied] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);

  const copy = () => {
    navigator.clipboard.writeText(props.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="relative border py-1 px-2 rounded-md drop-shadow-sm bg-white text-gray-700 border-gray-300 dark:border-gray-500 dark:bg-gray-600 dark:text-white">
      <div
        className="max-w-sm font-mono text-lg cursor-pointer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={copy}
      >
        <div className="flex flex-row items-center">
          <div className="grow">
            <span>{props.text}</span>
          </div>
          <span className="text-gray-500 w-5 h-5 hover:text-gray-400 duration-200">
            {copyIcon}
          </span>
        </div>
      </div>
      {hovered && (
        <div className="flex flex-row items-center space-x-1 absolute -top-9 right-0 bg-gray-800 rounded-md text-sm px-2 py-1 text-white">
          {copied ? checkIcon : copyIcon}

          <span>{copied ? "Copied" : "Click to copy"}</span>
        </div>
      )}
    </div>
  );
};
