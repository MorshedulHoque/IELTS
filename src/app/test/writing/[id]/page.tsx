"use client";
import { useEffect, useState, useRef, useCallback } from 'react';
import { redirect, useParams } from 'next/navigation';
import { getSingleWritingTest, postSubmitWritingTest } from '@/services/data';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import Loader from '@/components/Common/Loader';


interface TestPart {
  title: string;
  subtitle: string;
  Question: string[];
  instruction: string[];
  image: string;
  _id: string;
}

interface WritingTest {
  title: string;
  _id: string;
  type: string;
  duration: number;
  parts: TestPart[];
}

export default function WritingTestPage() {
  const params = useParams();
  const [test, setTest] = useState<WritingTest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [wordCounts, setWordCounts] = useState<Record<string, number>>({});
  const [activeTab, setActiveTab] = useState(0);
  const [panelWidths, setPanelWidths] = useState<Record<number, number>>({
    0: 50,
    1: 50
  });
  const [isDragging, setIsDragging] = useState(false);
  const [currentTaskIndex, setCurrentTaskIndex] = useState<number | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();

  const router = useRouter();

  // Function to count words
  const countWords = (text: string): number => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  // Format time function
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const handleMouseDown = (e: React.MouseEvent, taskIndex: number) => {
    setIsDragging(true);
    setCurrentTaskIndex(taskIndex);
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || currentTaskIndex === null) return;

    const containers = document.querySelectorAll('.split-container');
    const container = containers[currentTaskIndex];
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
    
    // Limit the width between 20% and 80%
    if (newLeftWidth >= 20 && newLeftWidth <= 80) {
      setPanelWidths(prev => ({
        ...prev,
        [currentTaskIndex]: newLeftWidth
      }));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setCurrentTaskIndex(null);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, currentTaskIndex]);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const data = await getSingleWritingTest(params.id);
        if (data.success) {
          setTest(data.data);
          setTimeLeft(data.data.duration * 60); // Initialize timer
        }
      } catch (err) {
        setError('Failed to fetch writing test');
      } finally {
        setLoading(false);
      }
    };

    fetchTest();
  }, [params.id]);

  // Timer effect
  useEffect(() => {
    if (!hasStarted) return;
    if (timeLeft === 0) {
      setIsTimeUp(true);
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, hasStarted]);

  const handleResponseChange = (partId: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [partId]: value
    }));
    // Update word count
    setWordCounts(prev => ({
      ...prev,
      [partId]: countWords(value)
    }));
  };

  // Submit handler with requested data structure
  const handleSubmit = async () => {
    if (!test) return;

    const submissionTime = new Date();

    // Create answers array in the requested format
    const answers = test.parts.map(part => ({
      partId: part._id,
      question: part.Question.join(' '), // Combine question array
      response: responses[part._id] || '',
      instructions: part.instruction,
      image: part.image // Include the image URL
    }));

    // Create test data object exactly as requested
    const testData = {
      userId: session?.user?.id,
      testId: test._id,
      answers: answers,
      submittedAt: submissionTime.toLocaleString(),
    };

    console.log("Test Submission Data:", testData);

    try {
      const data = await postSubmitWritingTest(testData);
      console.log(data.success);
      if (data.success) {
        toast.success("Test Submitted successfully!");
        router.push(`/getSubmittedWritingAnswers/${testData.testId}`);
        // Optionally, redirect or reset the form
      } else {
        toast.error("Failed to submit test. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred while creating the test.");
    }
  };


  if (loading) {
    return <Loader message="Loading writing test..." />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="alert alert-error max-w-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Error: {error}</span>
        </div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="alert alert-warning max-w-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span>Test not found</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 h-screen overflow-hidden flex flex-col">
      {!hasStarted && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-900/60 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="writing-start-title"
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
          >
            <div className="p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-red-100 text-red-700 p-3">
                  {/* writing icon */}
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 19l7-7 3 3-7 7-3-3z" fill="currentColor"/>
                    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" fill="currentColor"/>
                    <path d="M2 2l7.586 7.586" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M11 13H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 id="writing-start-title" className="text-xl font-semibold leading-tight text-gray-900">
                    Ready to begin your Writing test?
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    The timer will start as soon as you click <strong>Start Test</strong>.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                  <div className="text-xs uppercase tracking-wide text-red-600 font-medium">Duration</div>
                  <div className="text-sm font-semibold text-gray-900">{test.duration} min</div>
                </div>
                <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                  <div className="text-xs uppercase tracking-wide text-red-600 font-medium">Tasks</div>
                  <div className="text-sm font-semibold text-gray-900">{test.parts?.length || 2}</div>
                </div>
                <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                  <div className="text-xs uppercase tracking-wide text-red-600 font-medium">Type</div>
                  <div className="text-sm font-semibold text-gray-900">{test.type}</div>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => { if (typeof window !== 'undefined') window.history.back(); }}
                >
                  Back
                </button>
                <button
                  autoFocus
                  type="button"
                  className="px-5 py-2.5 text-sm font-medium text-white bg-red-700 hover:bg-red-800 rounded-lg shadow-md transition-colors"
                  onClick={() => {
                    const durationMin = test.duration || 60;
                    setTimeLeft(durationMin * 60);
                    setHasStarted(true);
                  }}
                >
                  Start Test
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Exam Header */}
      <div className="card bg-base-100 shadow-xl mb-2">
        <div className="py-4 px-6">
          <h2 className="card-title text-2xl">{test.title}</h2>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg">Duration: {test.duration} minutes</p>
            </div>
            <div className="text-lg font-bold text-red-600 px-4 bg-red-50 rounded-lg border border-red-200">
              {formatTime(timeLeft)}
              {isTimeUp && (
                <span className="text-red-500 font-bold"> - Time's up!</span>
              )}
            </div>
            <div className="badge bg-red-600 hover:bg-red-700 text-white border-0">
              Task {activeTab + 1} of {test.parts.length}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="card bg-base-100 shadow-xl flex-1 overflow-hidden flex flex-col">
        <div className="card-body flex-1 overflow-hidden p-4">
          {/* Tab Content */}
          {test.parts.map((part: TestPart, index: number) => (
            <div 
              key={part._id} 
              className={`h-full ${activeTab === index ? 'block' : 'hidden'}`}
            >
              <h2 className="text-2xl font-semibold mb-4">{part.title}</h2>
              
              <div className="split-container flex relative h-[calc(100vh-250px)]">
                {/* Left Side - Question and Instructions */}
                <div 
                  className="bg-base-200 p-4 rounded-lg overflow-auto"
                  style={{ width: `${panelWidths[index]}%` }}
                >
                  <h3 className="mb-2">{part.subtitle}</h3>

                  <div className="prose max-w-none mb-4 border border-gray-300 rounded-lg p-4 bg-gray-50 font-semibold">
                    {Array.isArray(part.Question) && part.Question.length > 0 ? (
                      part.Question.map((question, index) => (
                        <p key={index} className="mb-2 whitespace-pre-line leading-relaxed italic">{question}</p>
                      ))
                    ) : (
                      <p>No questions available.</p>
                    )}
                  </div>

                  {part.image && (
                    <div className="my-4">
                      <img
                        src={part.image}
                        alt={part.title}
                        className="rounded-lg max-w-full h-auto mx-auto"
                      />
                    </div>
                  )}

                  <div className="mt-6 p-4 rounded-lg">
                    {Array.isArray(part.instruction) && part.instruction.length > 0 ? (
                      part.instruction.map((instruction, index) => (
                        <p key={index}>{instruction}</p>
                      ))
                    ) : (
                      <p>No instructions available.</p>
                    )}
                  </div>
                </div>

                {/* Resizer */}
                <div
                  className={`w-1 bg-base-300 hover:bg-primary cursor-col-resize transition-colors ${
                    isDragging && currentTaskIndex === index ? 'bg-primary' : ''
                  }`}
                  onMouseDown={(e) => handleMouseDown(e, index)}
                />

                {/* Right Side - Input Area */}
                <div 
                  className="bg-base-200 p-4 rounded-lg overflow-hidden flex flex-col"
                  style={{ width: `${100 - panelWidths[index]}%` }}
                >
                  <div className="flex justify-between items-center mb-2">
                    {/* <label className="text-sm font-medium">Your Response:</label> */}
                    <div className="text-sm font-bold">
                      Word count: {wordCounts[part._id] || 0}
                    </div>
                  </div>
                  <textarea
                    className="textarea textarea-bordered w-full flex-1 resize-none"
                    placeholder="Write your response here..."
                    value={responses[part._id] || ''}
                    onChange={(e) => handleResponseChange(part._id, e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>
          ))}

        </div>
      </div>

      {/* Fixed Task Navigation Panel at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="px-4 py-2">
          <div className="flex justify-between items-center">
            {/* Previous Button */}
            <button
              onClick={() => setActiveTab(Math.max(0, activeTab - 1))}
              disabled={activeTab === 0}
              className="btn bg-red-600 hover:bg-red-700 border-0 disabled:bg-gray-400 disabled:cursor-not-allowed text-white"
              type="button"
            >
              Previous
            </button>

            {/* Task Navigation */}
            <div className="flex justify-center flex-1">
              {test.parts.map((part: TestPart, partIndex: number) => (
                <div key={partIndex} className="flex-1 flex justify-center">
                  <div className="border-2 border-gray-300 rounded-lg p-1 flex gap-0.5 justify-center">
                    <button
                      key={`task-${partIndex}`}
                      type="button"
                      className={`px-4 py-2 text-sm rounded border transition-colors ${
                        partIndex === activeTab
                          ? "bg-red-600 text-white border-red-600"
                          : "bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300"
                      }`}
                      onClick={() => setActiveTab(partIndex)}
                    >
                      Task {partIndex + 1}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={() => setActiveTab(Math.min(test.parts.length - 1, activeTab + 1))}
              disabled={activeTab === test.parts.length - 1}
              className="btn bg-red-600 hover:bg-red-700 border-0 disabled:bg-gray-400 disabled:cursor-not-allowed mx-2 text-white"
              type="button"
            >
              Next
            </button>

            {/* Submit Button */}
            <button
              onClick={() => handleSubmit()}
              type="button"
              className="btn bg-green-600 hover:bg-green-700 border-0 text-white"
            >
              Submit Test
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}