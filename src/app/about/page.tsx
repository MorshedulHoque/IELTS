"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  FaCheckCircle,
  FaRocket,
  FaUsers,
  FaAward,
  FaHeart,
  FaLightbulb,
  FaChartLine,
  FaGlobeAmericas,
  FaGraduationCap,
} from "react-icons/fa";
import { TbTargetArrow } from "react-icons/tb";

const AboutPage: React.FC = () => {
  const [visibleSections, setVisibleSections] = useState<{ [key: string]: boolean }>({});

  const sectionsRef = useRef<{ [key: string]: HTMLElement | null }>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => ({
              ...prev,
              [entry.target.id]: true,
            }));
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -100px 0px" }
    );

    Object.values(sectionsRef.current).forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      Object.values(sectionsRef.current).forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  const fadeInUp = (id: string) => {
    return visibleSections[id]
      ? "opacity-100 translate-y-0 transition-all duration-700 ease-out"
      : "opacity-0 translate-y-8 transition-all duration-700 ease-out";
  };

  const fadeIn = (id: string) => {
    return visibleSections[id]
      ? "opacity-100 transition-opacity duration-700 ease-out"
      : "opacity-0 transition-opacity duration-700 ease-out";
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-red-50 via-white to-blue-50 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 rounded-full text-red-700 text-sm font-medium mb-6">
              <FaHeart className="text-red-600" />
              <span>About BandGrowth</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
              Empowering Your IELTS Journey
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We're dedicated to helping you achieve your target IELTS band score through comprehensive practice, expert guidance, and innovative technology.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section
        id="mission"
        ref={(el) => { sectionsRef.current["mission"] = el; }}
        className="py-24 px-4 bg-white"
      >
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className={`${fadeInUp("mission")}`}>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full text-blue-700 text-sm font-medium mb-4">
                <TbTargetArrow className="text-blue-600" />
                <span>Our Mission</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                Making IELTS Success Accessible to Everyone
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                At BandGrowth, we believe that achieving your target IELTS band score shouldn't be limited by expensive courses or inaccessible resources. Our mission is to provide a comprehensive, free platform that empowers learners worldwide to excel in their IELTS journey.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                We combine cutting-edge AI technology with proven teaching methodologies to deliver personalized feedback, detailed analytics, and authentic practice materials that mirror the actual computer-based IELTS exam.
              </p>
            </div>
            <div className={`${fadeIn("mission-image")}`} ref={(el) => { sectionsRef.current["mission-image"] = el; }} id="mission-image">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 shadow-xl">
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { icon: FaUsers, label: "Active Learners", value: "10K+", color: "text-blue-600" },
                    { icon: FaAward, label: "Success Stories", value: "5K+", color: "text-purple-600" },
                    { icon: FaChartLine, label: "Practice Tests", value: "500+", color: "text-green-600" },
                    { icon: FaGlobeAmericas, label: "Countries", value: "50+", color: "text-orange-600" },
                  ].map((stat, index) => {
                    const IconComponent = stat.icon;
                    return (
                      <div key={index} className="text-center">
                        <div className={`w-16 h-16 ${stat.color.replace("text-", "bg-").replace("-600", "-50")} rounded-2xl flex items-center justify-center mx-auto mb-3`}>
                          <IconComponent className={`text-2xl ${stat.color}`} />
                        </div>
                        <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                        <div className="text-sm text-gray-600">{stat.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section
        id="values"
        ref={(el) => { sectionsRef.current["values"] = el; }}
        className="py-24 px-4 bg-gradient-to-b from-gray-50 to-white"
      >
        <div className="container mx-auto max-w-7xl">
          <div className={`text-center mb-20 ${fadeInUp("values")}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 rounded-full text-red-700 text-sm font-medium mb-4">
              <FaHeart className="text-red-600" />
              <span>Our Values</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              What We Stand For
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our core values guide everything we do and shape the experience we create for our learners.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: FaRocket,
                title: "Innovation",
                description: "We continuously evolve our platform with the latest AI technology and educational best practices to provide the most effective learning experience.",
                color: "text-blue-600",
                bgColor: "bg-blue-50",
              },
              {
                icon: FaUsers,
                title: "Accessibility",
                description: "Education should be free and accessible to everyone. We're committed to providing comprehensive IELTS preparation resources at no cost.",
                color: "text-green-600",
                bgColor: "bg-green-50",
              },
              {
                icon: TbTargetArrow,
                title: "Excellence",
                description: "We maintain the highest standards in our practice materials, feedback quality, and user experience to ensure your success.",
                color: "text-purple-600",
                bgColor: "bg-purple-50",
              },
              {
                icon: FaChartLine,
                title: "Progress-Focused",
                description: "Your improvement is our priority. We provide detailed analytics and personalized feedback to help you track and enhance your performance.",
                color: "text-orange-600",
                bgColor: "bg-orange-50",
              },
              {
                icon: FaLightbulb,
                title: "Empowerment",
                description: "We believe in empowering learners with the tools, knowledge, and confidence they need to achieve their IELTS goals independently.",
                color: "text-red-600",
                bgColor: "bg-red-50",
              },
              {
                icon: FaGlobeAmericas,
                title: "Global Reach",
                description: "We serve learners from around the world, understanding diverse needs and providing support for various IELTS purposes.",
                color: "text-indigo-600",
                bgColor: "bg-indigo-50",
              },
            ].map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div
                  key={index}
                  className={`${fadeInUp(`value-${index}`)}`}
                  ref={(el) => { sectionsRef.current[`value-${index}`] = el; }}
                  id={`value-${index}`}
                >
                  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full transform hover:-translate-y-2">
                    <div className={`w-16 h-16 ${value.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className={`text-3xl ${value.color}`} />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-gray-900">{value.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* What Makes Us Different Section */}
      <section
        id="different"
        ref={(el) => { sectionsRef.current["different"] = el; }}
        className="py-24 px-4 bg-white"
      >
        <div className="container mx-auto max-w-7xl">
          <div className={`text-center mb-20 ${fadeInUp("different")}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 rounded-full text-red-700 text-sm font-medium mb-4">
              <FaLightbulb className="text-red-600" />
              <span>What Makes Us Different</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Why Choose BandGrowth?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We've built a platform that addresses the real challenges IELTS candidates face.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              {
                title: "100% Free Forever",
                description: "No hidden costs, no subscriptions, no premium tiers. All features are completely free for everyone.",
                icon: FaCheckCircle,
                color: "text-green-600",
              },
              {
                title: "Computer-Based Focus",
                description: "Our platform is specifically designed for computer-delivered IELTS, matching the exact format you'll face on test day.",
                icon: FaCheckCircle,
                color: "text-blue-600",
              },
              {
                title: "AI-Powered Feedback",
                description: "Get instant, detailed feedback on your writing and speaking using advanced AI technology that understands IELTS criteria.",
                icon: FaCheckCircle,
                color: "text-purple-600",
              },
              {
                title: "Comprehensive Practice",
                description: "Access full-length practice tests for all four skills, plus writing samples and detailed analytics to track your progress.",
                icon: FaCheckCircle,
                color: "text-orange-600",
              },
            ].map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className={`${fadeInUp(`different-${index}`)}`}
                  ref={(el) => { sectionsRef.current[`different-${index}`] = el; }}
                  id={`different-${index}`}
                >
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <IconComponent className={`text-2xl ${feature.color} flex-shrink-0 mt-1`} />
                      <div>
                        <h3 className="text-xl font-bold mb-2 text-gray-900">{feature.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="cta"
        ref={(el) => { sectionsRef.current["cta"] = el; }}
        className="py-24 px-4 bg-gradient-to-br from-red-600 to-red-700 text-white"
      >
        <div className="container mx-auto max-w-4xl text-center">
          <div className={`${fadeIn("cta")}`}>
            <FaGraduationCap className="text-6xl mx-auto mb-6 opacity-90" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Start Your IELTS Journey?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of learners who are achieving their target band scores with BandGrowth. Start practicing today—it's completely free!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/user/signup"
                className="px-8 py-4 bg-white text-red-700 font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 text-lg"
              >
                Get Started Free
              </a>
              <a
                href="/"
                className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-red-700 transition-all duration-300 text-lg"
              >
                Explore Features
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;

