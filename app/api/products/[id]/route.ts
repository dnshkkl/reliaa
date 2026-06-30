import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/guard";
import {
  deleteProduct,
  getCategories,
  getProduct,
  saveImages,
  updateProduct,
} from "@/lib/store";
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

  const categoryId = String(form.get("categoryId") ?? "").trim();
  const name = String(form.get("name") ?? "").trim();
  const description = String(form.get("description") ?? "").trim();

  // Existing image URLs the user chose to keep
  const keepImages = form.getAll("keepImages").map(String).filter(Boolean);
  // Pre-uploaded URLs from the client
  const addedUrls = form.getAll("addedUrl").map(String).filter(Boolean);
  // New files to upload (fallback path)
  const newFiles = form
    .getAll("images")
    .filter((f): f is File => f instanceof File && f.size > 0);

  if (!name) {
    return NextResponse.json({ error: "Product name is required." }, { status: 400 });
  }

  const categories = await getCategories();
  if (!categories.some((c) => c.id === categoryId)) {
    return NextResponse.json({ error: "Please choose a valid category." }, { status: 400 });
  }

  if (newFiles.length > 0) {
    const err = validateImages(newFiles);
    if (err) return NextResponse.json({ error: err }, { status: 400 });
  }

  if (keepImages.length + addedUrls.length + newFiles.length === 0) {
    return NextResponse.json(
      { error: "At least one image is required." },
      { status: 400 }
    );
  }

  const uploadedUrls = newFiles.length > 0 ? await saveImages(newFiles) : [];
  const finalImages = [...keepImages, ...addedUrls, ...uploadedUrls];

  // Delete images that were removed (in current product but not in keepImages)
  const { promises: fs } = await import("fs");
  const path = await import("path");
  const current = await getProduct(id);
  if (current) {
    const removed = current.images.filter((url) => !keepImages.includes(url));
    // Delete removed images from storage (best-effort)
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

  await updateProduct(id, { categoryId, name, description, images: finalImages });
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
  await deleteProduct(id);
  return NextResponse.json({ ok: true });
}
