import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
// import HomePage from "./pages/home";
import DashboardPage from "./pages/dashboard";
import LoginPage from "./pages/login";
import UnauthorizedPage from "./pages/unauthorized";
import { AuthGuard } from "./components/guards/AuthGuard";
import { RoleGuard } from "./components/guards/RoleGuard";
import { OwnerGuard } from "./components/guards/OwnerGuard";
import { MainLayout } from "./components/layout/MainLayout";
import { TenantLayout } from "./components/layout/TenantLayout";
import { ROLES } from "@/constants/roles";
import { ROUTES } from "@/constants/routes";

import VenuesPage from "./pages/admin/VenuesPage";
import BookingsPage from "./pages/admin/BookingsPage";
import OwnersPage from "./pages/admin/OwnersPage";
import TeamPage from "./pages/superadmin/TeamPage";
import ActivityLogsPage from "./pages/superadmin/ActivityLogsPage";
import UsersPage from "./pages/admin/UsersPage";
import ModerationPage from "./pages/admin/ModerationPage";
import VenueSelectorPage from "./pages/owner/VenueSelectorPage";
import ReportsPage from "./pages/owner/ReportsPage";
import OwnerBookingsPage from "./pages/owner/OwnerBookingsPage";
import ReviewsPage from "./pages/owner/ReviewsPage";
import CalendarPage from "./pages/owner/CalendarPage";
const VenueSettingsPage = React.lazy(
  () => import("@/pages/owner/VenueSettingsPage"),
);

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Protected routes */}
        <Route path="/dashboard" element={<AuthGuard />}>
          <Route element={<MainLayout />}>
            {/* Owner routes */}
            <Route element={<RoleGuard allowedRoles={[ROLES.OWNER]} />}>
              <Route path="select-venue" element={<VenueSelectorPage />} />
              <Route path="venue/:venueId" element={<TenantLayout />}>
                <Route index element={<Navigate to="reports" replace />} />
                <Route path="reports" element={<ReportsPage />} />
                <Route path="bookings" element={<OwnerBookingsPage />} />
                <Route path="reviews" element={<ReviewsPage />} />
                <Route path="calendar" element={<CalendarPage />} />
                <Route path="settings" element={<VenueSettingsPage />} />
              </Route>
            </Route>

            {/* Admin & SuperAdmin routes */}
            <Route
              element={
                <RoleGuard allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]} />
              }
            >
              <Route path="venues" element={<VenuesPage />} />
              <Route path="bookings" element={<BookingsPage />} />
              <Route path="owners" element={<OwnersPage />} />
              <Route path="moderation" element={<ModerationPage />} />
              <Route element={<RoleGuard allowedRoles={[ROLES.SUPER_ADMIN]} />}>
                <Route path="team" element={<TeamPage />} />
                <Route path="logs" element={<ActivityLogsPage />} />
                <Route path="users" element={<UsersPage />} />
              </Route>
            </Route>

            {/* Dashboard Index / Redirect logic */}
            <Route element={<OwnerGuard />}>
              <Route index element={<DashboardPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
