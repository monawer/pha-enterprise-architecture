
import { useMemo } from 'react';
import { useEntityData } from '@/hooks/useEntityData';

interface Database {
  id: string;
  database_name: string;
  application_name?: string;
  database_environment_type?: string;
  created_at: string;
}

export const useDatabases = () => {
  const {
    data: databases,
    loading,
    searchTerm,
    setSearchTerm,
    fetchData,
    deleteItem,
    confirmDelete
  } = useEntityData<Database>({
    tableName: 'app_databases',
    orderBy: 'created_at',
    ascending: false
  });

  const filteredDatabases = useMemo(() => {
    if (!searchTerm) return databases;
    
    return databases.filter(db =>
      db.database_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      db.application_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [databases, searchTerm]);

  const handleDelete = (db: Database) => {
    confirmDelete(db.database_name, () => deleteItem(db.id));
  };

  return {
    databases: filteredDatabases,
    loading,
    searchTerm,
    setSearchTerm,
    refetch: fetchData,
    handleDelete
  };
};
