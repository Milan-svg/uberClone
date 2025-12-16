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

import L from "leaflet";

export const createSvgIcon = (
  svg,
  size = [40, 40],
  anchor = [size[0] / 2, size[1]] // bottom-center
) => {
  return L.divIcon({
    html: `
      <div style="
        width:${size[0]}px;
        height:${size[1]}px;
        transform: translate(-50%, -100%);
        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.35));
      ">
        ${svg}
      </div>
    `,
    className: "",
    iconSize: size,
    iconAnchor: anchor,
  });
};

// export const pickupIcon = createSvgIcon(
//   `
// <svg viewBox="0 0 24 24" width="40" height="40">
//   <path
//     fill="#22c55e"
//     stroke="white"
//     stroke-width="1.5"
//     d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5
//     c-1.38 0-2.5-1.12-2.5-2.5S10.62 4.5 12 4.5
//     s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"
//   />
// </svg>
// `,
//   [40, 40]
// );

export const pickupIcon = createSvgIcon(
  `
<svg viewBox="0 0 24 24" width="40" height="40">
  <!-- halo -->
  <circle cx="12" cy="10" r="9" fill="rgba(34,197,94,0.25)" />

  <!-- pin body -->
  <path
    d="M12 2C8.13 2 5 5.13 5 9
       c0 5.25 7 13 7 13
       s7-7.75 7-13
       c0-3.87-3.13-7-7-7z"
    fill="#22c55e"
    stroke="white"
    stroke-width="1.5"
  />

  <!-- inner dot -->
  <circle cx="12" cy="9" r="3.2" fill="white"/>
</svg>
`,
  [40, 40]
);

// export const destinationIcon = createSvgIcon(
//   `
// <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ef4444">
//   <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
// </svg>
// `,
//   [36, 36]
// );
export const destinationIcon = createSvgIcon(
  `
<svg viewBox="0 0 24 24" width="40" height="40">
  <!-- halo -->
  <circle cx="12" cy="10" r="9" fill="rgba(239,68,68,0.25)" />

  <!-- pin body -->
  <path
    d="M12 2C8.13 2 5 5.13 5 9
       c0 5.25 7 13 7 13
       s7-7.75 7-13
       c0-3.87-3.13-7-7-7z"
    fill="#ef4444"
    stroke="white"
    stroke-width="1.5"
  />

  <!-- inner square (different from pickup) -->
  <rect
    x="9"
    y="6"
    width="6"
    height="6"
    rx="1.2"
    fill="white"
  />
</svg>
`,
  [42, 42],
  [21, 21]
);

// export const captainIcon = createSvgIcon(
//   `
// <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3b82f6">
//   <circle cx="12" cy="12" r="10"/>
//   <path fill="white" d="M7 13h10l-1-3H8l-1 3zm2 2a1 1 0 11-2 0 1 1 0 012 0zm8 0a1 1 0 11-2 0 1 1 0 012 0z"/>
// </svg>
// `,
//   [34, 34]
// );

export const captainIcon = createSvgIcon(
  `
<svg viewBox="0 0 24 24" width="42" height="42">
  <!-- outer ring -->
  <circle
    cx="12"
    cy="12"
    r="10"
    fill="#3b82f6"
    stroke="white"
    stroke-width="1.5"
  />

  <!-- car body -->
  <path
    d="M7 13h10l-1.2-3.2H8.2L7 13z"
    fill="white"
  />

  <!-- wheels -->
  <circle cx="9" cy="15.5" r="1.1" fill="#111827"/>
  <circle cx="15" cy="15.5" r="1.1" fill="#111827"/>
</svg>
`,
  [42, 42],
  [21, 21] // center anchor, not bottom (vehicle moves)
);

// export const userIcon = createSvgIcon(
//   `
// <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#111">
//   <circle cx="12" cy="12" r="6"/>
// </svg>
// `,
//   [20, 20]
// );
export const userIcon = createSvgIcon(
  `
<svg viewBox="0 0 24 24" width="32" height="32">
  <!-- outer halo -->
  <circle cx="12" cy="12" r="10" fill="rgba(59,130,246,0.25)" />
  
  <!-- white ring -->
  <circle cx="12" cy="12" r="6" fill="white" />
  
  <!-- inner dot -->
  <circle cx="12" cy="12" r="4" fill="#2563eb" />
</svg>
`,
  [32, 32],
  [16, 16]
);
