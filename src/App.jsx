import React from "react";
import { BrowserRouter } from "react-router-dom";
import { ToastProvider } from "./context/ToastContext";
import { AuthProvider } from "./context/AuthContext";
import { SkillProvider } from "./context/SkillContext";
import { AppRoutes } from "./routes/AppRoutes";

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <SkillProvider>
            <AppRoutes />
          </SkillProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
