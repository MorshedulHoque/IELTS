"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaBell, FaEnvelope, FaUsers } from "react-icons/fa";

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "urgent";
  audience: "all" | "user";
  link?: string;
  createdAt: string;
  readBy: string[];
  targetUserId?: string;
}

type TargetType = "all" | "user";

const typeStyles: Record<string, string> = {
  info: "badge-info",
  success: "badge-success",
  warning: "badge-warning",
  urgent: "badge-error",
};

const AdminNotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [targetType, setTargetType] = useState<TargetType>("all");
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [formValues, setFormValues] = useState({
    title: "",
    message: "",
    link: "",
    type: "info",
    targetUserEmail: "",
  });

  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/notifications?scope=admin&limit=100");
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to fetch notifications");
      }
      setNotifications(data.data || []);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Unable to fetch notifications");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!formValues.title.trim() || !formValues.message.trim()) {
      toast.error("Title and message are required");
      return;
    }

    if (targetType === "user" && !formValues.targetUserEmail.trim()) {
      toast.error("Please provide the target user's email");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formValues,
          targetType,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        // Show the error message from the API
        const errorMessage = data.error || "Failed to create notification";
        toast.error(errorMessage);
        setSubmitting(false);
        return;
      }

      toast.success("Notification sent successfully");
      setFormValues({
        title: "",
        message: "",
        link: "",
        type: "info",
        targetUserEmail: "",
      });
      setTargetType("all");
      loadNotifications();
    } catch (error: any) {
      console.error(error);
      // Extract error message from various error formats
      let errorMessage = "Failed to create notification";
      if (error.message) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      } else if (error.error) {
        errorMessage = error.error;
      }
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this notification?")) return;

    try {
      const res = await fetch(`/api/notifications/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to delete notification");
      }
      toast.success("Notification deleted");
      loadNotifications();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to delete notification");
    }
  };

  const notificationStats = useMemo(() => {
    const total = notifications.length;
    const broadcast = notifications.filter((n) => n.audience === "all").length;
    const targeted = total - broadcast;
    return { total, broadcast, targeted };
  }, [notifications]);

  return (
    <div className="p-6 space-y-6">
      <ToastContainer />
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Notifications</h1>
          <p className="text-slate-500">
            Create announcements and keep users informed in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="stat bg-white shadow rounded-xl border border-slate-100">
            <div className="stat-figure text-primary">
              <FaBell />
            </div>
            <div className="stat-title text-slate-500">Total notifications</div>
            <div className="stat-value text-slate-800">{notificationStats.total}</div>
            <div className="stat-desc text-slate-500">All time</div>
          </div>
          <div className="stat bg-white shadow rounded-xl border border-slate-100">
            <div className="stat-figure text-secondary">
              <FaUsers />
            </div>
            <div className="stat-title text-slate-500">Broadcast</div>
            <div className="stat-value text-slate-800">{notificationStats.broadcast}</div>
            <div className="stat-desc text-slate-500">Sent to everyone</div>
          </div>
          <div className="stat bg-white shadow rounded-xl border border-slate-100">
            <div className="stat-figure text-accent">
              <FaEnvelope />
            </div>
            <div className="stat-title text-slate-500">Targeted</div>
            <div className="stat-value text-slate-800">{notificationStats.targeted}</div>
            <div className="stat-desc text-slate-500">Individual users</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <form
          className="bg-white shadow rounded-2xl border border-slate-100 p-6 space-y-4 xl:col-span-1"
          onSubmit={handleSubmit}
        >
          <div>
            <h2 className="text-xl font-semibold text-slate-800">
              Create notification
            </h2>
            <p className="text-sm text-slate-500">
              Compose a message to broadcast to all users or target a single user.
            </p>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Title</span>
            </label>
            <input
              name="title"
              type="text"
              value={formValues.title}
              onChange={handleInputChange}
              className="input input-bordered"
              placeholder="Maintenance downtime, Score release, etc."
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Message</span>
            </label>
            <textarea
              name="message"
              value={formValues.message}
              onChange={handleInputChange}
              className="textarea textarea-bordered min-h-[140px]"
              placeholder="Share details, instructions, or helpful links."
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Link (optional)</span>
            </label>
            <input
              name="link"
              type="text"
              value={formValues.link}
              onChange={handleInputChange}
              className="input input-bordered"
              placeholder="https://example.com/resource"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Type</span>
            </label>
            <select
              name="type"
              value={formValues.type}
              onChange={handleInputChange}
              className="select select-bordered"
            >
              <option value="info">Info</option>
              <option value="success">Success</option>
              <option value="warning">Warning</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Audience</span>
            </label>
            <div className="join">
              <button
                type="button"
                className={`btn join-item ${
                  targetType === "all" ? "btn-primary" : "btn-outline"
                }`}
                onClick={() => setTargetType("all")}
              >
                All users
              </button>
              <button
                type="button"
                className={`btn join-item ${
                  targetType === "user" ? "btn-primary" : "btn-outline"
                }`}
                onClick={() => setTargetType("user")}
              >
                Specific user
              </button>
            </div>
          </div>

          {targetType === "user" && (
            <div className="form-control">
              <label className="label">
                <span className="label-text">Target user email</span>
              </label>
              <input
                name="targetUserEmail"
                type="email"
                value={formValues.targetUserEmail}
                onChange={handleInputChange}
                className="input input-bordered"
                placeholder="user@example.com"
              />
            </div>
          )}

          <button className="btn btn-primary w-full" disabled={submitting}>
            {submitting ? "Sending..." : "Send notification"}
          </button>
        </form>

        <div className="bg-white shadow rounded-2xl border border-slate-100 p-6 xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-800">Recent notifications</h2>
              <p className="text-sm text-slate-500">
                Latest 100 notifications shown below. Older messages remain available in the database.
              </p>
            </div>
            <button
              className="btn btn-ghost btn-sm"
              onClick={loadNotifications}
              disabled={loading}
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-40">
              <span className="loading loading-spinner loading-lg text-primary" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              No notifications yet. Start by sending your first announcement.
            </div>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className="border border-slate-100 rounded-xl p-4 hover:shadow transition bg-slate-50/60 cursor-pointer"
                  onClick={() => setSelectedNotification(notification)}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm text-slate-500">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                      <h3 className="text-lg font-semibold text-slate-800">
                        {truncateText(notification.title, 80)}
                      </h3>
                    </div>
                    <div className="flex gap-2 items-center">
                      <span className={`badge ${typeStyles[notification.type]}`}>
                        {notification.type}
                      </span>
                      <span className="badge badge-outline">
                        {notification.audience === "all" ? "Everyone" : "Individual"}
                      </span>
                      <button
                        className="btn btn-xs btn-ghost text-error"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(notification._id);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="mt-3 text-slate-700 line-clamp-3">
                    {truncateText(notification.message, 200)}
                  </p>
                  {(notification.message.length > 200 || notification.title.length > 80) && (
                    <p className="text-xs text-primary mt-2 font-medium">Click to view full message</p>
                  )}
                  {notification.link && (
                    <a
                      href={notification.link}
                      target="_blank"
                      rel="noreferrer"
                      className="link link-primary mt-2 inline-flex items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View link
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Notification Detail Modal */}
      {selectedNotification && (
        <dialog className="modal modal-open" onClick={() => setSelectedNotification(null)}>
          <div className="modal-box max-w-3xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className={`badge ${typeStyles[selectedNotification.type]}`}>
                  {selectedNotification.type}
                </span>
                <span className="badge badge-outline">
                  {selectedNotification.audience === "all" ? "Everyone" : "Individual"}
                </span>
                <span className="text-sm text-slate-500">
                  {new Date(selectedNotification.createdAt).toLocaleString()}
                </span>
              </div>
              <button
                className="btn btn-sm btn-circle btn-ghost"
                onClick={() => setSelectedNotification(null)}
              >
                ✕
              </button>
            </div>
            <h3 className="font-bold text-xl text-slate-800 mb-4">
              {selectedNotification.title}
            </h3>
            <p className="text-slate-700 whitespace-pre-line mb-4 text-base leading-relaxed">
              {selectedNotification.message}
            </p>
            {selectedNotification.link && (
              <a
                href={selectedNotification.link}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline btn-primary inline-flex items-center gap-2 mb-4"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Open link
              </a>
            )}
            <div className="modal-action">
              <button
                className="btn btn-error"
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm("Delete this notification?")) {
                    handleDelete(selectedNotification._id);
                    setSelectedNotification(null);
                  }
                }}
              >
                Delete
              </button>
              <button
                className="btn btn-primary"
                onClick={() => setSelectedNotification(null)}
              >
                Close
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop" onClick={() => setSelectedNotification(null)}>
            <button>close</button>
          </form>
        </dialog>
      )}
    </div>
  );
};

export default AdminNotificationsPage;

