import { useDispatch, useSelector } from "react-redux";
import { Button } from "./Button";
import { RootState } from "store/store";
import { setDarkMode } from "store/selfSlice";
import Cookies from "universal-cookie";

export const DarkmodeButton = () => {
  const dispatch = useDispatch();
  const darkMode = useSelector((state: RootState) => state.self.darkMode);

  const toggleDarkmode = () => {
    if (darkMode) {
      dispatch(setDarkMode(false));
      const cookies = new Cookies();
      cookies.set("darkMode", false, { path: "/" });
    } else {
      dispatch(setDarkMode(true));
      const cookies = new Cookies();
      cookies.set("darkMode", true, { path: "/" });
    }
  };

  return (
    <Button
      onClick={toggleDarkmode}
      type="secondary"
      text={
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          stroke-width="1.5"
          viewBox="0 0 24 24"
          className="w-5 h-5 stroke-gray-600 dark:stroke-white"
        >
          <path
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12ZM22 12h1M12 2V1M12 23v-1M20 20l-1-1M20 4l-1 1M4 20l1-1M4 4l1 1M1 12h1"
          ></path>
        </svg>
      }
    />
  );
};
