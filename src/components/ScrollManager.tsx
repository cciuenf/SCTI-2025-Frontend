"use client";

import { useEffect } from "react";

const SCROLL_THRESHOLD = 500; //

export default function ScrollManager() {
  useEffect(() => {
    document.body.classList.add("scrollbar-unvisible");
    const handleScroll = () => {
      if (window.scrollY < SCROLL_THRESHOLD) {
        document.body.classList.add("scrollbar-unvisible");
      } else {
        document.body.classList.remove("scrollbar-unvisible");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return null; // This component does not render anything
}
