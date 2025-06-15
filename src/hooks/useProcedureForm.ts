
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { usePoliciesOptions } from '@/hooks/usePoliciesOptions';
import { Procedure } from '@/types/procedure';

export const useProcedureForm = (procedure?: Procedure) => {
  const [formData, setFormData] = useState<Procedure>({
    procedure_name: '',
    procedure_code: '',
    procedure_description: '',
    procedure_type: '',
    automation_level: '',
    importance: '',
    execution_duration: '',
    procedure_inputs: '',
    procedure_outputs: '',
    execution_steps: '',
    business_rules: '',
    execution_requirements: '',
    related_services: '',
    related_policies: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { options: policyOptions, loading: loadingPolicies } = usePoliciesOptions();

  useEffect(() => {
    console.log("🔵 [useProcedureForm] useEffect triggered");
    console.log("🔵 [useProcedureForm] procedure prop:", procedure);
    console.log("🔵 [useProcedureForm] policyOptions length:", policyOptions.length);
    
    if (procedure) {
      console.log("🔵 [useProcedureForm] Setting form data from procedure");
      
      // معالجة related_policies
      let processedPolicies = '';
      if (procedure.related_policies && policyOptions.length > 0) {
        console.log("🔍 [useProcedureForm] Processing related_policies:", procedure.related_policies);
        
        // تقسيم النص إلى قائمة من الأسماء أو الأكواد
        const policyIdentifiers = procedure.related_policies.split(',').map(p => p.trim()).filter(Boolean);
        const foundIds: string[] = [];
        
        policyIdentifiers.forEach(identifier => {
          // البحث عن السياسة بالاسم، الكود، أو الـ ID
          const foundPolicy = policyOptions.find(option => 
            option.policy_name === identifier || 
            option.id === identifier ||
            identifier.includes(option.id)
          );
          
          if (foundPolicy) {
            foundIds.push(foundPolicy.id);
            console.log(`✅ [useProcedureForm] Found policy: ${identifier} -> ID: ${foundPolicy.id}`);
          } else {
            console.log(`❌ [useProcedureForm] Policy not found: ${identifier}`);
            // إذا لم نجد السياسة، نبقي النص الأصلي
            foundIds.push(identifier);
          }
        });
        
        processedPolicies = foundIds.join(',');
        console.log("🎯 [useProcedureForm] Final processed policies:", processedPolicies);
      } else if (procedure.related_policies) {
        // إذا لم تكن خيارات السياسات محملة بعد، نبقي النص الأصلي
        processedPolicies = procedure.related_policies;
        console.log("🔄 [useProcedureForm] Keeping original policies (options not loaded):", processedPolicies);
      }

      const newFormData = {
        id: procedure.id,
        procedure_name: procedure.procedure_name || '',
        procedure_code: procedure.procedure_code || '',
        procedure_description: procedure.procedure_description || '',
        procedure_type: procedure.procedure_type || '',
        automation_level: procedure.automation_level || '',
        importance: procedure.importance || '',
        execution_duration: procedure.execution_duration || '',
        procedure_inputs: procedure.procedure_inputs || '',
        procedure_outputs: procedure.procedure_outputs || '',
        execution_steps: procedure.execution_steps || '',
        business_rules: procedure.business_rules || '',
        execution_requirements: procedure.execution_requirements || '',
        related_services: procedure.related_services || '',
        related_policies: processedPolicies,
        notes: procedure.notes || '',
      };
      
      console.log("🎯 [useProcedureForm] Final form data:", newFormData);
      setFormData(newFormData);
    } else {
      console.log("🔵 [useProcedureForm] No procedure prop, resetting form");
      // إعادة تعيين النموذج للوضع الافتراضي
      setFormData({
        procedure_name: '',
        procedure_code: '',
        procedure_description: '',
        procedure_type: '',
        automation_level: '',
        importance: '',
        execution_duration: '',
        procedure_inputs: '',
        procedure_outputs: '',
        execution_steps: '',
        business_rules: '',
        execution_requirements: '',
        related_services: '',
        related_policies: '',
        notes: '',
      });
    }
  }, [procedure, policyOptions]);

  function getPolicyIds(value: string | undefined): string[] {
    if (!value || !value.trim()) return [];
    return value.split(',')
      .map(s => s.trim())
      .filter(Boolean)
      .filter((v, i, arr) => arr.indexOf(v) === i);
  }

  function getPoliciesString(ids: string[]): string {
    return ids
      .map(s => (s && String(s).trim()))
      .filter(Boolean)
      .join(',');
  }

  const handleSubmit = async (e: React.FormEvent, onSuccess: () => void) => {
    e.preventDefault();
    
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
      
      if (procedure?.id) {
        console.log("🟢 [useProcedureForm] Updating procedure with data:", dataToSave);
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
        console.log("🟢 [useProcedureForm] Creating new procedure with data:", dataToSave);
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
    formData,
    setFormData,
    loading,
    policyOptions,
    loadingPolicies,
    getPolicyIds,
    getPoliciesString,
    handleSubmit,
  };
};
