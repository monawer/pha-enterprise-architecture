
import { useState, useEffect } from 'react';
import { Procedure } from '@/types/procedure';
import { PolicyOption } from '@/hooks/usePoliciesOptions';
import { processPolicies } from '@/utils/procedurePoliciesUtils';

// خريطة تحويل القيم الخاطئة إلى القيم الصحيحة للحقلين
const AUTOMATION_LEVELS = ["مؤتمت كليا", "مؤتمت جزئيا", "يدوي", "آلي جزئي", "آلي كلي"];
const IMPORTANCE_LEVELS = ["عالية", "متوسطة", "منخفضة"];

function fixFieldsMapping(p: Partial<Procedure>): Partial<Procedure> {
  let updated = { ...p };

  // أحياناً القيم تأتي بين الحقلين بشكل خاطئ: نصلح ذلك تلقائيًا
  // إذا كانت قيمة automation_level ليست من قائمة المستويات المسموحة، ننقلها إلى importance إذا كانت ضمن الاهمية والعكس
  if (
    updated.automation_level &&
    !AUTOMATION_LEVELS.includes(updated.automation_level) &&
    IMPORTANCE_LEVELS.includes(updated.automation_level)
  ) {
    // قيمة الأهمية في حقل مستوى الأتمتة! ننقلها للأهمية
    updated.importance = updated.automation_level;
    updated.automation_level = '';
  }
  if (
    updated.importance &&
    !IMPORTANCE_LEVELS.includes(updated.importance) &&
    AUTOMATION_LEVELS.includes(updated.importance)
  ) {
    // قيمة مستوى الأتمتة في حقل الأهمية! ننقلها لمستوى الأتمتة
    updated.automation_level = updated.importance;
    updated.importance = '';
  }
  return updated;
}

function sanitizeProcedure(p: Partial<Procedure> = {}): Procedure {
  console.log("🧹 [sanitizeProcedure] Input data before sanitization:", p);
  
  const cleaned = fixFieldsMapping(p);
  const result = {
    id: cleaned.id || '',
    procedure_name: cleaned.procedure_name ?? '',
    procedure_code: cleaned.procedure_code ?? '',
    procedure_description: cleaned.procedure_description ?? '',
    procedure_type: cleaned.procedure_type ?? '',
    automation_level: cleaned.automation_level ?? '',
    importance: cleaned.importance ?? '',
    execution_duration: cleaned.execution_duration ?? '',
    procedure_inputs: cleaned.procedure_inputs ?? '',
    procedure_outputs: cleaned.procedure_outputs ?? '',
    execution_steps: cleaned.execution_steps ?? '',
    business_rules: cleaned.business_rules ?? '',
    execution_requirements: cleaned.execution_requirements ?? '',
    related_services: cleaned.related_services ?? '',
    related_policies: cleaned.related_policies ?? '',
    notes: cleaned.notes ?? '',
    created_at: cleaned.created_at,
  };
  
  console.log("🧹 [sanitizeProcedure] Output data after sanitization:", result);
  return result;
}

export const useProcedureFormData = (
  procedure?: Procedure,
  policyOptions: PolicyOption[] = []
) => {
  const getInitialFormData = (): Procedure => {
    console.log("🆕 [getInitialFormData] Creating empty form data");
    return sanitizeProcedure();
  };

  const [formData, setFormData] = useState<Procedure>(getInitialFormData);

  useEffect(() => {
    console.log("🔵 [useProcedureFormData] useEffect triggered");
    console.log("🔵 [useProcedureFormData] procedure prop:", procedure);
    console.log("🔵 [useProcedureFormData] policyOptions length:", policyOptions.length);

    if (procedure) {
      console.log("🔵 [useProcedureFormData] Setting form data from procedure");
      console.log("📋 [useProcedureFormData] Original procedure data:", {
        id: procedure.id,
        procedure_name: procedure.procedure_name,
        procedure_code: procedure.procedure_code,
        procedure_description: procedure.procedure_description,
        procedure_type: procedure.procedure_type,
        automation_level: procedure.automation_level,
        importance: procedure.importance
      });

      const processedRelatedPolicies = processPolicies(
        procedure.related_policies ?? '',
        policyOptions
      );
      
      const sanitized = sanitizeProcedure({ 
        ...procedure, 
        related_policies: processedRelatedPolicies 
      });
      
      console.log("🎯 [useProcedureFormData] Final sanitized form data:", sanitized);
      console.log("📝 [useProcedureFormData] Setting formData state to:", {
        procedure_name: sanitized.procedure_name,
        procedure_code: sanitized.procedure_code,
        procedure_description: sanitized.procedure_description
      });
      
      setFormData(sanitized);
    } else {
      console.log("🔵 [useProcedureFormData] No procedure prop, resetting form");
      const emptyData = getInitialFormData();
      console.log("📝 [useProcedureFormData] Setting formData to empty:", emptyData);
      setFormData(emptyData);
    }
  }, [procedure, policyOptions]);

  // إضافة console log عند تغيير formData
  useEffect(() => {
    console.log("🔄 [useProcedureFormData] formData state changed:", {
      id: formData.id,
      procedure_name: formData.procedure_name,
      procedure_code: formData.procedure_code,
      procedure_description: formData.procedure_description
    });
  }, [formData]);

  return {
    formData,
    setFormData,
  };
};
