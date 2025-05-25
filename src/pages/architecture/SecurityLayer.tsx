
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Server, 
  Settings
} from 'lucide-react';

const SecurityLayer = () => {
  const navigate = useNavigate();

  const securityComponents = [
    {
      title: 'أجهزة الأمان',
      description: 'إدارة أجهزة الأمان والحماية',
      icon: Shield,
      path: '/architecture/security/devices',
      color: 'bg-red-500'
    },
    {
      title: 'خدمات الأمان',
      description: 'إدارة خدمات الأمان السيبراني',
      icon: Server,
      path: '/architecture/security/services',
      color: 'bg-orange-500'
    },
    {
      title: 'برامج الأمان',
      description: 'إدارة برامج الحماية والأمان',
      icon: Settings,
      path: '/architecture/security/software',
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">طبقة الأمان</h1>
          <p className="text-gray-600 mt-2">
            إدارة مكونات طبقة الأمان في البنية المؤسسية
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {securityComponents.map((component) => {
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

export default SecurityLayer;
