import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { AspectFrame } from "../shared/AspectFrame";
import { tokens } from "../shared/tokens";

export const kitchenSchema = z.object({
  still: z.string().default("stills/kitchen-placeholder.jpg"),
  subtitleLine: z.string().optional(),
  showText: z.boolean().default(false),
});

export type KitchenProps = z.infer<typeof kitchenSchema>;

export const KitchenScene: React.FC<KitchenProps> = ({ still, subtitleLine, showText }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Slow Ken Burns — 1.0 → 1.04 over the full duration.
  const scale = interpolate(frame, [0, durationInFrames], [1, 1.04], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Soft fade-in/out at the seams for a clean loop.
  const fade = interpolate(
    frame,
    [0, 12, durationInFrames - 12, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const textOpacity = showText
    ? interpolate(frame, [30, 60, durationInFrames - 60, durationInFrames - 30], [0, 1, 1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  return (
    <AspectFrame>
      <AbsoluteFill style={{ opacity: fade }}>
        <Img
          src={staticFile(still)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${scale})`,
            transformOrigin: "center 60%",
            filter: "saturate(0.9) brightness(0.85)",
          }}
        />
        {/* warm grade wash */}
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(180deg, rgba(26,26,26,0.25) 0%, rgba(26,26,26,0.0) 30%, rgba(26,26,26,0.0) 70%, rgba(26,26,26,0.55) 100%)",
            pointerEvents: "none",
          }}
        />
      </AbsoluteFill>

      {showText && subtitleLine && (
        <AbsoluteFill
          style={{
            justifyContent: "flex-end",
            alignItems: "center",
            paddingBottom: 120,
            opacity: textOpacity,
          }}
        >
          <div
            style={{
              fontFamily: tokens.font.heading,
              color: tokens.text.light,
              fontSize: 56,
              lineHeight: 1.2,
              fontWeight: 300,
              maxWidth: "70%",
              textAlign: "center",
              textShadow: "0 2px 12px rgba(0,0,0,0.6)",
            }}
          >
            {subtitleLine}
          </div>
        </AbsoluteFill>
      )}
    </AspectFrame>
  );
};
