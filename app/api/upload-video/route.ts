import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/guard";
import { saveVideo } from "@/lib/store";

const ALLOWED = ["video/mp4", "video/webm", "video/quicktime", "video/x-msvideo"];
const MAX_MB = 100;

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

  const file = form.get("video");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "A video file is required." }, { status: 400 });
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ error: "File must be a video (MP4, WebM, MOV, AVI)." }, { status: 400 });
  }
  if (file.size > MAX_MB * 1024 * 1024) {
    return NextResponse.json({ error: `Video must be ${MAX_MB} MB or smaller.` }, { status: 400 });
  }

  const url = await saveVideo(file);
  return NextResponse.json({ url });
}
