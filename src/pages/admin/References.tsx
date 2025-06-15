import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Settings, Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { User } from '@supabase/supabase-js';
import ReferenceTableManager from '@/components/admin/ReferenceTableManager';

interface ReferenceTable {
  tableName: string;
  displayName: string;
  description: string;
  columns: string[];
}

const References = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const referenceTables: ReferenceTable[] = [
    {
      tableName: 'ref_departments',
      displayName: 'الإدارات والأقسام',
      description: 'قائمة بجميع الإدارات والأقسام في المؤسسة',
      columns: ['code', 'name', 'description', 'parent_code']
    },
    {
      tableName: 'ref_app_types',
      displayName: 'أنواع التطبيقات',
      description: 'تصنيفات التطبيقات المختلفة',
      columns: ['code', 'name', 'description']
    },
    {
      tableName: 'ref_app_status',
      displayName: 'حالات التطبيقات',
      description: 'الحالات المختلفة للتطبيقات (نشط، متوقف، قيد التطوير)',
      columns: ['code', 'name', 'description']
    },
    {
      tableName: 'ref_technologies',
      displayName: 'التقنيات',
      description: 'قائمة التقنيات والأدوات المستخدمة',
      columns: ['code', 'name', 'description', 'category']
    },
    {
      tableName: 'ref_service_types',
      displayName: 'أنواع الخدمات',
      description: 'تصنيفات الخدمات المقدمة',
      columns: ['code', 'name', 'description']
    },
    {
      tableName: 'ref_channel_types',
      displayName: 'أنواع القنوات',
      description: 'قنوات تقديم الخدمات المختلفة',
      columns: ['code', 'name', 'description']
    },
    {
      tableName: 'ref_data_classifications',
      displayName: 'تصنيفات البيانات',
      description: 'مستويات تصنيف البيانات الأمنية',
      columns: ['code', 'name', 'description', 'level']
    },
    {
      tableName: 'ref_connection_types',
      displayName: 'أنواع الاتصالات',
      description: 'أنواع الاتصالات والتكامل بين الأنظمة',
      columns: ['code', 'name', 'description']
    },
    {
      tableName: 'ref_data_formats',
      displayName: 'صيغ البيانات',
      description: 'صيغ وأنواع البيانات المختلفة',
      columns: ['code', 'name', 'description']
    },
    {
      tableName: 'ref_integration_platforms',
      displayName: 'منصات التكامل',
      description: 'المنصات المستخدمة في التكامل بين الأنظمة',
      columns: ['code', 'name', 'description']
    }
  ];

  if (selectedTable) {
    const table = referenceTables.find(t => t.tableName === selectedTable);
    return (
      <ReferenceTableManager
        table={table!}
        onBack={() => setSelectedTable(null)}
        canEdit={true}
      />
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2 space-x-reverse">
          <Database className="w-8 h-8 text-green-600" />
          <h1 className="text-2xl font-bold text-gray-900">جداول التعريفات</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {referenceTables.map((table) => (
          <Card key={table.tableName} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{table.displayName}</span>
                <Settings className="w-5 h-5 text-gray-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{table.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {table.columns.length} حقل
                </span>
                <Button
                  onClick={() => setSelectedTable(table.tableName)}
                  variant="outline"
                  size="sm"
                >
                  إدارة البيانات
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default References;
