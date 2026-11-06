import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Public pages
import { LandingPage } from "../pages/public/LandingPage";
import { DiscoverPage } from "../pages/discover/DiscoverPage";
import { SkillDetailsPage } from "../pages/skills/SkillDetailsPage";
import { UserProfilePage } from "../pages/profile/UserProfilePage";

// Auth pages
import { LoginPage } from "../pages/auth/LoginPage";
import { RegisterPage } from "../pages/auth/RegisterPage";
import { ForgotPasswordPage } from "../pages/auth/ForgotPasswordPage";
import { ResetPasswordPage } from "../pages/auth/ResetPasswordPage";
import { EmailVerifyPage } from "../pages/auth/EmailVerifyPage";
import { RegisterSuccessPage } from "../pages/auth/RegisterSuccessPage";

// Dashboard pages
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { DashboardOverviewPage } from "../pages/dashboard/DashboardOverviewPage";
import { TeacherPortalPage } from "../pages/dashboard/TeacherPortalPage";
import { LearnerPortalPage } from "../pages/dashboard/LearnerPortalPage";
import { LearningRequestsPage } from "../pages/dashboard/LearningRequestsPage";
import { SkillExchangePage } from "../pages/dashboard/SkillExchangePage";
import { SessionsPage } from "../pages/sessions/SessionsPage";
import { MessagesPage } from "../pages/messages/MessagesPage";
import { ProgressPage } from "../pages/dashboard/ProgressPage";
import { ReviewsPage } from "../pages/dashboard/ReviewsPage";
import { NotificationsPage } from "../pages/dashboard/NotificationsPage";
import { SettingsPage } from "../pages/settings/SettingsPage";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/discover" element={<DiscoverPage />} />
      <Route path="/skills/:id" element={<SkillDetailsPage />} />
      <Route path="/profile/:id" element={<UserProfilePage />} />

      {/* Auth routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/verify-email" element={<EmailVerifyPage />} />
      <Route path="/register-success" element={<RegisterSuccessPage />} />

      {/* Dashboard authenticated routes */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardOverviewPage />} />
        <Route path="exchange" element={<SkillExchangePage />} />
        <Route path="teaching" element={<TeacherPortalPage />} />
        <Route path="learning" element={<LearnerPortalPage />} />
        <Route path="requests" element={<LearningRequestsPage />} />
        <Route path="sessions" element={<SessionsPage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="progress" element={<ProgressPage />} />
        <Route path="reviews" element={<ReviewsPage />} />
        <Route path="profile" element={<UserProfilePage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

