
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import ArchitectureLayers from "./pages/ArchitectureLayers";
import BusinessLayer from "./pages/architecture/BusinessLayer";
import ApplicationsLayer from "./pages/architecture/ApplicationsLayer";
import TechnologyLayer from "./pages/architecture/TechnologyLayer";
import Services from "./pages/architecture/business/Services";
import Users from "./pages/admin/Users";
import Roles from "./pages/admin/Roles";
import Permissions from "./pages/admin/Permissions";
import References from "./pages/admin/References";
import MainLayout from "./components/layout/MainLayout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          } />
          <Route path="/architecture/layers" element={
            <MainLayout>
              <ArchitectureLayers />
            </MainLayout>
          } />
          <Route path="/architecture/business" element={
            <MainLayout>
              <BusinessLayer />
            </MainLayout>
          } />
          <Route path="/architecture/business/services" element={
            <MainLayout>
              <Services />
            </MainLayout>
          } />
          <Route path="/architecture/applications" element={
            <MainLayout>
              <ApplicationsLayer />
            </MainLayout>
          } />
          <Route path="/architecture/technology" element={
            <MainLayout>
              <TechnologyLayer />
            </MainLayout>
          } />
          <Route path="/admin/users" element={
            <MainLayout>
              <Users />
            </MainLayout>
          } />
          <Route path="/admin/roles" element={
            <MainLayout>
              <Roles />
            </MainLayout>
          } />
          <Route path="/admin/permissions" element={
            <MainLayout>
              <Permissions />
            </MainLayout>
          } />
          <Route path="/admin/references" element={
            <MainLayout>
              <References />
            </MainLayout>
          } />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
