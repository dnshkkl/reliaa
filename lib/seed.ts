import type { StoreData } from "./types";

// Default data used the first time the site runs, before anything is added
// through the admin panel. Categories can be edited/added/removed in /admin.
export const seedData: StoreData = {
  categories: [
    {
      id: "sofas",
      name: "Sofas",
      slug: "sofas",
      description:
        "Statement seating designed for comfort and built to anchor a room.",
    },
    {
      id: "chairs",
      name: "Chairs",
      slug: "chairs",
      description:
        "Accent, lounge and dining chairs that balance form and function.",
    },
    {
      id: "other",
      name: "Other",
      slug: "other",
      description:
        "Tables, storage and finishing pieces to complete every space.",
    },
  ],
  products: [],
  projects: [],
  messages: [],
  heroSlides: [],
  whyChooseImageUrl: "",
  achievementSlides: [],
  reviews: [],
};
