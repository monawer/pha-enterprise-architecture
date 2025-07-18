
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalTrigger } from '@/components/ui/modal';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Search, Link, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import TechnicalLinkForm from '@/components/forms/TechnicalLinkForm';

const TechnicalLinks = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<any>(null);
  const { toast } = useToast();

  const { data: technicalLinks, isLoading, refetch } = useQuery({
    queryKey: ['technical-links'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('app_technical_links')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching technical links:', error);
        throw error;
      }
      return data || [];
    },
  });

  const filteredLinks = technicalLinks?.filter(link =>
    link.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    link.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الرابط التقني؟')) {
      try {
        const { error } = await supabase
          .from('app_technical_links')
          .delete()
          .eq('id', id);

        if (error) throw error;

        toast({
          title: "تم حذف الرابط التقني بنجاح",
          description: "تم حذف الرابط التقني من النظام",
        });
        
        refetch();
      } catch (error) {
        console.error('Error deleting technical link:', error);
        toast({
          title: "خطأ في الحذف",
          description: "حدث خطأ أثناء حذف الرابط التقني",
          variant: "destructive",
        });
      }
    }
  };

  const handleEdit = (link: any) => {
    setEditingLink(link);
    setIsModalOpen(true);
  };

  const handleFormSuccess = () => {
    setIsModalOpen(false);
    setEditingLink(null);
    refetch();
  };

  const handleFormCancel = () => {
    setIsModalOpen(false);
    setEditingLink(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">نقاط الربط التقني</h1>
          <p className="text-gray-600 mt-2">
            إدارة الروابط والاتصالات التقنية
          </p>
        </div>
        <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
          <ModalTrigger asChild>
            <Button onClick={() => setEditingLink(null)}>
              <Plus className="w-4 h-4 ml-2" />
              إضافة رابط تقني
            </Button>
          </ModalTrigger>
          <ModalContent className="max-w-2xl">
            <ModalHeader>
              <ModalTitle>
                {editingLink ? 'تعديل الرابط التقني' : 'إضافة رابط تقني جديد'}
              </ModalTitle>
            </ModalHeader>
            <div className="p-4">
              <TechnicalLinkForm
                onSuccess={handleFormSuccess}
                onCancel={handleFormCancel}
                initialData={editingLink}
                isEdit={!!editingLink}
                linkId={editingLink?.id}
              />
            </div>
          </ModalContent>
        </Modal>
      </div>

      <div className="flex items-center space-x-4 space-x-reverse">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="البحث في الروابط التقنية..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLinks.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Link className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                لا توجد روابط تقنية
              </h3>
              <p className="text-gray-600 text-center">
                {searchTerm ? 'لم يتم العثور على نتائج للبحث' : 'لم يتم إضافة أي روابط تقنية بعد'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredLinks.map((link) => (
            <Card key={link.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="p-2 rounded-lg bg-purple-500 text-white">
                      <Link className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{link.name}</CardTitle>
                      {link.number && (
                        <p className="text-sm text-gray-600">الرقم: {link.number}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2 space-x-reverse">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(link)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(link.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {link.description || 'لا يوجد وصف متاح'}
                </p>
                <div className="space-y-2 text-sm">
                  {link.sender && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">المرسل:</span>
                      <span>{link.sender}</span>
                    </div>
                  )}
                  {link.receiver && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">المستقبل:</span>
                      <span>{link.receiver}</span>
                    </div>
                  )}
                  {link.connection_type && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">نوع الاتصال:</span>
                      <span>{link.connection_type}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default TechnicalLinks;
