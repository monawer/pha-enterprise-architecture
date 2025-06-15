
export interface Procedure {
  id: string; // Make id required instead of optional
  procedure_name: string;
  procedure_code?: string;
  procedure_description?: string;
  procedure_type?: string;
  automation_level?: string;
  importance?: string;
  execution_duration?: string;
  procedure_inputs?: string;
  procedure_outputs?: string;
  execution_steps?: string;
  business_rules?: string;
  execution_requirements?: string;
  related_services?: string;
  related_policies?: string;
  notes?: string;
  created_at?: string;
}

export interface ProcedureFormProps {
  procedure?: Procedure;
  onSuccess: () => void;
  onCancel: () => void;
}
