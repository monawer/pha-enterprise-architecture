
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // وظيفة لملء بيانات المستخدم الوهمي
  const fillDemoCredentials = () => {
    setEmail("admin@admin.com");
    setPassword("pha@1010");
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        console.log("محاولة تسجيل الدخول بالبيانات:", email);
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) {
          console.error("خطأ في تسجيل الدخول:", error);
          throw error;
        }
        
        console.log("تم تسجيل الدخول بنجاح:", data);
        toast({
          title: "تم تسجيل الدخول بنجاح",
          description: "مرحباً بك في نظام البنية المؤسسية",
        });
        navigate("/");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });
        if (error) throw error;
        toast({
          title: "تم إنشاء الحساب بنجاح",
          description: "يرجى تسجيل الدخول باستخدام بياناتك",
        });
        setIsLogin(true);
      }
    } catch (error: any) {
      console.error("خطأ في المصادقة:", error);
      let errorMessage = "حدث خطأ في التسجيل";
      
      if (error.message === "Invalid login credentials") {
        errorMessage = "بيانات تسجيل الدخول غير صحيحة";
      } else if (error.message.includes("User already registered")) {
        errorMessage = "المستخدم مسجل بالفعل";
      }
      
      toast({
        title: "خطأ في التسجيل",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-green-200">
        <CardHeader className="text-center space-y-4">
        <div <img src="/lovable-uploads/c9d30792-fb30-4f2b-943c-af6559266144.png" alt="شعار هيئة الصحة العامة" class="h-auto w-auto object-contain"></div>
          <CardTitle className="text-2xl font-bold text-green-800">
            {isLogin ? "تسجيل الدخول" : "إنشاء حساب جديد"}
          </CardTitle>
          <p className="text-green-600">نظام البنية المؤسسية - هيئة الصحة العامة</p>
        </CardHeader>
        <CardContent>
          {/* زر للمستخدم الوهمي */}
          {isLogin && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-600 mb-2">للتجربة السريعة:</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={fillDemoCredentials}
                className="w-full text-blue-600 border-blue-300 hover:bg-blue-100"
              >
                استخدام حساب المدير التجريبي
              </Button>
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-green-700 mb-2">
                  الاسم الكامل
                </label>
                <Input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required={!isLogin}
                  className="border-green-300 focus:border-green-500"
                  dir="rtl"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-green-700 mb-2">
                البريد الإلكتروني
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-green-300 focus:border-green-500"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-green-700 mb-2">
                كلمة المرور
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-green-300 focus:border-green-500"
                dir="ltr"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
            >
              {loading ? "جاري التحميل..." : isLogin ? "تسجيل الدخول" : "إنشاء حساب"}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-green-600 hover:text-green-800 text-sm"
            >
              {isLogin ? "ليس لديك حساب؟ أنشئ حساباً جديداً" : "لديك حساب؟ سجل دخولك"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
