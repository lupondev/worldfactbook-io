import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title")?.trim() || "WorldFactbook.io";
  const description = searchParams.get("description")?.trim() || "";

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          background: "linear-gradient(145deg, #121214 0%, #0a0a0c 55%, #151318 100%)",
          padding: 56,
          justifyContent: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: "linear-gradient(90deg, #E8A83C, #c48a2e)",
          }}
        />
        <div
          style={{
            fontSize: title.length > 52 ? 48 : 56,
            fontWeight: 700,
            color: "#f5f0e6",
            lineHeight: 1.15,
            maxWidth: 1000,
            letterSpacing: -0.5,
          }}
        >
          {title}
        </div>
        {description ? (
          <div
            style={{
              fontSize: 26,
              color: "#a8a49a",
              marginTop: 28,
              lineHeight: 1.45,
              maxWidth: 980,
            }}
          >
            {description}
          </div>
        ) : null}
        <div
          style={{
            position: "absolute",
            bottom: 48,
            left: 56,
            fontSize: 22,
            color: "#E8A83C",
            fontWeight: 600,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          worldfactbook.io
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
