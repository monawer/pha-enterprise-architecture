
-- إضافة جدول للمراكز مع معلوماتها الأساسية
CREATE TABLE IF NOT EXISTS tech_data_center_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE,
  description TEXT,
  address TEXT,
  city TEXT,
  coordinates TEXT,
  manager_name TEXT,
  manager_contact TEXT,
  operational_status TEXT DEFAULT 'active',
  establishment_date DATE,
  total_area NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- تحديث جدول مراكز البيانات الحالي ليربط بالمواقع
ALTER TABLE tech_data_centers 
ADD COLUMN IF NOT EXISTS data_center_location_id UUID REFERENCES tech_data_center_locations(id);

-- إضافة جدول لربط المكونات التقنية بمراكز البيانات
CREATE TABLE IF NOT EXISTS tech_center_components (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data_center_location_id UUID NOT NULL REFERENCES tech_data_center_locations(id) ON DELETE CASCADE,
  component_type TEXT NOT NULL, -- 'physical_server', 'virtual_server', 'network_device', 'security_device'
  component_id UUID NOT NULL,
  component_name TEXT NOT NULL,
  installation_date DATE,
  status TEXT DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء فهرس للبحث السريع
CREATE INDEX IF NOT EXISTS idx_center_components_location ON tech_center_components(data_center_location_id);
CREATE INDEX IF NOT EXISTS idx_center_components_type ON tech_center_components(component_type);

-- إضافة عمود location_id للجداول التقنية الموجودة
ALTER TABLE tech_physical_servers 
ADD COLUMN IF NOT EXISTS data_center_location_id UUID REFERENCES tech_data_center_locations(id);

ALTER TABLE tech_virtual_servers 
ADD COLUMN IF NOT EXISTS data_center_location_id UUID REFERENCES tech_data_center_locations(id);

ALTER TABLE tech_network_devices 
ADD COLUMN IF NOT EXISTS data_center_location_id UUID REFERENCES tech_data_center_locations(id);

ALTER TABLE sec_devices 
ADD COLUMN IF NOT EXISTS data_center_location_id UUID REFERENCES tech_data_center_locations(id);
