
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, X } from 'lucide-react';
import { Procedure } from '@/types/procedure';

interface ProcedureFormActionsProps {
  loading: boolean;
  procedure?: Procedure;
  onCancel: () => void;
}

const ProcedureFormActions: React.FC<ProcedureFormActionsProps> = ({
  loading,
  procedure,
  onCancel,
}) => {
  return (
    <div className="flex justify-end space-x-2 space-x-reverse pt-4 border-t">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={loading}
        className="hover:bg-gray-100"
      >
        <X className="w-4 h-4 ml-2" />
        إلغاء
      </Button>
      <Button type="submit" disabled={loading} className="bg-saudi-green-700 text-white hover:bg-saudi-green-800">
        <Save className="w-4 h-4 ml-2" />
        {loading ? (
          <span>
            <span className="animate-spin inline-block mr-1">⏳</span> جاري الحفظ...
          </span>
        ) : procedure?.id ? 'تحديث' : 'إضافة'}
      </Button>
    </div>
  );
};
export default ProcedureFormActions;
