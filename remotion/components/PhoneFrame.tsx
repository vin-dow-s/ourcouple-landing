import React from "react";
import { Img } from "remotion";
import { colors } from "../theme";

interface PhoneFrameProps {
  src: string;
  /** Display height of the phone in pixels (canvas units, 1080p reference). */
  height?: number;
  /** Optional extra style for outer wrapper. */
  style?: React.CSSProperties;
}

/**
 * iPhone-style frame around an app screenshot. The screenshot images already
 * include a device bezel in most cases — we just add a subtle shadow.
 */
export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  src,
  height = 820,
  style,
}) => {
  return (
    <div
      style={{
        height,
        filter: `drop-shadow(0 30px 60px ${colors.shadow}) drop-shadow(0 8px 16px rgba(0,0,0,0.08))`,
        ...style,
      }}
    >
      <Img
        src={src}
        style={{
          height: "100%",
          width: "auto",
          objectFit: "contain",
          display: "block",
        }}
      />
    </div>
  );
};
