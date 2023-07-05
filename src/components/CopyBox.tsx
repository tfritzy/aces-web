import React from "react";

type CopyBoxProps = {
  text: string;
};

export const CopyBox = (props: CopyBoxProps) => {
  return (
    <div className="flex items-center cursor-pointer space-x-2 border border-gray-500 bg-gray-600 max-w-sm font-mono text-lg py-1 px-2 rounded-md text-white">
      <div className="flex gap-1">
        <span>{props.text}</span>
      </div>
      <span className="flex text-gray-500 w-5 h-5 hover:text-gray-400 duration-200">
        <img src="Icons/clipboard.png" alt="Copy" />
      </span>
    </div>
  );
};
