import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import { IncomingForm } from "formidable";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("image") as File;

  if (!file) {
    return NextResponse.json({ error: "No image file" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  // Upload to Cloudinary
  const result = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "ielts_images" }, (err, res) => {
        if (err) return reject(err);
        resolve(res);
      })
      .end(buffer);
  });

  return NextResponse.json({ url: (result as any).secure_url });
}
