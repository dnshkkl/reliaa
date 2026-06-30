import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/guard";
import { addReview, getReviews } from "@/lib/store";

export async function GET() {
  return NextResponse.json({ reviews: await getReviews() });
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

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
  if (rating < 1 || rating > 5) return NextResponse.json({ error: "Rating must be 1–5." }, { status: 400 });

  const review = await addReview({ clientName, role, text, rating });
  return NextResponse.json({ review }, { status: 201 });
}
