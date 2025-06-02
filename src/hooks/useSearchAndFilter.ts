
import { useState, useMemo } from 'react';

interface UseSearchAndFilterProps<T> {
  data: T[];
  searchFields: (keyof T)[];
  filterFields?: Record<string, (item: T) => boolean>;
}

export const useSearchAndFilter = <T>({
  data,
  searchFields,
  filterFields = {}
}: UseSearchAndFilterProps<T>) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, boolean>>({});

  const filteredData = useMemo(() => {
    let filtered = data;

    // تطبيق البحث
    if (searchTerm.trim()) {
      filtered = filtered.filter(item =>
        searchFields.some(field => {
          const value = item[field];
          if (typeof value === 'string') {
            return value.toLowerCase().includes(searchTerm.toLowerCase());
          }
          return false;
        })
      );
    }

    // تطبيق المرشحات
    Object.entries(activeFilters).forEach(([filterKey, isActive]) => {
      if (isActive && filterFields[filterKey]) {
        filtered = filtered.filter(filterFields[filterKey]);
      }
    });

    return filtered;
  }, [data, searchTerm, activeFilters, searchFields, filterFields]);

  const toggleFilter = (filterKey: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterKey]: !prev[filterKey]
    }));
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setActiveFilters({});
  };

  return {
    searchTerm,
    setSearchTerm,
    activeFilters,
    toggleFilter,
    clearAllFilters,
    filteredData,
    totalResults: filteredData.length,
    isFiltered: searchTerm.trim() !== '' || Object.values(activeFilters).some(Boolean)
  };
};
