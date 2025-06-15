import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
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

const Procedures = () => {
  const [selectedProcedure, setSelectedProcedure] = useState<Procedure | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [procedureToDelete, setProcedureToDelete] = useState<Procedure | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const { procedures, loading, fetchProcedures, deleteProcedure } = useProcedures();

  // تحسين اختيار البيانات للمودال
  const handleEdit = (procedure: Procedure) => {
    setSelectedProcedure(procedure);
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

  // فلترة ديناميكية تشمل الاسم والرمز والوصف
  const filteredProcedures = procedures.filter(procedure =>
    (procedure.procedure_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (procedure.procedure_description?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (procedure.procedure_code?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto py-8 px-2 md:px-8 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:justify-between items-center mb-8 gap-3">
        <div className="flex items-center gap-3">
          <FileText className="w-8 h-8 text-saudi-green-700" />
          <div>
            <h1 className="text-3xl font-bold text-saudi-green-900">إدارة الإجراءات</h1>
            <span className="block text-base text-gray-500 mt-1">
              عرض وإدارة الإجراءات التشغيلية والإدارية بشكل احترافي
            </span>
          </div>
        </div>
        <Button
          size="lg"
          className="gap-1 bg-saudi-green-700 text-white hover:bg-saudi-green-800 transition"
          onClick={handleAdd}
        >
          <Plus className="w-5 h-5" />
          إضافة إجراء جديد
        </Button>
      </div>

      <Card className="mb-6 shadow-lg border-gray-200">
        <div className="p-4">
          <SearchAndFilterCard
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            placeholder="ابحث في الإجراءات بالاسم أو الوصف أو الرمز..."
            totalCount={filteredProcedures.length}
            entityName="إجراء"
          />
        </div>
        <CardHeader className="bg-gray-50 rounded-t-lg border-b">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-gray-600" />
            قائمة جميع الإجراءات
            <span className="ml-2 text-base text-gray-400 font-normal">
              ({filteredProcedures.length})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isMobile ? (
            <div className="p-2">
              <ProceduresCardView
                data={filteredProcedures}
                loading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          ) : (
            <div className="p-2">
              <ProceduresTable
                data={filteredProcedures}
                loading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal لإضافة/تعديل إجراء */}
      <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
        <ModalContent className="max-w-3xl">
          <ModalHeader>
            <ModalTitle className="font-bold text-lg">
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

      {/* تأكيد حذف */}
      <ConfirmationModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onConfirm={confirmDelete}
        title="تأكيد الحذف"
        description={
          procedureToDelete
            ? `هل أنت متأكد من حذف الإجراء "${procedureToDelete.procedure_name}"؟ لا يمكن التراجع عن هذا الإجراء.`
            : ''
        }
        confirmText="نعم، حذف"
        cancelText="إلغاء"
        variant="destructive"
      />
    </div>
  );
};

export default Procedures;
