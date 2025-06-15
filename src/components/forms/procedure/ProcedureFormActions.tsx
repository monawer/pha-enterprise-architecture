
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
      >
        <X className="w-4 h-4 ml-2" />
        إلغاء
      </Button>
      <Button type="submit" disabled={loading}>
        <Save className="w-4 h-4 ml-2" />
        {loading ? 'جاري الحفظ...' : procedure?.id ? 'تحديث' : 'إضافة'}
      </Button>
    </div>
  );
};

export default ProcedureFormActions;
