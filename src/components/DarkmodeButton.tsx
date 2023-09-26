import { Button } from "./Button";

export const DarkmodeButton = () => {
  return (
    <Button
      onClick={() => {
        if (
          localStorage.theme === "dark" ||
          (!("theme" in localStorage) &&
            window.matchMedia("(prefers-color-scheme: dark)").matches)
        ) {
          localStorage.theme = "light";
        } else {
          localStorage.theme = "dark";
        }
      }}
      type="secondary"
      text={"👁"}
    />
  );
};
