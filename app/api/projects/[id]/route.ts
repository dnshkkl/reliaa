import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/guard";
import { deleteProject, getProject, saveImages, updateProject } from "@/lib/store";
import { validateImages } from "@/lib/validate";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const title = String(form.get("title") ?? "").trim();
  const location = String(form.get("location") ?? "").trim();
  const type = String(form.get("type") ?? "").trim();
  const description = String(form.get("description") ?? "").trim();

  const keepImages = form.getAll("keepImages").map(String).filter(Boolean);
  const newFiles = form
    .getAll("images")
    .filter((f): f is File => f instanceof File && f.size > 0);

  if (!title) {
    return NextResponse.json({ error: "Project title is required." }, { status: 400 });
  }

  if (newFiles.length > 0) {
    const err = validateImages(newFiles);
    if (err) return NextResponse.json({ error: err }, { status: 400 });
  }

  if (keepImages.length + newFiles.length === 0) {
    return NextResponse.json(
      { error: "At least one image is required." },
      { status: 400 }
    );
  }

  const uploadedUrls = newFiles.length > 0 ? await saveImages(newFiles) : [];
  const finalImages = [...keepImages, ...uploadedUrls];

  // Delete removed images
  const { promises: fs } = await import("fs");
  const path = await import("path");
  const current = await getProject(id);
  if (current) {
    const removed = current.images.filter((url) => !keepImages.includes(url));
    await Promise.all(
      removed.map(async (url) => {
        try {
          if (url.startsWith("/uploads/")) {
            await fs.unlink(path.join(process.cwd(), "public", url));
          } else if (url.includes("res.cloudinary.com")) {
            const { v2: cloudinary } = await import("cloudinary");
            const marker = "/upload/";
            const idx = url.indexOf(marker);
            if (idx !== -1) {
              let rest = url.slice(idx + marker.length);
              rest = rest.replace(/^v\d+\//, "").replace(/\.[a-zA-Z0-9]+$/, "");
              await cloudinary.uploader.destroy(rest, {
                resource_type: "image",
                invalidate: true,
              });
            }
          }
        } catch {
          // ignore
        }
      })
    );
  }

  await updateProject(id, { title, location, type, description, images: finalImages });
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const { id } = await params;
  await deleteProject(id);
  return NextResponse.json({ ok: true });
}
