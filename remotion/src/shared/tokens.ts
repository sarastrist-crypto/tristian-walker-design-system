// Mirrors the brand tokens from /colors_and_type.css. Kept as TS so Remotion
// compositions don't need a CSS pipeline. Update both files together.

export const tokens = {
  bg: {
    base: "#F8F5EF",
    parchment: "#FDFCF8",
    warm: "#E6DFD6",
    dark: "#312D29",
    ink: "#1A1A1A",
  },
  accent: {
    primary: "#BC744E",
    hover: "#A05E3D",
    tan: "#C4A484",
  },
  text: {
    main: "#2D2925",
    muted: "#5C554D",
    light: "#F8F5EF",
  },
  font: {
    heading: "Merriweather",
    body: "Lato",
    display: "Playfair Display",
    ui: "Inter",
  },
} as const;

export type AspectRatio = "16:9" | "9:16" | "1:1";

export const ASPECT_DIMENSIONS: Record<AspectRatio, { width: number; height: number }> = {
  "16:9": { width: 1920, height: 1080 },
  "9:16": { width: 1080, height: 1920 },
  "1:1": { width: 1080, height: 1080 },
};
