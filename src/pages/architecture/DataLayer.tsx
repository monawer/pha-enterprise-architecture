
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  Database, 
  FileText, 
  HardDrive,
  Archive
} from 'lucide-react';

const DataLayer = () => {
  const navigate = useNavigate();

  const dataComponents = [
    {
      title: 'كيانات البيانات',
      description: 'إدارة كيانات البيانات وتصنيفاتها',
      icon: Database,
      path: '/architecture/data/entities',
      color: 'bg-blue-500'
    },
    {
      title: 'تخزين البيانات',
      description: 'إدارة أنواع ومواقع تخزين البيانات',
      icon: HardDrive,
      path: '/architecture/data/storage',
      color: 'bg-green-500'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">طبقة البيانات</h1>
          <p className="text-gray-600 mt-2">
            إدارة مكونات طبقة البيانات في البنية المؤسسية
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dataComponents.map((component) => {
          const Icon = component.icon;
          return (
            <Card 
              key={component.path} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(component.path)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className={`p-2 rounded-lg ${component.color} text-white`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-xl">{component.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{component.description}</p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(component.path);
                  }}
                >
                  عرض التفاصيل
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default DataLayer;
