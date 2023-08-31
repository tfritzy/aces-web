import { Spinner } from "./Spinner";

type LoadingStateProps = {
  text: string;
};

export const LoadingState = (props: LoadingStateProps) => {
  return (
    <>
      <Spinner />
      <div className="text-center text-gray-700 dark:text-gray-100">
        {props.text}
      </div>
    </>
  );
};
