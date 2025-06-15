
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Procedure } from '@/types/procedure';

export const useProcedureFormSubmission = (procedure?: Procedure) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (
    e: React.FormEvent,
    formData: Procedure,
    onSuccess: () => void
  ) => {
    e.preventDefault();

    // سجل القيم أول شيء
    console.log("⏳ [handleSubmit] formData عند التعديل/الإضافة:", formData);

    if (!formData.procedure_name.trim()) {
      toast({
        title: "خطأ في التحقق",
        description: "اسم الإجراء مطلوب",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // إعداد البيانات للحفظ (بدون حقل id للإدراج الجديد)
      const { id, ...dataToSave } = formData;

      // سجل البيانات قبل رفعها
      console.log("⏫ [handleSubmit] dataToSave المُرسلة إلى Supabase:", dataToSave);

      if (procedure?.id) {
        console.log("🟢 [useProcedureFormSubmission] Updating procedure with data:", dataToSave);
        const { error } = await supabase
          .from('biz_procedures')
          .update(dataToSave)
          .eq('id', procedure.id);

        if (error) throw error;

        toast({
          title: "تم بنجاح",
          description: "تم تحديث الإجراء بنجاح",
        });
      } else {
        console.log("🟢 [useProcedureFormSubmission] Creating new procedure with data:", dataToSave);
        const { error } = await supabase
          .from('biz_procedures')
          .insert([dataToSave]);

        if (error) throw error;

        toast({
          title: "تم بنجاح",
          description: "تم إضافة الإجراء بنجاح",
        });
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving procedure:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حفظ البيانات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleSubmit
  };
};
