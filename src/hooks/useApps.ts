
import { useMemo } from 'react';
import { useEntityData } from '@/hooks/useEntityData';

interface Application {
  id: string;
  name: string;
  description?: string;
  version?: string;
  app_type?: string;
  app_status?: string;
  using_department?: string;
  created_at: string;
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
      app.description?.toLowerCase().includes(searchTerm.toLowerCase())
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
