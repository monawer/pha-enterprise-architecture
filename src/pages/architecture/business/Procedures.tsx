import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from '@/components/ui/modal';
import { Badge } from '@/components/ui/badge';
import { FileText, Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import ProcedureForm from '@/components/forms/ProcedureForm';
import { useIsMobile } from '@/hooks/use-mobile';

// تحديث نوع البيانات ليشمل كل الحقول المستخدمة بنموذج الاجراء
interface Procedure {
  id: string;
  procedure_name: string;
  procedure_code?: string;
  procedure_description?: string;
  procedure_type?: string;
  automation_level?: string;
  importance?: string;
  execution_duration?: string;
  execution_steps?: string;
  business_rules?: string;
  execution_requirements?: string;
  procedure_inputs?: string;
  procedure_outputs?: string;
  related_services?: string;
  related_policies?: string;
  notes?: string;
  // الحقول المفيدة لدعم النموذج مستقبلًا
  [key: string]: any;
  created_at: string;
}

const Procedures = () => {
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProcedure, setSelectedProcedure] = useState<Procedure | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [procedureToDelete, setProcedureToDelete] = useState<Procedure | null>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    fetchProcedures();
  }, []);

  const fetchProcedures = async () => {
    try {
      setLoading(true);
      // تأكد من جلب كل الأعمدة وليس فقط الأساسية
      const { data, error } = await supabase
        .from('biz_procedures')
        .select(
          'id, procedure_name, procedure_code, procedure_description, procedure_type, automation_level, importance, execution_duration, execution_steps, business_rules, execution_requirements, procedure_inputs, procedure_outputs, related_services, related_policies, notes, created_at'
        )
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProcedures(data || []);
    } catch (error) {
      console.error('Error fetching procedures:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في جلب بيانات الإجراءات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (procedure: Procedure) => {
    // يمرر الكائن كاملًا إلى الـForm ليتم تعبئة كل الحقول المطلوبة
    setSelectedProcedure(procedure);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedProcedure(null);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!procedureToDelete) return;

    try {
      const { error } = await supabase
        .from('biz_procedures')
        .delete()
        .eq('id', procedureToDelete.id);

      if (error) throw error;

      toast({
        title: "تم بنجاح",
        description: "تم حذف الإجراء بنجاح",
      });
      
      fetchProcedures();
      setIsDeleteModalOpen(false);
      setProcedureToDelete(null);
    } catch (error) {
      console.error('Error deleting procedure:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حذف الإجراء",
        variant: "destructive",
      });
    }
  };

  const handleFormSuccess = () => {
    setIsModalOpen(false);
    setSelectedProcedure(null);
    fetchProcedures();
  };

  const filteredProcedures = procedures.filter(procedure =>
    procedure.procedure_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (procedure.procedure_description && procedure.procedure_description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 space-x-reverse">
          <FileText className="w-8 h-8 text-blue-500" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">إدارة الإجراءات</h1>
            <p className="text-gray-600">عرض وإدارة الإجراءات التشغيلية والإدارية</p>
          </div>
        </div>
        
        <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
          <ModalTrigger asChild>
            <Button onClick={handleAdd}>
              <Plus className="w-4 h-4 ml-2" />
              إضافة إجراء جديد
            </Button>
          </ModalTrigger>
          <ModalContent className="max-w-4xl">
            <ModalHeader>
              <ModalTitle>
                {selectedProcedure ? 'تعديل الإجراء' : 'إضافة إجراء جديد'}
              </ModalTitle>
            </ModalHeader>
            <ProcedureForm
              procedure={selectedProcedure!}
              onSuccess={handleFormSuccess}
              onCancel={() => setIsModalOpen(false)}
            />
          </ModalContent>
        </Modal>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>قائمة الإجراءات ({filteredProcedures.length})</CardTitle>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Search className="w-4 h-4 text-gray-400" />
              <Input
                placeholder="البحث في الإجراءات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isMobile ? (
            <div className="grid grid-cols-1 gap-4">
              {filteredProcedures.map((procedure) => (
                <div key={procedure.id} className="rounded-lg border shadow-sm p-4 flex flex-col gap-2 bg-white">
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
                    <div className="text-xs text-gray-500 truncate">{procedure.procedure_description}</div>
                  )}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEdit(procedure)}
                    >
                      <Edit className="w-4 h-4" />
                      <span className="ml-1">تعديل</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        setProcedureToDelete(procedure);
                        setIsDeleteModalOpen(true);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="ml-1">حذف</span>
                    </Button>
                  </div>
                </div>
              ))}
              {filteredProcedures.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  لا توجد إجراءات متاحة
                </div>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>اسم الإجراء</TableHead>
                    <TableHead>الرمز</TableHead>
                    <TableHead>النوع</TableHead>
                    <TableHead>مستوى الأتمتة</TableHead>
                    <TableHead>الأهمية</TableHead>
                    <TableHead>مدة التنفيذ</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProcedures.map((procedure) => (
                    <TableRow key={procedure.id}>
                      <TableCell className="font-medium">
                        <div>
                          <p className="font-semibold">{procedure.procedure_name}</p>
                          {procedure.procedure_description && (
                            <p className="text-sm text-gray-500 mt-1">
                              {procedure.procedure_description.substring(0, 100)}...
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{procedure.procedure_code || '-'}</TableCell>
                      <TableCell>
                        {procedure.procedure_type && (
                          <Badge variant="outline">{procedure.procedure_type}</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {procedure.automation_level && (
                          <Badge variant="secondary">{procedure.automation_level}</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {procedure.importance && (
                          <Badge 
                            variant={
                              procedure.importance === 'عالية' ? 'destructive' :
                              procedure.importance === 'متوسطة' ? 'default' : 'outline'
                            }
                          >
                            {procedure.importance}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{procedure.execution_duration || '-'}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2 space-x-reverse">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEdit(procedure)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setProcedureToDelete(procedure);
                              setIsDeleteModalOpen(true);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <ModalContent className="max-w-md">
          <ModalHeader>
            <ModalTitle>تأكيد الحذف</ModalTitle>
          </ModalHeader>
          <div className="py-4">
            <p className="text-gray-600">
              هل أنت متأكد من حذف الإجراء "{procedureToDelete?.procedure_name}"؟
              هذا الإجراء لا يمكن التراجع عنه.
            </p>
          </div>
          <div className="flex justify-end space-x-2 space-x-reverse">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              إلغاء
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              حذف
            </Button>
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Procedures;
