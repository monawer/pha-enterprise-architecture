
import { useMemo } from 'react';
import { useEntityData } from '@/hooks/useEntityData';

interface Application {
  id: string;
  name: string;
  description?: string;
  version?: string;
  code?: string;
  app_type?: string;
  app_type_ref?: string;
  app_status?: string;
  status?: string;
  status_ref?: string;
  layer?: string;
  component_id?: string;
  
  // Technical Details
  development_technology?: string;
  technology_ref?: string;
  development_type?: string;
  development_type_ref?: string;
  architecture_pattern?: string;
  authentication_type?: string;
  hosting_server?: string;
  app_link?: string;
  
  // Business Information
  using_department?: string;
  using_department_ref?: string;
  owning_department?: string;
  owning_department_ref?: string;
  technical_owner?: string;
  end_user?: string;
  user_count?: number;
  importance?: string;
  
  // Development Information
  developer_entity?: string;
  source_type?: string;
  launch_date?: string;
  
  // Financial Information
  initial_cost?: number;
  operational_cost?: number;
  capital_cost?: number;
  
  // Operations
  operation_type?: string;
  operation_type_ref?: string;
  
  created_at: string;
  updated_at?: string;
}

export const useApps = () => {
  const {
    data: applications,
    loading,
    searchTerm,
    setSearchTerm,
    fetchData,
    deleteItem,
    confirmDelete
  } = useEntityData<Application>({
    tableName: 'app_applications',
    orderBy: 'created_at',
    ascending: false
  });

  const filteredApplications = useMemo(() => {
    if (!searchTerm) return applications;
    
    return applications.filter(app =>
      app.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.developer_entity?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [applications, searchTerm]);

  const handleDelete = (app: Application) => {
    confirmDelete(app.name, () => deleteItem(app.id));
  };

  return {
    applications: filteredApplications,
    loading,
    searchTerm,
    setSearchTerm,
    refetch: fetchData,
    handleDelete
  };
};
