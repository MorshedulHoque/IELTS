import { useEffect } from "react";

const useInitializeAnswers = ({ question, setAnswers }: any) => {
  useEffect(() => {
    const initialAnswers = question?.map((q: any) => ({
      questionId: q.question_number,
      value: "",
      answerText: "",
      isCorrect: null, // or null, since unanswered
    }));
    setAnswers(initialAnswers);
  }, [question, setAnswers]); // Re-run if question or setAnswers changes
};

export default useInitializeAnswers;
