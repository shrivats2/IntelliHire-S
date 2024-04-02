"use client";

import { useState, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import { ArrowUpToLine } from "lucide-react";
import { Hint } from "@/components/hint";

export const ScrollToTop = () => {
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 400) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    });
  }, []);

  const goToTop = () => {
    window.scroll({
      top: 0,
      left: 0,
    });
  };

  return (
    <>
      {showTopBtn && (
        <Hint asChild label="Scroll To Top">
          <button
            onClick={goToTop}
            className="fixed bottom-4 right-4 opacity-90 shadow-md w-[35px] h-[35px] flex justify-center items-center rounded-sm bg-[#46fd46c4] text-white"
          >
            <ArrowUpToLine className="h-4 w-4" />
          </button>
        </Hint>
      )}
    </>
  );
};
