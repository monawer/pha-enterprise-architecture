
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  Monitor, 
  Database, 
  Link
} from 'lucide-react';

const ApplicationsLayer = () => {
  const navigate = useNavigate();

  const applicationComponents = [
    {
      title: 'قائمة التطبيقات',
      description: 'إدارة التطبيقات والأنظمة',
      icon: Monitor,
      path: '/architecture/applications/apps',
      color: 'bg-blue-500'
    },
    {
      title: 'قواعد بيانات التطبيقات',
      description: 'إدارة قواعد البيانات ومحركاتها',
      icon: Database,
      path: '/architecture/applications/databases',
      color: 'bg-green-500'
    },
    {
      title: 'نقاط الربط التقني',
      description: 'إدارة الروابط والاتصالات التقنية',
      icon: Link,
      path: '/architecture/applications/technical-links',
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">طبقة التطبيقات</h1>
          <p className="text-gray-600 mt-2">
            إدارة مكونات طبقة التطبيقات في البنية المؤسسية
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {applicationComponents.map((component) => {
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

export default ApplicationsLayer;
