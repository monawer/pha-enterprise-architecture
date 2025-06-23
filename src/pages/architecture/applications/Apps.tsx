
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from '@/components/ui/modal';
import { Plus, Code, ExternalLink, Users, DollarSign, Calendar, Building } from 'lucide-react';
import ApplicationForm from '@/components/forms/ApplicationForm';
import { useIsMobile } from '@/hooks/use-mobile';
import { useApps } from '@/hooks/useApps';
import SearchAndFilterCard from '@/components/common/SearchAndFilterCard';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import EntityHeader from '@/components/common/EntityHeader';

const Apps = () => {
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [appToDelete, setAppToDelete] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const { applications, loading, refetch, handleDelete } = useApps();

  const handleEdit = (app: any) => {
    setSelectedApp(app);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedApp(null);
    setIsModalOpen(true);
  };

  const handleDeleteApp = (app: any) => {
    setAppToDelete(app);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!appToDelete?.id) return;
    handleDelete(appToDelete);
    setIsDeleteModalOpen(false);
    setAppToDelete(null);
  };

  const handleFormSuccess = () => {
    setIsModalOpen(false);
    setSelectedApp(null);
    refetch();
  };

  const filteredApps = applications.filter(app =>
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (app.description && app.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (app.code && app.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (app.developer_entity && app.developer_entity.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'inactive':
        return 'secondary';
      case 'maintenance':
        return 'destructive';
      case 'development':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'نشط';
      case 'inactive':
        return 'غير نشط';
      case 'maintenance':
        return 'تحت الصيانة';
      case 'development':
        return 'تحت التطوير';
      default:
        return status || 'غير محدد';
    }
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'critical':
        return 'text-red-600 bg-red-50';
      case 'high':
        return 'text-orange-600 bg-orange-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'low':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatCurrency = (amount: number) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <EntityHeader
        icon={<Code className="w-6 h-6" />}
        title="إدارة التطبيقات"
        description="عرض وإدارة التطبيقات المستخدمة في المؤسسة"
        onAdd={handleAdd}
        addButtonText="إضافة تطبيق جديد"
        addButtonIcon={<Plus className="w-4 h-4" />}
      />

      <SearchAndFilterCard
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="البحث في التطبيقات..."
        totalCount={filteredApps.length}
        entityName="تطبيق"
      />

      <Card>
        <CardHeader>
          <CardTitle>قائمة التطبيقات ({filteredApps.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">جاري التحميل...</div>
          ) : (
            <div className="grid gap-6">
              {filteredApps.map((app) => (
                <Card key={app.id} className="p-6 hover:shadow-md transition-shadow">
                  <div className="space-y-4">
                    {/* Header Section */}
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-xl">{app.name}</h3>
                          {app.code && (
                            <Badge variant="outline">{app.code}</Badge>
                          )}
                          {app.version && (
                            <Badge variant="secondary">v{app.version}</Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 mb-3">
                          <Badge variant={getStatusBadgeVariant(app.status)}>
                            {getStatusText(app.status)}
                          </Badge>
                          
                          {app.importance && (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImportanceColor(app.importance)}`}>
                              {app.importance === 'critical' ? 'حرج' :
                               app.importance === 'high' ? 'عالي' :
                               app.importance === 'medium' ? 'متوسط' :
                               app.importance === 'low' ? 'منخفض' : app.importance}
                            </span>
                          )}
                          
                          {app.app_link && (
                            <Button variant="ghost" size="sm" asChild>
                              <a href={app.app_link} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            </Button>
                          )}
                        </div>

                        {app.description && (
                          <p className="text-gray-600 mb-4">{app.description}</p>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(app)}
                        >
                          تعديل
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteApp(app)}
                        >
                          حذف
                        </Button>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
                      {/* Business Information */}
                      {(app.using_department || app.owning_department) && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <Building className="w-4 h-4" />
                            الأقسام
                          </div>
                          {app.using_department && (
                            <div className="text-sm">
                              <span className="text-gray-500">المستخدم:</span>
                              <span className="mr-1">{app.using_department}</span>
                            </div>
                          )}
                          {app.owning_department && (
                            <div className="text-sm">
                              <span className="text-gray-500">المالك:</span>
                              <span className="mr-1">{app.owning_department}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* User Information */}
                      {(app.user_count || app.end_user) && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <Users className="w-4 h-4" />
                            المستخدمون
                          </div>
                          {app.user_count && (
                            <div className="text-sm">
                              <span className="text-gray-500">العدد:</span>
                              <span className="mr-1">{app.user_count.toLocaleString('ar-SA')}</span>
                            </div>
                          )}
                          {app.end_user && (
                            <div className="text-sm">
                              <span className="text-gray-500">النوع:</span>
                              <span className="mr-1">{app.end_user}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Financial Information */}
                      {(app.initial_cost || app.operational_cost || app.capital_cost) && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <DollarSign className="w-4 h-4" />
                            التكاليف
                          </div>
                          {app.initial_cost && (
                            <div className="text-sm">
                              <span className="text-gray-500">أولية:</span>
                              <span className="mr-1">{formatCurrency(app.initial_cost)}</span>
                            </div>
                          )}
                          {app.operational_cost && (
                            <div className="text-sm">
                              <span className="text-gray-500">تشغيلية:</span>
                              <span className="mr-1">{formatCurrency(app.operational_cost)}</span>
                            </div>
                          )}
                          {app.capital_cost && (
                            <div className="text-sm">
                              <span className="text-gray-500">رأسمالية:</span>
                              <span className="mr-1">{formatCurrency(app.capital_cost)}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Technical Information */}
                      {(app.development_technology || app.hosting_server || app.launch_date) && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <Calendar className="w-4 h-4" />
                            معلومات تقنية
                          </div>
                          {app.development_technology && (
                            <div className="text-sm">
                              <span className="text-gray-500">التقنية:</span>
                              <span className="mr-1">{app.development_technology}</span>
                            </div>
                          )}
                          {app.hosting_server && (
                            <div className="text-sm">
                              <span className="text-gray-500">الخادم:</span>
                              <span className="mr-1">{app.hosting_server}</span>
                            </div>
                          )}
                          {app.launch_date && (
                            <div className="text-sm">
                              <span className="text-gray-500">الإطلاق:</span>
                              <span className="mr-1">{new Date(app.launch_date).toLocaleDateString('ar-SA')}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Additional Information */}
                    {(app.developer_entity || app.technical_owner) && (
                      <div className="flex flex-wrap gap-4 pt-2 border-t text-sm text-gray-600">
                        {app.developer_entity && (
                          <div>
                            <span className="font-medium">جهة التطوير:</span>
                            <span className="mr-1">{app.developer_entity}</span>
                          </div>
                        )}
                        {app.technical_owner && (
                          <div>
                            <span className="font-medium">المسؤول التقني:</span>
                            <span className="mr-1">{app.technical_owner}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
        <ModalContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <ModalHeader>
            <ModalTitle>
              {selectedApp ? 'تعديل تطبيق' : 'إضافة تطبيق جديد'}
            </ModalTitle>
          </ModalHeader>
          <ApplicationForm
            onSuccess={handleFormSuccess}
            onCancel={() => setIsModalOpen(false)}
            initialData={selectedApp}
            isEdit={!!selectedApp}
            applicationId={selectedApp?.id}
          />
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onConfirm={confirmDelete}
        title="تأكيد الحذف"
        description={`هل أنت متأكد من حذف التطبيق "${appToDelete?.name}"؟ هذا الإجراء لا يمكن التراجع عنه.`}
        confirmText="حذف"
        cancelText="إلغاء"
        variant="destructive"
      />
    </div>
  );
};

export default Apps;
