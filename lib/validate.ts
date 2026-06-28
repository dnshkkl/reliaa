/** Shared image validation for product/project uploads. */
export function validateImages(files: File[]): string | null {
  const valid = files.filter((f) => f.size > 0);
  if (valid.length === 0) return "At least one image is required.";
  if (valid.length > 10) return "Please upload 10 images or fewer.";
  for (const file of valid) {
    if (!file.type.startsWith("image/")) {
      return "Every file must be an image.";
    }
    if (file.size > 8 * 1024 * 1024) {
      return "Each image must be 8 MB or smaller.";
    }
  }
  return null;
}
