"use client";
import LoginButton from "@/components/Auth/LoginButton";
import { getSingleUser } from "@/services/data";
import { useSession } from "next-auth/react";
import userImage from "../../../../public/images/user.jpg";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSidebar } from "@/contexts/SidebarContext";
import {
  FaChartBar,
  FaBook,
  FaHeadphones,
  FaEdit,
  FaMicrophone,
  FaCog,
  FaBell,
  FaChevronDown,
  FaBars,
  FaTimes,
  FaSearch,
  FaUser,
  FaClipboardList,
  FaCaretDown,
  FaHome,
  FaMusic,
  FaSignOutAlt,
  FaUserCircle,
  FaBuilding,
  FaGraduationCap,
} from "react-icons/fa";

const AdminNavbar = () => {
  const [activePage, setActivePage] = useState("dashboard");
  const { data } = useSession();
  const [userData, setUserData]: any = useState();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { desktopSidebarOpen, setDesktopSidebarOpen } = useSidebar();

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

  const navigationItems = [
    {
      section: "Overview",
      items: [
        {
          id: "dashboard",
          label: "Dashboard",
          href: "/admin",
          icon: FaChartBar,
        },
      ],
    },
    {
      section: "Test Management",
      items: [
        {
          id: "reading",
          label: "Reading Tests",
          href: "/admin/allReading",
          icon: FaBook,
        },
        {
          id: "listening",
          label: "Listening Tests",
          href: "/admin/allListening",
          icon: FaHeadphones,
        },
        {
          id: "writing",
          label: "Writing Tests",
          href: "/admin/allWriting",
          icon: FaEdit,
        },
        {
          id: "speaking",
          label: "Speaking Tests",
          href: "/admin/allSpeaking",
          icon: FaMicrophone,
        },
      ],
    },
    {
      section: "Audio Management",
      items: [
        {
          id: "speaking-audio",
          label: "Speaking Audio",
          href: "/admin/audio-management",
          icon: FaMusic,
        },
        {
          id: "listening-audio",
          label: "Listening Audio",
          href: "/admin/listening-audio-management",
          icon: FaHeadphones,
        },
      ],
    },
    {
      section: "User Management",
      items: [
        {
          id: "users",
          label: "User Management",
          href: "/admin/users",
          icon: FaUser,
        },
      ],
    },
    {
      section: "Communication",
      items: [
        {
          id: "notifications",
          label: "Notifications",
          href: "/admin/notifications",
          icon: FaBell,
        },
      ],
    },
  ];

  const Sidebar = ({ isDesktop = false, isCollapsed = false }) => (
    <aside
      className={`bg-slate-900 text-slate-100 ${
        isCollapsed ? "w-16" : "w-72"
      } min-h-screen flex flex-col shadow-2xl transition-all duration-300`}
    >
      {/* Sidebar Header */}
      <div
        className={`p-6 border-b border-slate-700 ${isCollapsed ? "px-3" : ""}`}
      >
        <div
          className={`flex items-center ${
            isCollapsed ? "justify-center" : "gap-3"
          }`}
        >
          <div className="p-2 bg-blue-600 rounded-lg">
            <FaGraduationCap className="text-white text-xl" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-lg font-bold text-white">IELTS Admin</h1>
              <p className="text-xs text-slate-400">Management Portal</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-6">
          {navigationItems.map((section, index) => (
            <div key={index}>
              {!isCollapsed && (
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 px-2">
                  {section.section}
                </h3>
              )}
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activePage === item.id;
                  return (
                    <li key={item.id}>
                      <Link
                        href={item.href}
                        className={`flex items-center ${
                          isCollapsed ? "justify-center px-2" : "gap-3 px-3"
                        } py-2.5 rounded-lg transition-all duration-200 group relative ${
                          isActive
                            ? "bg-blue-600 text-white shadow-lg"
                            : "text-slate-300 hover:bg-slate-800 hover:text-white"
                        }`}
                        onClick={() => {
                          setActivePage(item.id);
                          setSidebarOpen(false);
                        }}
                        title={isCollapsed ? item.label : ""}
                      >
                        <Icon
                          className={`text-lg ${
                            isActive
                              ? "text-white"
                              : "text-slate-400 group-hover:text-white"
                          }`}
                        />
                        {!isCollapsed && (
                          <span className="font-medium">{item.label}</span>
                        )}
                        {isCollapsed && (
                          <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                            {item.label}
                          </div>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </nav>

      {/* Sidebar Footer */}
      <div
        className={`p-4 border-t border-slate-700 ${isCollapsed ? "px-2" : ""}`}
      >
        {!isCollapsed ? (
          <>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-xs text-slate-400">System Online</span>
            </div>
            <p className="text-xs text-slate-500">
              © 2024 IELTS Administration
            </p>
          </>
        ) : (
          <div className="flex justify-center">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          </div>
        )}
      </div>
    </aside>
  );

  return (
    <>
      {/* Main Navbar */}
      <header className="navbar bg-white shadow-md border-b border-slate-200 px-6 py-3 sticky top-0 z-50">
        {/* Left Section */}
        <div className="navbar-start">
          <div className="flex items-center gap-4">
            {/* Desktop Sidebar Toggle - Always visible on desktop */}
            <button
              onClick={() => setDesktopSidebarOpen(!desktopSidebarOpen)}
              className="hidden lg:flex btn btn-square btn-ghost text-slate-600 hover:bg-slate-100 tooltip tooltip-bottom"
              data-tip={
                desktopSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"
              }
            >
              {desktopSidebarOpen ? (
                <FaTimes className="h-5 w-5" />
              ) : (
                <FaBars className="h-5 w-5" />
              )}
            </button>

            {/* Mobile Menu Button - Only on mobile */}
            <div className="lg:hidden">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="btn btn-square btn-ghost text-slate-600 hover:bg-slate-100"
              >
                <FaBars className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
              <div className="fixed inset-0 z-50 lg:hidden">
                <div
                  className="fixed inset-0 bg-black bg-opacity-50"
                  onClick={() => setSidebarOpen(false)}
                ></div>
                <div className="fixed left-0 top-0 h-full">
                  <div className="relative">
                    <button
                      onClick={() => setSidebarOpen(false)}
                      className="absolute top-4 right-4 z-10 btn btn-sm btn-ghost text-slate-300 hover:text-white hover:bg-slate-800"
                    >
                      <FaTimes className="h-4 w-4" />
                    </button>
                    <Sidebar />
                  </div>
                </div>
              </div>
            )}

            {/* Brand Logo */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <FaGraduationCap className="text-white text-xl" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-slate-800">
                  IELTS Admin
                </h1>
                <p className="text-xs text-slate-500">Management Portal</p>
              </div>
            </div>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="navbar-center hidden lg:flex">
          <div className="form-control">
            <div className="input-group">
              <input
                type="text"
                placeholder="Search tests, users, reports..."
                className="input input-bordered bg-slate-50 text-slate-700 w-96 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="btn bg-blue-600 border-blue-600 hover:bg-blue-700 text-white">
                <FaSearch />
              </button>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="navbar-end">
          <div className="flex items-center gap-2">
            {/* Main Site Link */}
            <Link
              href="/"
              className="btn btn-sm btn-outline btn-primary hidden md:flex gap-2"
            >
              <FaHome className="text-sm" />
              Main Site
            </Link>

            {/* Notifications */}
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle text-slate-600 hover:bg-slate-100"
              >
                <div className="indicator">
                  <FaBell className="h-5 w-5" />
                  <span className="badge badge-xs badge-error indicator-item"></span>
                </div>
              </div>
              <div
                tabIndex={0}
                className="dropdown-content z-50 mt-3 card card-compact w-80 bg-base-100 shadow-xl border"
              >
                <div className="card-body">
                  <h3 className="font-semibold text-lg text-slate-800 border-b pb-2">
                    Notifications
                  </h3>
                  <div className="mt-3 space-y-3 max-h-64 overflow-y-auto">
                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <FaMicrophone className="text-blue-600 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-slate-800">
                          New Speaking Test Submission
                        </p>
                        <p className="text-xs text-slate-500">2 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
                      <FaCog className="text-amber-600 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-slate-800">
                          System Maintenance Scheduled
                        </p>
                        <p className="text-xs text-slate-500">1 hour ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t">
                    <button className="btn btn-sm btn-ghost w-full text-blue-600">
                      View All Notifications
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* User Menu */}
            {!data ? (
              <div className="hidden sm:block">
                <LoginButton />
              </div>
            ) : (
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar"
                >
                  <div className="w-10 rounded-full bg-gray-100 border border-gray-200">
                    <img
                      alt="User Profile"
                      src={userData?.image || userImage.src}
                      className="object-cover"
                    />
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content mt-3 z-[100] p-2 shadow bg-base-100 rounded-box w-52 border border-gray-200"
                >
                  <li className="menu-title">
                    <span>Hello, {data.user.name}</span>
                  </li>
                  <div className="divider my-1"></div>
                  <li>
                    <Link href="/userDashboard">Dashboard</Link>
                  </li>
                  <li>
                    <Link href="/profile">Profile</Link>
                  </li>
                  <li>
                    <Link href="/settings">Settings</Link>
                  </li>
                  <div className="divider my-1"></div>
                  <li>
                    <LoginButton />
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <div
        className={`hidden lg:block fixed left-0 top-0 z-40 transition-all duration-300`}
      >
        <Sidebar isDesktop={true} isCollapsed={!desktopSidebarOpen} />
      </div>
    </>
  );
};

export default AdminNavbar;
