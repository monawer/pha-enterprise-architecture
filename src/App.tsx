
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import DashboardHome from "./pages/DashboardHome";
import TogafNoraIntro from "./pages/TogafNoraIntro";
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
import DataCenters from "./pages/architecture/technology/DataCenters";
import Networks from "./pages/architecture/technology/Networks";
import Licenses from "./pages/architecture/technology/Licenses";
import Systems from "./pages/architecture/technology/Systems";
import SecurityDevices from "./pages/architecture/security/SecurityDevices";
import Users from "./pages/admin/Users";
import References from "./pages/admin/References";
import Settings from "./pages/Settings";
import MainLayout from "./components/layout/MainLayout";
import NotFound from "./pages/NotFound";
import ReferenceTableManager from "./components/admin/ReferenceTableManager";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

// Define reference tables for the routes
const referenceTableRoutes = [
  { path: 'departments', tableName: 'ref_departments', displayName: 'الإدارات والأقسام', description: 'قائمة بجميع الإدارات والأقسام في المؤسسة', columns: ['code', 'name', 'description', 'parent_code'] },
  { path: 'app-types', tableName: 'ref_app_types', displayName: 'أنواع التطبيقات', description: 'تصنيفات التطبيقات المختلفة', columns: ['code', 'name', 'description'] },
  { path: 'app-status', tableName: 'ref_app_status', displayName: 'حالات التطبيقات', description: 'الحالات المختلفة للتطبيقات', columns: ['code', 'name', 'description'] },
  { path: 'technologies', tableName: 'ref_technologies', displayName: 'التقنيات', description: 'قائمة التقنيات والأدوات المستخدمة', columns: ['code', 'name', 'description', 'category'] },
  { path: 'service-types', tableName: 'ref_service_types', displayName: 'أنواع الخدمات', description: 'تصنيفات الخدمات المقدمة', columns: ['code', 'name', 'description'] },
  { path: 'channel-types', tableName: 'ref_channel_types', displayName: 'أنواع القنوات', description: 'قنوات تقديم الخدمات المختلفة', columns: ['code', 'name', 'description'] },
  { path: 'data-classifications', tableName: 'ref_data_classifications', displayName: 'تصنيفات البيانات', description: 'مستويات تصنيف البيانات الأمنية', columns: ['code', 'name', 'description', 'level'] },
  { path: 'connection-types', tableName: 'ref_connection_types', displayName: 'أنواع الاتصالات', description: 'أنواع الاتصالات والتكامل', columns: ['code', 'name', 'description'] },
  { path: 'data-formats', tableName: 'ref_data_formats', displayName: 'صيغ البيانات', description: 'صيغ وأنواع البيانات المختلفة', columns: ['code', 'name', 'description'] },
  { path: 'integration-platforms', tableName: 'ref_integration_platforms', displayName: 'منصات التكامل', description: 'المنصات المستخدمة في التكامل', columns: ['code', 'name', 'description'] },
  { path: 'policy-types', tableName: 'ref_policy_types', displayName: 'أنواع السياسات', description: 'تصنيفات السياسات', columns: ['code', 'name', 'description'] },
  { path: 'procedure-types', tableName: 'ref_procedure_types', displayName: 'أنواع الإجراءات', description: 'تصنيفات الإجراءات', columns: ['code', 'name', 'description'] },
  { path: 'automation-levels', tableName: 'ref_automation_levels', displayName: 'مستويات الأتمتة', description: 'مستويات الأتمتة', columns: ['code', 'name'] },
  { path: 'operation-types', tableName: 'ref_operation_types', displayName: 'أنواع العمليات', description: 'تصنيفات العمليات', columns: ['code', 'name', 'description'] },
  { path: 'manufacturers', tableName: 'ref_manufacturers', displayName: 'الشركات المصنعة', description: 'بيانات الشركات المصنعة', columns: ['code', 'name', 'country', 'website'] },
  { path: 'security-functions', tableName: 'ref_security_functions', displayName: 'وظائف الأمان', description: 'وظائف الأمان المختلفة', columns: ['code', 'name', 'description', 'category'] }
];

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
              <DashboardHome />
            </MainLayout>
          } />
          <Route path="/info/togaf-nora" element={
            <MainLayout>
              <TogafNoraIntro />
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
          <Route path="/architecture/technology/data-centers" element={
            <MainLayout>
              <DataCenters />
            </MainLayout>
          } />
          <Route path="/architecture/technology/networks" element={
            <MainLayout>
              <Networks />
            </MainLayout>
          } />
          <Route path="/architecture/technology/licenses" element={
            <MainLayout>
              <Licenses />
            </MainLayout>
          } />
          <Route path="/architecture/technology/systems" element={
            <MainLayout>
              <Systems />
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
          <Route path="/admin/references" element={
            <MainLayout>
              <References />
            </MainLayout>
          } />
          
          {/* Dynamic routes for reference tables */}
          {referenceTableRoutes.map((table) => (
            <Route 
              key={table.path}
              path={`/admin/references/${table.path}`} 
              element={
                <MainLayout>
                  <ReferenceTableManager
                    table={{
                      tableName: table.tableName,
                      displayName: table.displayName,
                      description: table.description,
                      columns: table.columns
                    }}
                    onBack={() => window.history.back()}
                    canEdit={true}
                  />
                </MainLayout>
              } 
            />
          ))}
          
          <Route path="/settings" element={
            <MainLayout>
              <Settings />
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
