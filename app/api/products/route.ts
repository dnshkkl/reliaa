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

  const error = validateImages(files);
  if (error) return NextResponse.json({ error }, { status: 400 });

  const images = await saveImages(files);
  const product = await addProduct({ categoryId, name, description, images });
  return NextResponse.json({ product }, { status: 201 });
}
