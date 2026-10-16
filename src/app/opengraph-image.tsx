import { ImageResponse } from "next/og";
import { portfolio } from "@/content/portfolio";

export const alt = `${portfolio.profile.name} | ${portfolio.profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const { profile } = portfolio;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "radial-gradient(circle at 80% 20%, #3b1d8f 0%, #060818 55%, #03040d 100%)",
          color: "#e6e9ff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 28, color: "#22d3ee", letterSpacing: 6, textTransform: "uppercase" }}>
          Portfolio
        </div>
        <div
          style={{
            fontSize: 96,
            fontWeight: 800,
            marginTop: 20,
            backgroundImage: "linear-gradient(90deg, #c4b5fd, #8b5cf6, #22d3ee)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {profile.name}
        </div>
        <div style={{ fontSize: 40, marginTop: 16, color: "#9aa3c7" }}>{`<${profile.role} />`}</div>
        <div style={{ fontSize: 26, marginTop: 48, color: "#9aa3c7" }}>
          {profile.links.github.replace(/^https?:\/\//, "")}
        </div>
      </div>
    ),
    size,
  );
}
