
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Map, 
  User,
  Target,
  ArrowRight
} from 'lucide-react';

const UXLayer = () => {
  const navigate = useNavigate();

  const uxComponents = [
    {
      title: 'المستفيدين',
      description: 'إدارة المستفيدين وتصنيفاتهم',
      icon: Users,
      path: '/architecture/ux/beneficiaries',
      color: 'bg-blue-500'
    },
    {
      title: 'رحلات المستخدم',
      description: 'إدارة رحلات المستخدم والتفاعلات',
      icon: Map,
      path: '/architecture/ux/journeys',
      color: 'bg-green-500'
    },
    {
      title: 'الشخصيات',
      description: 'إدارة شخصيات المستخدمين',
      icon: User,
      path: '/architecture/ux/personas',
      color: 'bg-purple-500'
    },
    {
      title: 'المراحل',
      description: 'إدارة مراحل رحلة المستخدم',
      icon: Target,
      path: '/architecture/ux/stages',
      color: 'bg-orange-500'
    },
    {
      title: 'الخطوات',
      description: 'إدارة خطوات العمليات',
      icon: ArrowRight,
      path: '/architecture/ux/steps',
      color: 'bg-red-500'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">طبقة تجربة المستخدم</h1>
          <p className="text-gray-600 mt-2">
            إدارة مكونات طبقة تجربة المستخدم في البنية المؤسسية
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {uxComponents.map((component) => {
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

export default UXLayer;
