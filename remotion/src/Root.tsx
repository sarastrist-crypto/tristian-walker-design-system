import { Composition } from "remotion";
import { KitchenScene, kitchenSchema } from "./compositions/KitchenScene";
import { ThreeMailboxes, mailboxesSchema } from "./compositions/ThreeMailboxes";
import { FinishLine, finishLineSchema } from "./compositions/FinishLine";
import { ASPECT_DIMENSIONS } from "./shared/tokens";

const FPS = 30;
const HERO_DURATION = 300; // 10s seamless loop

export const Root: React.FC = () => {
  return (
    <>
      {/* Hero loop — silent, no overlay text. */}
      <Composition
        id="KitchenScene-hero"
        component={KitchenScene}
        durationInFrames={HERO_DURATION}
        fps={FPS}
        width={ASPECT_DIMENSIONS["16:9"].width}
        height={ASPECT_DIMENSIONS["16:9"].height}
        schema={kitchenSchema}
        defaultProps={{
          still: "stills/kitchen-placeholder.jpg",
          showText: false,
        }}
      />

      {/* Social cuts — same composition, different aspect + caption on. */}
      <Composition
        id="KitchenScene-9x16"
        component={KitchenScene}
        durationInFrames={HERO_DURATION}
        fps={FPS}
        width={ASPECT_DIMENSIONS["9:16"].width}
        height={ASPECT_DIMENSIONS["9:16"].height}
        schema={kitchenSchema}
        defaultProps={{
          still: "stills/kitchen-placeholder.jpg",
          subtitleLine: "Some kitchens go quiet long before anyone notices.",
          showText: true,
        }}
      />

      <Composition
        id="KitchenScene-1x1"
        component={KitchenScene}
        durationInFrames={HERO_DURATION}
        fps={FPS}
        width={ASPECT_DIMENSIONS["1:1"].width}
        height={ASPECT_DIMENSIONS["1:1"].height}
        schema={kitchenSchema}
        defaultProps={{
          still: "stills/kitchen-placeholder.jpg",
          subtitleLine: "Some kitchens go quiet long before anyone notices.",
          showText: true,
        }}
      />

      <Composition
        id="KitchenScene-16x9"
        component={KitchenScene}
        durationInFrames={HERO_DURATION}
        fps={FPS}
        width={ASPECT_DIMENSIONS["16:9"].width}
        height={ASPECT_DIMENSIONS["16:9"].height}
        schema={kitchenSchema}
        defaultProps={{
          still: "stills/kitchen-placeholder.jpg",
          subtitleLine: "Some kitchens go quiet long before anyone notices.",
          showText: true,
        }}
      />

      <Composition
        id="ThreeMailboxes"
        component={ThreeMailboxes}
        durationInFrames={300}
        fps={FPS}
        width={ASPECT_DIMENSIONS["16:9"].width}
        height={ASPECT_DIMENSIONS["16:9"].height}
        schema={mailboxesSchema}
        defaultProps={{ caption: "Three mailboxes." }}
      />

      <Composition
        id="FinishLine"
        component={FinishLine}
        durationInFrames={300}
        fps={FPS}
        width={ASPECT_DIMENSIONS["16:9"].width}
        height={ASPECT_DIMENSIONS["16:9"].height}
        schema={finishLineSchema}
        defaultProps={{ caption: "Five kilometers, on purpose." }}
      />
    </>
  );
};
