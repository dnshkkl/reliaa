import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/guard";
import {
  getVideoFeedItems,
  addVideoFeedItem,
  updateVideoFeedItem,
  deleteVideoFeedItem,
} from "@/lib/store";

export async function GET() {
  const items = await getVideoFeedItems();
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const body = await request.json();
  const item = await addVideoFeedItem({
    videoUrl: body.videoUrl ?? "",
    thumbnail: body.thumbnail ?? "",
    productName: body.productName ?? "",
    specs: Array.isArray(body.specs) ? body.specs : [],
    sequence: typeof body.sequence === "number" ? body.sequence : 0,
  });
  return NextResponse.json(item, { status: 201 });
}

export async function PATCH(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const body = await request.json();
  if (!body.id) return NextResponse.json({ error: "id required." }, { status: 400 });
  await updateVideoFeedItem(body.id, body);
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required." }, { status: 400 });
  await deleteVideoFeedItem(id);
  return NextResponse.json({ ok: true });
}
