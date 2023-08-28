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

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
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
