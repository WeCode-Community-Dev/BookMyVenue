import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import { Footer, Navbar } from "@/components/layout/Navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { HomePage } from "@/features/venues/HomePage";
import { VenueListPage } from "@/features/venues/VenueListPage";
import { VenueDetailPage } from "@/features/venues/VenueDetailPage";
import { LoginPage } from "@/features/auth/LoginPage";
import { SignupPage } from "@/features/auth/SignupPage";
import { BookingsPage } from "@/features/bookings/BookingsPage";
import { OwnerDashboardPage } from "@/features/owner/OwnerDashboardPage";
import { SubmitVenuePage } from "@/features/owner/SubmitVenuePage";
import { ManageBookingsPage } from "@/features/owner/ManageBookingsPage";
import { AdminDashboardPage } from "@/features/admin/AdminDashboardPage";
import { AdminApprovalsPage } from "@/features/admin/AdminApprovalsPage";
import { authApi } from "@/api/auth";
import { useAuthStore } from "@/stores/authStore";

export default function App() {
  const { isAuthenticated, setUser, logout } = useAuthStore();
  const { data, isError } = useQuery({
    queryKey: ["me"],
    queryFn: authApi.me,
    enabled: isAuthenticated,
    retry: false,
  });

  useEffect(() => {
    if (data) setUser(data);
  }, [data, setUser]);

  useEffect(() => {
    if (isError && isAuthenticated) logout();
  }, [isError, isAuthenticated, logout]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/venues" element={<VenueListPage />} />
          <Route path="/venues/:id" element={<VenueDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/bookings"
            element={
              <ProtectedRoute>
                <BookingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner"
            element={
              <ProtectedRoute roles={["owner", "admin"]}>
                <OwnerDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/venues/new"
            element={
              <ProtectedRoute roles={["owner", "admin"]}>
                <SubmitVenuePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/bookings"
            element={
              <ProtectedRoute roles={["owner", "admin"]}>
                <ManageBookingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/approvals"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminApprovalsPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
