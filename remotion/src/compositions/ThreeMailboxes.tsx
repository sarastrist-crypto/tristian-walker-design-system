import { AbsoluteFill } from "remotion";
import { z } from "zod";
import { AspectFrame } from "../shared/AspectFrame";
import { tokens } from "../shared/tokens";

export const mailboxesSchema = z.object({
  caption: z.string().default("Three mailboxes."),
});

export type MailboxesProps = z.infer<typeof mailboxesSchema>;

// Placeholder composition — wire stills + voiceover once assets land.
export const ThreeMailboxes: React.FC<MailboxesProps> = ({ caption }) => {
  return (
    <AspectFrame vignette={false}>
      <AbsoluteFill
        style={{
          backgroundColor: tokens.bg.parchment,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontFamily: tokens.font.heading,
            color: tokens.text.main,
            fontSize: 96,
            fontWeight: 300,
          }}
        >
          {caption}
        </div>
      </AbsoluteFill>
    </AspectFrame>
  );
};
