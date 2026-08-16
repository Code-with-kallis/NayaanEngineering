// src/components/ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation();
  const navType = useNavigationType();

  useEffect(() => {
    // Naye page link par click hone par hi top par jaye (PUSH navigation)
    // Jab user Back / Return kare (POP navigation), toh scroll position wahi rahe
    if (navType !== "POP") {
      window.scrollTo(0, 0);
    }
  }, [pathname, navType]);

  return null;
}

export default ScrollToTop;