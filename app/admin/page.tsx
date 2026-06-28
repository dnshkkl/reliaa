import AdminDashboard from "@/components/AdminDashboard";
import {
  getCategories,
  getMessages,
  getProducts,
  getProjects,
} from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [categories, products, projects, messages] = await Promise.all([
    getCategories(),
    getProducts(),
    getProjects(),
    getMessages(),
  ]);

  return (
    <AdminDashboard
      categories={categories}
      products={products}
      projects={projects}
      messages={messages}
    />
  );
}
