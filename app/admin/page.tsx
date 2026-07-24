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
  getVideoFeedItems,
  getWhyChooseImageUrl,
} from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [mainCategories, categories, products, projects, messages, heroSlides, whyChooseImageUrl, achievementSlides, clientSlides, reviews, videoFeedItems] =
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
      getVideoFeedItems(),
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
      videoFeedItems={videoFeedItems}
    />
  );
}
