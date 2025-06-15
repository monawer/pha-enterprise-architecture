
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ErrorInfo {
  message: string;
  code?: string;
  details?: string;
}

export const useErrorHandler = () => {
  const { toast } = useToast();
  const [errors, setErrors] = useState<Record<string, ErrorInfo>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleError = useCallback((error: unknown, context?: string) => {
    console.error('Error occurred:', error, 'Context:', context);
    
    let errorMessage = 'حدث خطأ غير متوقع';
    let errorCode = 'UNKNOWN_ERROR';
    let errorDetails = '';

    if (error instanceof Error) {
      errorMessage = error.message;
      errorCode = error.name;
      errorDetails = error.stack || '';
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else if (error && typeof error === 'object' && 'message' in error) {
      errorMessage = (error as any).message || errorMessage;
      errorCode = (error as any).code || errorCode;
    }

    // تخصيص رسائل الخطأ بناءً على نوع الخطأ
    if (errorMessage.includes('duplicate key value')) {
      errorMessage = 'هذا العنصر موجود بالفعل';
    } else if (errorMessage.includes('foreign key constraint')) {
      errorMessage = 'لا يمكن حذف هذا العنصر لأنه مرتبط بعناصر أخرى';
    } else if (errorMessage.includes('not null constraint')) {
      errorMessage = 'يرجى ملء جميع الحقول المطلوبة';
    } else if (errorMessage.includes('permission denied')) {
      errorMessage = 'ليس لديك صلاحية لتنفيذ هذا الإجراء';
    } else if (errorMessage.includes('network')) {
      errorMessage = 'مشكلة في الاتصال بالشبكة';
    }

    const errorInfo: ErrorInfo = {
      message: errorMessage,
      code: errorCode,
      details: errorDetails
    };

    if (context) {
      setErrors(prev => ({ ...prev, [context]: errorInfo }));
    }

    toast({
      title: "خطأ",
      description: errorMessage,
      variant: "destructive",
    });

    return errorInfo;
  }, [toast]);

  const clearError = useCallback((context: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[context];
      return newErrors;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  const executeWithErrorHandling = useCallback(async <T>(
    asyncFunction: () => Promise<T>,
    context?: string,
    successMessage?: string
  ): Promise<T | null> => {
    try {
      if (context) clearError(context);
      
      const result = await asyncFunction();
      
      if (successMessage) {
        toast({
          title: "تم بنجاح",
          description: successMessage,
        });
      }
      
      return result;
    } catch (error) {
      handleError(error, context);
      return null;
    }
  }, [handleError, clearError, toast]);

  return {
    errors,
    isLoading,
    handleError,
    clearError,
    clearAllErrors,
    executeWithErrorHandling
  };
};
