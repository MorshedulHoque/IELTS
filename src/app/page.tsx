import IELTSLandingPage from "@/components/Home/IELTSLandingPage";
import Image from "next/image";

export default function Home() {
  return (
    // <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    //   {/* Hero Section */}
    //   <section className="container mx-auto px-4 py-16 md:py-28 flex flex-col md:flex-row items-center">
    //     <div className="md:w-1/2 mb-10 md:mb-0">
    //       <h1 className="text-4xl md:text-6xl font-bold text-gray-800 leading-tight">
    //         Ace Your <span className="text-indigo-600">IELTS</span> Exam With
    //         Confidence
    //       </h1>
    //       <p className="mt-6 text-xl text-gray-600 max-w-lg">
    //         Realistic practice tests, personalized feedback, and expert
    //         strategies to help you achieve your band score.
    //       </p>
    //       <div className="mt-10 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
    //         <button className="btn btn-primary bg-indigo-600 text-white text-lg px-8 py-4 hover:bg-indigo-700 shadow-lg transition-all">
    //           Start Free Test
    //         </button>
    //         <button className="btn btn-outline border-indigo-600 text-indigo-600 text-lg px-8 py-4 hover:bg-indigo-50">
    //           How It Works
    //         </button>
    //       </div>
    //       <div className="mt-8 flex items-center">
    //         <div className="avatar-group -space-x-4">
    //           {[1, 2, 3, 4].map((item) => (
    //             <div key={item} className="avatar">
    //               <div className="w-12">
    //                 <img
    //                   src={`https://i.pravatar.cc/150?img=${item + 10}`}
    //                   alt="avatar"
    //                 />
    //               </div>
    //             </div>
    //           ))}
    //         </div>
    //         <p className="ml-4 text-gray-600">
    //           <span className="font-semibold">2,500+</span> successful students
    //         </p>
    //       </div>
    //     </div>
    //     <div className="md:w-1/2 flex justify-center">
    //       <div className="relative">
    //         <div className="w-80 h-80 bg-indigo-500 rounded-full absolute -top-6 -left-6 opacity-10"></div>
    //         <div className="card w-96 bg-base-100 shadow-xl border border-indigo-100">
    //           <figure className="px-10 pt-10">
    //             <div className="mockup-window border bg-indigo-50">
    //               <div className="bg-gray-800 p-6 flex justify-center">
    //                 <div className="text-center">
    //                   <div
    //                     className="radial-progress text-indigo-500"
    //                     style={{ "--value": 85 } as React.CSSProperties}
    //                   >
    //                     85%
    //                   </div>
    //                   <p className="mt-2 font-semibold text-white">
    //                     Mock Test Score
    //                   </p>
    //                 </div>
    //               </div>
    //             </div>
    //           </figure>
    //           <div className="card-body items-center text-center">
    //             <h2 className="card-title text-indigo-600">
    //               Band Score Predictor
    //             </h2>
    //             <p>Take our diagnostic test to get your predicted band score</p>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </section>

    //   {/* Features Section */}
    //   <section className="py-16 bg-white">
    //     <div className="container mx-auto px-4">
    //       <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800">
    //         Comprehensive Test Preparation
    //       </h2>
    //       <p className="mt-4 text-xl text-center text-gray-600 max-w-2xl mx-auto">
    //         Everything you need in one place to maximize your IELTS score
    //       </p>

    //       <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
    //         {features.map((feature, index) => (
    //           <div
    //             key={index}
    //             className="card bg-base-100 shadow-lg border border-indigo-50 hover:border-indigo-200 transition-all"
    //           >
    //             <div className="card-body">
    //               <div
    //                 className={`w-16 h-16 rounded-xl mb-4 flex items-center justify-center ${
    //                   index === 0
    //                     ? "bg-blue-100"
    //                     : index === 1
    //                     ? "bg-green-100"
    //                     : "bg-purple-100"
    //                 }`}
    //               >
    //                 {feature.icon}
    //               </div>
    //               <h3 className="card-title text-xl text-gray-800">
    //                 {feature.title}
    //               </h3>
    //               <p className="mt-2 text-gray-600">{feature.description}</p>
    //             </div>
    //           </div>
    //         ))}
    //       </div>
    //     </div>
    //   </section>

    //   {/* CTA Section */}
    //   <section className="py-16 bg-indigo-600">
    //     <div className="container mx-auto px-4 text-center">
    //       <h2 className="text-3xl md:text-4xl font-bold text-white">
    //         Ready to achieve your dream IELTS score?
    //       </h2>
    //       <p className="mt-4 text-xl text-indigo-100 max-w-2xl mx-auto">
    //         Join thousands of successful test-takers who've improved their
    //         scores with our platform
    //       </p>
    //       <div className="mt-10">
    //         <button className="btn btn-accent bg-white text-indigo-600 text-lg px-10 py-4 hover:bg-indigo-50 shadow-lg">
    //           Create Free Account
    //         </button>
    //         <button className="btn btn-ghost text-white text-lg ml-4 px-10 py-4 hover:bg-indigo-700">
    //           View Sample Tests
    //         </button>
    //       </div>
    //     </div>
    //   </section>
    // </div>
    <div>
      <IELTSLandingPage />
    </div>
  );
}

const features = [
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 text-blue-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
    title: "Full Practice Tests",
    description:
      "Complete IELTS simulations for all sections under timed conditions",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 text-green-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
        />
      </svg>
    ),
    title: "Detailed Analytics",
    description:
      "Track your progress and identify weaknesses with performance reports",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 text-purple-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
    title: "Expert Evaluation",
    description:
      "Get writing and speaking assessments from IELTS certified tutors",
  },
];
