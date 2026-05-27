import React from "react";
import {
  AbsoluteFill,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { PhoneFrame } from "../components/PhoneFrame";
import { Reveal } from "../components/Reveal";
import { BrandLockup } from "../components/Brand";
import { BulletList } from "../components/BulletList";

interface Bullet {
  text: string;
  color?: "rose" | "blue";
}

interface PhoneSwap {
  /** Frame within the Sequence at which this screenshot fades in. */
  at: number;
  /** Filename (in /public). */
  src: string;
}

interface FeatureSceneProps {
  /** Default screenshot shown from frame 0. */
  initialScreenshot: string;
  /** Additional screenshot swaps that crossfade over the default. */
  swaps?: PhoneSwap[];
  bullets: Bullet[];
  /** Frame at which bullets start appearing. */
  bulletsStart?: number;
  /** Stagger between bullets in frames. */
  bulletStagger?: number;
  /** Phone height in canvas pixels. */
  phoneHeight?: number;
}

/**
 * Two-column scene: brand lockup + bullets on the left, phone on the right.
 * Matches the layout / pacing of the original ProductDemoLaunch.mp4.
 */
export const FeatureScene: React.FC<FeatureSceneProps> = ({
  initialScreenshot,
  swaps = [],
  bullets,
  bulletsStart = 18,
  bulletStagger = 48,
  phoneHeight = 880,
}) => {
  return (
    <AbsoluteFill
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingLeft: 160,
        paddingRight: 200,
      }}
    >
      {/* Left column */}
      <div
        style={{
          flex: 1,
          maxWidth: 760,
          display: "flex",
          flexDirection: "column",
          gap: 56,
        }}
      >
        <Reveal delay={6} distance={20} from="left" damping={22}>
          <BrandLockup />
        </Reveal>

        <BulletList
          bullets={bullets}
          startFrame={bulletsStart}
          staggerFrames={bulletStagger}
        />
      </div>

      {/* Right column: phone with crossfade swaps */}
      <Reveal delay={0} distance={40} from="right" damping={22}>
        <div style={{ position: "relative", height: phoneHeight }}>
          <PhoneFrame
            src={staticFile(initialScreenshot)}
            height={phoneHeight}
          />
          {swaps.map((s, i) => (
            <PhoneSwapLayer
              key={i}
              src={staticFile(s.src)}
              fadeInFrame={s.at}
              phoneHeight={phoneHeight}
            />
          ))}
        </div>
      </Reveal>
    </AbsoluteFill>
  );
};

const PhoneSwapLayer: React.FC<{
  src: string;
  fadeInFrame: number;
  phoneHeight: number;
}> = ({ src, fadeInFrame, phoneHeight }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // 12-frame (0.2s @ 60fps) crossfade.
  const opacity = interpolate(
    frame,
    [fadeInFrame, fadeInFrame + Math.round(fps * 0.2)],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        opacity,
      }}
    >
      <PhoneFrame src={src} height={phoneHeight} />
    </div>
  );
};
