import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: [],
  unreadCount: 0,
};

const upsertNotifications = (state, incoming) => {
  const items = Array.isArray(incoming) ? incoming : [incoming];

  items.forEach((notification) => {
    const existingIndex = state.notifications.findIndex((n) => n.id === notification.id);
    if (existingIndex >= 0) {
      state.notifications[existingIndex] = notification;
    } else {
      state.notifications.unshift(notification);
    }
  });

  state.unreadCount = state.notifications.filter((n) => !n.isRead).length;
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotification: (state, action) => {
      upsertNotifications(state, action.payload);
    },
    markAllRead: (state) => {
      state.notifications = state.notifications.map((n) => ({
        ...n,
        isRead: true,
      }));
      state.unreadCount = 0;
    },
  },
});

export const { setNotification,markAllRead } = notificationSlice.actions;
export default notificationSlice.reducer;

// selectors
export const selectNotifications = (state) => state.notification.notifications;
export const selectUnreadCount = (state) => state.notification.unreadCount;
