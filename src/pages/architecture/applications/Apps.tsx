
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalTrigger } from '@/components/ui/modal';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Search, Monitor } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Apps = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const { data: applications, isLoading, refetch } = useQuery({
    queryKey: ['applications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('app_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching applications:', error);
        throw error;
      }
      return data || [];
    },
  });

  const filteredApplications = applications?.filter(app =>
    app.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

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
          <h1 className="text-3xl font-bold text-gray-900">التطبيقات</h1>
          <p className="text-gray-600 mt-2">
            إدارة التطبيقات والأنظمة في المؤسسة
          </p>
        </div>
        <Modal>
          <ModalTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 ml-2" />
              إضافة تطبيق
            </Button>
          </ModalTrigger>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>إضافة تطبيق جديد</ModalTitle>
            </ModalHeader>
            <div className="p-4">
              <p className="text-gray-600">سيتم إضافة نموذج إضافة التطبيق هنا</p>
            </div>
          </ModalContent>
        </Modal>
      </div>

      <div className="flex items-center space-x-4 space-x-reverse">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="البحث في التطبيقات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredApplications.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Monitor className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                لا توجد تطبيقات
              </h3>
              <p className="text-gray-600 text-center">
                {searchTerm ? 'لم يتم العثور على نتائج للبحث' : 'لم يتم إضافة أي تطبيقات بعد'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredApplications.map((app) => (
            <Card key={app.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="p-2 rounded-lg bg-blue-500 text-white">
                    <Monitor className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{app.name}</CardTitle>
                    {app.version && (
                      <p className="text-sm text-gray-600">الإصدار: {app.version}</p>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {app.description || 'لا يوجد وصف متاح'}
                </p>
                <div className="space-y-2 text-sm">
                  {app.app_type && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">النوع:</span>
                      <span>{app.app_type}</span>
                    </div>
                  )}
                  {app.app_status && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">الحالة:</span>
                      <span>{app.app_status}</span>
                    </div>
                  )}
                  {app.using_department && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">القسم المستخدم:</span>
                      <span>{app.using_department}</span>
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

export default Apps;
