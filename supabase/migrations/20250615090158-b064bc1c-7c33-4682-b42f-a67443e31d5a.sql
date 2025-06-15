
-- 1. إنشاء جدول المرجع لأنواع الإجراءات إذا لم يكن موجودًا
CREATE TABLE IF NOT EXISTS public.ref_procedure_types (
  code text PRIMARY KEY,
  name text NOT NULL,
  description text
);

-- إضافة القيم الشائعة حسب أفضل الممارسات
INSERT INTO public.ref_procedure_types (code, name)
VALUES
  ('operational', 'تشغيلي'),
  ('administrative', 'إداري'),
  ('technical', 'فني'),
  ('financial', 'مالي')
ON CONFLICT DO NOTHING;

-- 2. إنشاء جدول مرجعي لمستويات الأتمتة إذا لم يكن موجودًا
CREATE TABLE IF NOT EXISTS public.ref_automation_levels (
  code text PRIMARY KEY,
  name text NOT NULL
);

INSERT INTO public.ref_automation_levels (code, name) VALUES
  ('manual', 'يدوي'),
  ('semi_automated', 'شبه آلي'),
  ('automated', 'آلي'),
  ('fully_automated', 'آلي بالكامل')
ON CONFLICT DO NOTHING;
