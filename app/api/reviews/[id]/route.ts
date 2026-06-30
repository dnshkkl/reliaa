import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/guard";
import { deleteReview, updateReview } from "@/lib/store";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;

  let body: { clientName?: string; role?: string; text?: string; rating?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const clientName = String(body.clientName ?? "").trim();
  const role = String(body.role ?? "").trim();
  const text = String(body.text ?? "").trim();
  const rating = Number(body.rating ?? 5);

  if (!clientName) return NextResponse.json({ error: "Client name is required." }, { status: 400 });
  if (!text) return NextResponse.json({ error: "Review text is required." }, { status: 400 });

  await updateReview(id, { clientName, role, text, rating });
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
  await deleteReview(id);
  return NextResponse.json({ ok: true });
}
