export interface MainCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl?: string;
}

export interface Category {
  id: string;
  mainCategoryId?: string; // which main category this sub-category belongs to
  name: string;
  slug: string;
  description: string;
  imageUrl?: string; // optional background image for category cards
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  /** One or more image URLs. The first is used as the cover. */
  images: string[];
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  /** e.g. a city or venue name. */
  location: string;
  /** e.g. "Residential", "Hospitality", "Office". Free text. */
  type: string;
  description: string;
  /** One or more image URLs. The first is used as the cover. */
  images: string[];
  createdAt: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  /** Optional name of the product/piece the enquiry is about. */
  subject: string;
  read: boolean;
  createdAt: string;
}

export interface Review {
  id: string;
  clientName: string;
  role: string;
  text: string;
  rating: number; // 1-5
  createdAt: string;
}

export interface StoreData {
  mainCategories: MainCategory[];
  categories: Category[];
  products: Product[];
  projects: Project[];
  messages: Message[];
  heroSlides: string[];
  whyChooseImageUrl: string;
  achievementSlides: string[];
  clientSlides: string[];
  reviews: Review[];
}
