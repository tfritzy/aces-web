import React from "react";

type CopyBoxProps = {
  text: string;
  copyText: string;
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
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M15 9V4.6a.6.6 0 00-.6-.6H4.6a.6.6 0 00-.6.6v9.8a.6.6 0 00.6.6H9"
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

function fallbackCopyTextToClipboard(text: string) {
  const textArea = document.createElement("textarea");
  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand("copy");
    const msg = successful ? "successful" : "unsuccessful";
    console.log("Fallback: Copying text command was " + msg);
  } catch (err) {
    console.error("Fallback: Oops, unable to copy", err);
  }

  document.body.removeChild(textArea);
}

export const CopyBox = (props: CopyBoxProps) => {
  const [copied, setCopied] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);

  const copy = () => {
    if (!navigator.clipboard) {
      fallbackCopyTextToClipboard(props.copyText);
    } else {
      navigator.clipboard.writeText(props.copyText).catch((err) => {
        fallbackCopyTextToClipboard(props.copyText);
      });
    }

    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="relative border py-1 px-2 rounded-md drop-shadow-sm bg-white border-gray-300 dark:border-gray-500 dark:bg-gray-600">
      <div
        className="max-w-sm text-md cursor-pointer text-gray-600 dark:text-white stroke-gray-600 dark:stroke-white"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={copy}
      >
        <div className="flex flex-row items-center">
          <div className="grow truncate">
            <span>{props.text}</span>
          </div>
          <span className="w-5 h-5 duration-200">{copyIcon}</span>
        </div>
      </div>
      {hovered && (
        <div className="flex flex-row items-center space-x-1 absolute -top-9 right-0 bg-gray-600 rounded-md text-sm px-2 py-1 text-white stroke-white">
          {copied ? checkIcon : copyIcon}

          <span>{copied ? "Copied" : "Click to copy"}</span>
        </div>
      )}
    </div>
  );
};
