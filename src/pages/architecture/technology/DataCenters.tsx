import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Plus, Edit, Trash2, MapPin, Users, Settings } from 'lucide-react';
import { useDataCenterLocations, DataCenterLocation, CreateDataCenterLocation } from '@/hooks/useDataCenterLocations';
import { useDataCenterComponents } from '@/hooks/useDataCenterComponents';
import DataCenterLocationForm from '@/components/forms/DataCenterLocationForm';
import DataCenterComponentsList from '@/components/datacenter/DataCenterComponentsList';

const DataCenters = () => {
  const { locations, loading, createLocation, updateLocation, deleteLocation } = useDataCenterLocations();
  const { stats: globalStats } = useDataCenterComponents();
  const [showForm, setShowForm] = useState(false);
  const [editingLocation, setEditingLocation] = useState<DataCenterLocation | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<DataCenterLocation | null>(null);

  const handleSubmit = async (data: CreateDataCenterLocation) => {
    if (editingLocation) {
      return await updateLocation(editingLocation.id, data);
    } else {
      return await createLocation(data);
    }
  };

  const handleEdit = (location: DataCenterLocation) => {
    setEditingLocation(location);
    setShowForm(true);
  };

  const handleDelete = async (location: DataCenterLocation) => {
    if (confirm(`هل أنت متأكد من حذف مركز البيانات "${location.name}"؟`)) {
      await deleteLocation(location.id);
    }
  };

  const resetForm = () => {
    setEditingLocation(null);
    setShowForm(false);
  };

  const showComponents = (location: DataCenterLocation) => {
    setSelectedLocation(location);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-saudi-green-600"></div>
    </div>;
  }

  // عرض مكونات المركز المحدد
  if (selectedLocation) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setSelectedLocation(null)}
            className="font-saudi"
          >
            ← العودة للمراكز
          </Button>
        </div>
        <DataCenterComponentsList 
          locationId={selectedLocation.id} 
          locationName={selectedLocation.name}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white rounded-lg p-6 shadow-saudi-sm border border-gray-100">
        <div className="flex items-center space-x-4 space-x-reverse">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-saudi">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-saudi">مراكز البيانات</h1>
            <p className="text-gray-600 mt-1 font-saudi">إدارة مراكز البيانات ومواقع إدارة الشبكة</p>
          </div>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-saudi-green-600 hover:bg-saudi-green-700 text-white font-saudi"
        >
          <Plus className="w-4 h-4 ml-2" />
          إضافة مركز بيانات
        </Button>
      </div>

      {/* إحصائيات عامة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-saudi">عدد المراكز</p>
                <p className="text-2xl font-bold text-orange-600">{locations.length}</p>
              </div>
              <Building2 className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-saudi">إجمالي المكونات</p>
                <p className="text-2xl font-bold text-blue-600">{globalStats.total}</p>
              </div>
              <Settings className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-saudi">المراكز النشطة</p>
                <p className="text-2xl font-bold text-green-600">
                  {locations.filter(loc => loc.operational_status === 'active').length}
                </p>
              </div>
              <MapPin className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-saudi">تحت الصيانة</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {locations.filter(loc => loc.operational_status === 'maintenance').length}
                </p>
              </div>
              <Users className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {showForm && (
        <DataCenterLocationForm
          location={editingLocation}
          onSubmit={handleSubmit}
          onCancel={resetForm}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {locations.map((location) => (
          <Card key={location.id} className="border border-gray-200 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-saudi">{location.name}</CardTitle>
                <div className="flex space-x-1 space-x-reverse">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => showComponents(location)}
                    className="h-8 w-8 p-0"
                    title="عرض المكونات"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(location)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(location)}
                    className="h-8 w-8 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {location.code && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 font-saudi">الرمز:</span>
                  <span className="text-sm font-saudi">{location.code}</span>
                </div>
              )}
              {location.city && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 font-saudi">المدينة:</span>
                  <span className="text-sm font-saudi">{location.city}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 font-saudi">الحالة:</span>
                <span className={`text-sm font-saudi px-2 py-1 rounded-full text-xs ${
                  location.operational_status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : location.operational_status === 'maintenance'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {location.operational_status === 'active' ? 'نشط' : 
                   location.operational_status === 'maintenance' ? 'تحت الصيانة' : 'غير نشط'}
                </span>
              </div>
              {location.manager_name && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 font-saudi">المدير:</span>
                  <span className="text-sm font-saudi">{location.manager_name}</span>
                </div>
              )}
              {location.total_area && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 font-saudi">المساحة:</span>
                  <span className="text-sm font-saudi">{location.total_area.toLocaleString()} م²</span>
                </div>
              )}
              {location.description && (
                <div className="mt-2">
                  <p className="text-sm text-gray-700 font-saudi">{location.description}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {locations.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 font-saudi">لا توجد مراكز بيانات</h3>
          <p className="mt-1 text-sm text-gray-500 font-saudi">ابدأ بإضافة مركز بيانات جديد</p>
        </div>
      )}
    </div>
  );
};

export default DataCenters;
