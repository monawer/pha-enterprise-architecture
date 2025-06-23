
-- إضافة حقل نوع المركز إلى جدول مراكز البيانات
ALTER TABLE tech_data_center_locations 
ADD COLUMN center_type TEXT DEFAULT 'data_center';

-- إضافة تعليق لتوضيح القيم المسموحة
COMMENT ON COLUMN tech_data_center_locations.center_type IS 'نوع المركز: data_center (مركز بيانات), communication_room (غرفة اتصال), distribution_room (غرفة توزيع)';
