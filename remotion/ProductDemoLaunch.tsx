import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { AnimatedBackground } from "./components/AnimatedBackground";
import { FeatureScene } from "./scenes/FeatureScene";
import { OutroScene } from "./scenes/OutroScene";

// Match the original ProductDemoLaunch.mp4 exactly: 60fps, ~18s.
export const FPS = 60;
const s = (sec: number) => Math.round(sec * FPS);

/**
 * Timeline (matches original 18s @ 60fps):
 *   0.0 – 6.5s   Phase A  (Couple Card / daily ritual)
 *   6.5 – 15.0s  Phase B  (Games / shared space, multi-screenshot)
 *  15.0 – 18.0s  Outro    (logo → name → URL → CTA)
 */
const DUR = {
  phaseA: 6.5,
  phaseB: 8.5,
  outro: 3.0,
};

const TOTAL = DUR.phaseA + DUR.phaseB + DUR.outro;
export const DURATION_FRAMES = s(TOTAL);

export const ProductDemoLaunch: React.FC = () => {
  return (
    <AbsoluteFill>
      <AnimatedBackground />

      {/* PHASE A — Couple Card */}
      <Sequence from={s(0)} durationInFrames={s(DUR.phaseA)}>
        <FeatureScene
          initialScreenshot="mainscreenshot.png"
          bullets={[
            { text: "Your Couple Card, made for two", color: "rose" },
            { text: "Live bond score & compatibility", color: "rose" },
            { text: "A new ritual together every day", color: "blue" },
            { text: "Customise the colours & vibe", color: "blue" },
          ]}
          bulletsStart={s(0.9)}
          bulletStagger={s(0.85)}
        />
      </Sequence>

      {/* PHASE B — Games / shared space, phone rotates through screens */}
      <Sequence from={s(DUR.phaseA)} durationInFrames={s(DUR.phaseB)}>
        <FeatureScene
          initialScreenshot="screenshot1.png"
          swaps={[
            { at: s(2.7), src: "screenshot2.png" },
            { at: s(5.4), src: "screenshotright.png" },
          ]}
          bullets={[
            { text: "Message, photo & question of the day", color: "rose" },
            { text: "Truth or Dare, 36 Questions & more", color: "rose" },
            { text: "Notes, plans & memories — shared", color: "blue" },
            { text: "Free for your partner", color: "blue" },
          ]}
          bulletsStart={s(0.4)}
          bulletStagger={s(0.95)}
        />
      </Sequence>

      {/* OUTRO */}
      <Sequence
        from={s(DUR.phaseA + DUR.phaseB)}
        durationInFrames={s(DUR.outro)}
      >
        <OutroScene />
      </Sequence>
    </AbsoluteFill>
  );
};
