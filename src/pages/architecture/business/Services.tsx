import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from '@/components/ui/modal';
import { Badge } from '@/components/ui/badge';
import { Building2, Plus } from 'lucide-react';
import ServiceForm from '@/components/forms/ServiceForm';
import ServiceCard from '@/components/cards/ServiceCard';
import ServiceListView from '@/components/services/ServiceListView';
import ServiceTableView from '@/components/services/ServiceTableView';
import ViewModeToggle from '@/components/services/ViewModeToggle';
import ServiceDetailsModal from '@/components/services/ServiceDetailsModal';
import SearchAndFilter from '@/components/common/SearchAndFilter';
import PaginationControls from '@/components/common/PaginationControls';

interface Service {
  id: string;
  service_name: string;
  service_description?: string;
  service_type?: string;
  owning_department?: string;
  current_maturity?: string;
  highest_maturity?: string;
  service_fees?: number;
  annual_operations?: number;
  annual_beneficiaries?: number;
  service_code?: string;
  ownership_type?: string;
  authority_importance?: string;
  platform?: string;
  internal_external?: string;
  target_user?: string;
  service_language?: string;
  service_stability?: string;
  launch_date?: string;
  external_integration?: string;
  delivery_channels?: string;
  customer_satisfaction?: number;
  service_link?: string;
  service_priority?: string;
  execution_time?: string;
  user_guide?: string;
  faq_link?: string;
  sla_link?: string;
  application_steps?: string;
  beneficiary_type?: string;
  external_entities_connection?: string;
  integration_method?: string;
  delivery_method?: string;
  service_conditions?: string;
  required_documents?: string;
  keywords?: string;
  satisfaction_measurement_channels?: string;
  created_at: string;
}

type ViewMode = 'cards' | 'list' | 'table';

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [serviceDetails, setServiceDetails] = useState<Service | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list'); // Changed default to list
  const [activeFilters, setActiveFilters] = useState<Record<string, boolean>>({});
  
  // Pagination state - increased items per page for better density
  const [currentPage, setCurrentPage] = useState(1);
  
  const { toast } = useToast();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('biz_services')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في جلب بيانات الخدمات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedService(null);
    setIsModalOpen(true);
  };

  const handleViewDetails = (service: Service) => {
    setServiceDetails(service);
    setIsDetailsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!serviceToDelete) return;

    try {
      const { error } = await supabase
        .from('biz_services')
        .delete()
        .eq('id', serviceToDelete.id);

      if (error) throw error;

      toast({
        title: "تم بنجاح",
        description: "تم حذف الخدمة بنجاح",
      });
      
      fetchServices();
      setIsDeleteModalOpen(false);
      setServiceToDelete(null);
    } catch (error) {
      console.error('Error deleting service:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حذف الخدمة",
        variant: "destructive",
      });
    }
  };

  const handleFormSuccess = () => {
    setIsModalOpen(false);
    setSelectedService(null);
    fetchServices();
  };

  // Filter and search logic
  const filteredServices = services.filter(service => {
    const matchesSearch = service.service_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (service.service_description && service.service_description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (service.service_code && service.service_code.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Add filter logic here based on activeFilters
    return matchesSearch;
  });

  // Updated pagination logic for different view modes
  const getItemsPerPage = (mode: ViewMode) => {
    switch (mode) {
      case 'cards': return 36;
      case 'list': return 50;
      case 'table': return 100;
      default: return 36;
    }
  };

  const currentItemsPerPage = getItemsPerPage(viewMode);

  // Pagination logic
  const totalItems = filteredServices.length;
  const totalPages = Math.ceil(totalItems / currentItemsPerPage);
  const startIndex = (currentPage - 1) * currentItemsPerPage + 1;
  const endIndex = Math.min(currentPage * currentItemsPerPage, totalItems);
  const paginatedServices = filteredServices.slice(
    (currentPage - 1) * currentItemsPerPage,
    currentPage * currentItemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleToggleFilter = (filterKey: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterKey]: !prev[filterKey]
    }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setActiveFilters({});
    setSearchTerm('');
    setCurrentPage(1);
  };

  const isFiltered = Object.values(activeFilters).some(Boolean) || searchTerm.length > 0;

  const filterOptions = [
    { key: 'internal', label: 'داخلية', count: services.filter(s => s.internal_external === 'داخلية').length },
    { key: 'external', label: 'خارجية', count: services.filter(s => s.internal_external === 'خارجية').length },
    { key: 'high_priority', label: 'أولوية عالية', count: services.filter(s => s.service_priority === 'عالية').length },
    { key: 'critical_priority', label: 'أولوية حرجة', count: services.filter(s => s.service_priority === 'حرجة').length },
    { key: 'stable', label: 'مستقر', count: services.filter(s => s.service_stability === 'مستقر').length },
    { key: 'free', label: 'مجاني', count: services.filter(s => s.service_fees === 0).length },
  ];

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with enhanced styling */}
      <div className="flex items-center justify-between bg-gradient-to-r from-white to-gray-50/30 rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className="p-3 rounded-xl bg-gradient-to-br from-saudi-green-500 to-saudi-green-600 shadow-lg">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">إدارة الخدمات</h1>
            <p className="text-gray-600 mt-1">عرض وإدارة الخدمات المقدمة للمستفيدين</p>
            <div className="flex items-center mt-2 space-x-4 space-x-reverse text-sm">
              <span className="flex items-center text-saudi-green-700">
                <div className="w-2 h-2 bg-saudi-green-500 rounded-full mr-2 animate-pulse"></div>
                {services.length} خدمة نشطة
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <ViewModeToggle
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
            itemCount={totalItems}
          />

          <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
            <ModalTrigger asChild>
              <Button 
                onClick={handleAdd}
                className="bg-gradient-to-r from-saudi-green-600 to-saudi-green-700 hover:from-saudi-green-700 hover:to-saudi-green-800 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Plus className="w-4 h-4 ml-2" />
                إضافة خدمة جديدة
              </Button>
            </ModalTrigger>
            <ModalContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <ModalHeader>
                <ModalTitle>
                  {selectedService ? 'تعديل الخدمة' : 'إضافة خدمة جديدة'}
                </ModalTitle>
              </ModalHeader>
              <ServiceForm
                service={selectedService}
                onSuccess={handleFormSuccess}
                onCancel={() => setIsModalOpen(false)}
              />
            </ModalContent>
          </Modal>
        </div>
      </div>

      {/* Search and Filter */}
      <SearchAndFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        activeFilters={activeFilters}
        onToggleFilter={handleToggleFilter}
        onClearFilters={handleClearFilters}
        filterOptions={filterOptions}
        placeholder="البحث في الخدمات..."
        isFiltered={isFiltered}
        totalResults={totalItems}
      />

      {/* Results Summary */}
      <Card className="shadow-sm border border-gray-100">
        <CardHeader className="bg-gradient-to-r from-gray-50/50 to-transparent pb-4">
          <CardTitle className="flex items-center justify-between">
            <span className="text-xl">قائمة الخدمات ({totalItems})</span>
            <Badge variant="outline" className="text-sm bg-white">
              عرض {startIndex} - {endIndex} من أصل {totalItems}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {/* Dynamic View Based on Mode */}
          {viewMode === 'cards' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-3">
              {paginatedServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onEdit={handleEdit}
                  onDelete={(service) => {
                    setServiceToDelete(service);
                    setIsDeleteModalOpen(true);
                  }}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          )}

          {viewMode === 'list' && (
            <ServiceListView
              services={paginatedServices}
              onEdit={handleEdit}
              onDelete={(service) => {
                setServiceToDelete(service);
                setIsDeleteModalOpen(true);
              }}
              onViewDetails={handleViewDetails}
            />
          )}

          {viewMode === 'table' && (
            <ServiceTableView
              services={paginatedServices}
              onEdit={handleEdit}
              onDelete={(service) => {
                setServiceToDelete(service);
                setIsDeleteModalOpen(true);
              }}
              onViewDetails={handleViewDetails}
            />
          )}

          {paginatedServices.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8">
                <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد خدمات</h3>
                <p className="text-gray-500 mb-4">
                  {isFiltered ? 'لا توجد خدمات تطابق المعايير المحددة' : 'لم يتم إضافة أي خدمات بعد'}
                </p>
                {isFiltered && (
                  <Button 
                    variant="outline" 
                    onClick={handleClearFilters}
                    className="hover:bg-saudi-green-50 hover:border-saudi-green-300"
                  >
                    مسح الفلاتر
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          hasNextPage={currentPage < totalPages}
          hasPrevPage={currentPage > 1}
          startIndex={startIndex}
          endIndex={endIndex}
          totalItems={totalItems}
        />
      )}

      {/* Enhanced Service Details Modal */}
      <ServiceDetailsModal
        service={serviceDetails}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      />

      {/* Delete Confirmation Modal */}
      <Modal open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <ModalContent className="max-w-md">
          <ModalHeader>
            <ModalTitle className="text-red-600">تأكيد الحذف</ModalTitle>
          </ModalHeader>
          <div className="py-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-gray-700">
                هل أنت متأكد من حذف الخدمة "<span className="font-bold text-red-700">{serviceToDelete?.service_name}</span>"؟
              </p>
              <p className="text-red-600 text-sm mt-2">
                هذا الإجراء لا يمكن التراجع عنه.
              </p>
            </div>
          </div>
          <div className="flex justify-end space-x-2 space-x-reverse">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              className="hover:bg-gray-50"
            >
              إلغاء
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="hover:bg-red-700"
            >
              حذف
            </Button>
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Services;
