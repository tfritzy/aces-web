import React from "react";

import { Toast, ToastProps } from "components/Toast";
import { useAutoAnimate } from "@formkit/auto-animate/react";

type TimedToastProps = ToastProps & {
  addedAtMs: number;
};

export const useToasts = () => {
  const [toasts, setToasts] = React.useState<TimedToastProps[]>([]);

  const addToast = (props: ToastProps) => {
    setToasts([...toasts, { ...props, addedAtMs: Date.now() }]);
  };

  React.useEffect(() => {
    const timer = setTimeout(() => {
      const now = Date.now();
      setToasts(
        toasts.filter((toast) => {
          return now - toast.addedAtMs < 3000;
        })
      );
    }, 1000);

    return () => clearTimeout(timer);
  }, [toasts]);

  return { toasts, addToast };
};

type ToastsProps = {
  toasts: ToastProps[];
};

export const Toasts = (props: ToastsProps) => {
  const [animationParent] = useAutoAnimate();

  return (
    <div
      className="flex flex-col items-center absolute w-96 top-0 left-1/2 transform -translate-x-1/2"
      ref={animationParent}
    >
      {props.toasts.map((item) => (
        <Toast key={item.id} {...item} />
      ))}
    </div>
  );
};
