import React from "react";
import { Img, staticFile } from "remotion";
import { colors, fontStack } from "../theme";

/**
 * Brand lockup matching the original ProductDemoLaunch.mp4:
 * 88px rounded logo + "OurCouple" bold + italic subtitle, stacked right of logo.
 */
export const BrandLockup: React.FC<{ subtitle?: string }> = ({
  subtitle = "Your Shared Space",
}) => {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
      <Img
        src={staticFile("logo-512.png")}
        style={{
          width: 96,
          height: 96,
          borderRadius: 20,
        }}
      />
      <div>
        <div
          style={{
            fontFamily: fontStack,
            fontSize: 56,
            fontWeight: 800,
            color: colors.text,
            letterSpacing: -1.4,
            lineHeight: 1,
          }}
        >
          OurCouple
        </div>
        {subtitle ? (
          <div
            style={{
              fontFamily: fontStack,
              fontSize: 20,
              fontStyle: "italic",
              fontWeight: 500,
              color: colors.textSecondary,
              marginTop: 6,
              letterSpacing: 0.2,
            }}
          >
            {subtitle}
          </div>
        ) : null}
      </div>
    </div>
  );
};
