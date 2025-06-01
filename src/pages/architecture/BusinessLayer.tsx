
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  FileText, 
  Settings, 
  Users, 
  Workflow,
  ClipboardList,
  UserCheck
} from 'lucide-react';

const BusinessLayer = () => {
  const navigate = useNavigate();

  const businessComponents = [
    {
      title: 'الخدمات',
      description: 'إدارة الخدمات المقدمة للمستفيدين',
      icon: Building2,
      path: '/architecture/business/services',
      color: 'bg-blue-500'
    },
    {
      title: 'الإجراءات',
      description: 'إدارة الإجراءات والعمليات التشغيلية',
      icon: Workflow,
      path: '/architecture/business/procedures', 
      color: 'bg-green-500'
    },
    {
      title: 'السياسات',
      description: 'إدارة السياسات والقوانين التنظيمية',
      icon: FileText,
      path: '/architecture/business/policies',
      color: 'bg-purple-500'
    },
    {
      title: 'النماذج',
      description: 'إدارة النماذج المستخدمة في العمليات',
      icon: ClipboardList,
      path: '/architecture/business/forms',
      color: 'bg-orange-500'
    },
    {
      title: 'القدرات',
      description: 'إدارة القدرات المؤسسية',
      icon: Settings,
      path: '/architecture/business/capabilities',
      color: 'bg-red-500'
    },
    {
      title: 'الفروع',
      description: 'إدارة الفروع والمواقع',
      icon: Users,
      path: '/architecture/business/branches',
      color: 'bg-indigo-500'
    },
    {
      title: 'ملاك الأعمال',
      description: 'إدارة ملاك الأعمال والمسؤوليات',
      icon: UserCheck,
      path: '/architecture/business/business-owners',
      color: 'bg-teal-500'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">طبقة الأعمال</h1>
          <p className="text-gray-600 mt-2">
            إدارة مكونات طبقة الأعمال في البنية المؤسسية
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {businessComponents.map((component) => {
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

export default BusinessLayer;
