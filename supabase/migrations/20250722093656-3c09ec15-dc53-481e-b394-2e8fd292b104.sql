-- إنشاء جدول الأدوار
CREATE TABLE public.roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- إنشاء جدول أدوار المستخدمين
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role_id)
);

-- تمكين Row Level Security
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- سياسات الأمان للأدوار
CREATE POLICY "Allow public read access" ON public.roles FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to manage roles" ON public.roles FOR ALL USING (true);

-- سياسات الأمان لأدوار المستخدمين
CREATE POLICY "Allow public read access" ON public.user_roles FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to manage user roles" ON public.user_roles FOR ALL USING (true);

-- إدراج الأدوار الافتراضية
INSERT INTO public.roles (name, description) VALUES 
('admin', 'Administrator with full access'),
('user', 'Regular user with basic access'),
('moderator', 'Moderator with intermediate access');