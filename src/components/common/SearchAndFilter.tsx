
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
    <div className="space-y-4 bg-white rounded-lg p-4 shadow-saudi-sm">
      {/* شريط البحث */}
      <div className="flex items-center gap-2 flex-wrap md:flex-nowrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pr-10 border-saudi-green-200 focus-within:border-saudi-green-500 transition-colors duration-200"
          />
        </div>
        {isFiltered && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClearFilters}
            className="border-saudi-green-200 text-saudi-green-800 hover:bg-saudi-green-50"
          >
            <X className="w-4 h-4 ml-1" />
            مسح الكل
          </Button>
        )}
      </div>

      {/* المرشحات */}
      {filterOptions.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center text-saudi-green-800 bg-saudi-green-50 py-1 px-2 rounded-md">
            <Filter className="w-3.5 h-3.5 mr-1" />
            <span className="text-xs">فلترة:</span>
          </div>
          
          <div className="flex flex-wrap gap-1.5">
            {filterOptions.map((option) => (
              <Badge
                key={option.key}
                variant={activeFilters[option.key] ? "default" : "outline"}
                className={`cursor-pointer transition-colors duration-200 text-xs ${
                  activeFilters[option.key] 
                    ? "bg-saudi-green-700 hover:bg-saudi-green-800" 
                    : "bg-white text-saudi-green-800 border-saudi-green-200 hover:bg-saudi-green-50"
                }`}
                onClick={() => onToggleFilter(option.key)}
              >
                {option.label}
                {option.count !== undefined && ` (${option.count})`}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* عداد النتائج */}
      <div className="text-sm text-gray-600 bg-gray-50 py-1.5 px-3 rounded-md border border-gray-100">
        {isFiltered ? (
          <div className="flex items-center">
            <span className="font-medium text-saudi-green-800">{totalResults}</span>
            <span className="mx-1">من النتائج المفلترة</span>
          </div>
        ) : (
          <div className="flex items-center">
            <span className="font-medium text-saudi-green-800">{totalResults}</span>
            <span className="mx-1">إجمالي النتائج</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchAndFilter;
