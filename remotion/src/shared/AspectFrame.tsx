import type { ReactNode } from "react";
import { AbsoluteFill } from "remotion";
import { tokens } from "./tokens";

interface AspectFrameProps {
  children: ReactNode;
  vignette?: boolean;
}

export function AspectFrame({ children, vignette = true }: AspectFrameProps) {
  return (
    <AbsoluteFill style={{ backgroundColor: tokens.bg.ink }}>
      {children}
      {vignette && (
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(0,0,0,0) 50%, rgba(0,0,0,0.55) 100%)",
            pointerEvents: "none",
          }}
        />
      )}
    </AbsoluteFill>
  );
}
