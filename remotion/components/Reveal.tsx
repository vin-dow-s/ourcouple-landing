import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface RevealProps {
  /** Frame at which the reveal starts (relative to current Sequence). */
  delay?: number;
  /** Translate distance in pixels. */
  distance?: number;
  /** Direction. */
  from?: "bottom" | "top" | "left" | "right";
  /** Spring damping override. */
  damping?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

/**
 * Spring-based fade+slide reveal. Used for text/bullets/CTAs.
 */
export const Reveal: React.FC<RevealProps> = ({
  delay = 0,
  distance = 24,
  from = "bottom",
  damping = 16,
  style,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping, stiffness: 110, mass: 0.7 },
  });

  const opacity = interpolate(progress, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });
  const offset = interpolate(progress, [0, 1], [distance, 0], {
    extrapolateRight: "clamp",
  });

  const axis =
    from === "bottom"
      ? `translateY(${offset}px)`
      : from === "top"
        ? `translateY(${-offset}px)`
        : from === "left"
          ? `translateX(${-offset}px)`
          : `translateX(${offset}px)`;

  return (
    <div style={{ opacity, transform: axis, ...style }}>{children}</div>
  );
};
