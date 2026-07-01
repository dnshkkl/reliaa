import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/guard";
import { assignSubCategory } from "@/lib/store";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  let body: { mainCategoryId?: string | null };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  await assignSubCategory(id, body.mainCategoryId ?? null);
  return NextResponse.json({ ok: true });
}
