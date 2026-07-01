import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/guard";
import { addAchievementSlide, removeAchievementSlide, saveImage } from "@/lib/store";

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const file = form.get("image");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "An image is required." }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "File must be an image." }, { status: 400 });
  }
  if (file.size > 8 * 1024 * 1024) {
    return NextResponse.json({ error: "Image must be 8 MB or smaller." }, { status: 400 });
  }

  const imageUrl = await saveImage(file);
  await addAchievementSlide(imageUrl);
  return NextResponse.json({ ok: true, imageUrl });
}

export async function DELETE(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: { url?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!body.url) {
    return NextResponse.json({ error: "url is required." }, { status: 400 });
  }

  await removeAchievementSlide(body.url);
  return NextResponse.json({ ok: true });
}
