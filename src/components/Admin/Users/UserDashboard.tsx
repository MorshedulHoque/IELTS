"use client";
import { getAllUsers, updateUser, deleteUser } from "@/services/data";
import React, { useState, useEffect } from "react";
import Loader from '@/components/Common/Loader';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FiUser,
  FiMail,
  FiShield,
  FiActivity,
  FiEdit2,
  FiTrash2,
  FiSave,
  FiX,
  FiBarChart2,
  FiCalendar,
  FiAward,
  FiSearch,
  FiPlus,
} from "react-icons/fi";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { CiUser } from "react-icons/ci";

// User type definition
type User = {
  _id: string;
  username: string;
  email: string;
  role: "admin" | "user";
  lastActive: string;
  testAttempts: number;
  type: string;
};

const UserDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<any>();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<"admin" | "user">("user");
  const [newType, setNewType] = useState<"paid" | "free">("free");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { data }: any = useSession();

  console.log("Session Data", data);

  useEffect(() => {
    setCurrentUser(data?.user);
  }, [data]);

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const result = await getAllUsers();
        setUsers(result?.data || []);
      } catch (err) {
        toast.error("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Handle role change
  const handleRoleChange = async (userId: string) => {
    if (!currentUser || currentUser?.role !== "admin") return;

    try {
      setLoading(true);
      await updateUser(userId, { role: newRole, type: newType });

      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, role: newRole, type: newType } : user
        )
      );

      toast.success("User role updated successfully");
      setEditingUser(null);
    } catch (err) {
      toast.error("Failed to update user role");
    } finally {
      setLoading(false);
    }
  };

  // Handle user deletion
  const handleDelete = async (userId: string) => {
    if (!currentUser || currentUser?.role !== "admin") return;

    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      setLoading(true);
      await deleteUser(userId);
      setUsers(users.filter((user) => user._id !== userId));
      toast.success("User deleted successfully");
    } catch (err) {
      toast.error("Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Admin view - User management table
  const renderAdminView = () => (
    <div className="bg-base-100 rounded-xl p-6 shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
            <FiUser className="text-2xl" /> User Management
          </h2>
          <p className="text-gray-500 mt-1">
            Manage all system users and permissions
          </p>
        </div>

        <div className="mt-4 md:mt-0 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search users..."
            className="input input-bordered pl-10 w-full md:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading && (
        <div className="flex justify-center my-12">
          {/* <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div> */}
          <Loader message="" className="!w-6 !h-6 !border-2" />
        </div>
      )}

      {filteredUsers.length === 0 && !loading ? (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <FiUser className="text-3xl text-gray-400" />
          </div>
          <h3 className="text-xl font-medium">No users found</h3>
          <p className="text-gray-500 mt-2">
            Try adjusting your search or add a new user
          </p>
          <button className="btn btn-primary mt-4 gap-2">
            <FiPlus /> Add User
          </button>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="table w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-4 pl-6">User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Type</th>
                  <th>Last Active</th>
                  <th>Tests</th>
                  <th className="pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="border-t hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 pl-6">
                      <div className="flex items-center">
                        <div className="avatar placeholder">
                          <div className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center">
                            <span className="text-lg font-medium">
                              {user.username.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">
                            {user.username}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <FiMail className="text-gray-400" />
                        <span>{user.email}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      {editingUser?._id === user._id ? (
                        <div className="flex items-center gap-2">
                          <FiShield className="text-gray-400" />
                          <select
                            className="select select-bordered select-sm w-32"
                            value={newRole}
                            onChange={(e) =>
                              setNewRole(e.target.value as "admin" | "user")
                            }
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <FiShield
                            className={
                              user.role === "admin"
                                ? "text-blue-500"
                                : "text-gray-400"
                            }
                          />
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              user.role === "admin"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {user.role}
                          </span>
                        </div>
                      )}
                    </td>

                    <td className="py-4">
                      {editingUser?._id === user._id ? (
                        <div className="flex items-center gap-2">
                          <FiShield className="text-gray-400" />
                          <select
                            className="select select-bordered select-sm w-32"
                            value={newType}
                            onChange={(e) =>
                              setNewType(e.target.value as "paid" | "free")
                            }
                          >
                            <option value="free">Free</option>
                            <option value="paid">Paid</option>
                          </select>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <CiUser
                            className={
                              user.type === "paid"
                                ? "text-green-500 text-lg font-bold"
                                : "text-gray-400 text-lg font-bold"
                            }
                          />
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              user.type === "paid"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {user?.type}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <FiCalendar className="text-gray-400" />
                        <span>
                          {new Date(user.lastActive).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <FiBarChart2 className="text-gray-400" />
                        <span>{user.testAttempts}</span>
                      </div>
                    </td>
                    <td className="py-4 pr-6">
                      <div className="flex justify-end gap-2">
                        {editingUser?._id === user._id ? (
                          <>
                            <button
                              className="btn btn-success btn-sm gap-1"
                              onClick={() => handleRoleChange(user._id)}
                              disabled={loading}
                            >
                              <FiSave /> Save
                            </button>
                            <button
                              className="btn btn-outline btn-sm gap-1"
                              onClick={() => setEditingUser(null)}
                              disabled={loading}
                            >
                              <FiX /> Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="btn btn-outline btn-sm gap-1"
                              onClick={() => {
                                setEditingUser(user);
                                setNewRole(user.role);
                              }}
                              disabled={loading}
                            >
                              <FiEdit2 /> Edit
                            </button>
                            <button
                              className="btn btn-error btn-outline btn-sm gap-1"
                              onClick={() => handleDelete(user._id)}
                              disabled={user._id === currentUser?.id || loading}
                            >
                              <FiTrash2 /> Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <FiUser className="text-blue-600 text-xl" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {users.length}
                  </h3>
                  <p className="text-gray-600">Total Users</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-fuchsia-50 rounded-xl p-6 border border-purple-100">
              <div className="flex items-center gap-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <FiShield className="text-purple-600 text-xl" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {users.filter((u) => u.role === "admin").length}
                  </h3>
                  <p className="text-gray-600">Administrators</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <FiActivity className="text-green-600 text-xl" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {
                      users.filter(
                        (u) =>
                          new Date(u.lastActive).toDateString() ===
                          new Date().toDateString()
                      ).length
                    }
                  </h3>
                  <p className="text-gray-600">Active Today</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  // Normal user view - Profile and test history
  const renderUserView = () => {
    const user = users.find((u) => u._id === currentUser?.id) || users[0];

    if (!user) {
      return (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <FiUser className="text-3xl text-gray-400" />
          </div>
          <h3 className="text-xl font-medium">User profile not found</h3>
          <p className="text-gray-500 mt-2">Please try again later</p>
        </div>
      );
    }

    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-8 text-white mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="flex items-center mb-6 md:mb-0">
              <div className="avatar placeholder">
                <div className="bg-white text-primary rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold">
                  {user.username.charAt(0)}
                </div>
              </div>
              <div className="ml-6">
                <h1 className="text-2xl font-bold">{user.username}</h1>
                <p className="text-blue-100">{user.email}</p>
                <span
                  className={`mt-2 px-3 py-1 rounded-full text-sm font-medium ${
                    user.role === "admin"
                      ? "bg-blue-500 text-white"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {user.role}
                </span>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold">{user.testAttempts}</div>
                <div className="text-blue-100">Tests Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">7.5</div>
                <div className="text-blue-100">Avg. Score</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FiBarChart2 className="text-primary" /> Test Statistics
            </h3>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Reading</span>
                  <span className="font-medium">8.0</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: "80%" }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Listening</span>
                  <span className="font-medium">7.5</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: "75%" }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Writing</span>
                  <span className="font-medium">6.5</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{ width: "65%" }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Speaking</span>
                  <span className="font-medium">7.0</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{ width: "70%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FiCalendar className="text-primary" /> Recent Activity
            </h3>

            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-4">
                  <FiAward className="text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium">Completed Reading Test</h4>
                  <p className="text-gray-500 text-sm">
                    Academic Reading #3 - Score: 8.0
                  </p>
                  <p className="text-gray-400 text-xs mt-1">2 days ago</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-full mr-4">
                  <FiAward className="text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium">Completed Writing Test</h4>
                  <p className="text-gray-500 text-sm">
                    General Writing #2 - Score: 6.5
                  </p>
                  <p className="text-gray-400 text-xs mt-1">5 days ago</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-purple-100 p-2 rounded-full mr-4">
                  <FiAward className="text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium">Completed Listening Test</h4>
                  <p className="text-gray-500 text-sm">
                    Section 4 Practice - Score: 7.5
                  </p>
                  <p className="text-gray-400 text-xs mt-1">1 week ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <FiAward className="text-primary" /> Test History
            </h3>
            <button className="btn btn-primary gap-2">View Full Report</button>
          </div>

          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th>Test</th>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Score</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-gray-50">
                  <td>Academic Reading #3</td>
                  <td>2023-10-15</td>
                  <td>
                    <span className="badge badge-info">Reading</span>
                  </td>
                  <td className="font-bold text-blue-600">8.0</td>
                  <td>58 min</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td>General Writing #2</td>
                  <td>2023-10-10</td>
                  <td>
                    <span className="badge badge-warning">Writing</span>
                  </td>
                  <td className="font-bold text-yellow-600">6.5</td>
                  <td>62 min</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td>Section 4 Practice</td>
                  <td>2023-10-05</td>
                  <td>
                    <span className="badge badge-success">Listening</span>
                  </td>
                  <td className="font-bold text-green-600">7.5</td>
                  <td>32 min</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td>Speaking Mock Test</td>
                  <td>2023-10-01</td>
                  <td>
                    <span className="badge badge-primary">Speaking</span>
                  </td>
                  <td className="font-bold text-purple-600">7.0</td>
                  <td>14 min</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            IELTS Practice Platform
          </h1>
          <p className="text-gray-600 mt-2">
            Your personalized learning dashboard
          </p>
        </div>
        {/* <div className="badge badge-accent badge-lg mt-4 md:mt-0">Beta</div> */}
        <Link href={"/admin/users/addUser"}>
          <button className="btn btn-primary mt-4 gap-2">
            <FiPlus /> Add User
          </button>
        </Link>
      </div>

      <div className="tabs tabs-boxed bg-gray-100 p-1 rounded-lg mb-8">
        <a className="tab tab-active gap-2">
          <FiUser /> Users
        </a>
        <a className="tab gap-2">
          <FiBarChart2 /> Reports
        </a>
        <a className="tab gap-2">
          <FiAward /> Tests
        </a>
        {currentUser?.role === "admin" && (
          <a className="tab gap-2">
            <FiShield /> Settings
          </a>
        )}
      </div>

      {currentUser?.role === "admin" ? renderAdminView() : renderUserView()}
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default UserDashboard;
