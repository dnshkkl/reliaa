import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import type {
  StoreData,
  MainCategory,
  Category,
  Product,
  Project,
  Message,
  Review,
} from "./types";
import { seedData } from "./seed";

// ---------------------------------------------------------------------------
// Storage layer with two backends:
//   * Cloudinary  — used in production (when CLOUDINARY_URL is set). Images are
//                   stored as image assets; the small JSON document (categories,
//                   products, projects, messages) is stored as a raw asset.
//   * Local disk  — used automatically for local development (no setup needed).
// ---------------------------------------------------------------------------

const CLOUD_IMAGE_FOLDER = "reliaa/images";
const CLOUD_DATA_PUBLIC_ID = "reliaa/data"; // raw JSON document

const LOCAL_DATA_FILE = path.join(process.cwd(), "data", "products.json");
const LOCAL_UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

const useCloud = !!process.env.CLOUDINARY_URL;

// ---------------------------------------------------------------------------
// Cloudinary client (lazy — only loaded when CLOUDINARY_URL is configured).
// The SDK auto-configures itself from the CLOUDINARY_URL environment variable.
// ---------------------------------------------------------------------------

async function getCloudinary() {
  const mod = await import("cloudinary");
  return mod.v2;
}

/** Build the public delivery URL for the raw JSON document. */
async function cloudDataUrl(): Promise<string> {
  const cloudinary = await getCloudinary();
  const cloudName = cloudinary.config().cloud_name;
  // Non-versioned URL always resolves to the latest asset; cache-busted on read.
  return `https://res.cloudinary.com/${cloudName}/raw/upload/${CLOUD_DATA_PUBLIC_ID}`;
}

/** Derive a Cloudinary public_id from one of its delivery URLs. */
function publicIdFromUrl(url: string): string | null {
  const marker = "/upload/";
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  let rest = url.slice(idx + marker.length);
  rest = rest.replace(/^v\d+\//, ""); // strip version segment
  rest = rest.replace(/\.[a-zA-Z0-9]+$/, ""); // strip file extension
  return rest || null;
}

// ---------------------------------------------------------------------------
// Normalisation — keeps older saved documents compatible with the schema.
// ---------------------------------------------------------------------------

type LegacyProduct = Partial<Product> & { imageUrl?: string };

function normalize(raw: unknown): StoreData {
  const data = (raw ?? {}) as {
    mainCategories?: Partial<MainCategory>[];
    categories?: (Partial<Category> & { imageUrl?: string })[];
    products?: LegacyProduct[];
    projects?: Project[];
    messages?: Message[];
    heroSlides?: string[];
    whyChooseImageUrl?: string;
    achievementSlides?: string[];
    clientSlides?: string[];
    reviews?: Partial<Review>[];
  };
  return {
    mainCategories: (data.mainCategories ?? []).map((mc) => ({
      id: mc.id ?? randomUUID(),
      name: mc.name ?? "",
      slug: mc.slug ?? slugify(mc.name ?? ""),
      description: mc.description ?? "",
      imageUrl: mc.imageUrl,
    })),
    categories: (data.categories ?? []).map((c) => ({
      id: c.id ?? randomUUID(),
      mainCategoryId: c.mainCategoryId,
      name: c.name ?? "",
      slug: c.slug ?? slugify(c.name ?? ""),
      description: c.description ?? "",
      imageUrl: c.imageUrl,
    })),
    products: (data.products ?? []).map((p) => ({
      id: p.id ?? randomUUID(),
      categoryId: p.categoryId ?? "",
      name: p.name ?? "",
      description: p.description ?? "",
      images:
        p.images && p.images.length
          ? p.images
          : p.imageUrl
            ? [p.imageUrl]
            : [],
      createdAt: p.createdAt ?? new Date().toISOString(),
    })),
    projects: data.projects ?? [],
    messages: data.messages ?? [],
    heroSlides: data.heroSlides ?? [],
    whyChooseImageUrl: data.whyChooseImageUrl ?? "",
    achievementSlides: data.achievementSlides ?? [],
    clientSlides: data.clientSlides ?? [],
    reviews: (data.reviews ?? []).map((r) => ({
      id: r.id ?? randomUUID(),
      clientName: r.clientName ?? "",
      role: r.role ?? "",
      text: r.text ?? "",
      rating: r.rating ?? 5,
      createdAt: r.createdAt ?? new Date().toISOString(),
    })),
  };
}

// ---------------------------------------------------------------------------
// Data document (read / write)
// ---------------------------------------------------------------------------

async function readDataCloud(): Promise<StoreData> {
  try {
    const url = await cloudDataUrl();
    const res = await fetch(`${url}?t=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) return seedData; // 404 the first time, before anything is saved
    return normalize(await res.json());
  } catch {
    return seedData;
  }
}

async function readDataLocal(): Promise<StoreData> {
  try {
    const raw = await fs.readFile(LOCAL_DATA_FILE, "utf8");
    return normalize(JSON.parse(raw));
  } catch {
    return seedData;
  }
}

export async function readData(): Promise<StoreData> {
  return useCloud ? readDataCloud() : readDataLocal();
}

async function writeDataCloud(data: StoreData): Promise<void> {
  const cloudinary = await getCloudinary();
  const json = JSON.stringify(data, null, 2);
  const dataUri = `data:application/json;base64,${Buffer.from(json).toString(
    "base64"
  )}`;
  await cloudinary.uploader.upload(dataUri, {
    resource_type: "raw",
    public_id: CLOUD_DATA_PUBLIC_ID,
    overwrite: true,
    invalidate: true, // purge the CDN copy so the next read is fresh
  });
}

async function writeDataLocal(data: StoreData): Promise<void> {
  await fs.mkdir(path.dirname(LOCAL_DATA_FILE), { recursive: true });
  await fs.writeFile(LOCAL_DATA_FILE, JSON.stringify(data, null, 2), "utf8");
}

async function writeData(data: StoreData): Promise<void> {
  return useCloud ? writeDataCloud(data) : writeDataLocal(data);
}

// ---------------------------------------------------------------------------
// Image upload / delete
// ---------------------------------------------------------------------------

function safeExt(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  return /\.(jpg|jpeg|png|webp|avif|gif)$/.test(ext) ? ext : ".jpg";
}

export async function saveImage(file: File): Promise<string> {
  if (useCloud) {
    const cloudinary = await getCloudinary();
    const buffer = Buffer.from(await file.arrayBuffer());
    const dataUri = `data:${file.type || "image/jpeg"};base64,${buffer.toString(
      "base64"
    )}`;
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: CLOUD_IMAGE_FOLDER,
      public_id: randomUUID(),
      resource_type: "image",
    });
    return result.secure_url;
  }

  const ext = safeExt(file.name);
  const id = randomUUID();
  await fs.mkdir(LOCAL_UPLOAD_DIR, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(LOCAL_UPLOAD_DIR, `${id}${ext}`), buffer);
  return `/uploads/${id}${ext}`;
}

export async function saveImages(files: File[]): Promise<string[]> {
  const valid = files.filter((f) => f instanceof File && f.size > 0);
  return Promise.all(valid.map(saveImage));
}

async function deleteImage(imageUrl: string): Promise<void> {
  try {
    if (imageUrl.startsWith("/uploads/")) {
      await fs.unlink(path.join(process.cwd(), "public", imageUrl));
    } else if (imageUrl.includes("res.cloudinary.com")) {
      const cloudinary = await getCloudinary();
      const publicId = publicIdFromUrl(imageUrl);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId, {
          resource_type: "image",
          invalidate: true,
        });
      }
    }
  } catch {
    // Ignore — the image may already be gone; don't block data updates.
  }
}

async function deleteImages(urls: string[]): Promise<void> {
  await Promise.all(urls.map(deleteImage));
}

// ---------------------------------------------------------------------------
// Shared slug helper
// ---------------------------------------------------------------------------

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ---------------------------------------------------------------------------
// Main Categories
// ---------------------------------------------------------------------------

export async function getMainCategories(): Promise<MainCategory[]> {
  return (await readData()).mainCategories;
}

export async function addMainCategory(
  name: string,
  description: string
): Promise<MainCategory> {
  const data = await readData();
  const base = slugify(name) || "category";
  let slug = base;
  let n = 1;
  while (data.mainCategories.some((mc) => mc.slug === slug)) {
    slug = `${base}-${++n}`;
  }
  const mainCategory: MainCategory = {
    id: randomUUID(),
    name: name.trim(),
    slug,
    description: description.trim(),
  };
  data.mainCategories.push(mainCategory);
  await writeData(data);
  return mainCategory;
}

export async function updateMainCategory(
  id: string,
  name: string,
  description: string
): Promise<void> {
  const data = await readData();
  const mc = data.mainCategories.find((m) => m.id === id);
  if (!mc) return;
  mc.name = name.trim();
  mc.description = description.trim();
  await writeData(data);
}

export async function deleteMainCategory(id: string): Promise<void> {
  const data = await readData();
  const mc = data.mainCategories.find((m) => m.id === id);
  if (mc?.imageUrl) await deleteImage(mc.imageUrl);
  // Unlink sub-categories (don't delete them)
  data.categories.forEach((c) => {
    if (c.mainCategoryId === id) delete c.mainCategoryId;
  });
  data.mainCategories = data.mainCategories.filter((m) => m.id !== id);
  await writeData(data);
}

export async function setMainCategoryImage(
  id: string,
  imageUrl: string
): Promise<void> {
  const data = await readData();
  const mc = data.mainCategories.find((m) => m.id === id);
  if (!mc) return;
  if (mc.imageUrl) await deleteImage(mc.imageUrl);
  mc.imageUrl = imageUrl;
  await writeData(data);
}

export async function removeMainCategoryImage(id: string): Promise<void> {
  const data = await readData();
  const mc = data.mainCategories.find((m) => m.id === id);
  if (!mc) return;
  if (mc.imageUrl) await deleteImage(mc.imageUrl);
  delete mc.imageUrl;
  await writeData(data);
}

export async function assignSubCategory(
  categoryId: string,
  mainCategoryId: string | null
): Promise<void> {
  const data = await readData();
  const cat = data.categories.find((c) => c.id === categoryId);
  if (!cat) return;
  if (mainCategoryId) {
    cat.mainCategoryId = mainCategoryId;
  } else {
    delete cat.mainCategoryId;
  }
  await writeData(data);
}

// ---------------------------------------------------------------------------
// Sub Categories
// ---------------------------------------------------------------------------

export async function getCategories(): Promise<Category[]> {
  return (await readData()).categories;
}

export async function addCategory(
  name: string,
  description: string
): Promise<Category> {
  const data = await readData();
  const base = slugify(name) || "category";
  let slug = base;
  let n = 1;
  while (data.categories.some((c) => c.slug === slug)) {
    slug = `${base}-${++n}`;
  }
  const category: Category = {
    id: randomUUID(),
    name: name.trim(),
    slug,
    description: description.trim(),
  };
  data.categories.push(category);
  await writeData(data);
  return category;
}

export async function updateCategory(
  id: string,
  name: string,
  description: string
): Promise<void> {
  const data = await readData();
  const category = data.categories.find((c) => c.id === id);
  if (!category) return;
  category.name = name.trim();
  category.description = description.trim();
  await writeData(data);
}

export async function deleteCategory(id: string): Promise<void> {
  const data = await readData();
  const cat = data.categories.find((c) => c.id === id);
  if (cat?.imageUrl) await deleteImage(cat.imageUrl);
  const orphaned = data.products.filter((p) => p.categoryId === id);
  await Promise.all(orphaned.map((p) => deleteImages(p.images)));
  data.categories = data.categories.filter((c) => c.id !== id);
  data.products = data.products.filter((p) => p.categoryId !== id);
  await writeData(data);
}

export async function setCategoryImage(
  id: string,
  imageUrl: string
): Promise<void> {
  const data = await readData();
  const category = data.categories.find((c) => c.id === id);
  if (!category) return;
  if (category.imageUrl) await deleteImage(category.imageUrl);
  category.imageUrl = imageUrl;
  await writeData(data);
}

export async function removeCategoryImage(id: string): Promise<void> {
  const data = await readData();
  const category = data.categories.find((c) => c.id === id);
  if (!category) return;
  if (category.imageUrl) await deleteImage(category.imageUrl);
  delete category.imageUrl;
  await writeData(data);
}

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

export async function getProducts(): Promise<Product[]> {
  return (await readData()).products;
}

export async function getProduct(id: string): Promise<Product | undefined> {
  return (await readData()).products.find((p) => p.id === id);
}

export async function addProduct(input: {
  categoryId: string;
  name: string;
  description: string;
  images: string[];
}): Promise<Product> {
  const data = await readData();
  const product: Product = {
    id: randomUUID(),
    categoryId: input.categoryId,
    name: input.name.trim(),
    description: input.description.trim(),
    images: input.images,
    createdAt: new Date().toISOString(),
  };
  data.products.push(product);
  await writeData(data);
  return product;
}

export async function updateProduct(
  id: string,
  input: {
    categoryId: string;
    name: string;
    description: string;
    images: string[]; // final set (kept existing + newly uploaded)
  }
): Promise<void> {
  const data = await readData();
  const product = data.products.find((p) => p.id === id);
  if (!product) return;
  product.categoryId = input.categoryId;
  product.name = input.name.trim();
  product.description = input.description.trim();
  product.images = input.images;
  await writeData(data);
}

export async function deleteProduct(id: string): Promise<void> {
  const data = await readData();
  const product = data.products.find((p) => p.id === id);
  if (product) await deleteImages(product.images);
  data.products = data.products.filter((p) => p.id !== id);
  await writeData(data);
}

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

export async function getProjects(): Promise<Project[]> {
  return (await readData()).projects;
}

export async function getProject(id: string): Promise<Project | undefined> {
  return (await readData()).projects.find((p) => p.id === id);
}

export async function addProject(input: {
  title: string;
  location: string;
  type: string;
  description: string;
  images: string[];
}): Promise<Project> {
  const data = await readData();
  const project: Project = {
    id: randomUUID(),
    title: input.title.trim(),
    location: input.location.trim(),
    type: input.type.trim(),
    description: input.description.trim(),
    images: input.images,
    createdAt: new Date().toISOString(),
  };
  data.projects.push(project);
  await writeData(data);
  return project;
}

export async function updateProject(
  id: string,
  input: {
    title: string;
    location: string;
    type: string;
    description: string;
    images: string[]; // final set (kept existing + newly uploaded)
  }
): Promise<void> {
  const data = await readData();
  const project = data.projects.find((p) => p.id === id);
  if (!project) return;
  project.title = input.title.trim();
  project.location = input.location.trim();
  project.type = input.type.trim();
  project.description = input.description.trim();
  project.images = input.images;
  await writeData(data);
}

export async function deleteProject(id: string): Promise<void> {
  const data = await readData();
  const project = data.projects.find((p) => p.id === id);
  if (project) await deleteImages(project.images);
  data.projects = data.projects.filter((p) => p.id !== id);
  await writeData(data);
}

// ---------------------------------------------------------------------------
// Messages (contact enquiries)
// ---------------------------------------------------------------------------

export async function getMessages(): Promise<Message[]> {
  return (await readData()).messages;
}

export async function addMessage(input: {
  name: string;
  email: string;
  phone: string;
  message: string;
  subject: string;
}): Promise<Message> {
  const data = await readData();
  const message: Message = {
    id: randomUUID(),
    name: input.name.trim(),
    email: input.email.trim(),
    phone: input.phone.trim(),
    message: input.message.trim(),
    subject: input.subject.trim(),
    read: false,
    createdAt: new Date().toISOString(),
  };
  data.messages.push(message);
  await writeData(data);
  return message;
}

export async function markMessageRead(
  id: string,
  read: boolean
): Promise<void> {
  const data = await readData();
  const msg = data.messages.find((m) => m.id === id);
  if (!msg) return;
  msg.read = read;
  await writeData(data);
}

export async function deleteMessage(id: string): Promise<void> {
  const data = await readData();
  data.messages = data.messages.filter((m) => m.id !== id);
  await writeData(data);
}

// ---------------------------------------------------------------------------
// Hero Slides
// ---------------------------------------------------------------------------

export async function getHeroSlides(): Promise<string[]> {
  return (await readData()).heroSlides;
}

export async function addHeroSlide(imageUrl: string): Promise<void> {
  const data = await readData();
  data.heroSlides.push(imageUrl);
  await writeData(data);
}

export async function removeHeroSlide(imageUrl: string): Promise<void> {
  const data = await readData();
  await deleteImage(imageUrl);
  data.heroSlides = data.heroSlides.filter((s) => s !== imageUrl);
  await writeData(data);
}

// ---------------------------------------------------------------------------
// Achievement Slides
// ---------------------------------------------------------------------------

export async function getAchievementSlides(): Promise<string[]> {
  return (await readData()).achievementSlides;
}

export async function addAchievementSlide(imageUrl: string): Promise<void> {
  const data = await readData();
  data.achievementSlides.push(imageUrl);
  await writeData(data);
}

export async function removeAchievementSlide(imageUrl: string): Promise<void> {
  const data = await readData();
  await deleteImage(imageUrl);
  data.achievementSlides = data.achievementSlides.filter((s) => s !== imageUrl);
  await writeData(data);
}

// ---------------------------------------------------------------------------
// Client Slides
// ---------------------------------------------------------------------------

export async function getClientSlides(): Promise<string[]> {
  return (await readData()).clientSlides;
}

export async function addClientSlide(imageUrl: string): Promise<void> {
  const data = await readData();
  data.clientSlides.push(imageUrl);
  await writeData(data);
}

export async function removeClientSlide(imageUrl: string): Promise<void> {
  const data = await readData();
  await deleteImage(imageUrl);
  data.clientSlides = data.clientSlides.filter((s) => s !== imageUrl);
  await writeData(data);
}

// ---------------------------------------------------------------------------
// Why Choose section
// ---------------------------------------------------------------------------

export async function getWhyChooseImageUrl(): Promise<string> {
  return (await readData()).whyChooseImageUrl ?? "";
}

export async function setWhyChooseImage(imageUrl: string): Promise<void> {
  const data = await readData();
  if (data.whyChooseImageUrl) await deleteImage(data.whyChooseImageUrl);
  data.whyChooseImageUrl = imageUrl;
  await writeData(data);
}

export async function removeWhyChooseImage(): Promise<void> {
  const data = await readData();
  if (data.whyChooseImageUrl) {
    await deleteImage(data.whyChooseImageUrl);
    data.whyChooseImageUrl = "";
  }
  await writeData(data);
}

// ---------------------------------------------------------------------------
// Reviews
// ---------------------------------------------------------------------------

export async function getReviews(): Promise<Review[]> {
  return (await readData()).reviews;
}

export async function addReview(input: {
  clientName: string;
  role: string;
  text: string;
  rating: number;
}): Promise<Review> {
  const data = await readData();
  const review: Review = {
    id: randomUUID(),
    clientName: input.clientName.trim(),
    role: input.role.trim(),
    text: input.text.trim(),
    rating: Math.min(5, Math.max(1, input.rating)),
    createdAt: new Date().toISOString(),
  };
  data.reviews.push(review);
  await writeData(data);
  return review;
}

export async function updateReview(
  id: string,
  input: { clientName: string; role: string; text: string; rating: number }
): Promise<void> {
  const data = await readData();
  const review = data.reviews.find((r) => r.id === id);
  if (!review) return;
  review.clientName = input.clientName.trim();
  review.role = input.role.trim();
  review.text = input.text.trim();
  review.rating = Math.min(5, Math.max(1, input.rating));
  await writeData(data);
}

export async function deleteReview(id: string): Promise<void> {
  const data = await readData();
  data.reviews = data.reviews.filter((r) => r.id !== id);
  await writeData(data);
}
