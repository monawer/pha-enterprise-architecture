
import React from 'react';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { LayoutGrid, List, Table } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type ViewMode = 'cards' | 'list' | 'table';

interface ViewModeToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  itemCount: number;
}

const ViewModeToggle: React.FC<ViewModeToggleProps> = ({
  viewMode,
  onViewModeChange,
  itemCount,
}) => {
  const getItemsPerPageText = (mode: ViewMode) => {
    switch (mode) {
      case 'cards': return '36 بطاقة/صفحة';
      case 'list': return '50 عنصر/صفحة';
      case 'table': return '100 صف/صفحة';
      default: return '';
    }
  };

  return (
    <TooltipProvider>
      <div className="flex items-center gap-3">
        <ToggleGroup 
          type="single" 
          value={viewMode} 
          onValueChange={(value) => value && onViewModeChange(value as ViewMode)}
          className="bg-gray-100 rounded-lg p-1 shadow-sm"
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem 
                value="cards" 
                className="px-3 py-2 data-[state=on]:bg-white data-[state=on]:shadow-sm"
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline mr-2">بطاقات</span>
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>
              <p>عرض البطاقات - {getItemsPerPageText('cards')}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem 
                value="list" 
                className="px-3 py-2 data-[state=on]:bg-white data-[state=on]:shadow-sm"
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline mr-2">قائمة</span>
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>
              <p>عرض القائمة المضغوطة - {getItemsPerPageText('list')}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem 
                value="table" 
                className="px-3 py-2 data-[state=on]:bg-white data-[state=on]:shadow-sm"
              >
                <Table className="w-4 h-4" />
                <span className="hidden sm:inline mr-2">جدول</span>
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>
              <p>عرض الجدول التفصيلي - {getItemsPerPageText('table')}</p>
            </TooltipContent>
          </Tooltip>
        </ToggleGroup>

        <div className="text-xs text-gray-500 hidden md:block">
          {getItemsPerPageText(viewMode)}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ViewModeToggle;
