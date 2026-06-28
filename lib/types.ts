export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
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

export interface StoreData {
  categories: Category[];
  products: Product[];
  projects: Project[];
  messages: Message[];
}
