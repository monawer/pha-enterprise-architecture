
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
import { Database, Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface DataEntity {
  id: string;
  entity_name_ar: string;
  entity_name_en?: string;
  description_ar?: string;
  data_classification?: string;
  data_owner?: string;
  data_storage?: string;
  data_status?: string;
  created_at: string;
}

const DataEntities = () => {
  const [entities, setEntities] = useState<DataEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchEntities();
  }, []);

  const fetchEntities = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('data_entities')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntities(data || []);
    } catch (error) {
      console.error('Error fetching data entities:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في جلب بيانات كيانات البيانات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredEntities = entities.filter(entity =>
    entity.entity_name_ar.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (entity.entity_name_en && entity.entity_name_en.toLowerCase().includes(searchTerm.toLowerCase()))
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
          <Database className="w-8 h-8 text-blue-500" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">كيانات البيانات</h1>
            <p className="text-gray-600">عرض وإدارة كيانات البيانات وتصنيفاتها</p>
          </div>
        </div>
        <Button>
          <Plus className="w-4 h-4 ml-2" />
          إضافة كيان جديد
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>قائمة كيانات البيانات ({filteredEntities.length})</CardTitle>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Search className="w-4 h-4 text-gray-400" />
              <Input
                placeholder="البحث في كيانات البيانات..."
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
                  <TableHead>اسم الكيان</TableHead>
                  <TableHead>التصنيف</TableHead>
                  <TableHead>مالك البيانات</TableHead>
                  <TableHead>مكان التخزين</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntities.map((entity) => (
                  <TableRow key={entity.id}>
                    <TableCell className="font-medium">
                      <div>
                        <p className="font-semibold">{entity.entity_name_ar}</p>
                        {entity.entity_name_en && (
                          <p className="text-sm text-gray-500">{entity.entity_name_en}</p>
                        )}
                        {entity.description_ar && (
                          <p className="text-sm text-gray-500 mt-1">
                            {entity.description_ar.substring(0, 80)}...
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {entity.data_classification && (
                        <Badge variant="outline">{entity.data_classification}</Badge>
                      )}
                    </TableCell>
                    <TableCell>{entity.data_owner || '-'}</TableCell>
                    <TableCell>{entity.data_storage || '-'}</TableCell>
                    <TableCell>
                      {entity.data_status && (
                        <Badge variant="secondary">{entity.data_status}</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2 space-x-reverse">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filteredEntities.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              لا توجد كيانات بيانات متاحة
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DataEntities;
