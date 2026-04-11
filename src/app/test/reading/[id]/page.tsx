// app/readingQuestions/[_id]/page.tsx

import ReadingTest from "@/components/TestComponent/readingTest/ReadingTest";
import { getReadingQuestions, getSingleReadingTest } from "@/services/data";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const response = await getSingleReadingTest(id);
  const pageTitle = response?.data?.title || "IELTS Reading Test";
  return { title: pageTitle };
}

export default async function ReadingQuestionPage({
  params,
}: {
  params: { id: string };
}) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  // const res = await fetch(
  //   `${process.env.NEXT_PUBLIC_BASE_URL}/api/questions/readingQuestions/${id}`,
  //   { cache: "no-store" }
  // );

  const response = await getReadingQuestions(id);

  // const response = await res.json();

  if (!response.success || !response.data) {
    return <div className="text-center p-4">No reading test found.</div>;
  }

  const test: any = response.data;

  return (
    <div>
      <ReadingTest test={test} />
    </div>
  );
}
