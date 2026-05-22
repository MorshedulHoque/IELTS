// components/Navbar.tsx
"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import LoginButton from "../Auth/LoginButton";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Session } from "next-auth";
import { getSingleUser } from "@/services/data";
import userImage from "../../../public/images/user.jpg";
import NotificationBell from "@/components/Common/NotificationBell";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role?: string;
    };
  }
}

const Navbar: React.FC = () => {
  const pathName = usePathname();
  const { data } = useSession();
  const [userData, setUserData]: any = useState();
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  // Navigation links data
  const navLinks = [
    {
      href: "/test",
      label: "Mock Tests",
      hasSubmenu: true,
      submenu: [
        { href: "/test/listening", label: "Listening" },
        { href: "/test/reading", label: "Reading" },
        { href: "/test/writing", label: "Writing" },
        { href: "/test/speaking", label: "Speaking" },
      ],
    },
    {
      href: "/writing-samples",
      label: "Writing Samples",
      hasSubmenu: true,
      submenu: [
        { href: "/writing-samples", label: "All Samples" },
        { href: "/writing-samples?task=1", label: "Task 1" },
        { href: "/writing-samples?task=2", label: "Task 2" },
      ],
    },
    { href: "/blog", label: "Blog" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  useEffect(() => {
    const fetchSingleUser = async () => {
      if (data) {
        const result = await getSingleUser(data?.user.id);
        setUserData(result?.data);
        return result;
      }
    };
    fetchSingleUser();
  }, [data]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const hideForUserRoute =
    pathName.startsWith("/user/") &&
    pathName !== "/user/signin" &&
    pathName !== "/user/signin/" &&
    pathName !== "/user/signup" &&
    pathName !== "/user/signup/";

  return (
    <div className="sticky top-0 z-50">
      {!pathName.startsWith("/test/reading/") &&
        !pathName.startsWith("/test/writing/") &&
        !pathName.startsWith("/test/listening/") &&
        !pathName.startsWith("/admin") &&
        !hideForUserRoute &&
        !pathName.startsWith("/writing-samples/") && (
          <nav
            className={[
              "border-b transition-[background-color,box-shadow,backdrop-filter,border-color,padding] duration-300 ease-out",
              scrolled
                ? "bg-white/95 backdrop-blur-xl border-gray-200/90 shadow-[0_8px_30px_-6px_rgba(0,0,0,0.12)]"
                : "bg-white/80 backdrop-blur-md border-gray-200/50 shadow-sm",
            ].join(" ")}
          >
            <div className="container mx-auto px-4">
              <div
                className={[
                  "navbar transition-[padding,min-height] duration-300 ease-out",
                  scrolled ? "py-1.5 min-h-[3.25rem]" : "py-2.5 min-h-[3.5rem]",
                ].join(" ")}
              >
                {/* Logo */}
                <div className="navbar-start">
                  <Link
                    href="/"
                    className="group transition-transform duration-300 hover:scale-[1.02]"
                  >
                    <Image
                      src="/logo/BandGrowth_Logo_with_text.png"
                      alt="Band Growth"
                      width={220}
                      height={52}
                      priority
                      className={[
                        "w-auto object-contain transition-all duration-300 ease-out",
                        scrolled ? "h-9" : "h-10",
                      ].join(" ")}
                    />
                  </Link>
                </div>

                {/* Desktop Navigation */}
                <div className="navbar-center hidden lg:flex">
                  <ul
                    className={[
                      "menu menu-horizontal px-1 gap-1 transition-[padding] duration-300 ease-out",
                      scrolled ? "py-2" : "py-3",
                    ].join(" ")}
                  >
                    {navLinks.map((link) => (
                      <li key={link.href} className="relative group">
                        {link.hasSubmenu ? (
                          <>
                            <div
                              className={`font-medium px-4 py-2 rounded-lg transition-all duration-300 cursor-pointer relative inline-block ${
                                pathName.startsWith(link.href)
                                  ? "text-red-700 font-semibold"
                                  : "text-gray-700 hover:text-red-600"
                              }`}
                            >
                              <span className="relative z-10">{link.label}</span>
                              {pathName.startsWith(link.href) && (
                                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-600 to-red-500 rounded-full"></span>
                              )}
                            </div>
                            <ul className="absolute left-0 top-full !m-0 !ms-0 !p-2 before:hidden bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-200/50 w-56 z-50 mt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                              {link.submenu?.map((subItem) => (
                                <li key={subItem.href} className="p-0">
                                  <Link
                                    href={subItem.href}
                                    className={`w-full block p-2.5 rounded-lg transition-all duration-300 ${
                                      pathName === subItem.href
                                        ? "bg-gradient-to-r from-red-50 to-red-100 text-red-700 font-medium shadow-sm"
                                        : "text-gray-700 hover:bg-red-50 hover:text-red-700"
                                    }`}
                                  >
                                    {subItem.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </>
                        ) : (
                          <Link
                            href={link.href}
                            className={`font-medium px-4 py-2 rounded-lg transition-all duration-300 relative group inline-block ${
                              pathName.startsWith(link.href)
                                ? "text-red-700 font-semibold"
                                : "text-gray-700 hover:text-red-600"
                            }`}
                          >
                            <span className="relative z-10">{link.label}</span>
                            {pathName.startsWith(link.href) && (
                              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-600 to-red-500 rounded-full animate-in slide-in-from-left duration-300"></span>
                            )}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Right side controls */}
                <div className="navbar-end gap-3">
                  {data?.user.role === "admin" && (
                    <Link
                      href="/admin"
                      className="btn btn-sm btn-outline border-red-700 text-red-700 hover:bg-red-700 hover:text-white hover:border-red-700 hidden sm:inline-flex transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md"
                    >
                      Admin Panel
                    </Link>
                  )}

                  {/* Mobile menu button */}
                  <div className="dropdown lg:hidden">
                    <div 
                      tabIndex={0} 
                      role="button" 
                      className="btn btn-ghost rounded-lg transition-all duration-300 hover:bg-gray-100 active:scale-95"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 transition-transform duration-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 6h16M4 12h8m-8 6h16"
                        />
                      </svg>
                    </div>
                    <ul
                      tabIndex={0}
                      className="menu menu-sm dropdown-content bg-white/95 backdrop-blur-md rounded-xl z-50 mt-3 w-52 p-2 shadow-xl border border-gray-200/50 animate-in fade-in slide-in-from-top-2 duration-300"
                    >
                      {navLinks.map((link) => (
                        <li key={link.href}>
                          {link.hasSubmenu ? (
                            <>
                              <span
                                className={`font-medium px-3 py-2 rounded-lg transition-all duration-300 ${
                                  pathName.startsWith(link.href)
                                    ? "text-red-700 bg-red-50 font-semibold"
                                    : "text-gray-700 hover:bg-gray-100"
                                }`}
                              >
                                {link.label}
                              </span>
                              <ul className="!m-0 !ms-0 !p-2 before:hidden bg-gray-50/50 rounded-lg mt-1">
                                {link.submenu?.map((subItem) => (
                                  <li key={subItem.href} className="p-0">
                                    <Link
                                      href={subItem.href}
                                      className={`w-full block p-2 rounded-lg transition-all duration-300 ${
                                        pathName === subItem.href
                                          ? "bg-gradient-to-r from-red-50 to-red-100 text-red-700 font-medium shadow-sm"
                                          : "text-gray-700 hover:bg-red-50 hover:text-red-700"
                                      }`}
                                    >
                                      {subItem.label}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </>
                          ) : (
                            <Link
                              href={link.href}
                              className={`font-medium px-3 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                                pathName.startsWith(link.href)
                                  ? "text-red-700 bg-red-50 font-semibold"
                                  : "text-gray-700 hover:bg-gray-100"
                              }`}
                            >
                              {link.label}
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {data && <NotificationBell />}

                  {/* User profile dropdown */}
                  {data ? (
                    <div className="dropdown dropdown-end">
                      <button
                        tabIndex={0}
                        type="button"
                        className="flex items-center gap-2 rounded-full border border-rose-100 bg-white/90 px-2 py-1 shadow-sm hover:border-rose-300 hover:bg-rose-50/80 hover:shadow-md transition-all duration-200"
                      >
                        <div className="relative h-9 w-9 rounded-full overflow-hidden border border-gray-200 bg-gray-100 shadow-sm">
                          {userData?.image ? (
                            <img
                              alt="User profile"
                              src={userData.image}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <svg
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                              className="h-full w-full p-1.5 text-gray-500"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.6" />
                              <path d="M5 19C5.9 15.8 8.6 14 12 14C15.4 14 18.1 15.8 19 19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                            </svg>
                          )}
                          <span className="absolute inset-0 rounded-full ring-1 ring-white/70" />
                        </div>
                        {/* <div className="hidden md:flex flex-col items-start leading-tight max-w-[120px]">
                          <span className="text-xs font-semibold text-gray-800 truncate">
                            {data.user.name}
                          </span>
                        </div> */}
                        <svg
                          className="hidden md:block h-3.5 w-3.5 text-gray-500"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M5 7.5L10 12.5L15 7.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                      <div
                        tabIndex={0}
                        className="dropdown-content mt-3 w-64 rounded-2xl border border-rose-100 bg-white/95 p-3 shadow-[0_18px_45px_rgba(248,113,113,0.18)] backdrop-blur-md z-[100]"
                      >
                        <div className="flex items-center gap-3 pb-3 border-b border-rose-100/80 mb-3">
                          <div className="h-9 w-9 rounded-full overflow-hidden border border-gray-200 bg-gray-100 shadow-sm">
                            {userData?.image ? (
                              <img
                                alt="User profile"
                                src={userData.image}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <svg
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                                className="h-full w-full p-1.5 text-gray-500"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.6" />
                                <path d="M5 19C5.9 15.8 8.6 14 12 14C15.4 14 18.1 15.8 19 19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                              </svg>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {data.user.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {data.user.email}
                            </p>
                          </div>
                        </div>

                        <ul className="space-y-1.5 text-sm">
                          <li>
                            <Link
                              href="/userDashboard"
                              className="flex items-center justify-between rounded-xl px-3 py-2 text-gray-700 hover:bg-rose-50 hover:text-rose-700 transition-colors duration-150"
                            >
                              <span>Dashboard</span>
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/profile"
                              className="flex items-center justify-between rounded-xl px-3 py-2 text-gray-700 hover:bg-rose-50 hover:text-rose-700 transition-colors duration-150"
                            >
                              <span>Profile</span>
                            </Link>
                          </li>
                        </ul>

                        <button
                          type="button"
                          onClick={async () => {
                            await signOut({ redirect: false });
                            router.push("/");
                          }}
                          className="mt-3 w-full rounded-xl px-3 py-2 text-left text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-700 transition-colors duration-150 border-t border-rose-100/80"
                        >
                          Sign out
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="hidden sm:block">
                      <LoginButton />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </nav>
        )}
    </div>
  );
};

export default Navbar;