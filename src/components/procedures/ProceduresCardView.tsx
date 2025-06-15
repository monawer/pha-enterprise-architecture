import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { Procedure } from '@/types/procedure';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Badge } from '@/components/ui/badge';

interface ProceduresCardViewProps {
  data: Procedure[];
  loading: boolean;
  onEdit: (procedure: Procedure) => void;
  onDelete: (procedure: Procedure) => void;
}

const ProceduresCardView: React.FC<ProceduresCardViewProps> = ({
  data,
  loading,
  onEdit,
  onDelete,
}) => {
  if (loading) {
    return <LoadingSpinner message="جاري تحميل الإجراءات..." />;
  }
  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 animate-fade-in">
        لا توجد إجراءات متاحة
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-4">
      {data.map((procedure) => (
        <div key={procedure.id} className="rounded-xl border shadow-sm p-4 flex flex-col gap-3 bg-gradient-to-br from-gray-50 to-white hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-center">
            <span className="font-bold text-blue-700">{procedure.procedure_name}</span>
            <span className="text-xs text-gray-400">{procedure.procedure_code || '-'}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {procedure.procedure_type && (
              <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-800">{procedure.procedure_type}</Badge>
            )}
            {procedure.automation_level && (
              <Badge variant="secondary" className="bg-green-50 border-green-200">{procedure.automation_level}</Badge>
            )}
            {procedure.importance && (
              <Badge
                variant={
                  procedure.importance === 'عالية'
                    ? 'destructive'
                    : procedure.importance === 'متوسطة'
                    ? 'default'
                    : 'outline'
                }
              >
                {procedure.importance}
              </Badge>
            )}
            {procedure.execution_duration && (
              <span className="text-xs text-gray-600">⏱ {procedure.execution_duration}</span>
            )}
          </div>
          {procedure.procedure_description && (
            <div className="text-xs text-gray-500 line-clamp-3">{procedure.procedure_description}</div>
          )}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 hover:scale-105"
              onClick={() => onEdit(procedure)}
            >
              <span className="ml-1">تعديل</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-red-600 hover:text-red-700 hover:scale-105"
              onClick={() => onDelete(procedure)}
            >
              <span className="ml-1">حذف</span>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
export default ProceduresCardView;
