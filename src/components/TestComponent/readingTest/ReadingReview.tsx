 "use client";
 
 import Image from "next/image";
 import React, { useEffect, useMemo, useRef, useState } from "react";
 import TrueFalse from "../Common/TrueFalse";
 import FillInTheBlanks from "../Common/FillInTheBlanks";
 import MatchingHeadings from "../Common/MatchingHeadings";
 import ParagraphMatching from "../Common/ParagraphMatching";
 import McqSingle from "../Common/McqSingle";
 import PassFillInTheBlanks from "../Common/PassFillInTheBlanks";
 import McqMultiple from "../Common/McqMultiple";
 import SumFillInTheBlanks from "../Common/SumFillInTheBlanks";
 import SubFillInTheBlanks from "../Common/SubFillInTheBlanks";
 import TextHighlighter from "./TextHighlighter";
 
 type SubmittedAnswer = {
   questionId: number | string;
   value?: string;
   answers?: any[];
   answerText?: any;
   isCorrect?: boolean;
   questionGroup?: number[];
   questionType?: string;
 };
 
 function getAnswerValue(answers: SubmittedAnswer[], questionNumber: number): string {
   const found = answers?.find((a) => String(a.questionId) === String(questionNumber));
   return found?.value ?? "";
 }
 
 export default function ReadingReview({
   test,
   submissionAnswers,
 }: {
   test: any;
   submissionAnswers: SubmittedAnswer[];
 }) {
   const [currentPartIndex, setCurrentPartIndex] = useState(0);
   const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1);
   const [leftPanelWidth, setLeftPanelWidth] = useState<number>(50);
   const [isResizing, setIsResizing] = useState(false);
 
   const passageContainerRef = useRef<HTMLDivElement>(null);
   const questionsContainerRef = useRef<HTMLDivElement>(null);
 
   const currentPart = test.parts[currentPartIndex];
 
   const handleMouseDown = (e: React.MouseEvent) => {
     setIsResizing(true);
     e.preventDefault();
   };
 
   const handleMouseMove = (e: MouseEvent) => {
     if (!isResizing) return;
     const container = document.querySelector(".resize-container-review");
     if (!container) return;
     const rect = container.getBoundingClientRect();
     const newLeftWidth = ((e.clientX - rect.left) / rect.width) * 100;
     const constrainedWidth = Math.min(Math.max(newLeftWidth, 20), 80);
     setLeftPanelWidth(constrainedWidth);
   };
 
   const handleMouseUp = () => setIsResizing(false);
 
   useEffect(() => {
     if (isResizing) {
       document.addEventListener("mousemove", handleMouseMove);
       document.addEventListener("mouseup", handleMouseUp);
       document.body.style.cursor = "col-resize";
       document.body.style.userSelect = "none";
     } else {
       document.removeEventListener("mousemove", handleMouseMove);
       document.removeEventListener("mouseup", handleMouseUp);
       document.body.style.cursor = "";
       document.body.style.userSelect = "";
     }
 
     return () => {
       document.removeEventListener("mousemove", handleMouseMove);
       document.removeEventListener("mouseup", handleMouseUp);
       document.body.style.cursor = "";
       document.body.style.userSelect = "";
     };
   }, [isResizing]);
 
   const partQuestions = useMemo(() => {
     const map: { [key: number]: number[] } = {};
     test.parts.forEach((part: any, partIndex: number) => {
       const nums: number[] = [];
       part.questions.forEach((questionSet: any) => {
         if (questionSet.true_false_not_given)
           questionSet.true_false_not_given.forEach((q: any) => nums.push(q.question_number));
         if (questionSet.fill_in_the_blanks)
           questionSet.fill_in_the_blanks.forEach((q: any) => nums.push(q.question_number));
         if (questionSet.matching_headings)
           questionSet.matching_headings.forEach((q: any) => nums.push(q.question_number));
         if (questionSet.paragraph_matching)
           questionSet.paragraph_matching.forEach((q: any) => nums.push(q.question_number));
         if (questionSet.mcq) questionSet.mcq.forEach((q: any) => nums.push(q.question_number));
         if (questionSet.multiple_mcq) {
           questionSet.multiple_mcq.forEach((q: any) => {
             if (Array.isArray(q.question_numbers)) q.question_numbers.forEach((n: number) => nums.push(n));
             else if (q.question_number) nums.push(q.question_number);
           });
         }
         if (questionSet.passage_fill_in_the_blanks) {
           questionSet.passage_fill_in_the_blanks.forEach((q: any) => {
             if (Array.isArray(q.question_number)) q.question_number.forEach((n: number) => nums.push(n));
             else if (q.question_number) nums.push(q.question_number);
             // also add blank numbers if present
             if (Array.isArray(q.blanks)) q.blanks.forEach((b: any) => b.blank_number && nums.push(b.blank_number));
           });
         }
         if (questionSet.summary_fill_in_the_blanks) {
           questionSet.summary_fill_in_the_blanks.forEach((q: any) => {
             if (Array.isArray(q.question_numbers)) q.question_numbers.forEach((n: number) => nums.push(n));
             else if (q.question_number) nums.push(q.question_number);
           });
         }
         if (questionSet.fill_in_the_blanks_with_subtitle) {
           questionSet.fill_in_the_blanks_with_subtitle.forEach((blankSet: any) => {
             blankSet.questions?.forEach((q: any) => nums.push(q.question_number));
           });
         }
       });
       map[partIndex] = Array.from(new Set(nums)).sort((a, b) => a - b);
     });
     return map;
   }, [test.parts]);
 
   useEffect(() => {
     const first = partQuestions[currentPartIndex]?.[0];
     if (typeof first === "number") setCurrentQuestionNumber(first);
   }, [currentPartIndex, partQuestions]);
 
   const handleQuestionFocus = (questionId: number) => {
     setCurrentQuestionNumber(questionId);
   };
 
   const handleQuestionNavigation = (questionNumber: number, partIndex: number) => {
     setCurrentPartIndex(partIndex);
     setCurrentQuestionNumber(questionNumber);
     setTimeout(() => {
       const el = document.getElementById(`question-${questionNumber}`);
       if (el && questionsContainerRef.current) {
         const container = questionsContainerRef.current;
         const containerRect = container.getBoundingClientRect();
         const questionRect = el.getBoundingClientRect();
         container.scrollTo({
           top: container.scrollTop + (questionRect.top - containerRect.top) - 50,
           behavior: "smooth",
         });
       }
     }, 200);
   };
 
   const handleNextPart = () => {
     if (currentPartIndex < test.parts.length - 1) {
       setCurrentPartIndex((p) => p + 1);
       passageContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
       questionsContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
     }
   };
 
   const handlePrevPart = () => {
     if (currentPartIndex > 0) {
       setCurrentPartIndex((p) => p - 1);
       passageContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
       questionsContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
     }
   };
 
   // Convert submission answers to the same "answers array" shape used by the test UI widgets
   const answersArray = useMemo(() => submissionAnswers || [], [submissionAnswers]);
 
   return (
     <div className="w-full">
       <div className="card bg-base-100 shadow-xl mb-4">
         <div className="py-2 px-6">
           <h2 className="card-title text-xl">{test.title}</h2>
           <div className="flex justify-between items-center">
             <div>
               <p className="text-base text-gray-600">
                 Review mode (your submitted answers are pre-filled)
               </p>
             </div>
             <div className="badge bg-red-600 text-white border-0">
               Part {currentPartIndex + 1} of {test.parts.length}
             </div>
           </div>
         </div>
       </div>
 
       <div className="resize-container-review flex overflow-hidden border rounded-lg">
         {/* Passage (Left) */}
         <div
           ref={passageContainerRef}
           className="h-[70vh] overflow-y-auto p-4 border-r-2 bg-white"
           style={{ width: `${leftPanelWidth}%` }}
         >
           <h2 className="text-2xl font-bold mb-4 text-center">
             {currentPart.passage_title}
           </h2>
 
           {currentPart?.image && (
             <Image
               src={currentPart.image}
               alt={currentPart.passage_title}
               width={600}
               height={400}
               className="rounded-lg mb-4"
               unoptimized
             />
           )}
 
           <div className="prose max-w-none space-y-4">
             <TextHighlighter content={currentPart.passage} />
           </div>
         </div>
 
         {/* Resize Handle */}
         <div
           className="w-1 bg-gray-300 hover:bg-gray-400 cursor-col-resize flex-shrink-0 relative group"
           onMouseDown={handleMouseDown}
         >
           <div className="absolute inset-0 w-3 -left-1 cursor-col-resize"></div>
           <div className="w-full h-full flex items-center justify-center">
             <div className="w-0.5 h-8 bg-gray-400 group-hover:bg-gray-500 rounded"></div>
           </div>
         </div>
 
         {/* Questions (Right) */}
         <div
           ref={questionsContainerRef}
           className="h-[70vh] overflow-y-auto p-4 border-l bg-white"
           style={{ width: `${100 - leftPanelWidth}%` }}
         >
           <div className="space-y-6">
             {currentPart.questions?.map((question: any, index: number) => {
               const createQuestionIds = (): number[] => {
                 const questionIds: number[] = [];
                 if (question.true_false_not_given)
                   question.true_false_not_given.forEach((q: any) =>
                     questionIds.push(q.question_number)
                   );
                 if (question.fill_in_the_blanks)
                   question.fill_in_the_blanks.forEach((q: any) =>
                     questionIds.push(q.question_number)
                   );
                 if (question.matching_headings)
                   question.matching_headings.forEach((q: any) =>
                     questionIds.push(q.question_number)
                   );
                 if (question.paragraph_matching)
                   question.paragraph_matching.forEach((q: any) =>
                     questionIds.push(q.question_number)
                   );
                 if (question.mcq)
                   question.mcq.forEach((q: any) => questionIds.push(q.question_number));
                 if (question.multiple_mcq) {
                   question.multiple_mcq.forEach((q: any) => {
                     if (Array.isArray(q.question_numbers)) q.question_numbers.forEach((n: number) => questionIds.push(n));
                     else if (q.question_number) questionIds.push(q.question_number);
                   });
                 }
                 if (question.passage_fill_in_the_blanks) {
                   question.passage_fill_in_the_blanks.forEach((q: any) => {
                     if (Array.isArray(q.question_number)) q.question_number.forEach((n: number) => questionIds.push(n));
                     else if (q.question_number) questionIds.push(q.question_number);
                     if (Array.isArray(q.blanks)) q.blanks.forEach((b: any) => b.blank_number && questionIds.push(b.blank_number));
                   });
                 }
                 if (question.summary_fill_in_the_blanks) {
                   question.summary_fill_in_the_blanks.forEach((q: any) => {
                     if (Array.isArray(q.question_numbers)) q.question_numbers.forEach((n: number) => questionIds.push(n));
                     else if (q.question_number) questionIds.push(q.question_number);
                   });
                 }
                 if (question.fill_in_the_blanks_with_subtitle) {
                   question.fill_in_the_blanks_with_subtitle.forEach((blankSet: any) => {
                     blankSet.questions?.forEach((q: any) => questionIds.push(q.question_number));
                   });
                 }
                 return questionIds;
               };
 
               const questionIds = createQuestionIds();
               const firstQuestionNumber = questionIds[0] || index + 1;
 
               return (
                 <div
                   key={index}
                   id={`question-${firstQuestionNumber}`}
                   data-question-numbers={questionIds.join(",")}
                 >
                   {question.true_false_not_given && (
                     <TrueFalse
                       readOnly
                       answers={answersArray}
                       instructions={currentPart.questions[index]?.instructions || ""}
                       question={question.true_false_not_given}
                       handleAnswerChange={() => {}}
                       handleQuestionFocus={handleQuestionFocus}
                     />
                   )}
 
                   {question.fill_in_the_blanks && (
                     <FillInTheBlanks
                       readOnly
                       answers={answersArray}
                       instructions={currentPart.questions[index]?.instructions || ""}
                       question={question.fill_in_the_blanks}
                       handleAnswerChange={() => {}}
                       handleQuestionFocus={handleQuestionFocus}
                     />
                   )}
 
                   {question.matching_headings && (
                     <MatchingHeadings
                       readOnly
                       answers={answersArray}
                       instructions={currentPart.questions[index]?.instructions || ""}
                       question={question.matching_headings}
                       handleAnswerChange={() => {}}
                       handleQuestionFocus={handleQuestionFocus}
                     />
                   )}
 
                   {question.paragraph_matching && (
                     <ParagraphMatching
                       readOnly
                       answers={answersArray}
                       instructions={currentPart.questions[index]?.instructions || ""}
                       question={question.paragraph_matching}
                       handleAnswerChange={() => {}}
                       handleQuestionFocus={handleQuestionFocus}
                     />
                   )}
 
                   {question.mcq && (
                     <McqSingle
                       readOnly
                       instructions={currentPart.questions[index]?.instructions || ""}
                       question={question.mcq}
                       answers={answersArray}
                       handleAnswerChange={() => {}}
                       handleQuestionFocus={handleQuestionFocus}
                     />
                   )}
 
                   {question.multiple_mcq && (
                     <McqMultiple
                       readOnly
                       instructions={currentPart.questions[index]?.instructions || ""}
                       question={question.multiple_mcq}
                       answers={answersArray}
                       handleAnswerChange={() => {}}
                       handleQuestionFocus={handleQuestionFocus}
                     />
                   )}
 
                   {question.passage_fill_in_the_blanks && (
                     <PassFillInTheBlanks
                       readOnly
                       answers={answersArray}
                       instructions={currentPart.questions[index]?.instructions || ""}
                       question={question.passage_fill_in_the_blanks}
                       handleAnswerChange={() => {}}
                       handleQuestionFocus={handleQuestionFocus}
                     />
                   )}
 
                   {question.summary_fill_in_the_blanks && (
                     <SumFillInTheBlanks
                       readOnly
                       answers={answersArray}
                       instructions={currentPart.questions[index]?.instructions || ""}
                       question={question.summary_fill_in_the_blanks}
                       handleAnswerChange={() => {}}
                       handleQuestionFocus={handleQuestionFocus}
                     />
                   )}
 
                   {question.fill_in_the_blanks_with_subtitle && (
                     <SubFillInTheBlanks
                       readOnly
                       answers={answersArray}
                       instructions={currentPart.questions[index]?.instructions || ""}
                       question={question.fill_in_the_blanks_with_subtitle}
                       handleAnswerChange={() => {}}
                       handleQuestionFocus={handleQuestionFocus}
                     />
                   )}
                 </div>
               );
             })}
           </div>
         </div>
       </div>
 
       {/* Bottom navigation (same feel as test UI) */}
       <div className="mt-4 bg-white border border-gray-200 rounded-lg shadow-sm">
         <div className="px-4 py-2">
           <div className="flex justify-between items-center gap-2">
             <button
               onClick={handlePrevPart}
               disabled={currentPartIndex === 0}
               className="btn bg-red-600 hover:bg-red-700 border-0 disabled:bg-gray-400 disabled:cursor-not-allowed text-white"
               type="button"
             >
               Previous
             </button>
 
             <div className="flex justify-center flex-1 overflow-x-auto">
               {test.parts.map((part: any, partIndex: number) => (
                 <div key={partIndex} className="flex-1 flex justify-center min-w-[200px]">
                   <div className="border-2 border-gray-300 rounded-lg p-1 flex gap-0.5 justify-center flex-wrap">
                     {partQuestions[partIndex]?.map((questionNumber: number) => {
                       const hasAnswered = !!getAnswerValue(answersArray, questionNumber)?.trim();
                       return (
                         <button
                           key={`${questionNumber}-${partIndex}`}
                           type="button"
                           className={`w-7 h-7 text-xs rounded border transition-colors ${
                             questionNumber === currentQuestionNumber
                               ? "bg-blue-500 text-white border-blue-500"
                               : hasAnswered
                               ? "bg-green-200 text-green-700 border-green-400 hover:bg-green-300"
                               : "bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300"
                           }`}
                           onClick={() => handleQuestionNavigation(questionNumber, partIndex)}
                         >
                           {questionNumber}
                         </button>
                       );
                     })}
                   </div>
                 </div>
               ))}
             </div>
 
             <button
               onClick={handleNextPart}
               disabled={currentPartIndex === test.parts.length - 1}
               className="btn bg-red-600 hover:bg-red-700 border-0 disabled:bg-gray-400 disabled:cursor-not-allowed text-white"
               type="button"
             >
               Next
             </button>
           </div>
         </div>
       </div>
     </div>
   );
 }

