type TabRowProps = {
  tabs: {
    label: string;
    onClick: () => void;
    isSelected?: boolean;
  }[];
};

export const TabRow = (prosp: TabRowProps) => {
  return (
    <div className="flex flex-row justify-center rounded-md bg-gray-200 dark:bg-gray-700 p-1 space-x-1 border dark:border-gray-500 w-min">
      {prosp.tabs.map((tab) => (
        <button
          className={`px-3 py-1 rounded ${
            tab.isSelected
              ? "bg-white dark:bg-emerald-600"
              : "text-gray-700 dark:text-gray-400"
          }`}
          onClick={tab.onClick}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};
