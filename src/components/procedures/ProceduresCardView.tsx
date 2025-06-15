
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { Procedure } from '@/types/procedure';
import LoadingSpinner from '@/components/common/LoadingSpinner';

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
        <div key={procedure.id} className="rounded-lg border shadow-sm p-4 flex flex-col gap-2 bg-white hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center">
            <span className="font-bold text-blue-700">{procedure.procedure_name}</span>
            <span className="text-xs text-gray-500">{procedure.procedure_code || '-'}</span>
          </div>
          
          {procedure.procedure_type && (
            <span className="text-xs text-gray-600">النوع: {procedure.procedure_type}</span>
          )}
          
          {procedure.automation_level && (
            <span className="text-xs text-gray-600">الأتمتة: {procedure.automation_level}</span>
          )}
          
          {procedure.importance && (
            <span className="text-xs text-gray-600">الأهمية: {procedure.importance}</span>
          )}
          
          <div className="text-xs text-gray-600">
            {procedure.execution_duration && <>المدة: {procedure.execution_duration}</>}
          </div>
          
          {procedure.procedure_description && (
            <div className="text-xs text-gray-500 line-clamp-2">{procedure.procedure_description}</div>
          )}
          
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 hover-scale"
              onClick={() => onEdit(procedure)}
            >
              <Edit className="w-4 h-4" />
              <span className="ml-1">تعديل</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 hover-scale text-red-600 hover:text-red-700"
              onClick={() => onDelete(procedure)}
            >
              <Trash2 className="w-4 h-4" />
              <span className="ml-1">حذف</span>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProceduresCardView;
