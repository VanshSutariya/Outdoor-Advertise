import { useEffect, useState } from "react";

const useFindWidth: () => number = () => {
  const [width, setWidth] = useState<number>(0);
  const handleResize = () => setWidth(window.innerWidth);
  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return width;
};

export default useFindWidth;
