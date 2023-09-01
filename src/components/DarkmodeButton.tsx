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
          console.log("set light");
          localStorage.theme = "light";
        } else {
          console.log("set dark");
          localStorage.theme = "dark";
        }
      }}
      type="secondary"
      text={"👁"}
    />
  );
};
