
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
import { HardDrive, Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface DataStorage {
  id: string;
  name: string;
  code?: string;
  type?: string;
  description?: string;
  structure?: string;
  created_at: string;
}

const DataStorage = () => {
  const [storages, setStorages] = useState<DataStorage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchStorages();
  }, []);

  const fetchStorages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('data_storage')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStorages(data || []);
    } catch (error) {
      console.error('Error fetching data storage:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في جلب بيانات تخزين البيانات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredStorages = storages.filter(storage =>
    storage.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (storage.description && storage.description.toLowerCase().includes(searchTerm.toLowerCase()))
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
          <HardDrive className="w-8 h-8 text-green-500" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">تخزين البيانات</h1>
            <p className="text-gray-600">عرض وإدارة أنواع ومواقع تخزين البيانات</p>
          </div>
        </div>
        <Button>
          <Plus className="w-4 h-4 ml-2" />
          إضافة مخزن بيانات جديد
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>قائمة مخازن البيانات ({filteredStorages.length})</CardTitle>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Search className="w-4 h-4 text-gray-400" />
              <Input
                placeholder="البحث في مخازن البيانات..."
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
                  <TableHead>اسم المخزن</TableHead>
                  <TableHead>الرمز</TableHead>
                  <TableHead>النوع</TableHead>
                  <TableHead>الهيكل</TableHead>
                  <TableHead>الوصف</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStorages.map((storage) => (
                  <TableRow key={storage.id}>
                    <TableCell className="font-medium">{storage.name}</TableCell>
                    <TableCell>{storage.code || '-'}</TableCell>
                    <TableCell>
                      {storage.type && (
                        <Badge variant="outline">{storage.type}</Badge>
                      )}
                    </TableCell>
                    <TableCell>{storage.structure || '-'}</TableCell>
                    <TableCell>
                      {storage.description ? (
                        <span className="text-sm text-gray-600">
                          {storage.description.substring(0, 50)}...
                        </span>
                      ) : '-'}
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
          {filteredStorages.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              لا توجد مخازن بيانات متاحة
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DataStorage;
