
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataCenterLocation } from '@/hooks/useDataCenterLocations';

interface DataCenterLocationFormProps {
  location?: DataCenterLocation | null;
  onSubmit: (data: Partial<DataCenterLocation>) => Promise<boolean>;
  onCancel: () => void;
}

const DataCenterLocationForm: React.FC<DataCenterLocationFormProps> = ({
  location,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    name: location?.name || '',
    code: location?.code || '',
    description: location?.description || '',
    address: location?.address || '',
    city: location?.city || '',
    coordinates: location?.coordinates || '',
    manager_name: location?.manager_name || '',
    manager_contact: location?.manager_contact || '',
    operational_status: location?.operational_status || 'active',
    establishment_date: location?.establishment_date || '',
    total_area: location?.total_area?.toString() || ''
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const dataToSubmit = {
      ...formData,
      total_area: formData.total_area ? parseFloat(formData.total_area) : null,
      establishment_date: formData.establishment_date || null
    };

    const success = await onSubmit(dataToSubmit);
    if (success) {
      onCancel();
    }
    setLoading(false);
  };

  return (
    <Card className="border border-gray-200">
      <CardHeader>
        <CardTitle className="font-saudi">
          {location ? 'تعديل مركز البيانات' : 'إضافة مركز بيانات جديد'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="font-saudi">اسم المركز *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                className="font-saudi"
              />
            </div>
            <div>
              <Label htmlFor="code" className="font-saudi">رمز المركز</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({...formData, code: e.target.value})}
                className="font-saudi"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="description" className="font-saudi">الوصف</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="font-saudi"
              />
            </div>
            <div>
              <Label htmlFor="address" className="font-saudi">العنوان</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="font-saudi"
              />
            </div>
            <div>
              <Label htmlFor="city" className="font-saudi">المدينة</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                className="font-saudi"
              />
            </div>
            <div>
              <Label htmlFor="coordinates" className="font-saudi">الإحداثيات</Label>
              <Input
                id="coordinates"
                value={formData.coordinates}
                onChange={(e) => setFormData({...formData, coordinates: e.target.value})}
                placeholder="مثال: 24.7136, 46.6753"
                className="font-saudi"
              />
            </div>
            <div>
              <Label htmlFor="manager_name" className="font-saudi">اسم المدير</Label>
              <Input
                id="manager_name"
                value={formData.manager_name}
                onChange={(e) => setFormData({...formData, manager_name: e.target.value})}
                className="font-saudi"
              />
            </div>
            <div>
              <Label htmlFor="manager_contact" className="font-saudi">معلومات الاتصال</Label>
              <Input
                id="manager_contact"
                value={formData.manager_contact}
                onChange={(e) => setFormData({...formData, manager_contact: e.target.value})}
                className="font-saudi"
              />
            </div>
            <div>
              <Label htmlFor="operational_status" className="font-saudi">حالة التشغيل</Label>
              <Select value={formData.operational_status} onValueChange={(value) => setFormData({...formData, operational_status: value})}>
                <SelectTrigger className="font-saudi">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">نشط</SelectItem>
                  <SelectItem value="inactive">غير نشط</SelectItem>
                  <SelectItem value="maintenance">تحت الصيانة</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="establishment_date" className="font-saudi">تاريخ التأسيس</Label>
              <Input
                id="establishment_date"
                type="date"
                value={formData.establishment_date}
                onChange={(e) => setFormData({...formData, establishment_date: e.target.value})}
                className="font-saudi"
              />
            </div>
            <div>
              <Label htmlFor="total_area" className="font-saudi">المساحة الإجمالية (متر مربع)</Label>
              <Input
                id="total_area"
                type="number"
                value={formData.total_area}
                onChange={(e) => setFormData({...formData, total_area: e.target.value})}
                className="font-saudi"
              />
            </div>
          </div>
          <div className="flex space-x-2 space-x-reverse">
            <Button type="submit" disabled={loading} className="bg-saudi-green-600 hover:bg-saudi-green-700 font-saudi">
              {loading ? 'جاري الحفظ...' : (location ? 'تحديث' : 'إضافة')}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="font-saudi">
              إلغاء
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default DataCenterLocationForm;
