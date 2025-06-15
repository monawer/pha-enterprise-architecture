
-- حذف العلاقات أولاً لتجنب أخطاء المفاتيح الأجنبية
DROP TABLE IF EXISTS public.role_permissions CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;
DROP TABLE IF EXISTS public.roles CASCADE;
DROP TABLE IF EXISTS public.permissions CASCADE;

-- حذف الدوال المساعدة المرتبطة بالصلاحيات - إذا وجدت
DROP FUNCTION IF EXISTS public.get_user_permissions CASCADE;
DROP FUNCTION IF EXISTS public.user_has_permission CASCADE;
DROP FUNCTION IF EXISTS public.get_user_roles CASCADE;
DROP FUNCTION IF EXISTS public.is_admin_user CASCADE;
