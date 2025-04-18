import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // Dynamic parameters
  const title = searchParams.get("title") || "Oknum Studio";
  const description =
    searchParams.get("description") || "Tersangka Utama Kejayaan Brand Kamu";

  let fontData;
  try {
    const fontPath = path.join(process.cwd(), "public/fonts/Lexend-Bold.ttf");
    fontData = fs.readFileSync(fontPath);
  } catch (error) {
    console.error("Failed to load font:", error);
    // Fallback to use system fonts if the custom font fails to load
    fontData = null;
  }

  return new ImageResponse(
    (
      <div tw="flex flex-col items-center justify-center w-full h-full bg-gradient-to-br from-emerald-600 to-emerald-900 p-10 text-white">
        <div tw="flex flex-col bg-white/10 backdrop-blur-sm rounded-2xl border-2 border-white/20 p-10 w-4/5">
          <div tw="mb-6">
            <h1 tw="text-6xl font-bold m-0">{title}</h1>
            <p tw="text-3xl mt-2 opacity-90">{description}</p>
          </div>
          <div tw="flex justify-between items-center">
            <div tw="text-2xl opacity-80">
              Web Development • Mobile Apps • Digital Solutions
            </div>
            <div tw="text-2xl font-semibold text-right">www.oknum.studio</div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Lexend",
          data: fontData || Buffer.alloc(0),
          weight: 700,
          style: "normal",
        },
      ],
      headers: {
        "Cache-Control":
          "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
      },
    }
  );
}
