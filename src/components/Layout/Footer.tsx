"use client";
import { usePathname } from "next/navigation";
import React from "react";
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Footer = () => {
  const pathName = usePathname();

  // Footer links data
  const footerLinks = [
    {
      title: "Products",
      links: [
        "Practice Tests",
        "Scoring System",
        "Study Materials",
        "Premium Features",
      ],
    },
    {
      title: "Resources",
      links: [
        { text: "Band Score Calculator", href: "/band-score-calculator" },
        "IELTS Guide",
        "Tips & Strategies",
        "Vocabulary Builder",
        "Sample Answers",
      ],
    },
    {
      title: "Company",
      links: ["About Us", "Contact", "Testimonials", "Careers"],
    },
  ];

  const socialLinks = [
    { icon: <FaFacebook />, url: "#" },
    { icon: <FaTwitter />, url: "#" },
    { icon: <FaLinkedin />, url: "#" },
    { icon: <FaInstagram />, url: "#" },
  ];

  // const contactInfo = [
  //   {
  //     icon: <FaMapMarkerAlt className="text-red-600" />,
  //     text: "123 Education Street, London, UK",
  //   },
  //   { icon: <FaPhone className="text-red-600" />, text: "+44 20 7123 4567" },
  //   {
  //     icon: <FaEnvelope className="text-red-600" />,
  //     text: "support@ieltsmaster.com",
  //   },
  // ];

  return (
    !pathName.startsWith("/test/reading/") &&
    !pathName.startsWith("/test/writing/") &&
    !pathName.startsWith("/test/listening/") &&
    !pathName.startsWith("/admin") &&
    !pathName.startsWith("/user/") && (
      <footer className="border-t border-rose-100 bg-gradient-to-b from-rose-50/60 via-white to-rose-50/80 text-gray-700">
        <div className="container mx-auto px-4 max-w-6xl py-10 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[minmax(0,1.6fr)_repeat(3,minmax(0,1fr))] gap-10 md:gap-12 mb-10">
            {/* Brand section */}
            <div className="flex flex-col gap-5">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-rose-300 via-red-300 to-orange-200 blur-md opacity-70" />
                  <div className="relative w-10 h-10 bg-gradient-to-r from-rose-600 via-red-600 to-orange-500 rounded-2xl flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-lg tracking-tight">
                      B
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-xl font-semibold text-gray-900 tracking-tight">
                    BandGrowth
                  </span>
                  <div className="text-xs text-gray-500">
                    IELTS practice • analytics • progress
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 max-w-sm">
                Practice realistic IELTS tests, see your trends clearly, and know
                exactly what to work on next — all in one clean dashboard.
              </p>

              <div className="flex flex-wrap gap-3">
                {socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-rose-100 bg-white/90 text-gray-500 shadow-sm hover:border-rose-300 hover:text-rose-600 hover:shadow-md transition-all duration-200"
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Links sections */}
            {footerLinks.map((section, index) => (
              <div key={index} className="text-sm">
                <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-600 mb-4">
                  {section.title}
                </h4>
                <ul className="space-y-2.5">
                  {section.links.map((link, idx) => {
                    const linkObj =
                      typeof link === "string" ? { text: link, href: "#" } : link;
                    return (
                      <li key={idx}>
                        <a
                          href={linkObj.href}
                          className="inline-flex items-center text-gray-600 hover:text-rose-700 hover:translate-x-0.5 transition-all duration-150"
                        >
                          <span className="mr-1.5 h-[2px] w-0 group-hover:w-3 rounded-full bg-rose-400/80 transition-all duration-150" />
                          {linkObj.text}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}

            {/* Contact section */}
            {/* <div>
              <h4 className="text-lg font-bold text-gray-900 mb-5 tracking-tight">
                Contact
              </h4>
              <ul className="space-y-3">
                {contactInfo.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mt-1 mr-3">{item.icon}</span>
                    <span className="text-gray-600">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div> */}
          </div>

          {/* Copyright and legal */}
          <div className="pt-6 mt-2 border-t border-rose-100/80">
            <div className="flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4 text-xs md:text-sm">
              <p className="text-gray-500">
                © {new Date().getFullYear()} BandGrowth. All rights reserved.
              </p>
              <div className="flex flex-wrap items-center gap-4 md:gap-6">
                <a
                  href="/privacy-policy"
                  className="text-gray-500 hover:text-rose-700 transition-colors"
                >
                  Privacy Policy
                </a>
                <a
                  href="/terms-of-service"
                  className="text-gray-500 hover:text-rose-700 transition-colors"
                >
                  Terms of Service
                </a>
                <a
                  href="/cookie-policy"
                  className="text-gray-500 hover:text-rose-700 transition-colors"
                >
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    )
  );
};

export default Footer;
