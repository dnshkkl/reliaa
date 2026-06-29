import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/guard";
import { deleteProduct, getCategories, saveImages, updateProduct } from "@/lib/store";
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
  const files = form.getAll("images").filter((f): f is File => f instanceof File && f.size > 0);

  if (!name) {
    return NextResponse.json({ error: "Product name is required." }, { status: 400 });
  }

  const categories = await getCategories();
  if (!categories.some((c) => c.id === categoryId)) {
    return NextResponse.json({ error: "Please choose a valid category." }, { status: 400 });
  }

  let newImages: string[] | undefined;
  if (files.length > 0) {
    const err = validateImages(files);
    if (err) return NextResponse.json({ error: err }, { status: 400 });
    newImages = await saveImages(files);
  }

  await updateProduct(id, { categoryId, name, description, newImages });
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
