import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/guard";
import { addCategory, getCategories } from "@/lib/store";

export async function GET() {
  return NextResponse.json({ categories: await getCategories() });
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let name = "";
  let description = "";
  try {
    const body = await request.json();
    name = String(body.name ?? "").trim();
    description = String(body.description ?? "").trim();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!name) {
    return NextResponse.json(
      { error: "Category name is required." },
      { status: 400 }
    );
  }

  const category = await addCategory(name, description);
  return NextResponse.json({ category }, { status: 201 });
}
