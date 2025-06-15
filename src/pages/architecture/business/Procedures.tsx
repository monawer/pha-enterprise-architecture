
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from '@/components/ui/modal';
import { FileText, Plus } from 'lucide-react';
import ProcedureForm from '@/components/forms/ProcedureForm';
import { useIsMobile } from '@/hooks/use-mobile';
import { Procedure } from '@/types/procedure';
import { useProcedures } from '@/hooks/useProcedures';
import SearchAndFilterCard from '@/components/common/SearchAndFilterCard';
import ProceduresTable from '@/components/procedures/ProceduresTable';
import ProceduresCardView from '@/components/procedures/ProceduresCardView';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import EntityHeader from '@/components/common/EntityHeader';

const Procedures = () => {
  const [selectedProcedure, setSelectedProcedure] = useState<Procedure | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [procedureToDelete, setProcedureToDelete] = useState<Procedure | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const { procedures, loading, fetchProcedures, deleteProcedure } = useProcedures();

  const handleEdit = (procedure: Procedure) => {
    console.log("🟡 [Procedures] handleEdit called with:", procedure);
    
    const completeData: Procedure = {
      id: procedure.id,
      procedure_name: procedure.procedure_name || '',
      procedure_code: procedure.procedure_code || '',
      procedure_description: procedure.procedure_description || '',
      procedure_type: procedure.procedure_type || '',
      automation_level: procedure.automation_level || '',
      importance: procedure.importance || '',
      execution_duration: procedure.execution_duration || '',
      procedure_inputs: procedure.procedure_inputs || '',
      procedure_outputs: procedure.procedure_outputs || '',
      execution_steps: procedure.execution_steps || '',
      business_rules: procedure.business_rules || '',
      execution_requirements: procedure.execution_requirements || '',
      related_services: procedure.related_services || '',
      related_policies: procedure.related_policies || '',
      notes: procedure.notes || '',
      created_at: procedure.created_at
    };
    
    console.log("🟡 [Procedures] completeData being sent:", completeData);
    setSelectedProcedure(completeData);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedProcedure(null);
    setIsModalOpen(true);
  };

  const handleDelete = (procedure: Procedure) => {
    setProcedureToDelete(procedure);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!procedureToDelete?.id) return;
    await deleteProcedure(procedureToDelete.id);
    setIsDeleteModalOpen(false);
    setProcedureToDelete(null);
  };

  const handleFormSuccess = () => {
    setIsModalOpen(false);
    setSelectedProcedure(null);
    fetchProcedures();
  };

  const filteredProcedures = procedures.filter(procedure =>
    procedure.procedure_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (procedure.procedure_description && procedure.procedure_description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (procedure.procedure_code && procedure.procedure_code.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <EntityHeader
        icon={<FileText className="w-6 h-6" />}
        title="إدارة الإجراءات"
        description="عرض وإدارة الإجراءات التشغيلية والإدارية"
        onAdd={handleAdd}
        addButtonText="إضافة إجراء جديد"
        addButtonIcon={<Plus className="w-4 h-4" />}
      />

      <SearchAndFilterCard
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="البحث في الإجراءات..."
        totalCount={filteredProcedures.length}
        entityName="إجراء"
      />

      <Card>
        <CardHeader>
          <CardTitle>قائمة الإجراءات ({filteredProcedures.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isMobile ? (
            <ProceduresCardView
              data={filteredProcedures}
              loading={loading}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ) : (
            <ProceduresTable
              data={filteredProcedures}
              loading={loading}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
        <ModalContent className="max-w-4xl">
          <ModalHeader>
            <ModalTitle>
              {selectedProcedure ? 'تعديل الإجراء' : 'إضافة إجراء جديد'}
            </ModalTitle>
          </ModalHeader>
          <ProcedureForm
            procedure={selectedProcedure || undefined}
            onSuccess={handleFormSuccess}
            onCancel={() => setIsModalOpen(false)}
          />
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onConfirm={confirmDelete}
        title="تأكيد الحذف"
        description={`هل أنت متأكد من حذف الإجراء "${procedureToDelete?.procedure_name}"؟ هذا الإجراء لا يمكن التراجع عنه.`}
        confirmText="حذف"
        cancelText="إلغاء"
        variant="destructive"
      />
    </div>
  );
};

export default Procedures;
