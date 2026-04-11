## Contentful Integration Overview

This project uses **Contentful** as a headless CMS to store IELTS content and render it in the Next.js app.

- **Integration file**: `src/lib/contentful.ts`  
- **Main content types**:
  - `ieltsWriting` – IELTS writing sample questions and model answers
  - `blogPage` – Blog posts (tips, strategies, guides)

---

## 1. Contentful Client & Environment Variables

**File**: `src/lib/contentful.ts`

```ts
import { createClient } from "contentful";

const client = createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID!,
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN!,
  environment: process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || "master",
});

export default client;
```

Required environment variables (in `.env.local` or `.env`):

```bash
NEXT_PUBLIC_CONTENTFUL_SPACE_ID=YOUR_SPACE_ID
NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN=YOUR_DELIVERY_API_TOKEN
NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT=master
```

---

## 2. TypeScript Models (Content Types)

### 2.1 Writing Samples – `ieltsWriting`

**Interface**: `WritingSample` in `src/lib/contentful.ts`

Fields expected from Contentful:

- **question**: Short text – the IELTS writing question
- **slug**: Short text – unique slug for the URL
- **answer**: Rich text – model answer
- **date**: Date & time
- **taskType**: Short text – e.g. `Task 1`, `Task 2`
- **questionType**: Short text – e.g. `Line Graph`, `Agree or Disagree`
- **image** (optional): Media – illustration/chart for the question

These are mapped in the `WritingSample` interface and used throughout the app.

### 2.2 Blog Posts – `blogPage`

**Interface**: `BlogPost` in `src/lib/contentful.ts`

Fields expected from Contentful:

- **title**: Short text
- **slug**: Short text (unique)
- **createdDate**: Date & time
- **author**: Short text
- **category**: Short text
- **featuredImage**: Media (optional) – used in the listing card
- **metaTags**: Short text list (optional)
- **metaDescription**: Long text (optional) – used as intro/SEO text
- **body**: Rich text – full article content
- **image**: Media (optional) – main image on detail page
- **recommendedPostsCategory**: Reference (not yet used in UI)

---

## 3. Fetch Helpers (How Data Is Loaded)

All helpers live in `src/lib/contentful.ts` and use the shared `client`.

### 3.1 Get All Writing Samples

```ts
export const getWritingSamples = async (): Promise<WritingSample[]> => {
  try {
    const response = await client.getEntries({
      content_type: "ieltsWriting",
      order: ["-fields.date"], // newest first
    });

    return response.items as unknown as WritingSample[];
  } catch (error) {
    console.error("Error fetching writing samples:", error);

    // Fallback mock data for development
    return [
      {
        sys: { ... },
        fields: {
          question:
            "Sample Writing Question - This is a mock question for testing purposes.",
          slug: "sample-writing-question",
          date: new Date().toISOString(),
          taskType: "Task 1",
          questionType: "Academic",
          answer: {
            content: [
              {
                data: {},
                content: [
                  {
                    data: {},
                    marks: [],
                    value:
                      "This is a sample answer to demonstrate the writing samples functionality. In a real scenario, this would be fetched from Contentful.",
                    nodeType: "text",
                  },
                ],
                nodeType: "paragraph",
              },
            ],
          },
        },
      },
    ] as WritingSample[];
  }
};
```

### 3.2 Get One Writing Sample by Slug

```ts
export const getWritingSampleBySlug = async (
  slug: string
): Promise<WritingSample | null> => {
  try {
    const response = await client.getEntries({
      content_type: "ieltsWriting",
      "fields.slug": slug,
      limit: 1,
    });

    return (response.items[0] as unknown as WritingSample) || null;
  } catch (error) {
    console.error("Error fetching writing sample:", error);

    // Fallback mock for a known slug in development
    if (slug === "sample-writing-question") {
      return {
        sys: { ... },
        fields: { ...same as above mock... },
      } as WritingSample;
    }

    return null;
  }
};
```

### 3.3 Get All Blog Posts

```ts
export const getBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    const response = await client.getEntries({
      content_type: "blogPage",
      order: ["-fields.createdDate"],
    });

    return response.items as unknown as BlogPost[];
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
};
```

### 3.4 Get One Blog Post by Slug

```ts
export const getBlogPostBySlug = async (
  slug: string
): Promise<BlogPost | null> => {
  try {
    const response = await client.getEntries({
      content_type: "blogPage",
      "fields.slug": slug,
      limit: 1,
    });

    return (response.items[0] as unknown as BlogPost) || null;
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return null;
  }
};
```

---

## 4. Where Contentful Data Is Used

### 4.1 Writing Samples

- **Listing page**: `/writing-samples`
  - Route: `src/app/writing-samples/page.tsx`
  - Client component: `src/components/User/WritingSamplesClient.tsx`
  - Uses `getWritingSamples()` to load all samples and supports:
    - Filter by Task (Task 1 / Task 2)
    - Filter by question type
    - Cards link to `/writing-samples/[slug]`

- **Detail page**: `/writing-samples/[slug]`
  - Route: `src/app/writing-samples/[slug]/page.tsx`
  - Uses `getWritingSampleBySlug(slug)` to load one entry
  - Custom `renderRichText` function converts Contentful Rich Text in `fields.answer` into React elements (paragraphs, headings, lists, bold/italic/underline).

### 4.2 Blog

- **Blog list**: `/blog`
  - Route: `src/app/blog/page.tsx`
  - Client component: `src/components/User/BlogClient.tsx`
  - Uses `getBlogPosts()` to render a grid of cards with:
    - Featured image
    - Category, createdDate, author
    - Title and excerpt from the Rich Text `body`
    - Link to `/blog/[slug]`

- **Blog detail**: `/blog/[slug]`
  - Route: `src/app/blog/[slug]/page.tsx`
  - Uses `getBlogPostBySlug(slug)` to load a single post
  - Custom `renderRichText` renders the `body` Rich Text with support for:
    - Paragraphs
    - Headings (H1–H3)
    - Ordered / unordered lists
    - Basic marks (bold, italic, underline)

---

## 5. Navigation & Entry Points

- **Navbar** (`src/components/Layout/Navbar.tsx`):
  - `Writing Samples` link → `/writing-samples`
  - `Blog` link → `/blog`

- **Landing Page** (`src/components/Home/IELTSLandingPage.tsx`):
  - "Explore Writing Samples" section links to:
    - `/writing-samples?task=1` (Task 1)
    - `/writing-samples?task=2` (Task 2)

---

## 6. Adding New Content in Contentful

### 6.1 New Writing Sample (`ieltsWriting`)

1. In Contentful, open **content type** `ieltsWriting`.
2. Create a new entry and fill:
   - **question**
   - **slug** (must be unique)
   - **answer** (Rich Text)
   - **date**
   - **taskType** (`Task 1` / `Task 2`)
   - **questionType** (e.g. `Line Graph`, `Agree or Disagree`)
   - **image** (optional)
3. Publish the entry.
4. It will appear automatically on:
   - `/writing-samples`
   - `/writing-samples/[slug]`

### 6.2 New Blog Post (`blogPage`)

1. In Contentful, open **content type** `blogPage`.
2. Create a new entry and fill:
   - **Title**
   - **Slug** (unique)
   - **Created Date**
   - **Author**
   - **Category**
   - **Featured Image** (for list card, optional)
   - **Meta tags** (optional)
   - **Meta Description** (optional)
   - **Body** (Rich Text)
   - **Image** (main image, optional)
   - **Recommended posts Category** (optional reference)
3. Publish the entry.
4. It will appear automatically on:
   - `/blog`
   - `/blog/[slug]`

---

## 7. Debugging Contentful Issues

- If **no data appears**:
  - Verify environment variables are set correctly.
  - Check the **content type IDs** match exactly:
    - `ieltsWriting`
    - `blogPage`
  - Ensure entries are **Published**, not Draft.

- If there is a **runtime error**:
  - Check the terminal running `npm run dev` for errors from `contentful.ts`.
  - Confirm fields in Contentful match what the interfaces expect (for example, `createdDate` vs `date`).




