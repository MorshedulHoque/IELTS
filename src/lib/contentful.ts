import { createClient } from 'contentful';

const client = createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID!,
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN!,
  environment: process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || 'master',
});

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
    // First, let's check if we can connect to Contentful
    console.log('Attempting to connect to Contentful...');
    console.log('Space ID:', process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID);
    console.log('Token (first 10 chars):', process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN?.substring(0, 10) + '...');
    
    const response = await client.getEntries({
      content_type: 'ieltsWriting', // Adjust this based on your Contentful content type
      order: ['-fields.date'], // Sort by date descending
    });
    
    console.log('Successfully fetched', response.items.length, 'samples');
    return response.items as unknown as WritingSample[];
  } catch (error) {
    console.error('Error fetching writing samples:', error);
    
    // Return mock data for development
    return [
      {
        sys: {
          id: 'mock-1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        fields: {
          question: 'Sample Writing Question - This is a mock question for testing purposes.',
          slug: 'sample-writing-question',
          date: new Date().toISOString(),
          taskType: 'Task 1',
          questionType: 'Academic',
          answer: {
            content: [
              {
                data: {},
                content: [
                  {
                    data: {},
                    marks: [],
                    value: 'This is a sample answer to demonstrate the writing samples functionality. In a real scenario, this would be fetched from Contentful.',
                    nodeType: 'text',
                  },
                ],
                nodeType: 'paragraph',
              },
            ],
          },
        },
      },
    ] as WritingSample[];
  }
};

export const getWritingSampleBySlug = async (slug: string): Promise<WritingSample | null> => {
  try {
    const response = await client.getEntries({
      content_type: 'ieltsWriting',
      'fields.slug': slug,
      limit: 1,
    });
    
    return (response.items[0] as unknown as WritingSample) || null;
  } catch (error) {
    console.error('Error fetching writing sample:', error);
    
    // Return mock data for development
    if (slug === 'sample-writing-question') {
      return {
        sys: {
          id: 'mock-1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        fields: {
          question: 'Sample Writing Question - This is a mock question for testing purposes.',
          slug: 'sample-writing-question',
          date: new Date().toISOString(),
          taskType: 'Task 1',
          questionType: 'Academic',
          answer: {
            content: [
              {
                data: {},
                content: [
                  {
                    data: {},
                    marks: [],
                    value: 'This is a sample answer to demonstrate the writing samples functionality. In a real scenario, this would be fetched from Contentful.',
                    nodeType: 'text',
                  },
                ],
                nodeType: 'paragraph',
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
    const response = await client.getEntries({
      content_type: 'blogPage',
      order: ['-fields.createdDate'],
    });

    return response.items as unknown as BlogPost[];
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
};

export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  try {
    const response = await client.getEntries({
      content_type: 'blogPage',
      'fields.slug': slug,
      limit: 1,
    });

    return (response.items[0] as unknown as BlogPost) || null;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
};

export default client;
