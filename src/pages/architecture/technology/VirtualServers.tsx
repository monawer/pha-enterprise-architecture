import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from '@/components/ui/modal';
import { HardDrive, Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import VirtualServerForm from '@/components/forms/VirtualServerForm';
import VirtualServerCardMobile from '@/components/technology/VirtualServerCardMobile';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';

interface VirtualServer {
  id: string;
  host_name: string;
  os_type?: string;
  os_version?: string;
  virtual_cpu?: number;
  virtual_ram?: string;
  virtual_disk?: string;
  environment?: string;
  status?: string;
  operation_type?: string;
  initial_cost?: number;
  operational_cost?: number;
  created_at: string;
}

const VirtualServers = () => {
  const [servers, setServers] = useState<VirtualServer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedServer, setSelectedServer] = useState<VirtualServer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState<React.ReactNode>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    fetchServers();
  }, []);

  const fetchServers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tech_virtual_servers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setServers(data || []);
    } catch (error) {
      console.error('Error fetching virtual servers:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في جلب بيانات الخوادم الافتراضية",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (server: VirtualServer) => {
    setSelectedServer(server);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedServer(null);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleDelete = async (server: VirtualServer) => {
    if (window.confirm('هل أنت متأكد من حذف الخادم الافتراضي هذا؟')) {
      try {
        const { error } = await supabase
          .from('tech_virtual_servers')
          .delete()
          .eq('id', server.id);

        if (error) throw error;

        toast({
          title: "تم بنجاح",
          description: "تم حذف الخادم الافتراضي بنجاح",
        });

        fetchServers();
      } catch (error: any) {
        console.error('Error deleting virtual server:', error);
        toast({
          title: "خطأ",
          description: error.message || "حدث خطأ أثناء حذف الخادم الافتراضي",
          variant: "destructive",
        });
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedServer(null);
    setIsEditing(false);
  };

  const handleFormSuccess = () => {
    fetchServers();
    handleModalClose();
  };

  const openDrawer = (node: React.ReactNode) => {
    setDrawerContent(node);
    setIsDrawerOpen(true);
  };

  const filteredServers = servers.filter(server =>
    server.host_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (server.os_type && server.os_type.toLowerCase().includes(searchTerm.toLowerCase()))
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
          <HardDrive className="w-8 h-8 text-green-500" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">الخوادم الافتراضية</h1>
            <p className="text-gray-600">عرض وإدارة الخوادم الافتراضية</p>
          </div>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 ml-2" />
          إضافة خادم افتراضي جديد
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>قائمة الخوادم الافتراضية ({filteredServers.length})</CardTitle>
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
          {isMobile ? (
            <div className="grid grid-cols-1 gap-4">
              {filteredServers.map((server) => (
                <VirtualServerCardMobile
                  key={server.id}
                  server={server}
                  onEdit={() =>
                    openDrawer(
                      <>
                        <DrawerHeader>
                          <DrawerTitle>تعديل الخادم الافتراضي</DrawerTitle>
                        </DrawerHeader>
                        <VirtualServerForm
                          server={server}
                          onSuccess={() => {
                            setIsDrawerOpen(false);
                            handleFormSuccess();
                          }}
                          onCancel={() => setIsDrawerOpen(false)}
                        />
                      </>
                    )
                  }
                  onDelete={() =>
                    openDrawer(
                      <>
                        <DrawerHeader>
                          <DrawerTitle>تأكيد الحذف</DrawerTitle>
                        </DrawerHeader>
                        <div className="py-4">
                          <p className="text-gray-600">
                            هل أنت متأكد من حذف الخادم الافتراضي "{server.host_name}"؟ هذا الإجراء لا يمكن التراجع عنه.
                          </p>
                        </div>
                        <div className="flex justify-end space-x-2 space-x-reverse">
                          <Button variant="outline" onClick={() => setIsDrawerOpen(false)}>
                            إلغاء
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => {
                              setIsDrawerOpen(false);
                              handleDelete(server);
                            }}
                          >
                            حذف
                          </Button>
                        </div>
                      </>
                    )
                  }
                />
              ))}
              {/* إضافة خادم افتراضي جديد للجوال */}
              <Button
                className="w-full my-2"
                onClick={() =>
                  openDrawer(
                    <>
                      <DrawerHeader>
                        <DrawerTitle>إضافة خادم افتراضي جديد</DrawerTitle>
                      </DrawerHeader>
                      <VirtualServerForm
                        server={undefined}
                        onSuccess={() => {
                          setIsDrawerOpen(false);
                          handleFormSuccess();
                        }}
                        onCancel={() => setIsDrawerOpen(false)}
                      />
                    </>
                  )
                }
              >
                <Plus className="w-4 h-4 ml-2" />
                إضافة خادم افتراضي جديد
              </Button>
              {filteredServers.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  لا توجد خوادم افتراضية متاحة
                </div>
              )}
              {/* Drawer للجوال */}
              <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                <DrawerContent>{drawerContent}</DrawerContent>
              </Drawer>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>اسم الخادم</TableHead>
                    <TableHead>نظام التشغيل</TableHead>
                    <TableHead>البيئة</TableHead>
                    <TableHead>المعالج الافتراضي</TableHead>
                    <TableHead>الذاكرة</TableHead>
                    <TableHead>القرص</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredServers.map((server) => (
                    <TableRow key={server.id}>
                      <TableCell className="font-medium">{server.host_name}</TableCell>
                      <TableCell>
                        {server.os_type && server.os_version 
                          ? `${server.os_type} ${server.os_version}`
                          : server.os_type || '-'
                        }
                      </TableCell>
                      <TableCell>{server.environment || '-'}</TableCell>
                      <TableCell>{server.virtual_cpu || '-'}</TableCell>
                      <TableCell>{server.virtual_ram || '-'}</TableCell>
                      <TableCell>{server.virtual_disk || '-'}</TableCell>
                      <TableCell>
                        {server.status && (
                          <Badge variant="secondary">{server.status}</Badge>
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
                            onClick={() => handleDelete(server)}
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

      <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
        <ModalContent className="max-w-4xl">
          <ModalHeader>
            <ModalTitle>
              {isEditing ? 'تعديل الخادم الافتراضي' : 'إضافة خادم افتراضي جديد'}
            </ModalTitle>
          </ModalHeader>
          <VirtualServerForm
            server={selectedServer || undefined}
            onSuccess={handleFormSuccess}
            onCancel={handleModalClose}
          />
        </ModalContent>
      </Modal>
    </div>
  );
};

export default VirtualServers;
