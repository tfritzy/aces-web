import { ToastProps } from "components/Toast";
import { generateId } from "helpers/generateId";

export const handleError = async (
  response: Response,
  addToast: (props: ToastProps) => void
) => {
  if (response.status.toString().startsWith("4")) {
    let body = await response.text();
    addToast({
      message: body,
      type: "error",
      id: generateId("toast", 12),
    });
  } else {
    addToast({
      message: "Something went wrong.",
      type: "error",
      id: generateId("toast", 12),
    });
  }
};
