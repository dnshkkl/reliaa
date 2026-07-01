import AdminDashboard from "@/components/AdminDashboard";
import {
  getAchievementSlides,
  getCategories,
  getClientSlides,
  getHeroSlides,
  getMainCategories,
  getMessages,
  getProducts,
  getProjects,
  getReviews,
  getWhyChooseImageUrl,
} from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [mainCategories, categories, products, projects, messages, heroSlides, whyChooseImageUrl, achievementSlides, clientSlides, reviews] =
    await Promise.all([
      getMainCategories(),
      getCategories(),
      getProducts(),
      getProjects(),
      getMessages(),
      getHeroSlides(),
      getWhyChooseImageUrl(),
      getAchievementSlides(),
      getClientSlides(),
      getReviews(),
    ]);

  return (
    <AdminDashboard
      mainCategories={mainCategories}
      categories={categories}
      products={products}
      projects={projects}
      messages={messages}
      heroSlides={heroSlides}
      whyChooseImageUrl={whyChooseImageUrl}
      achievementSlides={achievementSlides}
      clientSlides={clientSlides}
      reviews={reviews}
    />
  );
}
