
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Auth from "../../pages/Auth";
import DashboardHome from "../../pages/DashboardHome";
import TogafNoraIntro from "../../pages/TogafNoraIntro";
import ArchitectureLayers from "../../pages/ArchitectureLayers";
import BusinessLayer from "../../pages/architecture/BusinessLayer";
import ApplicationsLayer from "../../pages/architecture/ApplicationsLayer";
import TechnologyLayer from "../../pages/architecture/TechnologyLayer";
import DataLayer from "../../pages/architecture/DataLayer";
import SecurityLayer from "../../pages/architecture/SecurityLayer";
import UXLayer from "../../pages/architecture/UXLayer";
import ArchimateViews from "../../pages/architecture/ArchimateViews";
import Metamodel from "../../pages/architecture/Metamodel";
import Services from "../../pages/architecture/business/Services";
import Procedures from "../../pages/architecture/business/Procedures";
import Policies from "../../pages/architecture/business/Policies";
import Forms from "../../pages/architecture/business/Forms";
import Capabilities from "../../pages/architecture/business/Capabilities";
import Branches from "../../pages/architecture/business/Branches";
import BusinessOwners from "../../pages/architecture/business/BusinessOwners";
import Apps from "../../pages/architecture/applications/Apps";
import Databases from "../../pages/architecture/applications/Databases";
import TechnicalLinks from "../../pages/architecture/applications/TechnicalLinks";
import DataEntities from "../../pages/architecture/data/DataEntities";
import DataStorage from "../../pages/architecture/data/DataStorage";
import PhysicalServers from "../../pages/architecture/technology/PhysicalServers";
import VirtualServers from "../../pages/architecture/technology/VirtualServers";
import NetworkDevices from "../../pages/architecture/technology/NetworkDevices";
import DataCenters from "../../pages/architecture/technology/DataCenters";
import Networks from "../../pages/architecture/technology/Networks";
import Licenses from "../../pages/architecture/technology/Licenses";
import Systems from "../../pages/architecture/technology/Systems";
import SecurityDevices from "../../pages/architecture/security/SecurityDevices";
import Users from "../../pages/admin/Users";
import References from "../../pages/admin/References";
import Settings from "../../pages/Settings";
import MainLayout from "../layout/MainLayout";
import NotFound from "../../pages/NotFound";
import ReferenceTableManager from "../admin/ReferenceTableManager";
import { referenceTableRoutes } from "../../config/referenceTableRoutes";

const AppRoutes: React.FC = () => {
  return (
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
      <Route path="/architecture/views" element={
        <MainLayout>
          <ArchimateViews />
        </MainLayout>
      } />
      <Route path="/architecture/metamodel" element={
        <MainLayout>
          <Metamodel />
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
  );
};

export default AppRoutes;
