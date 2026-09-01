import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Breizh Cola - Le cola breton";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#591420",
        color: "#f5ddd2",
      }}
    >
      <div style={{ fontSize: 120, fontWeight: 800, letterSpacing: -2 }}>
        Breizh Cola
      </div>
      <div style={{ fontSize: 40, marginTop: 16, opacity: 0.85 }}>
        Le cola breton
      </div>
    </div>,
    { ...size }
  );
}
