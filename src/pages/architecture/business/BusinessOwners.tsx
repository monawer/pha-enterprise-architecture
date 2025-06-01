
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Pencil, Trash2, UserCheck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import BusinessOwnerForm from '@/components/forms/BusinessOwnerForm';

interface BusinessOwner {
  id: string;
  code?: string;
  title: string;
  job_description?: string;
  parent_code?: string;
  component_id?: string;
  created_at: string;
  updated_at: string;
}

const BusinessOwners = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOwner, setEditingOwner] = useState<BusinessOwner | null>(null);
  const [deletingOwnerId, setDeletingOwnerId] = useState<string | null>(null);

  const { data: businessOwners = [], isLoading } = useQuery({
    queryKey: ['businessOwners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('biz_business_owners')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  const deleteOwnerMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('biz_business_owners')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessOwners'] });
      toast({
        title: "تم حذف مالك الأعمال بنجاح",
        description: "تم حذف مالك الأعمال من النظام",
      });
      setDeletingOwnerId(null);
    },
    onError: (error) => {
      console.error('Error deleting business owner:', error);
      toast({
        title: "خطأ في حذف مالك الأعمال",
        description: "حدث خطأ أثناء حذف مالك الأعمال",
        variant: "destructive",
      });
    },
  });

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingOwner(null);
    queryClient.invalidateQueries({ queryKey: ['businessOwners'] });
  };

  const handleEdit = (owner: BusinessOwner) => {
    setEditingOwner(owner);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteOwnerMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 space-x-reverse">
          <UserCheck className="w-8 h-8 text-teal-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">ملاك الأعمال</h1>
            <p className="text-gray-600">إدارة ملاك الأعمال والمسؤوليات في المؤسسة</p>
          </div>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="flex items-center space-x-2 space-x-reverse">
          <Plus className="w-4 h-4" />
          <span>إضافة مالك أعمال جديد</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>قائمة ملاك الأعمال</CardTitle>
        </CardHeader>
        <CardContent>
          {businessOwners.length === 0 ? (
            <div className="text-center py-8">
              <UserCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">لا توجد ملاك أعمال مسجلين</p>
              <p className="text-gray-400">قم بإضافة أول مالك أعمال لبدء الإدارة</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الكود</TableHead>
                  <TableHead>المسمى الوظيفي</TableHead>
                  <TableHead>الوصف الوظيفي</TableHead>
                  <TableHead>الكود الأب</TableHead>
                  <TableHead>تاريخ الإنشاء</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {businessOwners.map((owner) => (
                  <TableRow key={owner.id}>
                    <TableCell>{owner.code || '-'}</TableCell>
                    <TableCell className="font-medium">{owner.title}</TableCell>
                    <TableCell>{owner.job_description || '-'}</TableCell>
                    <TableCell>{owner.parent_code || '-'}</TableCell>
                    <TableCell>
                      {new Date(owner.created_at).toLocaleDateString('ar-SA')}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2 space-x-reverse">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(owner)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeletingOwnerId(owner.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingOwner ? 'تعديل مالك الأعمال' : 'إضافة مالك أعمال جديد'}
            </DialogTitle>
          </DialogHeader>
          <BusinessOwnerForm
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingOwner(null);
            }}
            initialData={editingOwner}
            isEdit={!!editingOwner}
            ownerId={editingOwner?.id}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingOwnerId} onOpenChange={() => setDeletingOwnerId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من حذف مالك الأعمال هذا؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingOwnerId && handleDelete(deletingOwnerId)}
              className="bg-red-600 hover:bg-red-700"
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BusinessOwners;
