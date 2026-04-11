"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { FaBell, FaCheck, FaEnvelopeOpen, FaInbox } from "react-icons/fa";
import { useSession } from "next-auth/react";

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "urgent";
  link?: string;
  createdAt: string;
  isRead: boolean;
}

const typeBadgeClasses: Record<Notification["type"], string> = {
  info: "badge-info",
  success: "badge-success",
  warning: "badge-warning",
  urgent: "badge-error",
};

const NotificationBell = () => {
  const { status } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  const fetchNotifications = useCallback(async () => {
    if (status !== "authenticated") return;

    try {
      setLoading(true);
      const res = await fetch("/api/notifications?limit=20");
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to fetch notifications");
      }
      setNotifications(data.data || []);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );

  const formatTimeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const handleNotificationClick = (notification: Notification) => {
    setSelectedNotification(notification);
    if (!notification.isRead) {
      handleMarkAsRead(notification._id);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "mark-read" }),
      });
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === id ? { ...notification, isRead: true } : notification
        )
      );
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await fetch("/api/notifications/mark-all-read", {
        method: "POST",
      });
      setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })));
    } catch (err) {
      console.error("Failed to mark notifications as read", err);
    }
  };

  if (status !== "authenticated") {
    return null;
  }

  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle text-slate-600 hover:bg-slate-100"
      >
        <div className="indicator">
          <FaBell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="badge badge-error badge-xs indicator-item"></span>
          )}
        </div>
      </div>
      <div
        tabIndex={0}
        className="dropdown-content z-[100] mt-3 card card-compact w-80 bg-base-100 shadow-xl border border-slate-100"
      >
        <div className="card-body">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg text-slate-800">Notifications</h3>
            {notifications.length > 0 && (
              <button
                className="btn btn-ghost btn-xs"
                onClick={handleMarkAllRead}
                disabled={unreadCount === 0}
              >
                <FaCheck className="mr-1" />
                Mark all read
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-6">
              <span className="loading loading-spinner text-primary" />
            </div>
          ) : error ? (
            <p className="text-sm text-error py-4">{error}</p>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center py-6 text-slate-500">
              <FaInbox className="text-3xl mb-2" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="max-h-80 overflow-y-auto space-y-3 mt-3">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-3 rounded-xl border text-sm cursor-pointer transition-all hover:shadow-md ${
                    notification.isRead
                      ? "bg-slate-50 border-slate-100"
                      : "bg-indigo-50/80 border-indigo-100"
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-slate-800">{truncateText(notification.title, 60)}</p>
                    <span className={`badge ${typeBadgeClasses[notification.type]}`}>
                      {notification.type}
                    </span>
                  </div>
                  <p className="text-slate-600 mt-1 line-clamp-2">
                    {truncateText(notification.message, 100)}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                    <span>{formatTimeAgo(notification.createdAt)}</span>
                    {!notification.isRead ? (
                      <span className="flex items-center gap-1 text-primary">
                        <FaEnvelopeOpen />
                        Unread
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-slate-400">
                        <FaCheck />
                        Seen
                      </span>
                    )}
                  </div>
                  {(notification.message.length > 100 || notification.title.length > 60) && (
                    <p className="text-xs text-primary mt-2 font-medium">Click to view full message</p>
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
          <div className="modal-box max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className={`badge ${typeBadgeClasses[selectedNotification.type]}`}>
                  {selectedNotification.type}
                </span>
                <span className="text-sm text-slate-500">
                  {formatTimeAgo(selectedNotification.createdAt)}
                </span>
              </div>
              <button
                className="btn btn-sm btn-circle btn-ghost"
                onClick={() => setSelectedNotification(null)}
              >
                ✕
              </button>
            </div>
            <h3 className="font-bold text-lg text-slate-800 mb-3">
              {selectedNotification.title}
            </h3>
            <p className="text-slate-700 whitespace-pre-line mb-4">
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

export default NotificationBell;

