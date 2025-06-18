
-- أولاً، التحقق من وجود موقع الرياض وإنشاؤه إذا لم يكن موجوداً
INSERT INTO tech_data_center_locations (name, city, operational_status)
SELECT 'مركز البيانات الرئيسي - الرياض', 'الرياض', 'active'
WHERE NOT EXISTS (
  SELECT 1 FROM tech_data_center_locations 
  WHERE name = 'مركز البيانات الرئيسي - الرياض'
);

-- نقل البيانات من tech_data_centers إلى tech_center_components
INSERT INTO tech_center_components (
  data_center_location_id,
  component_type,
  component_id,
  component_name,
  status,
  notes
)
SELECT 
  (SELECT id FROM tech_data_center_locations WHERE city = 'الرياض' LIMIT 1) as data_center_location_id,
  'data_center' as component_type,
  dc.id as component_id,
  dc.name as component_name,
  COALESCE(dc.operation_type, 'active') as status,
  CONCAT(
    CASE WHEN dc.tier_level IS NOT NULL THEN 'Tier Level: ' || dc.tier_level || '; ' ELSE '' END,
    CASE WHEN dc.environment IS NOT NULL THEN 'Environment: ' || dc.environment || '; ' ELSE '' END,
    CASE WHEN dc.center_type IS NOT NULL THEN 'Type: ' || dc.center_type || '; ' ELSE '' END,
    CASE WHEN dc.center_role IS NOT NULL THEN 'Role: ' || dc.center_role || '; ' ELSE '' END,
    CASE WHEN dc.location IS NOT NULL THEN 'Location: ' || dc.location || '; ' ELSE '' END,
    CASE WHEN dc.cost IS NOT NULL THEN 'Cost: ' || dc.cost::text || '; ' ELSE '' END
  ) as notes
FROM tech_data_centers dc
WHERE NOT EXISTS (
  SELECT 1 FROM tech_center_components tcc 
  WHERE tcc.component_id = dc.id AND tcc.component_type = 'data_center'
);
