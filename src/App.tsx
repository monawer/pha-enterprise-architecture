
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
import DataLayer from "./pages/architecture/DataLayer";
import SecurityLayer from "./pages/architecture/SecurityLayer";
import UXLayer from "./pages/architecture/UXLayer";
import Services from "./pages/architecture/business/Services";
import Procedures from "./pages/architecture/business/Procedures";
import Policies from "./pages/architecture/business/Policies";
import Forms from "./pages/architecture/business/Forms";
import Capabilities from "./pages/architecture/business/Capabilities";
import Branches from "./pages/architecture/business/Branches";
import BusinessOwners from "./pages/architecture/business/BusinessOwners";
import Apps from "./pages/architecture/applications/Apps";
import Databases from "./pages/architecture/applications/Databases";
import TechnicalLinks from "./pages/architecture/applications/TechnicalLinks";
import DataEntities from "./pages/architecture/data/DataEntities";
import DataStorage from "./pages/architecture/data/DataStorage";
import PhysicalServers from "./pages/architecture/technology/PhysicalServers";
import VirtualServers from "./pages/architecture/technology/VirtualServers";
import NetworkDevices from "./pages/architecture/technology/NetworkDevices";
import SecurityDevices from "./pages/architecture/security/SecurityDevices";
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
          <Route path="/architecture/business/procedures" element={
            <MainLayout>
              <Procedures />
            </MainLayout>
          } />
          <Route path="/architecture/business/policies" element={
            <MainLayout>
              <Policies />
            </MainLayout>
          } />
          <Route path="/architecture/business/forms" element={
            <MainLayout>
              <Forms />
            </MainLayout>
          } />
          <Route path="/architecture/business/capabilities" element={
            <MainLayout>
              <Capabilities />
            </MainLayout>
          } />
          <Route path="/architecture/business/branches" element={
            <MainLayout>
              <Branches />
            </MainLayout>
          } />
          <Route path="/architecture/business/business-owners" element={
            <MainLayout>
              <BusinessOwners />
            </MainLayout>
          } />
          <Route path="/architecture/applications" element={
            <MainLayout>
              <ApplicationsLayer />
            </MainLayout>
          } />
          <Route path="/architecture/applications/apps" element={
            <MainLayout>
              <Apps />
            </MainLayout>
          } />
          <Route path="/architecture/applications/databases" element={
            <MainLayout>
              <Databases />
            </MainLayout>
          } />
          <Route path="/architecture/applications/technical-links" element={
            <MainLayout>
              <TechnicalLinks />
            </MainLayout>
          } />
          <Route path="/architecture/technology" element={
            <MainLayout>
              <TechnologyLayer />
            </MainLayout>
          } />
          <Route path="/architecture/technology/physical-servers" element={
            <MainLayout>
              <PhysicalServers />
            </MainLayout>
          } />
          <Route path="/architecture/technology/virtual-servers" element={
            <MainLayout>
              <VirtualServers />
            </MainLayout>
          } />
          <Route path="/architecture/technology/network-devices" element={
            <MainLayout>
              <NetworkDevices />
            </MainLayout>
          } />
          <Route path="/architecture/data" element={
            <MainLayout>
              <DataLayer />
            </MainLayout>
          } />
          <Route path="/architecture/data/entities" element={
            <MainLayout>
              <DataEntities />
            </MainLayout>
          } />
          <Route path="/architecture/data/storage" element={
            <MainLayout>
              <DataStorage />
            </MainLayout>
          } />
          <Route path="/architecture/security" element={
            <MainLayout>
              <SecurityLayer />
            </MainLayout>
          } />
          <Route path="/architecture/security/devices" element={
            <MainLayout>
              <SecurityDevices />
            </MainLayout>
          } />
          <Route path="/architecture/ux" element={
            <MainLayout>
              <UXLayer />
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
