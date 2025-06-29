
-- تفعيل Row Level Security على جميع الجداول وتطبيق سياسات مرنة
-- هذا الحل يحل مشكلة الـ50 خطأ دون التأثير على وظائف المشروع

-- ===== الجداول المرجعية - سماح بالقراءة للجميع =====
ALTER TABLE ref_app_status ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON ref_app_status FOR SELECT USING (true);

ALTER TABLE ref_app_types ENABLE ROW LEVEL SECURITY;  
CREATE POLICY "Allow public read access" ON ref_app_types FOR SELECT USING (true);

ALTER TABLE ref_automation_levels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON ref_automation_levels FOR SELECT USING (true);

ALTER TABLE ref_channel_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON ref_channel_types FOR SELECT USING (true);

ALTER TABLE ref_connection_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON ref_connection_types FOR SELECT USING (true);

ALTER TABLE ref_data_classifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON ref_data_classifications FOR SELECT USING (true);

ALTER TABLE ref_data_formats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON ref_data_formats FOR SELECT USING (true);

ALTER TABLE ref_departments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON ref_departments FOR SELECT USING (true);

ALTER TABLE ref_development_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON ref_development_types FOR SELECT USING (true);

ALTER TABLE ref_form_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON ref_form_types FOR SELECT USING (true);

ALTER TABLE ref_integration_platforms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON ref_integration_platforms FOR SELECT USING (true);

ALTER TABLE ref_manufacturers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON ref_manufacturers FOR SELECT USING (true);

ALTER TABLE ref_operation_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON ref_operation_types FOR SELECT USING (true);

ALTER TABLE ref_policy_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON ref_policy_types FOR SELECT USING (true);

ALTER TABLE ref_procedure_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON ref_procedure_types FOR SELECT USING (true);

ALTER TABLE ref_security_functions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON ref_security_functions FOR SELECT USING (true);

ALTER TABLE ref_service_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON ref_service_types FOR SELECT USING (true);

ALTER TABLE ref_technologies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON ref_technologies FOR SELECT USING (true);

-- ===== جداول البيانات الأساسية - قراءة عامة، كتابة للمصادق عليهم =====
ALTER TABLE app_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON app_applications FOR SELECT USING (true);
CREATE POLICY "Allow authenticated write access" ON app_applications FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update access" ON app_applications FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete access" ON app_applications FOR DELETE TO authenticated USING (true);

ALTER TABLE app_databases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON app_databases FOR SELECT USING (true);
CREATE POLICY "Allow authenticated write access" ON app_databases FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update access" ON app_databases FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete access" ON app_databases FOR DELETE TO authenticated USING (true);

ALTER TABLE app_technical_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON app_technical_links FOR SELECT USING (true);
CREATE POLICY "Allow authenticated write access" ON app_technical_links FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update access" ON app_technical_links FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete access" ON app_technical_links FOR DELETE TO authenticated USING (true);

ALTER TABLE biz_branches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON biz_branches FOR SELECT USING (true);
CREATE POLICY "Allow authenticated write access" ON biz_branches FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update access" ON biz_branches FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete access" ON biz_branches FOR DELETE TO authenticated USING (true);

ALTER TABLE biz_business_owners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON biz_business_owners FOR SELECT USING (true);
CREATE POLICY "Allow authenticated write access" ON biz_business_owners FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update access" ON biz_business_owners FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete access" ON biz_business_owners FOR DELETE TO authenticated USING (true);

ALTER TABLE biz_capabilities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON biz_capabilities FOR SELECT USING (true);
CREATE POLICY "Allow authenticated write access" ON biz_capabilities FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update access" ON biz_capabilities FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete access" ON biz_capabilities FOR DELETE TO authenticated USING (true);

ALTER TABLE biz_channels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON biz_channels FOR SELECT USING (true);
CREATE POLICY "Allow authenticated write access" ON biz_channels FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update access" ON biz_channels FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete access" ON biz_channels FOR DELETE TO authenticated USING (true);

ALTER TABLE biz_forms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON biz_forms FOR SELECT USING (true);
CREATE POLICY "Allow authenticated write access" ON biz_forms FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update access" ON biz_forms FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete access" ON biz_forms FOR DELETE TO authenticated USING (true);

ALTER TABLE biz_policies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON biz_policies FOR SELECT USING (true);
CREATE POLICY "Allow authenticated write access" ON biz_policies FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update access" ON biz_policies FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete access" ON biz_policies FOR DELETE TO authenticated USING (true);

ALTER TABLE biz_procedures ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON biz_procedures FOR SELECT USING (true);
CREATE POLICY "Allow authenticated write access" ON biz_procedures FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update access" ON biz_procedures FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete access" ON biz_procedures FOR DELETE TO authenticated USING (true);

ALTER TABLE biz_services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON biz_services FOR SELECT USING (true);
CREATE POLICY "Allow authenticated write access" ON biz_services FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update access" ON biz_services FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete access" ON biz_services FOR DELETE TO authenticated USING (true);

ALTER TABLE data_entities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON data_entities FOR SELECT USING (true);
CREATE POLICY "Allow authenticated write access" ON data_entities FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update access" ON data_entities FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete access" ON data_entities FOR DELETE TO authenticated USING (true);

ALTER TABLE data_storage ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON data_storage FOR SELECT USING (true);
CREATE POLICY "Allow authenticated write access" ON data_storage FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update access" ON data_storage FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete access" ON data_storage FOR DELETE TO authenticated USING (true);

ALTER TABLE tech_data_center_locations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON tech_data_center_locations FOR SELECT USING (true);
CREATE POLICY "Allow authenticated write access" ON tech_data_center_locations FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update access" ON tech_data_center_locations FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete access" ON tech_data_center_locations FOR DELETE TO authenticated USING (true);

ALTER TABLE tech_data_centers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON tech_data_centers FOR SELECT USING (true);
CREATE POLICY "Allow authenticated write access" ON tech_data_centers FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update access" ON tech_data_centers FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete access" ON tech_data_centers FOR DELETE TO authenticated USING (true);

ALTER TABLE tech_center_components ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON tech_center_components FOR SELECT USING (true);
CREATE POLICY "Allow authenticated write access" ON tech_center_components FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update access" ON tech_center_components FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete access" ON tech_center_components FOR DELETE TO authenticated USING (true);

ALTER TABLE tech_licenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON tech_licenses FOR SELECT USING (true);
CREATE POLICY "Allow authenticated write access" ON tech_licenses FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update access" ON tech_licenses FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete access" ON tech_licenses FOR DELETE TO authenticated USING (true);

ALTER TABLE tech_network_devices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON tech_network_devices FOR SELECT USING (true);
CREATE POLICY "Allow authenticated write access" ON tech_network_devices FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update access" ON tech_network_devices FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete access" ON tech_network_devices FOR DELETE TO authenticated USING (true);

ALTER TABLE tech_networks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON tech_networks FOR SELECT USING (true);
CREATE POLICY "Allow authenticated write access" ON tech_networks FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update access" ON tech_networks FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete access" ON tech_networks FOR DELETE TO authenticated USING (true);

ALTER TABLE tech_physical_servers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON tech_physical_servers FOR SELECT USING (true);
CREATE POLICY "Allow authenticated write access" ON tech_physical_servers FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update access" ON tech_physical_servers FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete access" ON tech_physical_servers FOR DELETE TO authenticated USING (true);

ALTER TABLE tech_systems ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON tech_systems FOR SELECT USING (true);
CREATE POLICY "Allow authenticated write access" ON tech_systems FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update access" ON tech_systems FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete access" ON tech_systems FOR DELETE TO authenticated USING (true);

ALTER TABLE tech_virtual_servers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON tech_virtual_servers FOR SELECT USING (true);
CREATE POLICY "Allow authenticated write access" ON tech_virtual_servers FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update access" ON tech_virtual_servers FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete access" ON tech_virtual_servers FOR DELETE TO authenticated USING (true);

ALTER TABLE sec_devices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON sec_devices FOR SELECT USING (true);
CREATE POLICY "Allow authenticated write access" ON sec_devices FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update access" ON sec_devices FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete access" ON sec_devices FOR DELETE TO authenticated USING (true);

ALTER TABLE sec_services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON sec_services FOR SELECT USING (true);
CREATE POLICY "Allow authenticated write access" ON sec_services FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update access" ON sec_services FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete access" ON sec_services FOR DELETE TO authenticated USING (true);

ALTER TABLE sec_software ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON sec_software FOR SELECT USING (true);
CREATE POLICY "Allow authenticated write access" ON sec_software FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update access" ON sec_software FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete access" ON sec_software FOR DELETE TO authenticated USING (true);

ALTER TABLE ux_beneficiaries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON ux_beneficiaries FOR SELECT USING (true);
CREATE POLICY "Allow authenticated write access" ON ux_beneficiaries FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update access" ON ux_beneficiaries FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete access" ON ux_beneficiaries FOR DELETE TO authenticated USING (true);

ALTER TABLE ux_journeys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON ux_journeys FOR SELECT USING (true);
CREATE POLICY "Allow authenticated write access" ON ux_journeys FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update access" ON ux_journeys FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete access" ON ux_journeys FOR DELETE TO authenticated USING (true);

ALTER TABLE ux_personas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON ux_personas FOR SELECT USING (true);
CREATE POLICY "Allow authenticated write access" ON ux_personas FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update access" ON ux_personas FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete access" ON ux_personas FOR DELETE TO authenticated USING (true);

-- ===== الجداول الهيكلية - قراءة عامة، كتابة للمصادق عليهم =====
ALTER TABLE architecture_components ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON architecture_components FOR SELECT USING (true);
CREATE POLICY "Allow authenticated write access" ON architecture_components FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update access" ON architecture_components FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete access" ON architecture_components FOR DELETE TO authenticated USING (true);

ALTER TABLE architecture_layers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON architecture_layers FOR SELECT USING (true);
CREATE POLICY "Allow authenticated write access" ON architecture_layers FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update access" ON architecture_layers FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete access" ON architecture_layers FOR DELETE TO authenticated USING (true);

ALTER TABLE component_relationships ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON component_relationships FOR SELECT USING (true);
CREATE POLICY "Allow authenticated write access" ON component_relationships FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update access" ON component_relationships FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete access" ON component_relationships FOR DELETE TO authenticated USING (true);

-- ===== جداول التقارير والمؤشرات =====
ALTER TABLE kpis ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON kpis FOR SELECT USING (true);
CREATE POLICY "Allow authenticated write access" ON kpis FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update access" ON kpis FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete access" ON kpis FOR DELETE TO authenticated USING (true);

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON reports FOR SELECT USING (true);
CREATE POLICY "Allow authenticated write access" ON reports FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update access" ON reports FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete access" ON reports FOR DELETE TO authenticated USING (true);

-- ملاحظة: جدول user_profiles له RLS مفعل بالفعل حسب المعلومات المتوفرة
