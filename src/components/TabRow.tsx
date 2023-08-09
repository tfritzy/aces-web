type TabRowProps = {
  tabs: {
    label: string;
    onClick: () => void;
    isSelected?: boolean;
  }[];
};

export const TabRow = (prosp: TabRowProps) => {
  return (
    <div className="flex flex-row justify-center rounded-md bg-gray-100 dark:bg-gray-700 p-1 space-x-1 border dark:border-gray-500">
      {prosp.tabs.map((tab) => (
        <button
          className={`px-3 py-1 rounded ${
            tab.isSelected
              ? "text-white bg-blue-500 border border-blue-400"
              : "text-gray-600 dark:text-gray-400"
          }`}
          onClick={tab.onClick}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};
