
-- إيجاد القيم غير المطابقة في procedure_type
SELECT DISTINCT procedure_type
FROM public.biz_procedures
WHERE procedure_type IS NOT NULL
  AND procedure_type NOT IN (SELECT name FROM public.ref_procedure_types);

-- إيجاد القيم غير المطابقة في automation_level
SELECT DISTINCT automation_level
FROM public.biz_procedures
WHERE automation_level IS NOT NULL
  AND automation_level NOT IN (SELECT name FROM public.ref_automation_levels);
