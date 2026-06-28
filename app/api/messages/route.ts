import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/guard";
import { addMessage, getMessages } from "@/lib/store";

// Admin-only: read the inbox.
export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  return NextResponse.json({ messages: await getMessages() });
}

// Public: submit a contact enquiry.
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const message = String(body.message ?? "").trim();
  const subject = String(body.subject ?? "").trim();

  if (!name || !message) {
    return NextResponse.json(
      { error: "Please provide your name and a message." },
      { status: 400 }
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "Please provide a valid email address." },
      { status: 400 }
    );
  }

  if (message.length > 5000) {
    return NextResponse.json(
      { error: "Message is too long." },
      { status: 400 }
    );
  }

  await addMessage({ name, email, phone, message, subject });
  return NextResponse.json({ ok: true }, { status: 201 });
}
