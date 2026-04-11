"use client";
import React from "react";
import { FaCookie, FaShieldAlt, FaCog, FaList, FaCheckCircle, FaInfoCircle } from "react-icons/fa";

const CookiePolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-16 px-4 bg-gradient-to-br from-red-50 via-white to-blue-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 rounded-full text-red-700 text-sm font-medium mb-6">
              <FaCookie className="text-red-600" />
              <span>Cookie & Tracking</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Cookie Policy
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
                This Cookie Policy explains how BandGrowth ("we", "us", or "our") uses cookies and similar tracking technologies when you visit our website and use our platform. It explains what these technologies are, why we use them, and your rights to control our use of them.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                By continuing to use our platform, you consent to our use of cookies and tracking technologies as described in this policy.
              </p>
            </div>

            {/* What Are Cookies */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <FaInfoCircle className="text-2xl text-blue-600" />
                <h2 className="text-3xl font-bold text-gray-900">1. What Are Cookies?</h2>
              </div>
              
              <p className="text-gray-700 leading-relaxed mb-4">
                Cookies are small text files that are placed on your device (computer, tablet, or mobile) when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Cookies allow a website to recognize your device and store some information about your preferences or past actions. This helps us provide you with a better experience when you return to our platform.
              </p>
            </div>

            {/* Types of Cookies We Use */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <FaList className="text-2xl text-green-600" />
                <h2 className="text-3xl font-bold text-gray-900">2. Types of Cookies We Use</h2>
              </div>
              
              <div className="space-y-6">
                {/* Essential Cookies */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FaShieldAlt className="text-green-600" />
                    2.1 Essential Cookies
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    <strong>Purpose:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                    <li>Maintain your login session and authentication state</li>
                    <li>Remember your preferences and settings</li>
                    <li>Ensure security and prevent fraud</li>
                    <li>Enable basic website functionality</li>
                  </ul>
                  <p className="text-gray-700 leading-relaxed mt-3">
                    <strong>Duration:</strong> Session cookies (deleted when you close your browser) and persistent cookies (remain until expiration or deletion)
                  </p>
                  <p className="text-gray-700 leading-relaxed mt-2">
                    <strong>Can you opt-out?</strong> No - these cookies are essential and cannot be disabled as they are required for the platform to function.
                  </p>
                </div>

                {/* Functional Cookies */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FaCog className="text-blue-600" />
                    2.2 Functional Cookies
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    These cookies allow the website to remember choices you make (such as your language preference) and provide enhanced, personalized features.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    <strong>Purpose:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                    <li>Remember your language and region preferences</li>
                    <li>Store your UI preferences (theme, layout)</li>
                    <li>Remember your test progress and settings</li>
                    <li>Provide personalized content and features</li>
                  </ul>
                  <p className="text-gray-700 leading-relaxed mt-3">
                    <strong>Duration:</strong> Typically 30 days to 1 year
                  </p>
                  <p className="text-gray-700 leading-relaxed mt-2">
                    <strong>Can you opt-out?</strong> Yes - you can disable these through your browser settings, but some features may not work properly.
                  </p>
                </div>

                {/* Analytics Cookies */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FaCog className="text-purple-600" />
                    2.3 Analytics Cookies
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    <strong>Purpose:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                    <li>Track website usage and performance</li>
                    <li>Understand user behavior and preferences</li>
                    <li>Identify popular features and areas for improvement</li>
                    <li>Generate aggregated usage statistics</li>
                  </ul>
                  <p className="text-gray-700 leading-relaxed mt-3">
                    <strong>Duration:</strong> Typically 1-2 years
                  </p>
                  <p className="text-gray-700 leading-relaxed mt-2">
                    <strong>Can you opt-out?</strong> Yes - you can disable these through your browser settings or our cookie preferences.
                  </p>
                </div>
              </div>
            </div>

            {/* Third-Party Cookies */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <FaInfoCircle className="text-2xl text-orange-600" />
                <h2 className="text-3xl font-bold text-gray-900">3. Third-Party Cookies</h2>
              </div>
              
              <p className="text-gray-700 leading-relaxed mb-4">
                In addition to our own cookies, we may also use various third-party cookies to report usage statistics, deliver advertisements, and provide enhanced functionality. These third parties may set their own cookies on your device.
              </p>
              
              <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Third-Party Services We Use:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li><strong>Authentication Providers:</strong> Google OAuth, LinkedIn OAuth (for social login)</li>
                  <li><strong>Analytics Services:</strong> To understand how users interact with our platform</li>
                  <li><strong>Cloud Services:</strong> For hosting and content delivery</li>
                  <li><strong>AI Services:</strong> For evaluating writing and speaking submissions</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4">
                  These third parties have their own privacy policies and cookie practices. We encourage you to review their policies.
                </p>
              </div>
            </div>

            {/* How We Use Cookies */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">4. How We Use Cookies</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use cookies for the following purposes:
              </p>
              <ul className="list-disc list-inside space-y-3 text-gray-700 ml-4">
                <li><strong>Authentication:</strong> To keep you logged in and maintain your session</li>
                <li><strong>Security:</strong> To protect against fraud and unauthorized access</li>
                <li><strong>Preferences:</strong> To remember your settings and preferences</li>
                <li><strong>Performance:</strong> To analyze how our platform is used and improve performance</li>
                <li><strong>Personalization:</strong> To provide a customized experience based on your usage</li>
                <li><strong>Analytics:</strong> To understand user behavior and improve our services</li>
              </ul>
            </div>

            {/* Managing Cookies */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <FaCog className="text-2xl text-red-600" />
                <h2 className="text-3xl font-bold text-gray-900">5. Managing Your Cookie Preferences</h2>
              </div>
              
              <p className="text-gray-700 leading-relaxed mb-4">
                You have the right to accept or reject cookies. Most web browsers automatically accept cookies, but you can usually modify your browser settings to decline cookies if you prefer.
              </p>

              <div className="bg-blue-50 rounded-xl p-6 mb-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">5.1 Browser Settings</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  You can control cookies through your browser settings. Here are links to cookie settings for popular browsers:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Chrome</a></li>
                  <li><a href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Mozilla Firefox</a></li>
                  <li><a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Safari</a></li>
                  <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Microsoft Edge</a></li>
                </ul>
              </div>

              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">5.2 Impact of Disabling Cookies</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Please note that disabling certain cookies may impact your experience on our platform:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>You may need to log in more frequently</li>
                  <li>Some features may not work as expected</li>
                  <li>Your preferences may not be saved</li>
                  <li>Performance may be affected</li>
                </ul>
              </div>
            </div>

            {/* Local Storage */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">6. Local Storage and Similar Technologies</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                In addition to cookies, we may use other similar technologies such as:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-4">
                <li><strong>Local Storage:</strong> To store data locally on your device for faster access</li>
                <li><strong>Session Storage:</strong> To store temporary data during your session</li>
                <li><strong>Web Beacons:</strong> Small images embedded in web pages to track usage</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                These technologies serve similar purposes to cookies and are subject to the same privacy protections outlined in our Privacy Policy.
              </p>
            </div>

            {/* Updates to Policy */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">7. Updates to This Cookie Policy</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may update this Cookie Policy from time to time to reflect changes in our practices or for legal, operational, or regulatory reasons.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We will notify you of any material changes by posting the new Cookie Policy on this page and updating the "Last updated" date. We encourage you to review this Cookie Policy periodically.
              </p>
            </div>

            {/* Contact Information */}
            <div className="mb-12 bg-gradient-to-br from-red-50 to-blue-50 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <FaCookie className="text-2xl text-red-600" />
                <h2 className="text-3xl font-bold text-gray-900">8. Contact Us</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions about our use of cookies or this Cookie Policy, please contact us:
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

            {/* Additional Information */}
            <div className="mb-12 bg-green-50 rounded-xl p-6 border border-green-200">
              <div className="flex items-start gap-3">
                <FaCheckCircle className="text-green-600 text-xl flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Your Privacy Matters
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    We are committed to transparency about our use of cookies and tracking technologies. For more information about how we handle your personal data, please review our <a href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</a>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CookiePolicyPage;

