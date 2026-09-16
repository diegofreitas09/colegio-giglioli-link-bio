import { ImageResponse } from "next/og";
import { createElement } from "react";

const logoUrl = "https://colegiogiglioli.com.br/assets/logo-giglioli-vetorial.svg";

export const dynamic = "force-dynamic";

export async function GET() {
  const logo = createElement("img", {
    src: logoUrl,
    alt: "",
    width: 86,
    height: 86,
    style: {
      objectFit: "contain",
      display: "block"
    }
  });

  const canvas = createElement(
    "div",
    {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#ffffff",
        padding: "5px",
        boxSizing: "border-box"
      }
    },
    logo
  );

  return new ImageResponse(canvas, {
    width: 96,
    height: 96,
    headers: {
      "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000"
    }
  });
}
