import React, { useEffect, useState } from "react";
import "./loader.css";
import { useTheme } from "next-themes";

function Loader() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {mounted && (
        <div className="loader">
          <div
            className={`loader__bar ${mounted ? resolvedTheme : "light"}`}
          ></div>
          <div
            className={`loader__bar ${mounted ? resolvedTheme : "light"}`}
          ></div>
          <div
            className={`loader__bar ${mounted ? resolvedTheme : "light"}`}
          ></div>
          <div
            className={`loader__bar ${mounted ? resolvedTheme : "light"}`}
          ></div>
          <div
            className={`loader__bar ${mounted ? resolvedTheme : "light"}`}
          ></div>
          <div className="loader__ball"></div>
        </div>
      )}
    </>
  );
}

export default Loader;
