
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
import { Server, Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import PhysicalServerForm from '@/components/forms/PhysicalServerForm';

interface PhysicalServer {
  id: string;
  host_name: string;
  manufacturer?: string;
  model?: string;
  processor?: string;
  ram?: string;
  local_storage_capacity?: string;
  total_cpu_cores?: number;
  operation_type?: string;
  vendor_support_status?: string;
  vendor_support_end_date?: string;
  initial_cost?: number;
  operational_cost?: number;
  created_at: string;
}

const PhysicalServers = () => {
  const [servers, setServers] = useState<PhysicalServer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedServer, setSelectedServer] = useState<PhysicalServer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [serverToDelete, setServerToDelete] = useState<PhysicalServer | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchServers();
  }, []);

  const fetchServers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tech_physical_servers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setServers(data || []);
    } catch (error) {
      console.error('Error fetching physical servers:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في جلب بيانات الخوادم المادية",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (server: PhysicalServer) => {
    setSelectedServer(server);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedServer(null);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!serverToDelete) return;

    try {
      const { error } = await supabase
        .from('tech_physical_servers')
        .delete()
        .eq('id', serverToDelete.id);

      if (error) throw error;

      toast({
        title: "تم بنجاح",
        description: "تم حذف الخادم بنجاح",
      });
      
      fetchServers();
      setIsDeleteModalOpen(false);
      setServerToDelete(null);
    } catch (error) {
      console.error('Error deleting server:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حذف الخادم",
        variant: "destructive",
      });
    }
  };

  const handleFormSuccess = () => {
    setIsModalOpen(false);
    setSelectedServer(null);
    fetchServers();
  };

  const filteredServers = servers.filter(server =>
    server.host_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (server.manufacturer && server.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()))
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
          <Server className="w-8 h-8 text-blue-500" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">الخوادم المادية</h1>
            <p className="text-gray-600">عرض وإدارة الخوادم المادية</p>
          </div>
        </div>
        
        <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
          <ModalTrigger asChild>
            <Button onClick={handleAdd}>
              <Plus className="w-4 h-4 ml-2" />
              إضافة خادم جديد
            </Button>
          </ModalTrigger>
          <ModalContent className="max-w-2xl">
            <ModalHeader>
              <ModalTitle>
                {selectedServer ? 'تعديل الخادم' : 'إضافة خادم جديد'}
              </ModalTitle>
            </ModalHeader>
            <PhysicalServerForm
              server={selectedServer}
              onSuccess={handleFormSuccess}
              onCancel={() => setIsModalOpen(false)}
            />
          </ModalContent>
        </Modal>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>قائمة الخوادم المادية ({filteredServers.length})</CardTitle>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Search className="w-4 h-4 text-gray-400" />
              <Input
                placeholder="البحث في الخوادم..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>اسم الخادم</TableHead>
                  <TableHead>الشركة المصنعة</TableHead>
                  <TableHead>الطراز</TableHead>
                  <TableHead>المعالج</TableHead>
                  <TableHead>الذاكرة</TableHead>
                  <TableHead>أنوية المعالج</TableHead>
                  <TableHead>حالة الدعم</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServers.map((server) => (
                  <TableRow key={server.id}>
                    <TableCell className="font-medium">{server.host_name}</TableCell>
                    <TableCell>{server.manufacturer || '-'}</TableCell>
                    <TableCell>{server.model || '-'}</TableCell>
                    <TableCell>{server.processor || '-'}</TableCell>
                    <TableCell>{server.ram || '-'}</TableCell>
                    <TableCell>{server.total_cpu_cores || '-'}</TableCell>
                    <TableCell>
                      {server.vendor_support_status && (
                        <Badge variant="secondary">{server.vendor_support_status}</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2 space-x-reverse">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEdit(server)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setServerToDelete(server);
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
          {filteredServers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              لا توجد خوادم مادية متاحة
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
              هل أنت متأكد من حذف الخادم "{serverToDelete?.host_name}"؟
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

export default PhysicalServers;
