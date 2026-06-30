import AdminDashboard from "@/components/AdminDashboard";
import {
  getCategories,
  getHeroSlides,
  getMessages,
  getProducts,
  getProjects,
  getReviews,
  getWhyChooseImageUrl,
} from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [categories, products, projects, messages, heroSlides, whyChooseImageUrl, reviews] =
    await Promise.all([
      getCategories(),
      getProducts(),
      getProjects(),
      getMessages(),
      getHeroSlides(),
      getWhyChooseImageUrl(),
      getReviews(),
    ]);

  return (
    <AdminDashboard
      categories={categories}
      products={products}
      projects={projects}
      messages={messages}
      heroSlides={heroSlides}
      whyChooseImageUrl={whyChooseImageUrl}
      reviews={reviews}
    />
  );
}
