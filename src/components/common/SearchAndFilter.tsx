
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X } from 'lucide-react';

interface SearchAndFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  activeFilters: Record<string, boolean>;
  onToggleFilter: (filterKey: string) => void;
  onClearFilters: () => void;
  filterOptions?: Array<{
    key: string;
    label: string;
    count?: number;
  }>;
  placeholder?: string;
  isFiltered: boolean;
  totalResults: number;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchTerm,
  onSearchChange,
  activeFilters,
  onToggleFilter,
  onClearFilters,
  filterOptions = [],
  placeholder = "البحث...",
  isFiltered,
  totalResults
}) => {
  return (
    <div className="space-y-4">
      {/* شريط البحث */}
      <div className="flex items-center space-x-2 space-x-reverse">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pr-10"
          />
        </div>
        {isFiltered && (
          <Button variant="outline" size="sm" onClick={onClearFilters}>
            <X className="w-4 h-4 ml-1" />
            مسح الكل
          </Button>
        )}
      </div>

      {/* المرشحات */}
      {filterOptions.length > 0 && (
        <div className="flex items-center space-x-2 space-x-reverse">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">فلترة:</span>
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => (
              <Badge
                key={option.key}
                variant={activeFilters[option.key] ? "default" : "outline"}
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => onToggleFilter(option.key)}
              >
                {option.label}
                {option.count && ` (${option.count})`}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* عداد النتائج */}
      <div className="text-sm text-gray-600">
        {isFiltered ? (
          <>عرض {totalResults} من النتائج المفلترة</>
        ) : (
          <>إجمالي النتائج: {totalResults}</>
        )}
      </div>
    </div>
  );
};

export default SearchAndFilter;
