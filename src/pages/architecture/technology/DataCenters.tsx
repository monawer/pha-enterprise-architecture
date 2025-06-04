
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, Plus, Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface DataCenter {
  id: string;
  name: string;
  code?: string;
  location?: string;
  center_type?: string;
  center_role?: string;
  environment?: string;
  tier_level?: string;
  operation_type?: string;
  cost?: number;
  created_at: string;
}

const DataCenters = () => {
  const [dataCenters, setDataCenters] = useState<DataCenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCenter, setEditingCenter] = useState<DataCenter | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    location: '',
    center_type: '',
    center_role: '',
    environment: '',
    tier_level: '',
    operation_type: '',
    cost: ''
  });

  useEffect(() => {
    fetchDataCenters();
  }, []);

  const fetchDataCenters = async () => {
    try {
      const { data, error } = await supabase
        .from('tech_data_centers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDataCenters(data || []);
    } catch (error) {
      console.error('Error fetching data centers:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في تحميل البيانات",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const dataToSubmit = {
        ...formData,
        cost: formData.cost ? parseFloat(formData.cost) : null
      };

      if (editingCenter) {
        const { error } = await supabase
          .from('tech_data_centers')
          .update(dataToSubmit)
          .eq('id', editingCenter.id);

        if (error) throw error;
        
        toast({
          title: "تم التحديث",
          description: "تم تحديث مركز البيانات بنجاح"
        });
      } else {
        const { error } = await supabase
          .from('tech_data_centers')
          .insert([dataToSubmit]);

        if (error) throw error;
        
        toast({
          title: "تم الإضافة",
          description: "تم إضافة مركز البيانات بنجاح"
        });
      }

      resetForm();
      fetchDataCenters();
    } catch (error) {
      console.error('Error saving data center:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في حفظ البيانات",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (center: DataCenter) => {
    setEditingCenter(center);
    setFormData({
      name: center.name || '',
      code: center.code || '',
      location: center.location || '',
      center_type: center.center_type || '',
      center_role: center.center_role || '',
      environment: center.environment || '',
      tier_level: center.tier_level || '',
      operation_type: center.operation_type || '',
      cost: center.cost?.toString() || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف مركز البيانات؟')) {
      try {
        const { error } = await supabase
          .from('tech_data_centers')
          .delete()
          .eq('id', id);

        if (error) throw error;
        
        toast({
          title: "تم الحذف",
          description: "تم حذف مركز البيانات بنجاح"
        });
        
        fetchDataCenters();
      } catch (error) {
        console.error('Error deleting data center:', error);
        toast({
          title: "خطأ",
          description: "حدث خطأ في حذف مركز البيانات",
          variant: "destructive"
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      location: '',
      center_type: '',
      center_role: '',
      environment: '',
      tier_level: '',
      operation_type: '',
      cost: ''
    });
    setEditingCenter(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-saudi-green-600"></div>
    </div>;
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
            <p className="text-gray-600 mt-1 font-saudi">إدارة مراكز البيانات والمواقع</p>
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

      {showForm && (
        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle className="font-saudi">
              {editingCenter ? 'تعديل مركز البيانات' : 'إضافة مركز بيانات جديد'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="font-saudi">اسم مركز البيانات *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    className="font-saudi"
                  />
                </div>
                <div>
                  <Label htmlFor="code" className="font-saudi">الرمز</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                    className="font-saudi"
                  />
                </div>
                <div>
                  <Label htmlFor="location" className="font-saudi">الموقع</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="font-saudi"
                  />
                </div>
                <div>
                  <Label htmlFor="center_type" className="font-saudi">نوع المركز</Label>
                  <Input
                    id="center_type"
                    value={formData.center_type}
                    onChange={(e) => setFormData({...formData, center_type: e.target.value})}
                    className="font-saudi"
                  />
                </div>
                <div>
                  <Label htmlFor="center_role" className="font-saudi">دور المركز</Label>
                  <Input
                    id="center_role"
                    value={formData.center_role}
                    onChange={(e) => setFormData({...formData, center_role: e.target.value})}
                    className="font-saudi"
                  />
                </div>
                <div>
                  <Label htmlFor="environment" className="font-saudi">البيئة</Label>
                  <Input
                    id="environment"
                    value={formData.environment}
                    onChange={(e) => setFormData({...formData, environment: e.target.value})}
                    className="font-saudi"
                  />
                </div>
                <div>
                  <Label htmlFor="tier_level" className="font-saudi">مستوى التصنيف</Label>
                  <Input
                    id="tier_level"
                    value={formData.tier_level}
                    onChange={(e) => setFormData({...formData, tier_level: e.target.value})}
                    className="font-saudi"
                  />
                </div>
                <div>
                  <Label htmlFor="operation_type" className="font-saudi">نوع التشغيل</Label>
                  <Input
                    id="operation_type"
                    value={formData.operation_type}
                    onChange={(e) => setFormData({...formData, operation_type: e.target.value})}
                    className="font-saudi"
                  />
                </div>
                <div>
                  <Label htmlFor="cost" className="font-saudi">التكلفة</Label>
                  <Input
                    id="cost"
                    type="number"
                    value={formData.cost}
                    onChange={(e) => setFormData({...formData, cost: e.target.value})}
                    className="font-saudi"
                  />
                </div>
              </div>
              <div className="flex space-x-2 space-x-reverse">
                <Button type="submit" className="bg-saudi-green-600 hover:bg-saudi-green-700 font-saudi">
                  {editingCenter ? 'تحديث' : 'إضافة'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm} className="font-saudi">
                  إلغاء
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dataCenters.map((center) => (
          <Card key={center.id} className="border border-gray-200 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-saudi">{center.name}</CardTitle>
                <div className="flex space-x-1 space-x-reverse">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(center)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(center.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {center.code && <p className="text-sm text-gray-600 font-saudi">الرمز: {center.code}</p>}
              {center.location && <p className="text-sm text-gray-600 font-saudi">الموقع: {center.location}</p>}
              {center.center_type && <p className="text-sm text-gray-600 font-saudi">النوع: {center.center_type}</p>}
              {center.tier_level && <p className="text-sm text-gray-600 font-saudi">المستوى: {center.tier_level}</p>}
              {center.cost && <p className="text-sm text-gray-600 font-saudi">التكلفة: {center.cost.toLocaleString()} ريال</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      {dataCenters.length === 0 && (
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
