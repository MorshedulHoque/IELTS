import BlogClient from "@/components/User/BlogClient";
import { getCachedBlogPosts } from "@/lib/contentful-cached";

export default async function BlogPage() {
  const posts = await getCachedBlogPosts();
  return <BlogClient initialPosts={posts} />;
}
