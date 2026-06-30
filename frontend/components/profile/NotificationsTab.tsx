"use client";

import React from "react";
import { Bell, Calendar, Percent, Shield, Trash2, CheckCheck } from "lucide-react";
import { useAuth, Notification } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

export default function NotificationsTab() {
  const { notifications, dismissNotification, markAllNotificationsAsRead } = useAuth();

  const handleMarkAllRead = () => {
    markAllNotificationsAsRead();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "booking":
        return (
          <div className="size-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100/50">
            <Calendar className="size-4.5" />
          </div>
        );
      case "promo":
        return (
          <div className="size-9 rounded-full bg-purple-50 text-purple-605 flex items-center justify-center shrink-0 border border-purple-100/50">
            <Percent className="size-4.5" />
          </div>
        );
      case "system":
      default:
        return (
          <div className="size-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100/50">
            <Shield className="size-4.5" />
          </div>
        );
    }
  };

  const hasUnread = notifications.some((n) => !n.read);

  return (
    <div className="space-y-6 select-none">
      
      {/* Header and mark read buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Notifications Feed
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-slate-400 mt-1">
            Stay updated with your active booking statuses and exclusive alerts
          </p>
        </div>

        {notifications.length > 0 && hasUnread && (
          <Button
            type="button"
            onClick={handleMarkAllRead}
            className="self-start sm:self-center flex items-center gap-1.5 bg-transparent hover:bg-slate-100 text-slate-650 hover:text-slate-800 border border-slate-200 text-xs font-extrabold h-9 rounded-xl px-4 cursor-pointer transition"
          >
            <CheckCheck className="size-4" />
            <span>Mark all read</span>
          </Button>
        )}
      </div>

      {/* Notifications list */}
      {notifications.length > 0 ? (
        <div className="space-y-3.5">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white border rounded-2xl p-4 flex gap-3.5 transition-all relative ${
                notification.read
                  ? "border-slate-200/50 opacity-80"
                  : "border-rose-200/50 bg-rose-50/5 ring-1 ring-rose-500/5"
              }`}
            >
              {/* Type Icon */}
              {getIcon(notification.type)}

              {/* Title & description details */}
              <div className="flex-grow space-y-1 pr-6 text-left">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-black text-slate-900 leading-tight">
                    {notification.title}
                  </h4>
                  {!notification.read && (
                    <span className="size-2 rounded-full bg-rose-600 animate-pulse" />
                  )}
                </div>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                  {notification.description}
                </p>
                <span className="text-[10px] text-slate-400 font-bold block pt-1 leading-none">
                  {notification.timestamp}
                </span>
              </div>

              {/* Dismiss / Delete button */}
              <button
                onClick={() => dismissNotification(notification.id)}
                className="absolute top-4 right-4 size-7 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-red-500 transition cursor-pointer border-none bg-transparent"
                aria-label="Delete Notification"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-150/50 rounded-2xl py-12 px-6 text-center text-slate-450 font-semibold text-sm max-w-lg mx-auto space-y-3">
          <Bell className="size-8 text-slate-300 mx-auto" />
          <p>You have no notifications at this time.</p>
          <p className="text-xs text-slate-400 font-medium leading-relaxed">
            Check back later for event bookings confirmation and alerts.
          </p>
        </div>
      )}

    </div>
  );
}
