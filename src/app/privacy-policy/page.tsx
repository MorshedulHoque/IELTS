"use client";
import React from "react";
import { FaShieldAlt, FaLock, FaUserShield, FaDatabase, FaCookie, FaEnvelope } from "react-icons/fa";

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-16 px-4 bg-gradient-to-br from-red-50 via-white to-blue-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 rounded-full text-red-700 text-sm font-medium mb-6">
              <FaShieldAlt className="text-red-600" />
              <span>Privacy & Security</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Privacy Policy
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
                At BandGrowth, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                By using BandGrowth, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our platform.
              </p>
            </div>

            {/* Information We Collect */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <FaDatabase className="text-2xl text-blue-600" />
                <h2 className="text-3xl font-bold text-gray-900">1. Information We Collect</h2>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">1.1 Personal Information</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  When you register for an account, we may collect:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Name and email address</li>
                  <li>Profile information (optional profile picture)</li>
                  <li>Authentication credentials (securely hashed)</li>
                  <li>OAuth provider information (if you sign in with Google or LinkedIn)</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">1.2 Usage Data</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We automatically collect information about how you interact with our platform:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Test results and performance data</li>
                  <li>Practice test submissions and answers</li>
                  <li>Writing and speaking samples you submit</li>
                  <li>Analytics and progress tracking data</li>
                  <li>Device information and browser type</li>
                  <li>IP address and general location data</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">1.3 Cookies and Tracking Technologies</h3>
                <p className="text-gray-700 leading-relaxed">
                  We use cookies and similar tracking technologies to enhance your experience, analyze usage patterns, and maintain your session. You can control cookie preferences through your browser settings.
                </p>
              </div>
            </div>

            {/* How We Use Information */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <FaLock className="text-2xl text-green-600" />
                <h2 className="text-3xl font-bold text-gray-900">2. How We Use Your Information</h2>
              </div>
              
              <p className="text-gray-700 leading-relaxed mb-4">
                We use the collected information for the following purposes:
              </p>
              <ul className="list-disc list-inside space-y-3 text-gray-700 ml-4 mb-6">
                <li><strong>Service Delivery:</strong> To provide, maintain, and improve our IELTS practice platform</li>
                <li><strong>Personalization:</strong> To customize your learning experience and provide relevant content</li>
                <li><strong>AI Evaluation:</strong> To analyze your writing and speaking submissions using AI technology</li>
                <li><strong>Progress Tracking:</strong> To generate analytics and track your performance over time</li>
                <li><strong>Communication:</strong> To send you notifications, updates, and important information about your account</li>
                <li><strong>Security:</strong> To protect against fraud, unauthorized access, and other security threats</li>
                <li><strong>Legal Compliance:</strong> To comply with applicable laws and regulations</li>
              </ul>
            </div>

            {/* Data Sharing */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <FaUserShield className="text-2xl text-purple-600" />
                <h2 className="text-3xl font-bold text-gray-900">3. Data Sharing and Disclosure</h2>
              </div>
              
              <p className="text-gray-700 leading-relaxed mb-4">
                We respect your privacy and do not sell your personal information. We may share your information only in the following circumstances:
              </p>
              
              <div className="bg-blue-50 rounded-xl p-6 mb-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">3.1 Service Providers</h3>
                <p className="text-gray-700 leading-relaxed">
                  We may share information with trusted third-party service providers who assist us in operating our platform, including:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mt-3">
                  <li>Cloud hosting services (for data storage)</li>
                  <li>AI service providers (for writing and speaking evaluation)</li>
                  <li>Authentication providers (Google, LinkedIn OAuth)</li>
                  <li>Content management systems (Contentful for writing samples)</li>
                  <li>Analytics services (to understand platform usage)</li>
                </ul>
              </div>

              <div className="bg-blue-50 rounded-xl p-6 mb-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">3.2 Legal Requirements</h3>
                <p className="text-gray-700 leading-relaxed">
                  We may disclose your information if required by law, court order, or government regulation, or to protect our rights, property, or safety.
                </p>
              </div>

              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">3.3 Business Transfers</h3>
                <p className="text-gray-700 leading-relaxed">
                  In the event of a merger, acquisition, or sale of assets, your information may be transferred to the new entity, subject to the same privacy protections.
                </p>
              </div>
            </div>

            {/* Data Security */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <FaShieldAlt className="text-2xl text-red-600" />
                <h2 className="text-3xl font-bold text-gray-900">4. Data Security</h2>
              </div>
              
              <p className="text-gray-700 leading-relaxed mb-4">
                We implement industry-standard security measures to protect your personal information:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-6">
                <li>Encryption of data in transit and at rest</li>
                <li>Secure authentication and password hashing</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and authentication requirements</li>
                <li>Secure cloud infrastructure</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.
              </p>
            </div>

            {/* Your Rights */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <FaUserShield className="text-2xl text-orange-600" />
                <h2 className="text-3xl font-bold text-gray-900">5. Your Privacy Rights</h2>
              </div>
              
              <p className="text-gray-700 leading-relaxed mb-4">
                Depending on your location, you may have the following rights regarding your personal information:
              </p>
              <ul className="list-disc list-inside space-y-3 text-gray-700 ml-4 mb-6">
                <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal requirements)</li>
                <li><strong>Portability:</strong> Request transfer of your data to another service</li>
                <li><strong>Objection:</strong> Object to certain processing of your information</li>
                <li><strong>Withdrawal:</strong> Withdraw consent where processing is based on consent</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                To exercise these rights, please contact us using the information provided in the "Contact Us" section below.
              </p>
            </div>

            {/* Data Retention */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">6. Data Retention</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this policy, unless a longer retention period is required by law.
              </p>
              <p className="text-gray-700 leading-relaxed">
                When you delete your account, we will delete or anonymize your personal information, except where we are required to retain it for legal, regulatory, or legitimate business purposes.
              </p>
            </div>

            {/* Children's Privacy */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">7. Children's Privacy</h2>
              <p className="text-gray-700 leading-relaxed">
                BandGrowth is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately, and we will take steps to delete such information.
              </p>
            </div>

            {/* International Data Transfers */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">8. International Data Transfers</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Your information may be transferred to and processed in countries other than your country of residence. These countries may have data protection laws that differ from those in your country.
              </p>
              <p className="text-gray-700 leading-relaxed">
                By using our platform, you consent to the transfer of your information to these countries. We take appropriate measures to ensure your information receives adequate protection in accordance with this Privacy Policy.
              </p>
            </div>

            {/* Changes to Policy */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">9. Changes to This Privacy Policy</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may update this Privacy Policy from time to time to reflect changes in our practices or for legal, operational, or regulatory reasons.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this Privacy Policy periodically.
              </p>
            </div>

            {/* Contact Us */}
            <div className="mb-12 bg-gradient-to-br from-red-50 to-blue-50 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <FaEnvelope className="text-2xl text-red-600" />
                <h2 className="text-3xl font-bold text-gray-900">10. Contact Us</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <p className="text-gray-700 mb-2">
                  <strong>Email:</strong> privacy@bandgrowth.com
                </p>
                <p className="text-gray-700">
                  <strong>Platform:</strong> BandGrowth (IELTS Prep)
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicyPage;

