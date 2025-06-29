
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AuthRequiredProps {
  action?: string;
  message?: string;
}

const AuthRequired: React.FC<AuthRequiredProps> = ({ 
  action = "هذا الإجراء", 
  message 
}) => {
  const navigate = useNavigate();

  const defaultMessage = `يجب تسجيل الدخول أولاً للقيام بـ${action}`;

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardContent className="p-6 text-center">
        <Lock className="w-12 h-12 text-orange-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-orange-800 mb-2">
          تسجيل الدخول مطلوب
        </h3>
        <p className="text-orange-600 mb-4">
          {message || defaultMessage}
        </p>
        <Button 
          onClick={() => navigate('/auth')}
          className="bg-orange-600 hover:bg-orange-700"
        >
          <LogIn className="w-4 h-4 ml-2" />
          تسجيل الدخول
        </Button>
      </CardContent>
    </Card>
  );
};

export default AuthRequired;
