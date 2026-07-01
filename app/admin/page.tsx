import AdminDashboard from "@/components/AdminDashboard";
import {
  getAchievementSlides,
  getCategories,
  getClientSlides,
  getHeroSlides,
  getMessages,
  getProducts,
  getProjects,
  getReviews,
  getWhyChooseImageUrl,
} from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [categories, products, projects, messages, heroSlides, whyChooseImageUrl, achievementSlides, clientSlides, reviews] =
    await Promise.all([
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
