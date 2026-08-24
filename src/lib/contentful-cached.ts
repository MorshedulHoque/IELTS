import "server-only";

import { unstable_cache } from "next/cache";
import {
  getBlogPostBySlug,
  getBlogPosts,
  getLearnPostBySlug,
  getLearnPosts,
  getWritingSampleBySlug,
  getWritingSamples,
} from "@/lib/contentful";

/** ISR-style window; on-demand updates via `POST /api/revalidate` + tags */
export const CONTENTFUL_REVALIDATE_SECONDS = 300;

export function getCachedBlogPosts() {
  return unstable_cache(() => getBlogPosts(), ["contentful", "blog", "list"], {
    revalidate: CONTENTFUL_REVALIDATE_SECONDS,
    tags: ["contentful-blog-list"],
  })();
}

export function getCachedBlogPostBySlug(slug: string) {
  return unstable_cache(
    () => getBlogPostBySlug(slug),
    ["contentful", "blog", "slug", slug],
    {
      revalidate: CONTENTFUL_REVALIDATE_SECONDS,
      tags: ["contentful-blog-list", `contentful-blog:${slug}`],
    },
  )();
}

export function getCachedWritingSamples() {
  return unstable_cache(
    () => getWritingSamples(),
    ["contentful", "writing", "list"],
    {
      revalidate: CONTENTFUL_REVALIDATE_SECONDS,
      tags: ["contentful-writing-list"],
    },
  )();
}

export function getCachedWritingSampleBySlug(slug: string) {
  return unstable_cache(
    () => getWritingSampleBySlug(slug),
    ["contentful", "writing", "slug", slug],
    {
      revalidate: CONTENTFUL_REVALIDATE_SECONDS,
      tags: ["contentful-writing-list", `contentful-writing:${slug}`],
    },
  )();
}

export function getCachedLearnPosts(learnType?: string) {
  return unstable_cache(
    () => getLearnPosts(learnType),
    ["contentful", "learn", "list", learnType ?? "all"],
    {
      revalidate: CONTENTFUL_REVALIDATE_SECONDS,
      tags: ["contentful-learn-list"],
    },
  )();
}

export function getCachedLearnPostBySlug(slug: string) {
  return unstable_cache(
    () => getLearnPostBySlug(slug),
    ["contentful", "learn", "slug", slug],
    {
      revalidate: CONTENTFUL_REVALIDATE_SECONDS,
      tags: ["contentful-learn-list", `contentful-learn:${slug}`],
    },
  )();
}
