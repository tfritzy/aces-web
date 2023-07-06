import React from "react";

type CopyBoxProps = {
  text: string;
};

export const CopyBox = (props: CopyBoxProps) => {
  const [copied, setCopied] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);

  const copy = () => {
    navigator.clipboard.writeText(props.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="relative">
      <div
        className="border border-gray-500 bg-gray-600 max-w-sm font-mono text-lg py-1 px-2 rounded-md text-white cursor-pointer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={copy}
      >
        <div className="flex flex-row items-center">
          <div className="grow">
            <span>{props.text}</span>
          </div>
          <span className="text-gray-500 w-5 h-5 hover:text-gray-400 duration-200">
            <img src="Icons/clipboard.png" alt="Copy" />
          </span>
        </div>
      </div>
      {hovered && (
        <div className="flex flex-row items-center space-x-1 absolute -top-9 right-0 bg-gray-800 rounded-md text-sm px-2 py-1">
          {copied ? (
            <img
              src="Icons/check.svg"
              alt="Check"
              style={{ width: 18, height: 20 }}
            />
          ) : (
            <img
              src="Icons/copy.svg"
              alt="Check"
              style={{ width: 20, height: 20 }}
            />
          )}

          <span>{copied ? "Copied" : "Click to copy"}</span>
        </div>
      )}
    </div>
  );
};
