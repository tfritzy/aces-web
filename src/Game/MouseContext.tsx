import React, { createContext, useState } from "react";

export const MouseContext = createContext({ x: 0, y: 0 });

export const MouseProvider = ({ children }: { children: JSX.Element }) => {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  React.useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMouseX(event.clientX);
      setMouseY(event.clientY);
    };
    const handleTouchMove = (event: TouchEvent) => {
      setMouseX(event.touches[0].clientX);
      setMouseY(event.touches[0].clientY);
    };

    window.addEventListener("mousemove", handleMouseMove, true);
    window.addEventListener("touchmove", handleTouchMove, true);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  const mouse = React.useMemo(
    () => ({ x: mouseX, y: mouseY }),
    [mouseX, mouseY]
  );

  return (
    <MouseContext.Provider value={mouse}>{children}</MouseContext.Provider>
  );
};
