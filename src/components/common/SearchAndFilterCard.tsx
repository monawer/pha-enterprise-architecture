
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface SearchAndFilterCardProps {
  title: string;
  count: number;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  children?: React.ReactNode;
}

const SearchAndFilterCard: React.FC<SearchAndFilterCardProps> = ({
  title,
  count,
  searchTerm,
  onSearchChange,
  placeholder = 'البحث...',
  children
}) => {
  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <CardTitle>{title} ({count})</CardTitle>
          <div className="flex items-center space-x-2 space-x-reverse">
            <Search className="w-4 h-4 text-gray-400" />
            <Input
              placeholder={placeholder}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-64 transition-all duration-300 focus:w-80"
            />
          </div>
        </div>
        {children}
      </CardHeader>
    </Card>
  );
};

export default SearchAndFilterCard;
