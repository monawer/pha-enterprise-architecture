
-- أكثر القيم شيوعًا في عمود procedure_type
SELECT procedure_type, COUNT(*) AS freq
FROM public.biz_procedures
WHERE procedure_type IS NOT NULL
GROUP BY procedure_type
ORDER BY freq DESC;

-- أكثر القيم شيوعًا في عمود automation_level
SELECT automation_level, COUNT(*) AS freq
FROM public.biz_procedures
WHERE automation_level IS NOT NULL
GROUP BY automation_level
ORDER BY freq DESC;
