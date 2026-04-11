"use client";
import React, { useState, useEffect, useRef } from "react";
import Loader from '@/components/Common/Loader';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import { FaMicrophone, FaStop, FaPlay, FaPause, FaClock, FaCheck, FaArrowRight } from "react-icons/fa";
import { postSubmitSpeakingTest, analyzeSpeakingAudio } from "@/services/data";

interface SpeakingTestProps {
  test: {
    _id: string;
    title: string;
    type: "part1" | "part2" | "part3" | "full_test";
    questions: Array<{
      question_number: number;
      question: string;
      question_type: string;
      preparation_time?: number;
      speaking_time: number;
      instructions?: string;
    }>;
  };
}

const SpeakingTest: React.FC<SpeakingTestProps> = ({ test }) => {
  const router = useRouter();
  const { data: session }: any = useSession();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [preparationTimeLeft, setPreparationTimeLeft] = useState(0);
  const [isPreparationPhase, setIsPreparationPhase] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const prepTimerRef = useRef<NodeJS.Timeout | null>(null);

  const currentQuestion = test.questions[currentQuestionIndex];

  const renderQuestionText = (text: string) => {
    // Render cue card style: detect lines and bullets
    const lines = text.split(/\r?\n/);
    const parts: React.ReactNode[] = [];
    let inBullets = false;
    let bulletItems: string[] = [];
    let hasRenderedTitle = false;

    const flushBullets = () => {
      if (bulletItems.length > 0) {
        parts.push(
          <ul key={`ul-${parts.length}`} className="list-disc pl-6 space-y-1">
            {bulletItems.map((item, idx) => (
              <li key={idx} className="text-lg text-gray-700">{item}</li>
            ))}
          </ul>
        );
        bulletItems = [];
      }
    };

    lines.forEach((line, idx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('- ')) {
        inBullets = true;
        bulletItems.push(trimmed.slice(2));
      } else if (trimmed.length === 0) {
        // blank line
        flushBullets();
        parts.push(<div key={`br-${idx}`} className="h-2" />);
        inBullets = false;
      } else {
        // normal paragraph or header
        flushBullets();
        if (!hasRenderedTitle) {
          parts.push(
            <p key={`p-${idx}`} className="text-2xl font-semibold text-gray-800 mb-3">{line}</p>
          );
          hasRenderedTitle = true;
        } else if (trimmed.toLowerCase() === 'you should say:' || trimmed.toLowerCase() === 'you should say') {
          parts.push(
            <p key={`p-${idx}`} className="font-semibold text-gray-800 mb-2">{line}</p>
          );
        } else {
          parts.push(
            <p key={`p-${idx}`} className="text-lg text-gray-700 mb-2">{line}</p>
          );
        }
        inBullets = false;
      }
    });

    flushBullets();
    return <>{parts}</>;
  };

  useEffect(() => {
    // Initialize timers based on question type
    if (currentQuestion.question_type === "cue_card" && currentQuestion.preparation_time) {
      setPreparationTimeLeft(currentQuestion.preparation_time * 60);
      setIsPreparationPhase(true);
    } else {
      setTimeLeft(currentQuestion.speaking_time * 60);
      setIsPreparationPhase(false);
    }
  }, [currentQuestion]);

  useEffect(() => {
    if (isPreparationPhase && preparationTimeLeft > 0) {
      prepTimerRef.current = setInterval(() => {
        setPreparationTimeLeft((prev) => {
          if (prev <= 1) {
            setIsPreparationPhase(false);
            setTimeLeft(currentQuestion.speaking_time * 60);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    // Remove automatic time-based progression - let user control manually
    if (!isPreparationPhase && timeLeft > 0 && isRecording) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Just stop the timer, don't force progression
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (prepTimerRef.current) clearInterval(prepTimerRef.current);
    };
  }, [isPreparationPhase, preparationTimeLeft, timeLeft, isRecording, currentQuestion]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        setRecordedAudio(audioBlob);
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setIsPaused(false);
      toast.success("Recording started! Continue through all questions.");
    } catch (error) {
      console.error("Error starting recording:", error);
      toast.error("Failed to start recording. Please check microphone permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      setIsPaused(false);
      toast.success("Recording stopped! Submitting your complete test.");
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      toast.info("Recording paused");
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      toast.info("Recording resumed");
    }
  };

  const handleStopRecording = () => {
    stopRecording();
    setTimeLeft(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < test.questions.length - 1) {
      // Mark current question as answered
      setAnsweredQuestions(prev => new Set([...prev, currentQuestion.question_number]));
      
      // Move to next question
      setCurrentQuestionIndex(prev => prev + 1);
      
      // Reset timer for new question
      setTimeLeft(currentQuestion.speaking_time * 60);
      
      toast.info("Moving to next question. Recording continues...");
    } else {
      // All questions completed, stop recording and submit
      setAnsweredQuestions(prev => new Set([...prev, currentQuestion.question_number]));
      handleStopRecording();
    }
  };

  const handleSubmit = async () => {
    if (!recordedAudio || !session?.user?.id) {
      toast.error("No recording available or user not authenticated");
      return;
    }

    setIsProcessing(true);

    try {
      console.log("Starting submission process...");
      console.log("Session user ID:", session.user.id);
      console.log("Test ID:", test._id);
      console.log("Total questions answered:", answeredQuestions.size);

      // Upload audio to Cloudinary
      console.log("Uploading audio to Cloudinary...");
      const formData = new FormData();
      formData.append('audio', recordedAudio, 'speaking-test.wav');

      const uploadResponse = await fetch('/api/upload/audio', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error('Upload response error:', {
          status: uploadResponse.status,
          statusText: uploadResponse.statusText,
          body: errorText
        });
        throw new Error(`Upload failed: ${uploadResponse.status} - ${uploadResponse.statusText}`);
      }

      const uploadResult = await uploadResponse.json();
      console.log("Cloudinary upload result:", uploadResult);

      if (!uploadResult.success) {
        console.error('Upload result error:', uploadResult);
        throw new Error(uploadResult.error || uploadResult.details || 'Upload failed');
      }

      const audioUrl = uploadResult.audioUrl;
      const cloudinaryPublicId = uploadResult.publicId;

      // For demo purposes, we'll use a mock transcript
      // In a real implementation, you'd send the audio to a transcription service
      const mockTranscript = "This is a sample transcript of the complete speaking test. Um, I think that uh, like, you know, this is just a demonstration of the filler word detection system for the entire part.";

      console.log("Calling analyzeSpeakingAudio...");
      // Analyze the transcript
      const analysisResult = await analyzeSpeakingAudio({
        audioUrl: audioUrl,
        transcript: mockTranscript,
        recordingDuration: 120 // Total duration for the part
      });

      console.log("Analysis result:", analysisResult);

      if (analysisResult.success) {
        setAnalysis(analysisResult.data);

        // Submit the answer with Cloudinary URL
        const submissionData = {
          userId: session.user.id,
          testId: test._id,
          testType: test.type,
          questionNumbers: Array.from(answeredQuestions),
          audioFile: audioUrl,
          cloudinaryPublicId: cloudinaryPublicId,
          feedback: analysisResult.data
        };

        console.log("Submitting answer with data:", submissionData);
        
        // Submit to database
        const submitResult = await postSubmitSpeakingTest(submissionData);
        console.log("Submit result:", submitResult);
        
        if (submitResult.success) {
          setShowResults(true);
          toast.success("Test submitted successfully!");
        } else {
          toast.error("Failed to save test results");
        }
      } else {
        console.error("Analysis failed:", analysisResult);
        toast.error("Failed to analyze audio");
      }
    } catch (error: any) {
      console.error("Error submitting test:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // Provide more specific error messages
      if (error.message.includes("Upload failed")) {
        toast.error("Failed to upload audio. Please try again.");
      } else if (error.response?.status === 401) {
        toast.error("Authentication failed. Please log in again.");
      } else if (error.response?.status === 400) {
        toast.error("Invalid data format. Please try again.");
      } else if (error.response?.status === 500) {
        toast.error("Server error. Please try again later.");
      } else {
        toast.error(`Failed to submit test: ${error.message}`);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (showResults && analysis) {
    return (
      <div className="container mx-auto p-4 min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">Speaking Test Results</h2>
              
              {/* Audio Player */}
              {audioUrl && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Your Complete Recording</h3>
                  <audio controls className="w-full">
                    <source src={audioUrl} type="audio/wav" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}

              {/* Navigation */}
              <div className="card-actions justify-end">
                <button
                  onClick={() => router.push("/test/speaking")}
                  className="btn btn-primary"
                >
                  Back to Speaking Tests
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto">
        {/* Test Header */}
        {/* <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h1 className="card-title text-3xl">{test.title}</h1>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-lg">Type: {test.type.replace('_', ' ')}</p>
                <p className="text-lg">Question {currentQuestionIndex + 1} of {test.questions.length}</p>
                <p className="text-sm text-gray-600">
                  Questions answered: {answeredQuestions.size}/{test.questions.length}
                </p>
              </div>
              <div className="px-3 py-1 rounded-full bg-red-100 text-red-700 font-semibold text-sm">
                {currentQuestion.question_type.replace('_', ' ')}
              </div>
            </div>
          </div>
        </div> */}

        {/* Timer */}
        <div className="card bg-base-100 shadow-xl mb-2">
          <div className="card-body">
            <div className="flex items-center justify-center gap-2">
              <FaClock className="text-2xl text-red-600" />
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">
                  {isPreparationPhase 
                    ? formatTime(preparationTimeLeft) 
                    : formatTime(timeLeft)
                  }
                </div>
                <div className="text-sm text-gray-600">
                  {isPreparationPhase ? "Preparation Time" : "Speaking Time (Suggested)"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Question Display */}
        <div className="card bg-base-100 shadow-xl mb-2">
          <div className="card-body">
            {/* <h2 className="card-title text-xl mb-4">Question {currentQuestion.question_number}</h2> */}
            
            {isPreparationPhase ? (
              <div className="alert bg-red-50 mb-4">
                <FaClock className="h-4 w-4" />
                <span>Preparation Phase: Take 1 minute to prepare your answer</span>
              </div>
            ) : null}

            <div className={"bg-gray-50 p-6 rounded-lg " + (currentQuestion.question_type === 'personal' ? 'text-center' : '')}>
              {renderQuestionText(currentQuestion.question)}
              
              {currentQuestion.instructions && (
                <div className="mt-4 p-3 bg-red-50 rounded-lg">
                  <p className="text-sm text-red-700">
                    <span className="whitespace-pre-line">{currentQuestion.instructions}</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recording Controls */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            {/* {!isPreparationPhase && (
              <h3 className="card-title text-lg mb-4">Recording Controls</h3>
            )} */}
            {isPreparationPhase && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-center justify-center items-center">
                <div className="flex items-center gap-2 justify-center items-center">
                  <FaClock className="h-4 w-4 text-red-600" />
                  <span className="font-semibold">Preparation phase in progress</span>
                  <span aria-hidden className="flex items-center ml-1">
                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse ml-1" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse ml-1" style={{ animationDelay: '300ms' }}></span>
                  </span>
                </div>
                <p className="text-sm mt-1">
                  Recording control buttons will appear automatically when preparation ends.
                </p>
              </div>
            )}
            
            <div className="flex justify-center gap-4">
              {!isRecording && !recordedAudio && !isPreparationPhase && (
                <button
                  onClick={startRecording}
                  className="btn btn-lg bg-red-600 hover:bg-red-700 text-white border-none"
                  disabled={isPreparationPhase}
                >
                  <FaMicrophone className="h-5 w-5 mr-2" />
                  Start Recording
                </button>
              )}

              {isRecording && !isPaused && (
                <button
                  onClick={pauseRecording}
                  className="btn btn-lg bg-yellow-500 hover:bg-yellow-600 text-white border-none"
                >
                  <FaPause className="h-5 w-5 mr-2" />
                  Pause
                </button>
              )}

              {isRecording && isPaused && (
                <button
                  onClick={resumeRecording}
                  className="btn btn-lg bg-blue-600 hover:bg-blue-700 text-white border-none"
                >
                  <FaPlay className="h-5 w-5 mr-2" />
                  Resume
                </button>
              )}

              {isRecording && (
                <button
                  onClick={stopRecording}
                  className="btn btn-lg bg-red-700 hover:bg-red-800 text-white border-none"
                >
                  <FaStop className="h-5 w-5 mr-2" />
                  Stop Recording & Submit
                </button>
              )}

              {recordedAudio && !isRecording && (
                <button
                  onClick={handleSubmit}
                  className="btn btn-lg bg-red-600 hover:bg-red-700 text-white border-none"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <Loader message="" className="!w-6 !h-6 !border-2" />
                  ) : (
                    <>
                      <FaCheck className="h-5 w-5 mr-2" />
                      Submit Complete Test
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Next Question Button - Always available when recording */}
              {isRecording && currentQuestionIndex < test.questions.length - 1 && (
              <div className="mt-4 text-center">
                <button
                  onClick={handleNextQuestion}
                    className="btn btn-lg bg-red-500 hover:bg-red-600 text-white border-none"
                >
                  <FaArrowRight className="h-5 w-5 mr-2" />
                  Next Question
                </button>
                <p className="text-sm text-gray-600 mt-2">
                  Click when ready to move to the next question
                </p>
              </div>
            )}

            {/* Recording Status */}
            {isRecording && (
              <div className="mt-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-red-500 font-semibold">Recording...</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Keep recording through all questions
                </p>
              </div>
            )}

            {/* Progress Indicator */}
            {isRecording && (
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>{answeredQuestions.size}/{test.questions.length} questions</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(answeredQuestions.size / test.questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SpeakingTest; 