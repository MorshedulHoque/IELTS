export type WritingPart = {
  title: string;
  subtitle: string;
  Question: string[];
  instruction: string[];
  image?: string;
};

export type WritingTest = {
  title: string;
  type: "Academic" | "General";
  duration: number;
  parts: WritingPart[];
};

export type WritingTestFormProps = {
  testData: WritingTest;
  onSubmit: (test: WritingTest) => void;
};
