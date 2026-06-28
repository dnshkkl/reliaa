import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/guard";
import { deleteProject } from "@/lib/store";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  await deleteProject(id);
  return NextResponse.json({ ok: true });
}
