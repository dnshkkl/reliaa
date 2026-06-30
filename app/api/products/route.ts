import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/guard";
import { addProduct, getCategories, getProducts, saveImages } from "@/lib/store";
import { validateImages } from "@/lib/validate";

export async function GET() {
  return NextResponse.json({ products: await getProducts() });
}

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

  const categoryId = String(form.get("categoryId") ?? "");
  const name = String(form.get("name") ?? "").trim();
  const description = String(form.get("description") ?? "").trim();
  const files = form.getAll("images").filter((f): f is File => f instanceof File);
  // Pre-uploaded URLs sent by the client (avoids large multipart body)
  const addedUrls = form.getAll("addedUrl").map(String).filter(Boolean);

  if (!name) {
    return NextResponse.json(
      { error: "Product name is required." },
      { status: 400 }
    );
  }

  const categories = await getCategories();
  if (!categories.some((c) => c.id === categoryId)) {
    return NextResponse.json(
      { error: "Please choose a valid category." },
      { status: 400 }
    );
  }

  if (files.length === 0 && addedUrls.length === 0) {
    return NextResponse.json({ error: "At least one image is required." }, { status: 400 });
  }

  let images: string[];
  if (files.length > 0) {
    const error = validateImages(files);
    if (error) return NextResponse.json({ error }, { status: 400 });
    images = [...addedUrls, ...(await saveImages(files))];
  } else {
    images = addedUrls;
  }

  const product = await addProduct({ categoryId, name, description, images });
  return NextResponse.json({ product }, { status: 201 });
}
