 "use client";
 
 import React, { useEffect, useMemo, useState } from "react";
 import SubFillInTheBlanks from "../Common/SubFillInTheBlanks";
 import McqSingle from "../Common/McqSingle";
 import McqMultiple from "../Common/McqMultiple";
 import BoxMatching from "../Common/BoxMatching";
 import Map from "../Common/Map";
 
 type SubmittedAnswer = {
   questionId: number | string;
   value?: string;
   answerText?: any;
   isCorrect?: boolean;
   questionGroup?: number[];
   questionType?: string;
 };
 
 export default function ListeningReview({
   test,
   submissionAnswers,
 }: {
   test: any;
   submissionAnswers: SubmittedAnswer[];
 }) {
   const [currentPartIndex, setCurrentPartIndex] = useState(0);
   const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1);
 
   const currentPart = test.parts[currentPartIndex];
 
   const answersArray = useMemo(() => submissionAnswers || [], [submissionAnswers]);
   const answersRecord = useMemo(() => {
     const record: Record<string, any> = {};
     (submissionAnswers || []).forEach((a) => {
       record[String(a.questionId)] = { value: a.value ?? "" };
     });
     return record;
   }, [submissionAnswers]);
 
   const partQuestions = useMemo(() => {
     const map: { [key: number]: number[] } = {};
     test.parts.forEach((part: any, partIndex: number) => {
       const nums: number[] = [];
       part.questions.forEach((questionSet: any) => {
         if (questionSet.fill_in_the_blanks_with_subtitle) {
           questionSet.fill_in_the_blanks_with_subtitle.forEach((blankSet: any) => {
             blankSet.questions?.forEach((q: any) => nums.push(q.question_number));
           });
         }
         if (questionSet.mcq) questionSet.mcq.forEach((q: any) => nums.push(q.question_number));
         if (questionSet.multiple_mcq) {
           questionSet.multiple_mcq.forEach((q: any) => {
             q.question_numbers?.forEach((n: number) => nums.push(n));
           });
         }
         if (questionSet.box_matching) {
           questionSet.box_matching.forEach((q: any) => {
             q.questions?.forEach((qq: any) => nums.push(qq.question_number));
           });
         }
         if (questionSet.map) {
           questionSet.map.forEach((m: any) => {
             m.questions?.forEach((qq: any) => nums.push(qq.question_number));
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
 
   const handleQuestionFocus = (questionId: number) => setCurrentQuestionNumber(questionId);
 
   const handleQuestionNavigation = (questionNumber: number, partIndex: number) => {
     setCurrentPartIndex(partIndex);
     setCurrentQuestionNumber(questionNumber);
     setTimeout(() => {
       const questionElement = document.getElementById(`question-${questionNumber}`);
       if (questionElement) {
         questionElement.scrollIntoView({ behavior: "smooth", block: "start" });
       }
     }, 200);
   };
 
   const handleNextPart = () => {
     if (currentPartIndex < test.parts.length - 1) setCurrentPartIndex((p) => p + 1);
   };
 
   const handlePrevPart = () => {
     if (currentPartIndex > 0) setCurrentPartIndex((p) => p - 1);
   };
 
   return (
     <div className="w-full">
       <div className="card bg-base-100 shadow-xl mb-2">
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
 
       {/* Audio Player */}
       <div className="card bg-base-100 shadow-xl mb-2">
         <div className="card-body py-2">
           <audio controls className="w-full">
             <source src={test.audioUrl} type="audio/mpeg" />
             Your browser does not support the audio element.
           </audio>
         </div>
       </div>
 
       {/* Questions Section */}
       <div className="card bg-base-100 shadow-xl overflow-y-auto">
         <div className="card-body px-6 md:px-16 lg:px-32">
           <h2 className="text-2xl font-bold mb-4">{currentPart.title}</h2>
           <div className="space-y-6">
             {currentPart.questions?.map((questionSet: any, index: any) => {
               const ids: number[] = [];
               if (questionSet.fill_in_the_blanks_with_subtitle) {
                 questionSet.fill_in_the_blanks_with_subtitle.forEach((blankSet: any) => {
                   blankSet.questions?.forEach((q: any) => ids.push(q.question_number));
                 });
               }
               if (questionSet.mcq) questionSet.mcq.forEach((q: any) => ids.push(q.question_number));
               if (questionSet.multiple_mcq) {
                 questionSet.multiple_mcq.forEach((q: any) => q.question_numbers?.forEach((n: number) => ids.push(n)));
               }
               if (questionSet.box_matching) {
                 questionSet.box_matching.forEach((q: any) => q.questions?.forEach((qq: any) => ids.push(qq.question_number)));
               }
               if (questionSet.map) {
                 questionSet.map.forEach((m: any) => m.questions?.forEach((qq: any) => ids.push(qq.question_number)));
               }
               const firstId = ids[0] || index + 1;
 
               return (
                 <div key={index} id={`question-${firstId}`} data-question-numbers={ids.join(",")}>
                   {questionSet.fill_in_the_blanks_with_subtitle && (
                     <SubFillInTheBlanks
                       readOnly
                       answers={answersArray}
                       instructions={questionSet.instruction}
                       question={questionSet.fill_in_the_blanks_with_subtitle}
                       handleAnswerChange={() => {}}
                       handleQuestionFocus={handleQuestionFocus}
                     />
                   )}
                   {questionSet.mcq && (
                     <McqSingle
                       readOnly
                       instructions={questionSet.instruction}
                       question={questionSet.mcq}
                       answers={answersArray}
                       handleAnswerChange={() => {}}
                       handleQuestionFocus={handleQuestionFocus}
                     />
                   )}
                   {questionSet.multiple_mcq && (
                     <McqMultiple
                       readOnly
                       instructions={questionSet.instruction}
                       question={questionSet.multiple_mcq}
                       answers={answersArray}
                       handleAnswerChange={() => {}}
                       handleQuestionFocus={handleQuestionFocus}
                     />
                   )}
                   {questionSet.box_matching && (
                     <BoxMatching
                       readOnly
                       answers={answersArray}
                       instructions={questionSet.instruction}
                       question={questionSet.box_matching}
                       handleAnswerChange={() => {}}
                       handleQuestionFocus={handleQuestionFocus}
                     />
                   )}
                   {questionSet.map && (
                     <Map
                       readOnly
                       question={questionSet.map[0]}
                       handleAnswerChange={() => {}}
                       handleQuestionFocus={handleQuestionFocus}
                       answers={answersRecord}
                     />
                   )}
                 </div>
               );
             })}
           </div>
         </div>
       </div>
 
       {/* Bottom navigation (like test UI) */}
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
                   <div className="border-2 border-gray-300 rounded-lg p-2 flex flex-wrap gap-1 justify-center">
                     {partQuestions[partIndex]?.map((questionNumber: number) => {
                       const hasAnswered = !!answersRecord[String(questionNumber)]?.value?.trim();
                       return (
                         <button
                           key={`${questionNumber}-${partIndex}`}
                           type="button"
                           className={`w-8 h-8 text-xs rounded border transition-colors ${
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

