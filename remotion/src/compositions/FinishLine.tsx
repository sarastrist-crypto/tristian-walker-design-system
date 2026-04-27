import { AbsoluteFill } from "remotion";
import { z } from "zod";
import { AspectFrame } from "../shared/AspectFrame";
import { tokens } from "../shared/tokens";

export const finishLineSchema = z.object({
  caption: z.string().default("Five kilometers, on purpose."),
});

export type FinishLineProps = z.infer<typeof finishLineSchema>;

// Placeholder composition — wire stills + voiceover once assets land.
export const FinishLine: React.FC<FinishLineProps> = ({ caption }) => {
  return (
    <AspectFrame vignette={false}>
      <AbsoluteFill
        style={{
          backgroundColor: tokens.bg.dark,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontFamily: tokens.font.heading,
            color: tokens.text.light,
            fontSize: 88,
            fontWeight: 300,
            letterSpacing: "-0.02em",
          }}
        >
          {caption}
        </div>
      </AbsoluteFill>
    </AspectFrame>
  );
};
