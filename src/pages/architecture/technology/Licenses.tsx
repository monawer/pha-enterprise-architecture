
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText, Plus, Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface License {
  id: string;
  license_name: string;
  code?: string;
  type?: string;
  manufacturer?: string;
  quantity?: number;
  cost?: number;
  acquisition_date?: string;
  expiry_date?: string;
  created_at: string;
}

const Licenses = () => {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingLicense, setEditingLicense] = useState<License | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    license_name: '',
    code: '',
    type: '',
    manufacturer: '',
    quantity: '',
    cost: '',
    acquisition_date: '',
    expiry_date: ''
  });

  useEffect(() => {
    fetchLicenses();
  }, []);

  const fetchLicenses = async () => {
    try {
      const { data, error } = await supabase
        .from('tech_licenses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLicenses(data || []);
    } catch (error) {
      console.error('Error fetching licenses:', error);
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
        quantity: formData.quantity ? parseInt(formData.quantity) : null,
        cost: formData.cost ? parseFloat(formData.cost) : null,
        acquisition_date: formData.acquisition_date || null,
        expiry_date: formData.expiry_date || null
      };

      if (editingLicense) {
        const { error } = await supabase
          .from('tech_licenses')
          .update(dataToSubmit)
          .eq('id', editingLicense.id);

        if (error) throw error;
        
        toast({
          title: "تم التحديث",
          description: "تم تحديث الترخيص بنجاح"
        });
      } else {
        const { error } = await supabase
          .from('tech_licenses')
          .insert([dataToSubmit]);

        if (error) throw error;
        
        toast({
          title: "تم الإضافة",
          description: "تم إضافة الترخيص بنجاح"
        });
      }

      resetForm();
      fetchLicenses();
    } catch (error) {
      console.error('Error saving license:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في حفظ البيانات",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (license: License) => {
    setEditingLicense(license);
    setFormData({
      license_name: license.license_name || '',
      code: license.code || '',
      type: license.type || '',
      manufacturer: license.manufacturer || '',
      quantity: license.quantity?.toString() || '',
      cost: license.cost?.toString() || '',
      acquisition_date: license.acquisition_date || '',
      expiry_date: license.expiry_date || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف الترخيص؟')) {
      try {
        const { error } = await supabase
          .from('tech_licenses')
          .delete()
          .eq('id', id);

        if (error) throw error;
        
        toast({
          title: "تم الحذف",
          description: "تم حذف الترخيص بنجاح"
        });
        
        fetchLicenses();
      } catch (error) {
        console.error('Error deleting license:', error);
        toast({
          title: "خطأ",
          description: "حدث خطأ في حذف الترخيص",
          variant: "destructive"
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      license_name: '',
      code: '',
      type: '',
      manufacturer: '',
      quantity: '',
      cost: '',
      acquisition_date: '',
      expiry_date: ''
    });
    setEditingLicense(null);
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
          <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-saudi">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-saudi">التراخيص</h1>
            <p className="text-gray-600 mt-1 font-saudi">إدارة تراخيص البرمجيات والأنظمة</p>
          </div>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-saudi-green-600 hover:bg-saudi-green-700 text-white font-saudi"
        >
          <Plus className="w-4 h-4 ml-2" />
          إضافة ترخيص
        </Button>
      </div>

      {showForm && (
        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle className="font-saudi">
              {editingLicense ? 'تعديل الترخيص' : 'إضافة ترخيص جديد'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="license_name" className="font-saudi">اسم الترخيص *</Label>
                  <Input
                    id="license_name"
                    value={formData.license_name}
                    onChange={(e) => setFormData({...formData, license_name: e.target.value})}
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
                  <Label htmlFor="type" className="font-saudi">النوع</Label>
                  <Input
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="font-saudi"
                  />
                </div>
                <div>
                  <Label htmlFor="manufacturer" className="font-saudi">الشركة المصنعة</Label>
                  <Input
                    id="manufacturer"
                    value={formData.manufacturer}
                    onChange={(e) => setFormData({...formData, manufacturer: e.target.value})}
                    className="font-saudi"
                  />
                </div>
                <div>
                  <Label htmlFor="quantity" className="font-saudi">الكمية</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
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
                <div>
                  <Label htmlFor="acquisition_date" className="font-saudi">تاريخ الحصول</Label>
                  <Input
                    id="acquisition_date"
                    type="date"
                    value={formData.acquisition_date}
                    onChange={(e) => setFormData({...formData, acquisition_date: e.target.value})}
                    className="font-saudi"
                  />
                </div>
                <div>
                  <Label htmlFor="expiry_date" className="font-saudi">تاريخ الانتهاء</Label>
                  <Input
                    id="expiry_date"
                    type="date"
                    value={formData.expiry_date}
                    onChange={(e) => setFormData({...formData, expiry_date: e.target.value})}
                    className="font-saudi"
                  />
                </div>
              </div>
              <div className="flex space-x-2 space-x-reverse">
                <Button type="submit" className="bg-saudi-green-600 hover:bg-saudi-green-700 font-saudi">
                  {editingLicense ? 'تحديث' : 'إضافة'}
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
        {licenses.map((license) => (
          <Card key={license.id} className="border border-gray-200 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-saudi">{license.license_name}</CardTitle>
                <div className="flex space-x-1 space-x-reverse">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(license)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(license.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {license.code && <p className="text-sm text-gray-600 font-saudi">الرمز: {license.code}</p>}
              {license.type && <p className="text-sm text-gray-600 font-saudi">النوع: {license.type}</p>}
              {license.manufacturer && <p className="text-sm text-gray-600 font-saudi">الشركة: {license.manufacturer}</p>}
              {license.quantity && <p className="text-sm text-gray-600 font-saudi">الكمية: {license.quantity}</p>}
              {license.cost && <p className="text-sm text-gray-600 font-saudi">التكلفة: {license.cost.toLocaleString()} ريال</p>}
              {license.expiry_date && (
                <p className="text-sm text-gray-600 font-saudi">
                  تاريخ الانتهاء: {new Date(license.expiry_date).toLocaleDateString('ar-SA')}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {licenses.length === 0 && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 font-saudi">لا توجد تراخيص</h3>
          <p className="mt-1 text-sm text-gray-500 font-saudi">ابدأ بإضافة ترخيص جديد</p>
        </div>
      )}
    </div>
  );
};

export default Licenses;
