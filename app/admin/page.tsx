import AdminDashboard from "@/components/AdminDashboard";
import {
  getAchievementSlides,
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
  const [categories, products, projects, messages, heroSlides, whyChooseImageUrl, achievementSlides, reviews] =
    await Promise.all([
      getCategories(),
      getProducts(),
      getProjects(),
      getMessages(),
      getHeroSlides(),
      getWhyChooseImageUrl(),
      getAchievementSlides(),
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
      achievementSlides={achievementSlides}
      reviews={reviews}
    />
  );
}
