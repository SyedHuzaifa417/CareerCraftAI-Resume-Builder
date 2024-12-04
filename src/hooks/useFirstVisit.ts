// src/hooks/useFirstVisit.ts
import { useState, useEffect } from "react";

export const useFirstVisit = () => {
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  useEffect(() => {
    const hasVisitedBefore = localStorage.getItem("firstVisit");

    if (!hasVisitedBefore) {
      setIsFirstVisit(true);
      localStorage.setItem("firstVisit", "true");
    }
  }, []);

  return isFirstVisit;
};
