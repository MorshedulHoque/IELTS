"use client";
import React, { useState } from "react";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaUser,
  FaTag,
  FaComment,
  FaCheckCircle,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-16 px-4 bg-gradient-to-br from-red-50 via-white to-blue-50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 rounded-full text-red-700 text-sm font-medium mb-6">
              <FaEnvelope className="text-red-600" />
              <span>Get in Touch</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Contact Us
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Have questions, feedback, or need support? We're here to help! Reach out to us and we'll get back to you as soon as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Let's Connect
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Whether you have questions about our platform, need technical support, or want to share feedback, we'd love to hear from you.
              </p>

              <div className="space-y-6 mb-8">
                {/* Email */}
                <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FaEnvelope className="text-xl text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      Email Us
                    </h3>
                    <a
                      href="mailto:support@bandgrowth.com"
                      className="text-gray-600 hover:text-red-600 transition-colors"
                    >
                      support@bandgrowth.com
                    </a>
                    <p className="text-sm text-gray-500 mt-1">
                      We typically respond within 24 hours
                    </p>
                  </div>
                </div>

                {/* General Inquiry */}
                <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FaEnvelope className="text-xl text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      General Inquiry
                    </h3>
                    <a
                      href="mailto:info@bandgrowth.com"
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      info@bandgrowth.com
                    </a>
                    <p className="text-sm text-gray-500 mt-1">
                      For partnerships and general questions
                    </p>
                  </div>
                </div>

                {/* Privacy */}
                <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FaEnvelope className="text-xl text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      Privacy & Data
                    </h3>
                    <a
                      href="mailto:privacy@bandgrowth.com"
                      className="text-gray-600 hover:text-purple-600 transition-colors"
                    >
                      privacy@bandgrowth.com
                    </a>
                    <p className="text-sm text-gray-500 mt-1">
                      For privacy-related inquiries
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-gradient-to-br from-red-50 to-blue-50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Response Time
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  We aim to respond to all inquiries within 24-48 hours during business days. For urgent technical issues, please mention "URGENT" in your subject line.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Send us a Message
                </h2>

                {submitStatus === "success" && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                    <FaCheckCircle className="text-green-600 text-xl" />
                    <p className="text-green-700 font-medium">
                      Thank you! Your message has been sent successfully. We'll get back to you soon.
                    </p>
                  </div>
                )}

                {submitStatus === "error" && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-red-700 font-medium">
                      Something went wrong. Please try again or email us directly.
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      <FaUser className="inline mr-2 text-red-600" />
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                      placeholder="John Doe"
                    />
                  </div>

                  {/* Email Field */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      <FaEnvelope className="inline mr-2 text-red-600" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                      placeholder="john@example.com"
                    />
                  </div>

                  {/* Subject Field */}
                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      <FaTag className="inline mr-2 text-red-600" />
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                      placeholder="How can we help?"
                    />
                  </div>

                  {/* Message Field */}
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      <FaComment className="inline mr-2 text-red-600" />
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all resize-none"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin">⏳</span>
                        Sending...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane className="text-lg" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              {
                question: "How do I reset my password?",
                answer:
                  "You can reset your password by clicking 'Forgot Password' on the sign-in page. We'll send you a password reset link to your registered email address.",
              },
              {
                question: "Is BandGrowth really free?",
                answer:
                  "Yes! BandGrowth is 100% free forever. All features, including practice tests, AI feedback, and analytics, are available at no cost.",
              },
              {
                question: "How accurate is the AI evaluation?",
                answer:
                  "Our AI evaluation system is trained on IELTS criteria and provides detailed feedback on your writing and speaking. While it's highly accurate, we recommend using it as a learning tool alongside official IELTS preparation materials.",
              },
              {
                question: "Can I use BandGrowth on mobile devices?",
                answer:
                  "Yes! BandGrowth is fully responsive and works on all devices including smartphones and tablets. However, for the best experience with computer-based IELTS practice, we recommend using a desktop or laptop.",
              },
              {
                question: "How do I report a bug or technical issue?",
                answer:
                  "Please use the contact form above and select 'Technical Support' as your subject, or email us directly at support@bandgrowth.com with details about the issue.",
              },
            ].map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 pr-4">
                      {faq.question}
                    </h3>
                    <div className="flex-shrink-0">
                      {isOpen ? (
                        <FaChevronUp className="text-red-600 text-sm" />
                      ) : (
                        <FaChevronDown className="text-gray-400 text-sm" />
                      )}
                    </div>
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="px-6 pb-6 pt-0">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;

