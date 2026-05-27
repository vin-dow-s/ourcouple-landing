import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, fontStack } from "../theme";

/**
 * Outro matching the original ProductDemoLaunch.mp4 pacing:
 *  - 0.0–0.4s : tiny logo fades in centered
 *  - 0.4–0.7s : logo grows + slides up, "OurCouple" appears beneath
 *  - 0.7–1.0s : "ourcouple.app" subtitle appears
 *  - 1.0–end  : "Available on iOS" pill + Android note appear
 */
export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Stage 1: logo fade-in, very small.
  const logoFadeIn = interpolate(frame, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Stage 2: logo "settles" — grows from small → full + nudges up.
  const grow = spring({
    frame: frame - 18,
    fps,
    config: { damping: 22, stiffness: 110 },
  });
  const logoScale = interpolate(grow, [0, 1], [0.45, 1]);
  const logoTranslateY = interpolate(grow, [0, 1], [80, 0]);

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 20,
      }}
    >
      <div
        style={{
          transform: `translateY(${logoTranslateY}px) scale(${logoScale})`,
          opacity: logoFadeIn,
        }}
      >
        <Img
          src={staticFile("logo-512.png")}
          style={{
            width: 168,
            height: 168,
            borderRadius: 36,
          }}
        />
      </div>

      <FadeUp delay={28} distance={18}>
        <div
          style={{
            fontFamily: fontStack,
            fontSize: 92,
            fontWeight: 800,
            color: colors.text,
            letterSpacing: -2.2,
            lineHeight: 1,
            marginTop: 6,
          }}
        >
          OurCouple
        </div>
      </FadeUp>

      <FadeUp delay={42} distance={14}>
        <div
          style={{
            fontFamily: fontStack,
            fontSize: 26,
            fontWeight: 500,
            color: colors.textSecondary,
            letterSpacing: 0.2,
          }}
        >
          ourcouple.app
        </div>
      </FadeUp>

      <FadeUp delay={60} distance={18}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 14,
            padding: "20px 38px",
            borderRadius: 18,
            backgroundColor: colors.text,
            color: colors.white,
            fontFamily: fontStack,
            fontSize: 28,
            fontWeight: 700,
            marginTop: 18,
            boxShadow: `0 12px 30px rgba(0,0,0,0.18)`,
          }}
        >
          <span style={{ fontSize: 28 }}></span>
          Available on iOS
        </div>
      </FadeUp>

      <FadeUp delay={76} distance={12}>
        <div
          style={{
            fontFamily: fontStack,
            fontSize: 18,
            fontWeight: 500,
            color: colors.textLight,
            marginTop: 6,
            letterSpacing: 0.3,
          }}
        >
          Coming soon on Android
        </div>
      </FadeUp>
    </AbsoluteFill>
  );
};

const FadeUp: React.FC<{
  delay: number;
  distance: number;
  children: React.ReactNode;
}> = ({ delay, distance, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 20, stiffness: 110 },
  });
  const opacity = interpolate(progress, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });
  const ty = interpolate(progress, [0, 1], [distance, 0], {
    extrapolateRight: "clamp",
  });
  return (
    <div style={{ opacity, transform: `translateY(${ty}px)` }}>{children}</div>
  );
};
