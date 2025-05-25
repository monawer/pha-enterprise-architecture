
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Building2, Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Service {
  id: string;
  service_name: string;
  service_description?: string;
  service_type?: string;
  owning_department?: string;
  current_maturity?: string;
  service_fees?: number;
  annual_operations?: number;
  annual_beneficiaries?: number;
  created_at: string;
}

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
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

  const filteredServices = services.filter(service =>
    service.service_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (service.service_description && service.service_description.toLowerCase().includes(searchTerm.toLowerCase()))
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
          <Building2 className="w-8 h-8 text-blue-500" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">إدارة الخدمات</h1>
            <p className="text-gray-600">عرض وإدارة الخدمات المقدمة للمستفيدين</p>
          </div>
        </div>
        <Button>
          <Plus className="w-4 h-4 ml-2" />
          إضافة خدمة جديدة
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>قائمة الخدمات ({filteredServices.length})</CardTitle>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Search className="w-4 h-4 text-gray-400" />
              <Input
                placeholder="البحث في الخدمات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>اسم الخدمة</TableHead>
                  <TableHead>النوع</TableHead>
                  <TableHead>الجهة المسؤولة</TableHead>
                  <TableHead>مستوى النضج</TableHead>
                  <TableHead>الرسوم</TableHead>
                  <TableHead>العمليات السنوية</TableHead>
                  <TableHead>المستفيدين السنويين</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServices.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="font-medium">
                      <div>
                        <p className="font-semibold">{service.service_name}</p>
                        {service.service_description && (
                          <p className="text-sm text-gray-500 mt-1">
                            {service.service_description.substring(0, 100)}...
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {service.service_type && (
                        <Badge variant="outline">{service.service_type}</Badge>
                      )}
                    </TableCell>
                    <TableCell>{service.owning_department || '-'}</TableCell>
                    <TableCell>
                      {service.current_maturity && (
                        <Badge variant="secondary">{service.current_maturity}</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {service.service_fees ? `${service.service_fees} ريال` : 'مجاني'}
                    </TableCell>
                    <TableCell>{service.annual_operations?.toLocaleString() || '-'}</TableCell>
                    <TableCell>{service.annual_beneficiaries?.toLocaleString() || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filteredServices.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              لا توجد خدمات متاحة
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Services;
