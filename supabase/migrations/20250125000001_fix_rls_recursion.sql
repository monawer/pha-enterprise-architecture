
-- إزالة السياسات المتضاربة من جدول user_roles
DROP POLICY IF EXISTS "المستخدمون يمكنهم عرض أدوارهم" ON public.user_roles;
DROP POLICY IF EXISTS "المشرفون يمكنهم عرض جميع أدوار المستخدمين" ON public.user_roles;

-- إنشاء دالة security definer لتجنب التكرار اللانهائي
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT COALESCE(
    (SELECT r.name 
     FROM public.roles r 
     INNER JOIN public.user_roles ur ON r.id = ur.role_id 
     WHERE ur.user_id = auth.uid() 
     LIMIT 1),
    'user'
  );
$$;

-- إنشاء سياسة جديدة باستخدام الدالة
CREATE POLICY "المستخدمون يمكنهم عرض أدوارهم الخاصة" 
ON public.user_roles 
FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- إنشاء سياسة للمشرفين باستخدام بريد إلكتروني محدد
CREATE POLICY "مدير النظام يمكنه عرض جميع الأدوار" 
ON public.user_roles 
FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email = 'monawer@monawer.com'
  )
);
