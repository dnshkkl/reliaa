import { getVideoFeedItems } from "@/lib/store";
import VideoFeed from "@/components/VideoFeed";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Videos — Reliaa",
  description: "Watch Reliaa's furniture collection come to life.",
};

export default async function VideosPage() {
  const items = await getVideoFeedItems();
  return (
    <div className="fixed inset-0 z-0 bg-black">
      <VideoFeed items={items} />
    </div>
  );
}
