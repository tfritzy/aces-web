import { Spinner } from "./Spinner";

type LoadingStateProps = {
  text: string;
};

export const LoadingState = (props: LoadingStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center px-8 py-6 space-y-4">
      <Spinner />
      <div className="text-center text-gray-700 dark:text-gray-100">
        {props.text}
      </div>
    </div>
  );
};
