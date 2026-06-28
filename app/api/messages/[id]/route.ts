import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/guard";
import { deleteMessage, markMessageRead } from "@/lib/store";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const { id } = await params;
  let read = true;
  try {
    const body = await request.json();
    read = Boolean(body.read);
  } catch {
    // default to marking read
  }
  await markMessageRead(id, read);
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
  await deleteMessage(id);
  return NextResponse.json({ ok: true });
}
