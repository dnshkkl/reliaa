import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/guard";
import { addProject, getProjects, saveImages } from "@/lib/store";
import { validateImages } from "@/lib/validate";

export async function GET() {
  return NextResponse.json({ projects: await getProjects() });
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

  const title = String(form.get("title") ?? "").trim();
  const location = String(form.get("location") ?? "").trim();
  const type = String(form.get("type") ?? "").trim();
  const description = String(form.get("description") ?? "").trim();
  const files = form.getAll("images").filter((f): f is File => f instanceof File);
  const addedUrls = form.getAll("addedUrl").map(String).filter(Boolean);

  if (!title) {
    return NextResponse.json(
      { error: "Project title is required." },
      { status: 400 }
    );
  }

  if (files.length === 0 && addedUrls.length === 0) {
    return NextResponse.json({ error: "At least one image is required." }, { status: 400 });
  }

  let images: string[];
  if (files.length > 0) {
    const error = validateImages(files);
    if (error) return NextResponse.json({ error }, { status: 400 });
    images = [...addedUrls, ...(await saveImages(files))];
  } else {
    images = addedUrls;
  }

  const project = await addProject({
    title,
    location,
    type,
    description,
    images,
  });
  return NextResponse.json({ project }, { status: 201 });
}
