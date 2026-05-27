import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { colors } from "../theme";

/**
 * Soft animated cream background with two slowly drifting radial blobs
 * (rose + blue) to give the canvas life without distracting from the UI.
 */
export const AnimatedBackground: React.FC = () => {
  const frame = useCurrentFrame();
  // Gentle drift, full cycle ~12s at 30fps.
  const t = frame / 360;
  const x1 = 30 + Math.sin(t * Math.PI * 2) * 8;
  const y1 = 35 + Math.cos(t * Math.PI * 2) * 6;
  const x2 = 75 + Math.cos(t * Math.PI * 2 + 1.2) * 8;
  const y2 = 70 + Math.sin(t * Math.PI * 2 + 1.2) * 6;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(45% 50% at ${x1}% ${y1}%, ${colors.primaryLight} 0%, rgba(242,228,230,0) 70%), radial-gradient(40% 45% at ${x2}% ${y2}%, ${colors.partnerLight} 0%, rgba(228,236,242,0) 70%)`,
        }}
      />
    </AbsoluteFill>
  );
};
