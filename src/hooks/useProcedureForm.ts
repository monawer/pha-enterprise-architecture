
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
    if (procedure) {
      console.log("🟣 [ProcedureForm] useEffect procedure prop value:", procedure);
      
      // معالجة related_policies - إذا كانت تحتوي على قيم نصية نبحث عن IDs المقابلة
      let relatedPolicyIds = '';
      if (procedure.related_policies && policyOptions.length > 0) {
        console.log("🔍 Processing related_policies:", procedure.related_policies);
        console.log("🔍 Available policy options:", policyOptions);
        
        // إذا كانت تحتوي على فاصلة، قم بتقسيمها
        const policyNames = procedure.related_policies.split(',').map(p => p.trim());
        const foundIds: string[] = [];
        
        policyNames.forEach(policyName => {
          // البحث عن السياسة بالاسم أو الكود
          const foundPolicy = policyOptions.find(option => 
            option.policy_name === policyName || 
            option.id === policyName
          );
          
          if (foundPolicy) {
            foundIds.push(foundPolicy.id);
            console.log(`✅ Found policy: ${policyName} -> ID: ${foundPolicy.id}`);
          } else {
            console.log(`❌ Policy not found: ${policyName}`);
          }
        });
        
        relatedPolicyIds = foundIds.join(',');
        console.log("🎯 Final related_policies IDs:", relatedPolicyIds);
      }

      setFormData({
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
        related_policies: relatedPolicyIds,
        notes: procedure.notes || '',
      });
    }
  }, [procedure, policyOptions]);

  useEffect(() => {
    console.log("⚡ [ProcedureForm] current formData.related_policies:", formData.related_policies);
  }, [formData.related_policies]);

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
      if (procedure?.id) {
        const { error } = await supabase
          .from('biz_procedures')
          .update(formData)
          .eq('id', procedure.id);

        if (error) throw error;
        
        toast({
          title: "تم بنجاح",
          description: "تم تحديث الإجراء بنجاح",
        });
      } else {
        const { error } = await supabase
          .from('biz_procedures')
          .insert([formData]);

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
