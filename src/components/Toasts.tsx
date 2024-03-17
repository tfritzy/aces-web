import React from "react";

import { Toast, ToastProps } from "components/Toast";
import { useAutoAnimate } from "@formkit/auto-animate/react";

type TimedToastProps = ToastProps & {
  addedAtMs: number;
};

export const useToasts = () => {
  const [toasts, setToasts] = React.useState<TimedToastProps[]>([]);

  const addToast = (props: ToastProps) => {
    setToasts([{ ...props, addedAtMs: Date.now() }, ...toasts]);
  };

  React.useEffect(() => {
    const timer = setTimeout(() => {
      const now = Date.now();
      setToasts(
        toasts.filter((toast) => {
          return now - toast.addedAtMs < 5000;
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
    <div className="fixed left-0 top-0 w-screen full-height min-w-screen pointer-events-none pt-2">
      <div
        className="flex flex-col min-w-screen items-center space-y-2"
        ref={animationParent}
      >
        {props.toasts.map((item) => (
          <Toast key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
};
