"use client";
import React from "react";
import { FaFileContract, FaGavel, FaUserShield, FaExclamationTriangle, FaCheckCircle, FaBan } from "react-icons/fa";

const TermsOfServicePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-16 px-4 bg-gradient-to-br from-red-50 via-white to-blue-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 rounded-full text-red-700 text-sm font-medium mb-6">
              <FaFileContract className="text-red-600" />
              <span>Legal Terms</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Terms of Service
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-lg max-w-none">
            {/* Introduction */}
            <div className="mb-12">
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                Welcome to BandGrowth. These Terms of Service ("Terms") govern your access to and use of our IELTS preparation platform, including all features, content, and services provided by BandGrowth ("Service", "Platform", "we", "us", or "our").
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of these Terms, you may not access or use the Service.
              </p>
            </div>

            {/* Acceptance of Terms */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <FaCheckCircle className="text-2xl text-green-600" />
                <h2 className="text-3xl font-bold text-gray-900">1. Acceptance of Terms</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                By creating an account, accessing, or using BandGrowth, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy, which is incorporated herein by reference.
              </p>
              <p className="text-gray-700 leading-relaxed">
                You must be at least 13 years old to use this Service. If you are under 18, you represent that you have your parent's or guardian's permission to use the Service.
              </p>
            </div>

            {/* Description of Service */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <FaFileContract className="text-2xl text-blue-600" />
                <h2 className="text-3xl font-bold text-gray-900">2. Description of Service</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                BandGrowth is an online IELTS preparation platform that provides:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-4">
                <li>Practice tests for Listening, Reading, Writing, and Speaking modules</li>
                <li>AI-powered evaluation and feedback for writing and speaking submissions</li>
                <li>Writing samples and model answers</li>
                <li>Performance analytics and progress tracking</li>
                <li>Educational resources and study materials</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to modify, suspend, or discontinue any part of the Service at any time, with or without notice.
              </p>
            </div>

            {/* User Accounts */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <FaUserShield className="text-2xl text-purple-600" />
                <h2 className="text-3xl font-bold text-gray-900">3. User Accounts</h2>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-6 mb-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">3.1 Account Registration</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  To use certain features of the Service, you must register for an account. You agree to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Provide accurate, current, and complete information during registration</li>
                  <li>Maintain and update your account information to keep it accurate</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Accept responsibility for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized access or security breach</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">3.2 Account Termination</h3>
                <p className="text-gray-700 leading-relaxed">
                  You may delete your account at any time. We reserve the right to suspend or terminate your account if you violate these Terms or engage in any fraudulent, abusive, or illegal activity.
                </p>
              </div>
            </div>

            {/* Acceptable Use */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <FaBan className="text-2xl text-red-600" />
                <h2 className="text-3xl font-bold text-gray-900">4. Acceptable Use Policy</h2>
              </div>
              
              <p className="text-gray-700 leading-relaxed mb-4">
                You agree not to use the Service to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-6">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe upon intellectual property rights of others</li>
                <li>Upload malicious code, viruses, or harmful software</li>
                <li>Attempt to gain unauthorized access to the Service or other users' accounts</li>
                <li>Interfere with or disrupt the Service or servers</li>
                <li>Use automated systems (bots, scrapers) to access the Service without permission</li>
                <li>Impersonate any person or entity or misrepresent your affiliation</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Share your account credentials with others</li>
                <li>Use the Service for commercial purposes without authorization</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                Violation of these rules may result in immediate termination of your account and legal action.
              </p>
            </div>

            {/* Intellectual Property */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <FaGavel className="text-2xl text-orange-600" />
                <h2 className="text-3xl font-bold text-gray-900">5. Intellectual Property Rights</h2>
              </div>
              
              <div className="bg-blue-50 rounded-xl p-6 mb-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">5.1 Our Content</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  All content on BandGrowth, including but not limited to text, graphics, logos, images, software, and the compilation of all content, is the property of BandGrowth or its content suppliers and is protected by copyright, trademark, and other intellectual property laws.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  You may not reproduce, distribute, modify, create derivative works, publicly display, or commercially exploit any content from the Service without our express written permission.
                </p>
              </div>

              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">5.2 Your Content</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  You retain ownership of any content you submit to the Service (such as writing samples, speaking recordings, or test answers). However, by submitting content, you grant us a worldwide, non-exclusive, royalty-free license to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Use, store, and process your content to provide and improve the Service</li>
                  <li>Analyze your content using AI technology for evaluation and feedback</li>
                  <li>Generate anonymized analytics and insights</li>
                </ul>
              </div>
            </div>

            {/* Service Availability */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">6. Service Availability and Modifications</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We strive to provide continuous access to the Service, but we do not guarantee that the Service will be available at all times. The Service may be unavailable due to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-6">
                <li>Scheduled maintenance or updates</li>
                <li>Technical issues or server problems</li>
                <li>Force majeure events</li>
                <li>Security concerns</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to modify, suspend, or discontinue any part of the Service at any time, with or without notice. We are not liable for any loss or damage resulting from Service unavailability.
              </p>
            </div>

            {/* AI Evaluation Disclaimer */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <FaExclamationTriangle className="text-2xl text-yellow-600" />
                <h2 className="text-3xl font-bold text-gray-900">7. AI Evaluation Disclaimer</h2>
              </div>
              <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
                <p className="text-gray-700 leading-relaxed mb-4">
                  Our AI-powered evaluation system provides feedback and scoring estimates based on IELTS criteria. However:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>AI evaluations are estimates and may not reflect your actual IELTS band score</li>
                  <li>Results should be used as learning tools, not definitive assessments</li>
                  <li>We do not guarantee the accuracy of AI-generated feedback</li>
                  <li>Official IELTS scores can only be obtained through authorized IELTS test centers</li>
                </ul>
              </div>
            </div>

            {/* Limitation of Liability */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">8. Limitation of Liability</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, BANDGROWTH AND ITS AFFILIATES SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-6">
                <li>Loss of data or information</li>
                <li>Loss of profits or business opportunities</li>
                <li>Service interruptions or unavailability</li>
                <li>Errors or inaccuracies in content</li>
                <li>Any damages resulting from your use or inability to use the Service</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                Our total liability for any claims arising from your use of the Service shall not exceed the amount you paid us in the 12 months preceding the claim, or $100, whichever is greater.
              </p>
            </div>

            {/* Indemnification */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">9. Indemnification</h2>
              <p className="text-gray-700 leading-relaxed">
                You agree to indemnify, defend, and hold harmless BandGrowth, its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mt-4">
                <li>Your use of the Service</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any rights of another party</li>
                <li>Any content you submit to the Service</li>
              </ul>
            </div>

            {/* Free Service */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">10. Free Service</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                BandGrowth is currently provided free of charge. We reserve the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-6">
                <li>Introduce premium features or paid plans in the future</li>
                <li>Modify or discontinue free features</li>
                <li>Implement usage limits or restrictions</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                We will provide reasonable notice of any material changes to the free nature of the Service.
              </p>
            </div>

            {/* Governing Law */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">11. Governing Law and Dispute Resolution</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                These Terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law principles.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Any disputes arising from these Terms or your use of the Service shall be resolved through good faith negotiation. If negotiation fails, disputes shall be resolved through binding arbitration or in the appropriate courts of jurisdiction.
              </p>
            </div>

            {/* Changes to Terms */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">12. Changes to Terms</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We reserve the right to modify these Terms at any time. We will notify users of material changes by:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-6">
                <li>Posting the updated Terms on this page</li>
                <li>Updating the "Last updated" date</li>
                <li>Sending email notifications for significant changes</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                Your continued use of the Service after changes become effective constitutes acceptance of the modified Terms. If you do not agree to the changes, you must stop using the Service.
              </p>
            </div>

            {/* Severability */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">13. Severability</h2>
              <p className="text-gray-700 leading-relaxed">
                If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.
              </p>
            </div>

            {/* Contact Information */}
            <div className="mb-12 bg-gradient-to-br from-red-50 to-blue-50 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <FaFileContract className="text-2xl text-red-600" />
                <h2 className="text-3xl font-bold text-gray-900">14. Contact Information</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <p className="text-gray-700 mb-2">
                  <strong>Email:</strong> legal@bandgrowth.com
                </p>
                <p className="text-gray-700">
                  <strong>Platform:</strong> BandGrowth (IELTS Prep)
                </p>
              </div>
            </div>

            {/* Acknowledgment */}
            <div className="mb-12 bg-blue-50 rounded-xl p-6 border border-blue-200">
              <p className="text-gray-700 leading-relaxed font-medium">
                By using BandGrowth, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsOfServicePage;

