//panel animation function
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
export function panelAnimate(ref, isOpen) {
  useGSAP(
    function () {
      gsap.to(ref.current, {
        transform: isOpen ? "translateY(0%)" : "translateY(100%)",
        ease: "power2.out",
        duration: 0.5,
      });
    },
    [isOpen]
  );
}
