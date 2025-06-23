export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      app_applications: {
        Row: {
          app_link: string | null
          app_status: string | null
          app_type: string | null
          app_type_ref: string | null
          architecture_pattern: string | null
          authentication_type: string | null
          capital_cost: number | null
          code: string | null
          component_id: string | null
          created_at: string | null
          description: string | null
          developer_entity: string | null
          development_technology: string | null
          development_type: string | null
          development_type_ref: string | null
          end_user: string | null
          hosting_server: string | null
          id: string
          importance: string | null
          launch_date: string | null
          layer: string | null
          name: string
          operation_type_ref: string | null
          operational_cost: number | null
          owning_department: string | null
          owning_department_ref: string | null
          source_type: string | null
          status: string | null
          status_ref: string | null
          technical_owner: string | null
          technology_ref: string | null
          updated_at: string | null
          user_count: number | null
          using_department: string | null
          using_department_ref: string | null
          version: string | null
        }
        Insert: {
          app_link?: string | null
          app_status?: string | null
          app_type?: string | null
          app_type_ref?: string | null
          architecture_pattern?: string | null
          authentication_type?: string | null
          capital_cost?: number | null
          code?: string | null
          component_id?: string | null
          created_at?: string | null
          description?: string | null
          developer_entity?: string | null
          development_technology?: string | null
          development_type?: string | null
          development_type_ref?: string | null
          end_user?: string | null
          hosting_server?: string | null
          id?: string
          importance?: string | null
          launch_date?: string | null
          layer?: string | null
          name: string
          operation_type_ref?: string | null
          operational_cost?: number | null
          owning_department?: string | null
          owning_department_ref?: string | null
          source_type?: string | null
          status?: string | null
          status_ref?: string | null
          technical_owner?: string | null
          technology_ref?: string | null
          updated_at?: string | null
          user_count?: number | null
          using_department?: string | null
          using_department_ref?: string | null
          version?: string | null
        }
        Update: {
          app_link?: string | null
          app_status?: string | null
          app_type?: string | null
          app_type_ref?: string | null
          architecture_pattern?: string | null
          authentication_type?: string | null
          capital_cost?: number | null
          code?: string | null
          component_id?: string | null
          created_at?: string | null
          description?: string | null
          developer_entity?: string | null
          development_technology?: string | null
          development_type?: string | null
          development_type_ref?: string | null
          end_user?: string | null
          hosting_server?: string | null
          id?: string
          importance?: string | null
          launch_date?: string | null
          layer?: string | null
          name?: string
          operation_type_ref?: string | null
          operational_cost?: number | null
          owning_department?: string | null
          owning_department_ref?: string | null
          source_type?: string | null
          status?: string | null
          status_ref?: string | null
          technical_owner?: string | null
          technology_ref?: string | null
          updated_at?: string | null
          user_count?: number | null
          using_department?: string | null
          using_department_ref?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "app_applications_app_type_ref_fkey"
            columns: ["app_type_ref"]
            isOneToOne: false
            referencedRelation: "ref_app_types"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "app_applications_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "architecture_components"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "app_applications_development_type_ref_fkey"
            columns: ["development_type_ref"]
            isOneToOne: false
            referencedRelation: "ref_development_types"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "app_applications_operation_type_ref_fkey"
            columns: ["operation_type_ref"]
            isOneToOne: false
            referencedRelation: "ref_operation_types"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "app_applications_owning_department_ref_fkey"
            columns: ["owning_department_ref"]
            isOneToOne: false
            referencedRelation: "ref_departments"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "app_applications_status_ref_fkey"
            columns: ["status_ref"]
            isOneToOne: false
            referencedRelation: "ref_app_status"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "app_applications_technology_ref_fkey"
            columns: ["technology_ref"]
            isOneToOne: false
            referencedRelation: "ref_technologies"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "app_applications_using_department_ref_fkey"
            columns: ["using_department_ref"]
            isOneToOne: false
            referencedRelation: "ref_departments"
            referencedColumns: ["code"]
          },
        ]
      }
      app_databases: {
        Row: {
          application_name: string | null
          component_id: string | null
          created_at: string | null
          database_environment_type: string | null
          database_name: string
          id: string
          updated_at: string | null
        }
        Insert: {
          application_name?: string | null
          component_id?: string | null
          created_at?: string | null
          database_environment_type?: string | null
          database_name: string
          id?: string
          updated_at?: string | null
        }
        Update: {
          application_name?: string | null
          component_id?: string | null
          created_at?: string | null
          database_environment_type?: string | null
          database_name?: string
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "app_databases_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "architecture_components"
            referencedColumns: ["id"]
          },
        ]
      }
      app_technical_links: {
        Row: {
          component_id: string | null
          connection_method: string | null
          connection_scope: string | null
          connection_type: string | null
          connection_type_ref: string | null
          created_at: string | null
          data_format: string | null
          data_format_ref: string | null
          description: string | null
          id: string
          inputs: string | null
          integration_platform: string | null
          integration_platform_ref: string | null
          name: string
          number: string | null
          outputs: string | null
          product: string | null
          receiver: string | null
          sender: string | null
          updated_at: string | null
        }
        Insert: {
          component_id?: string | null
          connection_method?: string | null
          connection_scope?: string | null
          connection_type?: string | null
          connection_type_ref?: string | null
          created_at?: string | null
          data_format?: string | null
          data_format_ref?: string | null
          description?: string | null
          id?: string
          inputs?: string | null
          integration_platform?: string | null
          integration_platform_ref?: string | null
          name: string
          number?: string | null
          outputs?: string | null
          product?: string | null
          receiver?: string | null
          sender?: string | null
          updated_at?: string | null
        }
        Update: {
          component_id?: string | null
          connection_method?: string | null
          connection_scope?: string | null
          connection_type?: string | null
          connection_type_ref?: string | null
          created_at?: string | null
          data_format?: string | null
          data_format_ref?: string | null
          description?: string | null
          id?: string
          inputs?: string | null
          integration_platform?: string | null
          integration_platform_ref?: string | null
          name?: string
          number?: string | null
          outputs?: string | null
          product?: string | null
          receiver?: string | null
          sender?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "app_technical_links_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "architecture_components"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "app_technical_links_connection_type_ref_fkey"
            columns: ["connection_type_ref"]
            isOneToOne: false
            referencedRelation: "ref_connection_types"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "app_technical_links_data_format_ref_fkey"
            columns: ["data_format_ref"]
            isOneToOne: false
            referencedRelation: "ref_data_formats"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "app_technical_links_integration_platform_ref_fkey"
            columns: ["integration_platform_ref"]
            isOneToOne: false
            referencedRelation: "ref_integration_platforms"
            referencedColumns: ["code"]
          },
        ]
      }
      architecture_components: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          layer_id: string
          name: string
          owner: string | null
          parent_id: string | null
          status: Database["public"]["Enums"]["component_status"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          layer_id: string
          name: string
          owner?: string | null
          parent_id?: string | null
          status?: Database["public"]["Enums"]["component_status"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          layer_id?: string
          name?: string
          owner?: string | null
          parent_id?: string | null
          status?: Database["public"]["Enums"]["component_status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "architecture_components_layer_id_fkey"
            columns: ["layer_id"]
            isOneToOne: false
            referencedRelation: "architecture_layers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "architecture_components_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "architecture_components"
            referencedColumns: ["id"]
          },
        ]
      }
      architecture_layers: {
        Row: {
          code: string
          created_at: string | null
          description: string | null
          id: string
          name: string
          order_num: number
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          order_num: number
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          order_num?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      biz_branches: {
        Row: {
          branch_code: string | null
          branch_location: string | null
          branch_name: string
          component_id: string | null
          created_at: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          branch_code?: string | null
          branch_location?: string | null
          branch_name: string
          component_id?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          branch_code?: string | null
          branch_location?: string | null
          branch_name?: string
          component_id?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "biz_branches_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "architecture_components"
            referencedColumns: ["id"]
          },
        ]
      }
      biz_business_owners: {
        Row: {
          code: string
          component_id: string | null
          created_at: string | null
          id: string
          job_description: string | null
          parent_code: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          code: string
          component_id?: string | null
          created_at?: string | null
          id?: string
          job_description?: string | null
          parent_code?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          code?: string
          component_id?: string | null
          created_at?: string | null
          id?: string
          job_description?: string | null
          parent_code?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "biz_business_owners_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "architecture_components"
            referencedColumns: ["id"]
          },
        ]
      }
      biz_capabilities: {
        Row: {
          capability_classification: string | null
          capability_description: string | null
          capability_name: string
          capability_owner: string | null
          component_id: string | null
          created_at: string | null
          id: string
          task_code: string | null
          updated_at: string | null
        }
        Insert: {
          capability_classification?: string | null
          capability_description?: string | null
          capability_name: string
          capability_owner?: string | null
          component_id?: string | null
          created_at?: string | null
          id?: string
          task_code?: string | null
          updated_at?: string | null
        }
        Update: {
          capability_classification?: string | null
          capability_description?: string | null
          capability_name?: string
          capability_owner?: string | null
          component_id?: string | null
          created_at?: string | null
          id?: string
          task_code?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "biz_capabilities_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "architecture_components"
            referencedColumns: ["id"]
          },
        ]
      }
      biz_channels: {
        Row: {
          channel_code: string | null
          channel_name: string
          channel_type: string | null
          channel_type_ref: string | null
          component_id: string | null
          created_at: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          channel_code?: string | null
          channel_name: string
          channel_type?: string | null
          channel_type_ref?: string | null
          component_id?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          channel_code?: string | null
          channel_name?: string
          channel_type?: string | null
          channel_type_ref?: string | null
          component_id?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "biz_channels_channel_type_ref_fkey"
            columns: ["channel_type_ref"]
            isOneToOne: false
            referencedRelation: "ref_channel_types"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "biz_channels_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "architecture_components"
            referencedColumns: ["id"]
          },
        ]
      }
      biz_forms: {
        Row: {
          automation_level_enum:
            | Database["public"]["Enums"]["automation_level"]
            | null
          automation_status: string | null
          component_id: string | null
          created_at: string | null
          form_code: string | null
          form_description: string | null
          form_name: string
          form_type: string | null
          form_type_ref: string | null
          id: string
          related_procedures: string | null
          related_services: string | null
          storage_location: string | null
          updated_at: string | null
        }
        Insert: {
          automation_level_enum?:
            | Database["public"]["Enums"]["automation_level"]
            | null
          automation_status?: string | null
          component_id?: string | null
          created_at?: string | null
          form_code?: string | null
          form_description?: string | null
          form_name: string
          form_type?: string | null
          form_type_ref?: string | null
          id?: string
          related_procedures?: string | null
          related_services?: string | null
          storage_location?: string | null
          updated_at?: string | null
        }
        Update: {
          automation_level_enum?:
            | Database["public"]["Enums"]["automation_level"]
            | null
          automation_status?: string | null
          component_id?: string | null
          created_at?: string | null
          form_code?: string | null
          form_description?: string | null
          form_name?: string
          form_type?: string | null
          form_type_ref?: string | null
          id?: string
          related_procedures?: string | null
          related_services?: string | null
          storage_location?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "biz_forms_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "architecture_components"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "biz_forms_form_type_ref_fkey"
            columns: ["form_type_ref"]
            isOneToOne: false
            referencedRelation: "ref_form_types"
            referencedColumns: ["code"]
          },
        ]
      }
      biz_policies: {
        Row: {
          activation_date: string | null
          component_id: string | null
          created_at: string | null
          id: string
          owning_department: string | null
          owning_department_ref: string | null
          owning_sector: string | null
          policy_code: string | null
          policy_description: string | null
          policy_name: string
          policy_status: string | null
          policy_type: string | null
          policy_type_ref: string | null
          related_procedures: string | null
          related_services: string | null
          updated_at: string | null
        }
        Insert: {
          activation_date?: string | null
          component_id?: string | null
          created_at?: string | null
          id?: string
          owning_department?: string | null
          owning_department_ref?: string | null
          owning_sector?: string | null
          policy_code?: string | null
          policy_description?: string | null
          policy_name: string
          policy_status?: string | null
          policy_type?: string | null
          policy_type_ref?: string | null
          related_procedures?: string | null
          related_services?: string | null
          updated_at?: string | null
        }
        Update: {
          activation_date?: string | null
          component_id?: string | null
          created_at?: string | null
          id?: string
          owning_department?: string | null
          owning_department_ref?: string | null
          owning_sector?: string | null
          policy_code?: string | null
          policy_description?: string | null
          policy_name?: string
          policy_status?: string | null
          policy_type?: string | null
          policy_type_ref?: string | null
          related_procedures?: string | null
          related_services?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "biz_policies_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "architecture_components"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "biz_policies_owning_department_ref_fkey"
            columns: ["owning_department_ref"]
            isOneToOne: false
            referencedRelation: "biz_business_owners"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "biz_policies_policy_type_ref_fkey"
            columns: ["policy_type_ref"]
            isOneToOne: false
            referencedRelation: "ref_policy_types"
            referencedColumns: ["code"]
          },
        ]
      }
      biz_procedures: {
        Row: {
          automation_level: string | null
          automation_level_enum:
            | Database["public"]["Enums"]["automation_level"]
            | null
          beneficiary_type: string | null
          business_rules: string | null
          component_id: string | null
          created_at: string | null
          execution_duration: string | null
          execution_requirements: string | null
          execution_steps: string | null
          execution_systems: string | null
          id: string
          importance: string | null
          notes: string | null
          priority_level: Database["public"]["Enums"]["priority_level"] | null
          procedure_classification: string | null
          procedure_code: string | null
          procedure_description: string | null
          procedure_inputs: string | null
          procedure_name: string
          procedure_outputs: string | null
          procedure_type: string | null
          procedure_type_ref: string | null
          related_policies: string | null
          related_procedures: string | null
          related_services: string | null
          updated_at: string | null
        }
        Insert: {
          automation_level?: string | null
          automation_level_enum?:
            | Database["public"]["Enums"]["automation_level"]
            | null
          beneficiary_type?: string | null
          business_rules?: string | null
          component_id?: string | null
          created_at?: string | null
          execution_duration?: string | null
          execution_requirements?: string | null
          execution_steps?: string | null
          execution_systems?: string | null
          id?: string
          importance?: string | null
          notes?: string | null
          priority_level?: Database["public"]["Enums"]["priority_level"] | null
          procedure_classification?: string | null
          procedure_code?: string | null
          procedure_description?: string | null
          procedure_inputs?: string | null
          procedure_name: string
          procedure_outputs?: string | null
          procedure_type?: string | null
          procedure_type_ref?: string | null
          related_policies?: string | null
          related_procedures?: string | null
          related_services?: string | null
          updated_at?: string | null
        }
        Update: {
          automation_level?: string | null
          automation_level_enum?:
            | Database["public"]["Enums"]["automation_level"]
            | null
          beneficiary_type?: string | null
          business_rules?: string | null
          component_id?: string | null
          created_at?: string | null
          execution_duration?: string | null
          execution_requirements?: string | null
          execution_steps?: string | null
          execution_systems?: string | null
          id?: string
          importance?: string | null
          notes?: string | null
          priority_level?: Database["public"]["Enums"]["priority_level"] | null
          procedure_classification?: string | null
          procedure_code?: string | null
          procedure_description?: string | null
          procedure_inputs?: string | null
          procedure_name?: string
          procedure_outputs?: string | null
          procedure_type?: string | null
          procedure_type_ref?: string | null
          related_policies?: string | null
          related_procedures?: string | null
          related_services?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "biz_procedures_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "architecture_components"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "biz_procedures_procedure_type_ref_fkey"
            columns: ["procedure_type_ref"]
            isOneToOne: false
            referencedRelation: "ref_procedure_types"
            referencedColumns: ["code"]
          },
        ]
      }
      biz_services: {
        Row: {
          annual_beneficiaries: number | null
          annual_operations: number | null
          application_steps: string | null
          authority_importance: string | null
          beneficiary_type: string | null
          component_id: string | null
          created_at: string | null
          current_maturity: string | null
          current_maturity_enum:
            | Database["public"]["Enums"]["maturity_level"]
            | null
          customer_satisfaction: number | null
          delivery_channels: string | null
          delivery_method: string | null
          execution_time: string | null
          external_entities_connection: string | null
          external_integration: string | null
          faq_link: string | null
          highest_maturity: string | null
          highest_maturity_enum:
            | Database["public"]["Enums"]["maturity_level"]
            | null
          id: string
          integration_method: string | null
          internal_external: string | null
          keywords: string | null
          launch_date: string | null
          ownership_type: string | null
          owning_department: string | null
          owning_department_ref: string | null
          platform: string | null
          required_documents: string | null
          satisfaction_measurement_channels: string | null
          service_code: string | null
          service_conditions: string | null
          service_description: string | null
          service_fees: number | null
          service_language: string | null
          service_link: string | null
          service_name: string
          service_priority: string | null
          service_stability: string | null
          service_type: string | null
          service_type_ref: string | null
          sla_link: string | null
          target_user: string | null
          updated_at: string | null
          user_guide: string | null
        }
        Insert: {
          annual_beneficiaries?: number | null
          annual_operations?: number | null
          application_steps?: string | null
          authority_importance?: string | null
          beneficiary_type?: string | null
          component_id?: string | null
          created_at?: string | null
          current_maturity?: string | null
          current_maturity_enum?:
            | Database["public"]["Enums"]["maturity_level"]
            | null
          customer_satisfaction?: number | null
          delivery_channels?: string | null
          delivery_method?: string | null
          execution_time?: string | null
          external_entities_connection?: string | null
          external_integration?: string | null
          faq_link?: string | null
          highest_maturity?: string | null
          highest_maturity_enum?:
            | Database["public"]["Enums"]["maturity_level"]
            | null
          id?: string
          integration_method?: string | null
          internal_external?: string | null
          keywords?: string | null
          launch_date?: string | null
          ownership_type?: string | null
          owning_department?: string | null
          owning_department_ref?: string | null
          platform?: string | null
          required_documents?: string | null
          satisfaction_measurement_channels?: string | null
          service_code?: string | null
          service_conditions?: string | null
          service_description?: string | null
          service_fees?: number | null
          service_language?: string | null
          service_link?: string | null
          service_name: string
          service_priority?: string | null
          service_stability?: string | null
          service_type?: string | null
          service_type_ref?: string | null
          sla_link?: string | null
          target_user?: string | null
          updated_at?: string | null
          user_guide?: string | null
        }
        Update: {
          annual_beneficiaries?: number | null
          annual_operations?: number | null
          application_steps?: string | null
          authority_importance?: string | null
          beneficiary_type?: string | null
          component_id?: string | null
          created_at?: string | null
          current_maturity?: string | null
          current_maturity_enum?:
            | Database["public"]["Enums"]["maturity_level"]
            | null
          customer_satisfaction?: number | null
          delivery_channels?: string | null
          delivery_method?: string | null
          execution_time?: string | null
          external_entities_connection?: string | null
          external_integration?: string | null
          faq_link?: string | null
          highest_maturity?: string | null
          highest_maturity_enum?:
            | Database["public"]["Enums"]["maturity_level"]
            | null
          id?: string
          integration_method?: string | null
          internal_external?: string | null
          keywords?: string | null
          launch_date?: string | null
          ownership_type?: string | null
          owning_department?: string | null
          owning_department_ref?: string | null
          platform?: string | null
          required_documents?: string | null
          satisfaction_measurement_channels?: string | null
          service_code?: string | null
          service_conditions?: string | null
          service_description?: string | null
          service_fees?: number | null
          service_language?: string | null
          service_link?: string | null
          service_name?: string
          service_priority?: string | null
          service_stability?: string | null
          service_type?: string | null
          service_type_ref?: string | null
          sla_link?: string | null
          target_user?: string | null
          updated_at?: string | null
          user_guide?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "biz_services_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "architecture_components"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "biz_services_owning_department_ref_fkey"
            columns: ["owning_department_ref"]
            isOneToOne: false
            referencedRelation: "ref_departments"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "biz_services_service_type_ref_fkey"
            columns: ["service_type_ref"]
            isOneToOne: false
            referencedRelation: "ref_service_types"
            referencedColumns: ["code"]
          },
        ]
      }
      component_relationships: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          metadata: Json | null
          relationship_direction: string | null
          relationship_strength: string | null
          relationship_type: string
          source_component_id: string | null
          target_component_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          relationship_direction?: string | null
          relationship_strength?: string | null
          relationship_type: string
          source_component_id?: string | null
          target_component_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          relationship_direction?: string | null
          relationship_strength?: string | null
          relationship_type?: string
          source_component_id?: string | null
          target_component_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "component_relationships_source_component_id_fkey"
            columns: ["source_component_id"]
            isOneToOne: false
            referencedRelation: "architecture_components"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "component_relationships_target_component_id_fkey"
            columns: ["target_component_id"]
            isOneToOne: false
            referencedRelation: "architecture_components"
            referencedColumns: ["id"]
          },
        ]
      }
      data_entities: {
        Row: {
          component_id: string | null
          created_at: string | null
          data_classification: string | null
          data_classification_ref: string | null
          data_owner: string | null
          data_status: string | null
          data_storage: string | null
          description_ar: string | null
          description_en: string | null
          entity_id: string | null
          entity_name_ar: string
          entity_name_en: string | null
          id: string
          related_application: string | null
          related_services: string | null
          updated_at: string | null
        }
        Insert: {
          component_id?: string | null
          created_at?: string | null
          data_classification?: string | null
          data_classification_ref?: string | null
          data_owner?: string | null
          data_status?: string | null
          data_storage?: string | null
          description_ar?: string | null
          description_en?: string | null
          entity_id?: string | null
          entity_name_ar: string
          entity_name_en?: string | null
          id?: string
          related_application?: string | null
          related_services?: string | null
          updated_at?: string | null
        }
        Update: {
          component_id?: string | null
          created_at?: string | null
          data_classification?: string | null
          data_classification_ref?: string | null
          data_owner?: string | null
          data_status?: string | null
          data_storage?: string | null
          description_ar?: string | null
          description_en?: string | null
          entity_id?: string | null
          entity_name_ar?: string
          entity_name_en?: string | null
          id?: string
          related_application?: string | null
          related_services?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "data_entities_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "architecture_components"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "data_entities_data_classification_ref_fkey"
            columns: ["data_classification_ref"]
            isOneToOne: false
            referencedRelation: "ref_data_classifications"
            referencedColumns: ["code"]
          },
        ]
      }
      data_storage: {
        Row: {
          code: string | null
          component_id: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          structure: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          code?: string | null
          component_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          structure?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          code?: string | null
          component_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          structure?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "data_storage_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "architecture_components"
            referencedColumns: ["id"]
          },
        ]
      }
      kpis: {
        Row: {
          actual: number
          category_id: string
          created_at: string
          description: string | null
          id: string
          name: string
          period: string
          target: number
          unit: string
          updated_at: string
        }
        Insert: {
          actual: number
          category_id: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          period: string
          target: number
          unit: string
          updated_at?: string
        }
        Update: {
          actual?: number
          category_id?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          period?: string
          target?: number
          unit?: string
          updated_at?: string
        }
        Relationships: []
      }
      ref_app_status: {
        Row: {
          code: string
          description: string | null
          name: string
        }
        Insert: {
          code: string
          description?: string | null
          name: string
        }
        Update: {
          code?: string
          description?: string | null
          name?: string
        }
        Relationships: []
      }
      ref_app_types: {
        Row: {
          code: string
          description: string | null
          name: string
        }
        Insert: {
          code: string
          description?: string | null
          name: string
        }
        Update: {
          code?: string
          description?: string | null
          name?: string
        }
        Relationships: []
      }
      ref_automation_levels: {
        Row: {
          code: string
          name: string
        }
        Insert: {
          code: string
          name: string
        }
        Update: {
          code?: string
          name?: string
        }
        Relationships: []
      }
      ref_channel_types: {
        Row: {
          code: string
          description: string | null
          name: string
        }
        Insert: {
          code: string
          description?: string | null
          name: string
        }
        Update: {
          code?: string
          description?: string | null
          name?: string
        }
        Relationships: []
      }
      ref_connection_types: {
        Row: {
          code: string
          description: string | null
          name: string
        }
        Insert: {
          code: string
          description?: string | null
          name: string
        }
        Update: {
          code?: string
          description?: string | null
          name?: string
        }
        Relationships: []
      }
      ref_data_classifications: {
        Row: {
          code: string
          description: string | null
          level: number | null
          name: string
        }
        Insert: {
          code: string
          description?: string | null
          level?: number | null
          name: string
        }
        Update: {
          code?: string
          description?: string | null
          level?: number | null
          name?: string
        }
        Relationships: []
      }
      ref_data_formats: {
        Row: {
          code: string
          description: string | null
          name: string
        }
        Insert: {
          code: string
          description?: string | null
          name: string
        }
        Update: {
          code?: string
          description?: string | null
          name?: string
        }
        Relationships: []
      }
      ref_departments: {
        Row: {
          code: string
          description: string | null
          name: string
          parent_code: string | null
        }
        Insert: {
          code: string
          description?: string | null
          name: string
          parent_code?: string | null
        }
        Update: {
          code?: string
          description?: string | null
          name?: string
          parent_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ref_departments_parent_code_fkey"
            columns: ["parent_code"]
            isOneToOne: false
            referencedRelation: "ref_departments"
            referencedColumns: ["code"]
          },
        ]
      }
      ref_development_types: {
        Row: {
          code: string
          description: string | null
          name: string
        }
        Insert: {
          code: string
          description?: string | null
          name: string
        }
        Update: {
          code?: string
          description?: string | null
          name?: string
        }
        Relationships: []
      }
      ref_form_types: {
        Row: {
          code: string
          description: string | null
          name: string
        }
        Insert: {
          code: string
          description?: string | null
          name: string
        }
        Update: {
          code?: string
          description?: string | null
          name?: string
        }
        Relationships: []
      }
      ref_integration_platforms: {
        Row: {
          code: string
          description: string | null
          name: string
        }
        Insert: {
          code: string
          description?: string | null
          name: string
        }
        Update: {
          code?: string
          description?: string | null
          name?: string
        }
        Relationships: []
      }
      ref_manufacturers: {
        Row: {
          code: string
          country: string | null
          name: string
          website: string | null
        }
        Insert: {
          code: string
          country?: string | null
          name: string
          website?: string | null
        }
        Update: {
          code?: string
          country?: string | null
          name?: string
          website?: string | null
        }
        Relationships: []
      }
      ref_operation_types: {
        Row: {
          code: string
          description: string | null
          name: string
        }
        Insert: {
          code: string
          description?: string | null
          name: string
        }
        Update: {
          code?: string
          description?: string | null
          name?: string
        }
        Relationships: []
      }
      ref_policy_types: {
        Row: {
          code: string
          description: string | null
          name: string
        }
        Insert: {
          code: string
          description?: string | null
          name: string
        }
        Update: {
          code?: string
          description?: string | null
          name?: string
        }
        Relationships: []
      }
      ref_procedure_types: {
        Row: {
          code: string
          description: string | null
          name: string
        }
        Insert: {
          code: string
          description?: string | null
          name: string
        }
        Update: {
          code?: string
          description?: string | null
          name?: string
        }
        Relationships: []
      }
      ref_security_functions: {
        Row: {
          category: string | null
          code: string
          description: string | null
          name: string
        }
        Insert: {
          category?: string | null
          code: string
          description?: string | null
          name: string
        }
        Update: {
          category?: string | null
          code?: string
          description?: string | null
          name?: string
        }
        Relationships: []
      }
      ref_service_types: {
        Row: {
          code: string
          description: string | null
          name: string
        }
        Insert: {
          code: string
          description?: string | null
          name: string
        }
        Update: {
          code?: string
          description?: string | null
          name?: string
        }
        Relationships: []
      }
      ref_technologies: {
        Row: {
          category: string | null
          code: string
          description: string | null
          name: string
        }
        Insert: {
          category?: string | null
          code: string
          description?: string | null
          name: string
        }
        Update: {
          category?: string | null
          code?: string
          description?: string | null
          name?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          name: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      sec_devices: {
        Row: {
          code: string | null
          component_id: string | null
          created_at: string | null
          data_center_location_id: string | null
          firmware_version: string | null
          function: string | null
          function_ref: string | null
          host_name: string
          id: string
          initial_cost: number | null
          manufacturer: string | null
          manufacturer_ref: string | null
          model: string | null
          network_segment: string | null
          operation_type: string | null
          operation_type_ref: string | null
          operational_cost: number | null
          support_end_date: string | null
          updated_at: string | null
          vendor_support_status: string | null
        }
        Insert: {
          code?: string | null
          component_id?: string | null
          created_at?: string | null
          data_center_location_id?: string | null
          firmware_version?: string | null
          function?: string | null
          function_ref?: string | null
          host_name: string
          id?: string
          initial_cost?: number | null
          manufacturer?: string | null
          manufacturer_ref?: string | null
          model?: string | null
          network_segment?: string | null
          operation_type?: string | null
          operation_type_ref?: string | null
          operational_cost?: number | null
          support_end_date?: string | null
          updated_at?: string | null
          vendor_support_status?: string | null
        }
        Update: {
          code?: string | null
          component_id?: string | null
          created_at?: string | null
          data_center_location_id?: string | null
          firmware_version?: string | null
          function?: string | null
          function_ref?: string | null
          host_name?: string
          id?: string
          initial_cost?: number | null
          manufacturer?: string | null
          manufacturer_ref?: string | null
          model?: string | null
          network_segment?: string | null
          operation_type?: string | null
          operation_type_ref?: string | null
          operational_cost?: number | null
          support_end_date?: string | null
          updated_at?: string | null
          vendor_support_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sec_devices_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "architecture_components"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sec_devices_data_center_location_id_fkey"
            columns: ["data_center_location_id"]
            isOneToOne: false
            referencedRelation: "tech_data_center_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sec_devices_function_ref_fkey"
            columns: ["function_ref"]
            isOneToOne: false
            referencedRelation: "ref_security_functions"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "sec_devices_manufacturer_ref_fkey"
            columns: ["manufacturer_ref"]
            isOneToOne: false
            referencedRelation: "ref_manufacturers"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "sec_devices_operation_type_ref_fkey"
            columns: ["operation_type_ref"]
            isOneToOne: false
            referencedRelation: "ref_operation_types"
            referencedColumns: ["code"]
          },
        ]
      }
      sec_services: {
        Row: {
          code: string | null
          component_id: string | null
          created_at: string | null
          description: string | null
          function: string | null
          id: string
          initial_cost: number | null
          operation_type: string | null
          operational_cost: number | null
          service_name: string
          updated_at: string | null
          vendor_support_status: string | null
        }
        Insert: {
          code?: string | null
          component_id?: string | null
          created_at?: string | null
          description?: string | null
          function?: string | null
          id?: string
          initial_cost?: number | null
          operation_type?: string | null
          operational_cost?: number | null
          service_name: string
          updated_at?: string | null
          vendor_support_status?: string | null
        }
        Update: {
          code?: string | null
          component_id?: string | null
          created_at?: string | null
          description?: string | null
          function?: string | null
          id?: string
          initial_cost?: number | null
          operation_type?: string | null
          operational_cost?: number | null
          service_name?: string
          updated_at?: string | null
          vendor_support_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sec_services_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "architecture_components"
            referencedColumns: ["id"]
          },
        ]
      }
      sec_software: {
        Row: {
          code: string | null
          component_id: string | null
          created_at: string | null
          function: string | null
          function_ref: string | null
          id: string
          initial_cost: number | null
          manufacturer: string | null
          manufacturer_ref: string | null
          name: string
          operation_type: string | null
          operation_type_ref: string | null
          operational_cost: number | null
          updated_at: string | null
          vendor_support_end_date: string | null
          vendor_support_status: string | null
          version: string | null
        }
        Insert: {
          code?: string | null
          component_id?: string | null
          created_at?: string | null
          function?: string | null
          function_ref?: string | null
          id?: string
          initial_cost?: number | null
          manufacturer?: string | null
          manufacturer_ref?: string | null
          name: string
          operation_type?: string | null
          operation_type_ref?: string | null
          operational_cost?: number | null
          updated_at?: string | null
          vendor_support_end_date?: string | null
          vendor_support_status?: string | null
          version?: string | null
        }
        Update: {
          code?: string | null
          component_id?: string | null
          created_at?: string | null
          function?: string | null
          function_ref?: string | null
          id?: string
          initial_cost?: number | null
          manufacturer?: string | null
          manufacturer_ref?: string | null
          name?: string
          operation_type?: string | null
          operation_type_ref?: string | null
          operational_cost?: number | null
          updated_at?: string | null
          vendor_support_end_date?: string | null
          vendor_support_status?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sec_software_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "architecture_components"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sec_software_function_ref_fkey"
            columns: ["function_ref"]
            isOneToOne: false
            referencedRelation: "ref_security_functions"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "sec_software_manufacturer_ref_fkey"
            columns: ["manufacturer_ref"]
            isOneToOne: false
            referencedRelation: "ref_manufacturers"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "sec_software_operation_type_ref_fkey"
            columns: ["operation_type_ref"]
            isOneToOne: false
            referencedRelation: "ref_operation_types"
            referencedColumns: ["code"]
          },
        ]
      }
      tech_center_components: {
        Row: {
          component_id: string
          component_name: string
          component_type: string
          created_at: string | null
          data_center_location_id: string
          id: string
          installation_date: string | null
          notes: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          component_id: string
          component_name: string
          component_type: string
          created_at?: string | null
          data_center_location_id: string
          id?: string
          installation_date?: string | null
          notes?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          component_id?: string
          component_name?: string
          component_type?: string
          created_at?: string | null
          data_center_location_id?: string
          id?: string
          installation_date?: string | null
          notes?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tech_center_components_data_center_location_id_fkey"
            columns: ["data_center_location_id"]
            isOneToOne: false
            referencedRelation: "tech_data_center_locations"
            referencedColumns: ["id"]
          },
        ]
      }
      tech_data_center_locations: {
        Row: {
          address: string | null
          center_type: string | null
          city: string | null
          code: string | null
          coordinates: string | null
          created_at: string | null
          description: string | null
          establishment_date: string | null
          id: string
          manager_contact: string | null
          manager_name: string | null
          name: string
          operational_status: string | null
          total_area: number | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          center_type?: string | null
          city?: string | null
          code?: string | null
          coordinates?: string | null
          created_at?: string | null
          description?: string | null
          establishment_date?: string | null
          id?: string
          manager_contact?: string | null
          manager_name?: string | null
          name: string
          operational_status?: string | null
          total_area?: number | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          center_type?: string | null
          city?: string | null
          code?: string | null
          coordinates?: string | null
          created_at?: string | null
          description?: string | null
          establishment_date?: string | null
          id?: string
          manager_contact?: string | null
          manager_name?: string | null
          name?: string
          operational_status?: string | null
          total_area?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      tech_data_centers: {
        Row: {
          center_role: string | null
          center_type: string | null
          code: string | null
          component_id: string | null
          cost: number | null
          created_at: string | null
          data_center_location_id: string | null
          environment: string | null
          id: string
          location: string | null
          name: string
          operation_type: string | null
          tier_level: string | null
          updated_at: string | null
        }
        Insert: {
          center_role?: string | null
          center_type?: string | null
          code?: string | null
          component_id?: string | null
          cost?: number | null
          created_at?: string | null
          data_center_location_id?: string | null
          environment?: string | null
          id?: string
          location?: string | null
          name: string
          operation_type?: string | null
          tier_level?: string | null
          updated_at?: string | null
        }
        Update: {
          center_role?: string | null
          center_type?: string | null
          code?: string | null
          component_id?: string | null
          cost?: number | null
          created_at?: string | null
          data_center_location_id?: string | null
          environment?: string | null
          id?: string
          location?: string | null
          name?: string
          operation_type?: string | null
          tier_level?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tech_data_centers_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "architecture_components"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tech_data_centers_data_center_location_id_fkey"
            columns: ["data_center_location_id"]
            isOneToOne: false
            referencedRelation: "tech_data_center_locations"
            referencedColumns: ["id"]
          },
        ]
      }
      tech_licenses: {
        Row: {
          acquisition_date: string | null
          code: string | null
          component_id: string | null
          cost: number | null
          created_at: string | null
          expiry_date: string | null
          id: string
          license_name: string
          manufacturer: string | null
          quantity: number | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          acquisition_date?: string | null
          code?: string | null
          component_id?: string | null
          cost?: number | null
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          license_name: string
          manufacturer?: string | null
          quantity?: number | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          acquisition_date?: string | null
          code?: string | null
          component_id?: string | null
          cost?: number | null
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          license_name?: string
          manufacturer?: string | null
          quantity?: number | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tech_licenses_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "architecture_components"
            referencedColumns: ["id"]
          },
        ]
      }
      tech_network_devices: {
        Row: {
          cabinet: string | null
          cluster_id: string | null
          component_id: string | null
          cpu: string | null
          created_at: string | null
          data_center_location_id: string | null
          device_status: string | null
          firmware_version: string | null
          function: string | null
          host_name: string
          id: string
          initial_cost: number | null
          location: string | null
          manufacturer: string | null
          manufacturer_ref: string | null
          model: string | null
          network_segment: string | null
          operation_type: string | null
          operation_type_ref: string | null
          operational_cost: number | null
          physical_ram: string | null
          storage_capacity: string | null
          support_end_date: string | null
          technology: string | null
          total_cpu_cores: number | null
          type: string | null
          updated_at: string | null
          vendor_support_status: string | null
          vm_monitor_type: string | null
          vm_monitor_version: string | null
        }
        Insert: {
          cabinet?: string | null
          cluster_id?: string | null
          component_id?: string | null
          cpu?: string | null
          created_at?: string | null
          data_center_location_id?: string | null
          device_status?: string | null
          firmware_version?: string | null
          function?: string | null
          host_name: string
          id?: string
          initial_cost?: number | null
          location?: string | null
          manufacturer?: string | null
          manufacturer_ref?: string | null
          model?: string | null
          network_segment?: string | null
          operation_type?: string | null
          operation_type_ref?: string | null
          operational_cost?: number | null
          physical_ram?: string | null
          storage_capacity?: string | null
          support_end_date?: string | null
          technology?: string | null
          total_cpu_cores?: number | null
          type?: string | null
          updated_at?: string | null
          vendor_support_status?: string | null
          vm_monitor_type?: string | null
          vm_monitor_version?: string | null
        }
        Update: {
          cabinet?: string | null
          cluster_id?: string | null
          component_id?: string | null
          cpu?: string | null
          created_at?: string | null
          data_center_location_id?: string | null
          device_status?: string | null
          firmware_version?: string | null
          function?: string | null
          host_name?: string
          id?: string
          initial_cost?: number | null
          location?: string | null
          manufacturer?: string | null
          manufacturer_ref?: string | null
          model?: string | null
          network_segment?: string | null
          operation_type?: string | null
          operation_type_ref?: string | null
          operational_cost?: number | null
          physical_ram?: string | null
          storage_capacity?: string | null
          support_end_date?: string | null
          technology?: string | null
          total_cpu_cores?: number | null
          type?: string | null
          updated_at?: string | null
          vendor_support_status?: string | null
          vm_monitor_type?: string | null
          vm_monitor_version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tech_network_devices_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "architecture_components"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tech_network_devices_data_center_location_id_fkey"
            columns: ["data_center_location_id"]
            isOneToOne: false
            referencedRelation: "tech_data_center_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tech_network_devices_manufacturer_ref_fkey"
            columns: ["manufacturer_ref"]
            isOneToOne: false
            referencedRelation: "ref_manufacturers"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "tech_network_devices_operation_type_ref_fkey"
            columns: ["operation_type_ref"]
            isOneToOne: false
            referencedRelation: "ref_operation_types"
            referencedColumns: ["code"]
          },
        ]
      }
      tech_networks: {
        Row: {
          component_id: string | null
          cost: number | null
          created_at: string | null
          id: string
          network_connection_type: string | null
          network_location: string | null
          network_role: string | null
          network_type: string | null
          operation_type: string | null
          updated_at: string | null
        }
        Insert: {
          component_id?: string | null
          cost?: number | null
          created_at?: string | null
          id?: string
          network_connection_type?: string | null
          network_location?: string | null
          network_role?: string | null
          network_type?: string | null
          operation_type?: string | null
          updated_at?: string | null
        }
        Update: {
          component_id?: string | null
          cost?: number | null
          created_at?: string | null
          id?: string
          network_connection_type?: string | null
          network_location?: string | null
          network_role?: string | null
          network_type?: string | null
          operation_type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tech_networks_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "architecture_components"
            referencedColumns: ["id"]
          },
        ]
      }
      tech_physical_servers: {
        Row: {
          cluster_id: string | null
          component_id: string | null
          created_at: string | null
          data_center_location_id: string | null
          host_name: string
          id: string
          initial_cost: number | null
          local_storage_capacity: string | null
          manufacturer: string | null
          manufacturer_ref: string | null
          model: string | null
          network_segment: string | null
          operation_type: string | null
          operation_type_ref: string | null
          operational_cost: number | null
          processor: string | null
          ram: string | null
          total_cpu_cores: number | null
          updated_at: string | null
          vendor_support_end_date: string | null
          vendor_support_status: string | null
          vm_monitor_type: string | null
          vm_monitor_version: string | null
        }
        Insert: {
          cluster_id?: string | null
          component_id?: string | null
          created_at?: string | null
          data_center_location_id?: string | null
          host_name: string
          id?: string
          initial_cost?: number | null
          local_storage_capacity?: string | null
          manufacturer?: string | null
          manufacturer_ref?: string | null
          model?: string | null
          network_segment?: string | null
          operation_type?: string | null
          operation_type_ref?: string | null
          operational_cost?: number | null
          processor?: string | null
          ram?: string | null
          total_cpu_cores?: number | null
          updated_at?: string | null
          vendor_support_end_date?: string | null
          vendor_support_status?: string | null
          vm_monitor_type?: string | null
          vm_monitor_version?: string | null
        }
        Update: {
          cluster_id?: string | null
          component_id?: string | null
          created_at?: string | null
          data_center_location_id?: string | null
          host_name?: string
          id?: string
          initial_cost?: number | null
          local_storage_capacity?: string | null
          manufacturer?: string | null
          manufacturer_ref?: string | null
          model?: string | null
          network_segment?: string | null
          operation_type?: string | null
          operation_type_ref?: string | null
          operational_cost?: number | null
          processor?: string | null
          ram?: string | null
          total_cpu_cores?: number | null
          updated_at?: string | null
          vendor_support_end_date?: string | null
          vendor_support_status?: string | null
          vm_monitor_type?: string | null
          vm_monitor_version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tech_physical_servers_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "architecture_components"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tech_physical_servers_data_center_location_id_fkey"
            columns: ["data_center_location_id"]
            isOneToOne: false
            referencedRelation: "tech_data_center_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tech_physical_servers_manufacturer_ref_fkey"
            columns: ["manufacturer_ref"]
            isOneToOne: false
            referencedRelation: "ref_manufacturers"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "tech_physical_servers_operation_type_ref_fkey"
            columns: ["operation_type_ref"]
            isOneToOne: false
            referencedRelation: "ref_operation_types"
            referencedColumns: ["code"]
          },
        ]
      }
      tech_systems: {
        Row: {
          component_id: string | null
          cost: number | null
          created_at: string | null
          function: string | null
          id: string
          manufacturer: string | null
          name: string
          operation_type: string | null
          system_status: string | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          component_id?: string | null
          cost?: number | null
          created_at?: string | null
          function?: string | null
          id?: string
          manufacturer?: string | null
          name: string
          operation_type?: string | null
          system_status?: string | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          component_id?: string | null
          cost?: number | null
          created_at?: string | null
          function?: string | null
          id?: string
          manufacturer?: string | null
          name?: string
          operation_type?: string | null
          system_status?: string | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tech_systems_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "architecture_components"
            referencedColumns: ["id"]
          },
        ]
      }
      tech_virtual_servers: {
        Row: {
          backup: string | null
          cluster_id: string | null
          component_id: string | null
          created_at: string | null
          data_center_location_id: string | null
          disaster_recovery: string | null
          environment: string | null
          host_name: string
          id: string
          initial_cost: number | null
          network_segment: string | null
          operation_type: string | null
          operation_type_ref: string | null
          operational_cost: number | null
          os_type: string | null
          os_version: string | null
          status: string | null
          updated_at: string | null
          virtual_cpu: number | null
          virtual_disk: string | null
          virtual_ram: string | null
        }
        Insert: {
          backup?: string | null
          cluster_id?: string | null
          component_id?: string | null
          created_at?: string | null
          data_center_location_id?: string | null
          disaster_recovery?: string | null
          environment?: string | null
          host_name: string
          id?: string
          initial_cost?: number | null
          network_segment?: string | null
          operation_type?: string | null
          operation_type_ref?: string | null
          operational_cost?: number | null
          os_type?: string | null
          os_version?: string | null
          status?: string | null
          updated_at?: string | null
          virtual_cpu?: number | null
          virtual_disk?: string | null
          virtual_ram?: string | null
        }
        Update: {
          backup?: string | null
          cluster_id?: string | null
          component_id?: string | null
          created_at?: string | null
          data_center_location_id?: string | null
          disaster_recovery?: string | null
          environment?: string | null
          host_name?: string
          id?: string
          initial_cost?: number | null
          network_segment?: string | null
          operation_type?: string | null
          operation_type_ref?: string | null
          operational_cost?: number | null
          os_type?: string | null
          os_version?: string | null
          status?: string | null
          updated_at?: string | null
          virtual_cpu?: number | null
          virtual_disk?: string | null
          virtual_ram?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tech_virtual_servers_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "architecture_components"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tech_virtual_servers_data_center_location_id_fkey"
            columns: ["data_center_location_id"]
            isOneToOne: false
            referencedRelation: "tech_data_center_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tech_virtual_servers_operation_type_ref_fkey"
            columns: ["operation_type_ref"]
            isOneToOne: false
            referencedRelation: "ref_operation_types"
            referencedColumns: ["code"]
          },
        ]
      }
      user_profiles: {
        Row: {
          created_at: string
          department: string | null
          full_name: string
          id: string
          is_active: boolean
          updated_at: string
        }
        Insert: {
          created_at?: string
          department?: string | null
          full_name: string
          id: string
          is_active?: boolean
          updated_at?: string
        }
        Update: {
          created_at?: string
          department?: string | null
          full_name?: string
          id?: string
          is_active?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      ux_beneficiaries: {
        Row: {
          component_id: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          type: string | null
          updated_at: string | null
        }
        Insert: {
          component_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          component_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ux_beneficiaries_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "architecture_components"
            referencedColumns: ["id"]
          },
        ]
      }
      ux_journeys: {
        Row: {
          code: string | null
          component_id: string | null
          created_at: string | null
          description: string | null
          goal: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          code?: string | null
          component_id?: string | null
          created_at?: string | null
          description?: string | null
          goal?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          code?: string | null
          component_id?: string | null
          created_at?: string | null
          description?: string | null
          goal?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ux_journeys_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "architecture_components"
            referencedColumns: ["id"]
          },
        ]
      }
      ux_personas: {
        Row: {
          code: string | null
          component_id: string | null
          created_at: string | null
          demographic_info: string | null
          description: string | null
          goals: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          code?: string | null
          component_id?: string | null
          created_at?: string | null
          demographic_info?: string | null
          description?: string | null
          goals?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          code?: string | null
          component_id?: string | null
          created_at?: string | null
          demographic_info?: string | null
          description?: string | null
          goals?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ux_personas_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "architecture_components"
            referencedColumns: ["id"]
          },
        ]
      }
      ux_stages: {
        Row: {
          code: string | null
          component_id: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          code?: string | null
          component_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          code?: string | null
          component_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ux_stages_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "architecture_components"
            referencedColumns: ["id"]
          },
        ]
      }
      ux_steps: {
        Row: {
          code: string | null
          communication_channel: string | null
          component_id: string | null
          created_at: string | null
          expected_impact: string | null
          id: string
          improvement_opportunities: string | null
          name: string
          priority: string | null
          related_gaps: string | null
          updated_at: string | null
        }
        Insert: {
          code?: string | null
          communication_channel?: string | null
          component_id?: string | null
          created_at?: string | null
          expected_impact?: string | null
          id?: string
          improvement_opportunities?: string | null
          name: string
          priority?: string | null
          related_gaps?: string | null
          updated_at?: string | null
        }
        Update: {
          code?: string | null
          communication_channel?: string | null
          component_id?: string | null
          created_at?: string | null
          expected_impact?: string | null
          id?: string
          improvement_opportunities?: string | null
          name?: string
          priority?: string | null
          related_gaps?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ux_steps_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "architecture_components"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      automation_level: "manual" | "semi_automated" | "automated"
      component_status:
        | "active"
        | "planned"
        | "retired"
        | "inDevelopment"
        | "maintenance"
      maturity_level:
        | "initial"
        | "developing"
        | "defined"
        | "managed"
        | "optimized"
      priority_level: "critical" | "high" | "medium" | "low"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      automation_level: ["manual", "semi_automated", "automated"],
      component_status: [
        "active",
        "planned",
        "retired",
        "inDevelopment",
        "maintenance",
      ],
      maturity_level: [
        "initial",
        "developing",
        "defined",
        "managed",
        "optimized",
      ],
      priority_level: ["critical", "high", "medium", "low"],
    },
  },
} as const
