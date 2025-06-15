
import React from 'react';
import { Badge } from '@/components/ui/badge';
import EntityTable from '@/components/common/EntityTable';
import { Procedure } from '@/types/procedure';

interface ProceduresTableProps {
  data: Procedure[];
  loading: boolean;
  onEdit: (procedure: Procedure) => void;
  onDelete: (procedure: Procedure) => void;
}

const ProceduresTable: React.FC<ProceduresTableProps> = ({
  data,
  loading,
  onEdit,
  onDelete,
}) => {
  const columns = [
    {
      key: 'procedure_name',
      header: 'اسم الإجراء',
      render: (procedure: Procedure) => (
        <div>
          <p className="font-semibold">{procedure.procedure_name}</p>
          {procedure.procedure_description && (
            <p className="text-sm text-gray-500 mt-1">
              {procedure.procedure_description.substring(0, 100)}...
            </p>
          )}
        </div>
      ),
    },
    {
      key: 'procedure_code',
      header: 'الرمز',
      render: (procedure: Procedure) => procedure.procedure_code || '-',
    },
    {
      key: 'procedure_type',
      header: 'النوع',
      render: (procedure: Procedure) => 
        procedure.procedure_type ? (
          <Badge variant="outline">{procedure.procedure_type}</Badge>
        ) : '-',
    },
    {
      key: 'automation_level',
      header: 'مستوى الأتمتة',
      render: (procedure: Procedure) => 
        procedure.automation_level ? (
          <Badge variant="secondary">{procedure.automation_level}</Badge>
        ) : '-',
    },
    {
      key: 'importance',
      header: 'الأهمية',
      render: (procedure: Procedure) => 
        procedure.importance ? (
          <Badge 
            variant={
              procedure.importance === 'عالية' ? 'destructive' :
              procedure.importance === 'متوسطة' ? 'default' : 'outline'
            }
          >
            {procedure.importance}
          </Badge>
        ) : '-',
    },
    {
      key: 'execution_duration',
      header: 'مدة التنفيذ',
      render: (procedure: Procedure) => procedure.execution_duration || '-',
    },
  ];

  return (
    <EntityTable
      data={data}
      columns={columns}
      loading={loading}
      onEdit={onEdit}
      onDelete={onDelete}
      emptyMessage="لا توجد إجراءات متاحة"
      itemsPerPage={10}
    />
  );
};

export default ProceduresTable;
