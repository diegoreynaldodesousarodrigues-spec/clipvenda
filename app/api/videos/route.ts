import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import * as fal from "@fal-ai/serverless-client";

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file") as File;
  const nome = form.get("nome") as string;
  const descricao = form.get("descricao") as string;

  const blob = await put(file.name, file, { access: "public" });

  fal.config({ credentials: process.env.FAL_KEY! });
  const result: any = await fal.subscribe("fal-ai/luma-dream-machine/image-to-video", {
    inputs: {
      image_url: blob.url,
      prompt: `Cinematic commercial video of ${nome}, ${descricao}, 4k commercial lighting`,
      aspect_ratio: "9:16"
    },
  });

  return NextResponse.json({ url: result.video.url });
}
