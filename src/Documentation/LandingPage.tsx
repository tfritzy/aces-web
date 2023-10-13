import { Rulebook } from "./Rulebook";

export const LandingPage = () => {
  return (
    <div className="absolute z-10 w-screen h-full flex flex-col items-center">
      <div className="w-[950px] h-screen bg-white dark:bg-gray-900 border-l border-r border-gray-300 dark:border-gray-700 dark:shadow-black shadow-lg p-12 overflow-y-scroll">
        <Rulebook />
      </div>
    </div>
  );
};