import React from "react";
import { Reveal } from "./Reveal";
import { colors, fontStack } from "../theme";

interface Bullet {
  text: string;
  /** "rose" or "blue" — colors the dot. */
  color?: "rose" | "blue";
}

interface BulletListProps {
  bullets: Bullet[];
  /** Frame at which the FIRST bullet starts revealing (within the Sequence). */
  startFrame?: number;
  /** Frames between successive bullet reveals (60fps → 60 = 1s). */
  staggerFrames?: number;
}

/**
 * Vertically stacked bullets that fade+slide in one after the other.
 * Matches the cadence of the original ProductDemoLaunch.mp4 — bullets
 * appear, accumulate, and stay on screen.
 */
export const BulletList: React.FC<BulletListProps> = ({
  bullets,
  startFrame = 0,
  staggerFrames = 48,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 22,
      }}
    >
      {bullets.map((b, i) => {
        const dot = b.color === "blue" ? colors.partner : colors.primary;
        return (
          <Reveal
            key={i}
            delay={startFrame + i * staggerFrames}
            distance={18}
            from="left"
            damping={20}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                fontFamily: fontStack,
                fontSize: 26,
                fontWeight: 600,
                color: colors.text,
                letterSpacing: -0.3,
              }}
            >
              <span
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: dot,
                  flexShrink: 0,
                }}
              />
              {b.text}
            </div>
          </Reveal>
        );
      })}
    </div>
  );
};
