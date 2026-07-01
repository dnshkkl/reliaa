import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/guard";
import { addMainCategory, getMainCategories } from "@/lib/store";

export async function GET() {
  return NextResponse.json({ mainCategories: await getMainCategories() });
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: { name?: string; description?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  if (!name) return NextResponse.json({ error: "Name is required." }, { status: 400 });

  const mc = await addMainCategory(name, String(body.description ?? ""));
  return NextResponse.json({ mainCategory: mc }, { status: 201 });
}
