import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

/**
 * On-demand CDN + Data Cache invalidation for Contentful-backed pages.
 * POST JSON: { "secret": "...", "tags": ["contentful-blog-list"] }
 * or { "secret": "...", "tag": "contentful-blog-list" }
 * Omit tags to revalidate default list tags for blog + writing samples.
 */
export async function POST(req: NextRequest) {
  const secretEnv = process.env.CONTENTFUL_REVALIDATE_SECRET;
  if (!secretEnv) {
    return NextResponse.json(
      { message: "CONTENTFUL_REVALIDATE_SECRET is not set" },
      { status: 503 },
    );
  }

  let body: Record<string, unknown> = {};
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    body = {};
  }

  const secret =
    (typeof body.secret === "string" ? body.secret : undefined) ??
    req.nextUrl.searchParams.get("secret");

  if (secret !== secretEnv) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let tags: string[];
  if (Array.isArray(body.tags) && body.tags.every((t) => typeof t === "string")) {
    tags = body.tags as string[];
  } else if (typeof body.tag === "string") {
    tags = [body.tag];
  } else {
    tags = ["contentful-blog-list", "contentful-writing-list"];
  }

  for (const tag of tags) {
    revalidateTag(tag);
  }

  return NextResponse.json({ revalidated: true, tags });
}
