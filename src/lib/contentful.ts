import { createClient } from "contentful";

let client: ReturnType<typeof createClient> | null = null;

/**
 * Node-only TLS relax for HTTPS calls to Contentful.
 * Uses a custom HTTPS agent when:
 * - `CONTENTFUL_ALLOW_INSECURE_TLS=true` or `NODE_TLS_REJECT_UNAUTHORIZED=0`
 * - or **`NODE_ENV=development`** and `CONTENTFUL_STRICT_TLS` is not `true`
 *   (common with corporate proxies that add a non-system-trusted intermediate).
 * In production keep defaults; for proper TLS trust prefer `NODE_EXTRA_CA_CERTS` with your org root.
 */
function getOptionalHttpsAgent() {
  if (typeof window !== "undefined") return undefined;

  const explicitBypass =
    process.env.CONTENTFUL_ALLOW_INSECURE_TLS === "true" ||
    process.env.NODE_TLS_REJECT_UNAUTHORIZED === "0";

  const devBypass =
    process.env.NODE_ENV === "development" &&
    process.env.CONTENTFUL_STRICT_TLS !== "true";

  if (!explicitBypass && !devBypass) return undefined;

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const https = require("https") as typeof import("https");
    return new https.Agent({ rejectUnauthorized: false });
  } catch {
    return undefined;
  }
}

function getContentfulClient() {
  const httpsAgent = getOptionalHttpsAgent();

  if (!client) {
    client = createClient({
      space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID!,
      accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN!,
      environment: process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || "master",
      ...(httpsAgent ? { httpsAgent } : {}),
    });
  }
  return client;
}

export interface WritingSample {
  sys: {
    id: string;
    createdAt: string;
    updatedAt: string;
  };
  fields: {
    question: string;
    slug: string;
    image?: {
      fields: {
        file: {
          url: string;
          details: {
            image: {
              width: number;
              height: number;
            };
          };
        };
      };
    };
    answer: {
      content: Array<{
        data: {};
        content: Array<{
          data: {};
          marks: Array<{ type: string }>;
          value: string;
          nodeType: string;
        }>;
        nodeType: string;
      }>;
    };
    date: string;
    taskType: string;
    questionType: string;
  };
}

export interface BlogPost {
  sys: {
    id: string;
    createdAt: string;
    updatedAt: string;
  };
  fields: {
    title: string;
    slug: string;
    createdDate: string;
    author: string;
    category: string;
    featuredImage?: {
      fields: {
        file: {
          url: string;
          details: {
            image: {
              width: number;
              height: number;
            };
          };
        };
      };
    };
    metaTags?: string[];
    metaDescription?: string;
    body: {
      content: Array<{
        data: {};
        content: Array<{
          data: {};
          marks: Array<{ type: string }>;
          value: string;
          nodeType: string;
        }>;
        nodeType: string;
      }>;
    };
    image?: {
      fields: {
        file: {
          url: string;
          details: {
            image: {
              width: number;
              height: number;
            };
          };
        };
      };
    };
    recommendedPostsCategory?: any;
  };
}

export const getWritingSamples = async (): Promise<WritingSample[]> => {
  try {
    if (process.env.NODE_ENV === "development") {
      // console.log(
      //   "Contentful writing samples: space",
      //   process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
      // );
    }

    const response = await getContentfulClient().getEntries({
      content_type: "ieltsWriting",
      order: ["-fields.date"],
    });

    return response.items as unknown as WritingSample[];
  } catch (error) {
    console.error("Error fetching writing samples:", error);

    // Return mock data for development
    return [
      {
        sys: {
          id: "mock-1",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
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

export interface LearnPost {
  sys: {
    id: string;
    createdAt: string;
    updatedAt: string;
  };
  fields: {
    title: string;
    slug: string;
    image?: {
      fields: {
        file: {
          url: string;
          details: {
            image: {
              width: number;
              height: number;
            };
          };
        };
      };
    };
    blogText: {
      content: Array<{
        data: {};
        content: Array<{
          data: {};
          marks: Array<{ type: string }>;
          value: string;
          nodeType: string;
        }>;
        nodeType: string;
      }>;
    };
    date: string;
    learnType: string; // "IELTS Guide" | "Reading" | "Listening" | "Writing" | "Speaking"
  };
}

export const LEARN_TYPES = [
  "IELTS Guide",
  "Reading",
  "Listening",
  "Writing",
  "Speaking",
] as const;
export type LearnType = (typeof LEARN_TYPES)[number];

export const getLearnPosts = async (
  learnType?: string
): Promise<LearnPost[]> => {
  try {
    const response = await getContentfulClient().getEntries({
      content_type: "learn",
      ...(learnType ? { "fields.learnType": learnType } : {}),
      order: ["-fields.date"],
    });

    return response.items as unknown as LearnPost[];
  } catch (error) {
    console.error("Error fetching learn posts:", error);
    return [];
  }
};

export const getLearnPostBySlug = async (
  slug: string
): Promise<LearnPost | null> => {
  try {
    const response = await getContentfulClient().getEntries({
      content_type: "learn",
      "fields.slug": slug,
      limit: 1,
    });

    return (response.items[0] as unknown as LearnPost) || null;
  } catch (error) {
    console.error("Error fetching learn post:", error);
    return null;
  }
};

export const getWritingSampleBySlug = async (
  slug: string
): Promise<WritingSample | null> => {
  try {
    const response = await getContentfulClient().getEntries({
      content_type: "ieltsWriting",
      "fields.slug": slug,
      limit: 1,
    });

    return (response.items[0] as unknown as WritingSample) || null;
  } catch (error) {
    console.error("Error fetching writing sample:", error);

    // Return mock data for development
    if (slug === "sample-writing-question") {
      return {
        sys: {
          id: "mock-1",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
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
      } as WritingSample;
    }

    return null;
  }
};

export const getBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    const response = await getContentfulClient().getEntries({
      content_type: "blogPage",
      order: ["-fields.createdDate"],
    });

    return response.items as unknown as BlogPost[];
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
};

export const getBlogPostBySlug = async (
  slug: string
): Promise<BlogPost | null> => {
  try {
    const response = await getContentfulClient().getEntries({
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

export { getContentfulClient };
