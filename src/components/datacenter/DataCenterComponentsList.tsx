import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Server, HardDrive, Wifi, Shield, Building2, Plus, Trash2, Edit } from 'lucide-react';
import { useDataCenterComponents, DataCenterComponent } from '@/hooks/useDataCenterComponents';
import AddComponentDialog from './AddComponentDialog';
import EditComponentDialog from './EditComponentDialog';

interface DataCenterComponentsListProps {
  locationId: string;
  locationName: string;
}

const componentIcons = {
  physical_server: <Server className="w-4 h-4" />,
  virtual_server: <HardDrive className="w-4 h-4" />,
  network_device: <Wifi className="w-4 h-4" />,
  security_device: <Shield className="w-4 h-4" />,
  data_center: <Building2 className="w-4 h-4" />
};

const componentLabels = {
  physical_server: 'خادم فيزيائي',
  virtual_server: 'خادم افتراضي',
  network_device: 'جهاز شبكة',
  security_device: 'جهاز أمني',
  data_center: 'مركز بيانات'
};

const componentColors = {
  physical_server: 'bg-blue-50 text-blue-600',
  virtual_server: 'bg-green-50 text-green-600',
  network_device: 'bg-purple-50 text-purple-600',
  security_device: 'bg-red-50 text-red-600',
  data_center: 'bg-orange-50 text-orange-600'
};

const DataCenterComponentsList: React.FC<DataCenterComponentsListProps> = ({
  locationId,
  locationName
}) => {
  const { components, stats, loading, removeComponentFromCenter, refetch } = useDataCenterComponents(locationId);
  const [editingComponent, setEditingComponent] = useState<DataCenterComponent | null>(null);

  const handleRemoveComponent = async (componentId: string) => {
    if (confirm('هل أنت متأكد من إزالة هذا المكون من مركز البيانات؟')) {
      await removeComponentFromCenter(componentId);
    }
  };

  const handleComponentAdded = () => {
    refetch();
  };

  const handleEditComponent = (component: DataCenterComponent) => {
    setEditingComponent(component);
  };

  const handleEditSubmit = () => {
    setEditingComponent(null);
    refetch();
  };

  if (loading) {
    return <div className="flex justify-center items-center h-32">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-saudi-green-600"></div>
    </div>;
  }

  // إنشاء إحصائيات ديناميكية بناء على المكونات الموجودة فعلياً
  const getComponentTypesWithCounts = () => {
    const typeCounts: { [key: string]: number } = {};
    components.forEach(component => {
      typeCounts[component.component_type] = (typeCounts[component.component_type] || 0) + 1;
    });
    return Object.entries(typeCounts).map(([type, count]) => ({
      type: type as keyof typeof componentLabels,
      count,
      label: componentLabels[type as keyof typeof componentLabels],
      color: componentColors[type as keyof typeof componentColors]
    }));
  };

  const componentTypesWithCounts = getComponentTypesWithCounts();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-saudi-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 font-saudi">مكونات {locationName}</h2>
          <AddComponentDialog 
            locationId={locationId} 
            onComponentAdded={handleComponentAdded}
          />
        </div>
        
        {/* إحصائيات ديناميكية */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
          {componentTypesWithCounts.map(({ type, count, label, color }) => (
            <div key={type} className={`p-4 rounded-lg text-center ${color}`}>
              <div className="text-2xl font-bold">{count}</div>
              <div className="text-sm font-saudi">{label}</div>
            </div>
          ))}
          
          {/* إجمالي المكونات */}
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-gray-600">{stats.total}</div>
            <div className="text-sm text-gray-600 font-saudi">إجمالي المكونات</div>
          </div>
          
          {/* عدد الأنواع */}
          <div className="bg-indigo-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-indigo-600">{componentTypesWithCounts.length}</div>
            <div className="text-sm text-indigo-600 font-saudi">أنواع المكونات</div>
          </div>
        </div>
      </div>

      {/* قائمة المكونات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {components.map((component) => (
          <Card key={component.id} className="border border-gray-200 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    {componentIcons[component.component_type]}
                  </div>
                  <div>
                    <CardTitle className="text-sm font-saudi">{component.component_name}</CardTitle>
                    <Badge variant="outline" className="text-xs font-saudi">
                      {componentLabels[component.component_type]}
                    </Badge>
                  </div>
                </div>
                <div className="flex space-x-1 space-x-reverse">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditComponent(component)}
                    className="h-8 w-8 p-0"
                    title="تعديل المكون"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleRemoveComponent(component.id)}
                    className="h-8 w-8 p-0"
                    title="حذف المكون"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 font-saudi">الحالة:</span>
                <Badge variant={component.status === 'active' ? 'default' : 'secondary'} className="font-saudi">
                  {component.status === 'active' ? 'نشط' : 'غير نشط'}
                </Badge>
              </div>
              {component.installation_date && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 font-saudi">تاريخ التركيب:</span>
                  <span className="text-sm font-saudi">{new Date(component.installation_date).toLocaleDateString('ar-SA')}</span>
                </div>
              )}
              {component.notes && (
                <div className="mt-2">
                  <span className="text-sm text-gray-600 font-saudi">ملاحظات:</span>
                  <p className="text-sm text-gray-800 font-saudi mt-1">{component.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {components.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 font-saudi">لا توجد مكونات</h3>
          <p className="mt-1 text-sm text-gray-500 font-saudi">لم يتم إضافة أي مكونات لهذا المركز بعد</p>
        </div>
      )}

      {/* Edit Component Dialog */}
      {editingComponent && (
        <EditComponentDialog
          component={editingComponent}
          onClose={() => setEditingComponent(null)}
          onSubmit={handleEditSubmit}
        />
      )}
    </div>
  );
};

export default DataCenterComponentsList;
