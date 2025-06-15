import { useState, useEffect } from 'react';
import { Procedure } from '@/types/procedure';
import { PolicyOption } from '@/hooks/usePoliciesOptions';
import { processPolicies } from '@/utils/procedurePoliciesUtils';

// خريطة تحويل القيم الخاطئة إلى القيم الصحيحة للحقلين
const AUTOMATION_LEVELS = ["مؤتمت كليا", "مؤتمت جزئيا", "يدوي", "آلي جزئي", "آلي كلي"];
const IMPORTANCE_LEVELS = ["عالية", "متوسطة", "منخفضة"];

function fixFieldsMapping(p: Partial<Procedure>): Partial<Procedure> {
  let updated = { ...p };
  const originalAutomation = updated.automation_level;
  const originalImportance = updated.importance;

  console.log("🔧 [fixFieldsMapping] Initial values:", { automation: originalAutomation, importance: originalImportance });

  const automationIsActuallyImportance = originalAutomation &&
    !AUTOMATION_LEVELS.includes(originalAutomation) &&
    IMPORTANCE_LEVELS.some(level => originalAutomation.includes(level));
    
  const importanceIsActuallyAutomation = originalImportance &&
    !IMPORTANCE_LEVELS.some(level => originalImportance.includes(level)) &&
    AUTOMATION_LEVELS.includes(originalImportance);

  if (automationIsActuallyImportance && importanceIsActuallyAutomation) {
    // This is a swap
    console.log("🔄 [fixFieldsMapping] Swapping automation_level and importance");
    updated.automation_level = originalImportance;
    updated.importance = originalAutomation;
  } else if (automationIsActuallyImportance && !updated.importance) {
    // Only automation is wrong, and importance is empty
    console.log("➡️ [fixFieldsMapping] Moving automation_level to importance");
    updated.importance = originalAutomation;
    updated.automation_level = '';
  } else if (importanceIsActuallyAutomation && !updated.automation_level) {
    // Only importance is wrong, and automation is empty
    console.log("➡️ [fixFieldsMapping] Moving importance to automation_level");
    updated.automation_level = originalImportance;
    updated.importance = '';
  }

  // Normalize importance value to match select options
  if (updated.importance?.includes("متوسط")) {
      console.log(`[fixFieldsMapping] Normalizing importance from "${updated.importance}" to "متوسطة"`);
      updated.importance = "متوسطة";
  }
  
  console.log("🔧 [fixFieldsMapping] Final values:", { automation: updated.automation_level, importance: updated.importance });
  
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
    console.log(`🔵 [useProcedureFormData] useEffect - START. Procedure ID: ${procedure?.id}`);

    if (procedure) {
      console.log("🔵 [useProcedureFormData] useEffect - Procedure found. Processing...");
      const processedRelatedPolicies = processPolicies(
        procedure.related_policies ?? '',
        policyOptions
      );
      
      const sanitized = sanitizeProcedure({ 
        ...procedure, 
        related_policies: processedRelatedPolicies 
      });
      
      console.log("🎯 [useProcedureFormData] useEffect - Final sanitized form data:", sanitized);
      console.log("📝 [useProcedureFormData] useEffect - Setting formData state.");
      
      setFormData(sanitized);
    } else {
      console.log("🔵 [useProcedureFormData] useEffect - No procedure found. Resetting form.");
      const emptyData = getInitialFormData();
      console.log("📝 [useProcedureFormData] useEffect - Setting formData to empty.");
      setFormData(emptyData);
    }
    console.log(`🔵 [useProcedureFormData] useEffect - END. Procedure ID: ${procedure?.id}`);
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
