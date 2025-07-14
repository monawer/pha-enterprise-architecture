-- إنشاء جدول لحفظ مواضع المكونات في المناظير
CREATE TABLE public.archimate_node_positions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  component_id UUID NOT NULL,
  view_type TEXT NOT NULL,
  x_position NUMERIC NOT NULL,
  y_position NUMERIC NOT NULL,
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- فهرس مركب لضمان عدم تكرار المواضع لنفس المكون في نفس المنظر
  CONSTRAINT unique_component_view_user UNIQUE (component_id, view_type, user_id)
);

-- تمكين RLS
ALTER TABLE public.archimate_node_positions ENABLE ROW LEVEL SECURITY;

-- سياسات الوصول
CREATE POLICY "المستخدمون يمكنهم قراءة مواضعهم"
ON public.archimate_node_positions 
FOR SELECT 
USING (user_id IS NULL OR auth.uid() = user_id);

CREATE POLICY "المستخدمون يمكنهم إدراج مواضعهم"
ON public.archimate_node_positions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "المستخدمون يمكنهم تحديث مواضعهم"
ON public.archimate_node_positions 
FOR UPDATE 
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "المستخدمون يمكنهم حذف مواضعهم"
ON public.archimate_node_positions 
FOR DELETE 
USING (auth.uid() = user_id OR user_id IS NULL);

-- دالة لتحديث timestamp التحديث
CREATE OR REPLACE FUNCTION public.update_node_positions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- محفز لتحديث timestamp التحديث تلقائياً
CREATE TRIGGER update_archimate_node_positions_updated_at
  BEFORE UPDATE ON public.archimate_node_positions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_node_positions_updated_at();