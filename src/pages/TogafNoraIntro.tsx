
import React from "react";
import { Layers, LayoutDashboard } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const TogafNoraIntro: React.FC = () => (
  <div className="max-w-3xl mx-auto animate-fade-in-up">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LayoutDashboard className="w-8 h-8 text-green-700" />
          البنية المؤسسية وإطارا توجاف ونورة
        </CardTitle>
      </CardHeader>
      <CardContent>
        <section className="mb-6">
          <h2 className="text-lg font-bold mb-2 text-green-800">عن توجاف ونورة</h2>
          <p className="text-gray-700">
            مفهوم البنية المؤسسية يشير إلى تنظيم وتكامل جميع مكونات العمل والتقنية والبيانات والأمان ضمن الإطار المؤسسي الجامع. 
            إطار توجاف (TOGAF) هو الإطار الأشهر عالميًا في هذا المجال، في حين يضع إطار نورة الوطني (من هيئة الحكومة الرقمية) معايير محلية لضمان التكامل والتحكم.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-lg font-bold mb-2 text-blue-800">توافق المنظومة</h2>
          <ul className="list-disc pl-5 text-gray-800">
            <li>جميع الطبقات البنيوية ممثلة بنطاق النظام (الأعمال، التطبيقات، البيانات، التقنية، الأمان، تجربة المستخدم).</li>
            <li>البيانات مرتبة ومرمزة وفق الجداول الوطنية والأنظمة المرجعية.</li>
            <li>إمكانية رسم العلاقات بين العناصر لتحقيق خارطة نورة وهندسة توجاف.</li>
          </ul>
        </section>
        <section>
          <h2 className="text-lg font-bold mb-2 text-purple-800">العلاقة بين الطبقات والمعايير</h2>
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
            <img 
              src="https://lovable.dev/opengraph-image-p98pqg.png"
              alt="مخطط الربط بين الطبقات وأطر العمل"
              className="w-full md:w-64 h-44 object-contain rounded-xl border"
              />
            <div>
              <p className="text-sm text-gray-600 mb-2">
                الشكل يوضح الأفكار الرئيسية: كل طبقة معماريـة (يمين) ترتبط مباشرة بمعايير نورة (يسار) ومع المكونات وإجراءات الحوكمة (وسط).
              </p>
              <ul className="text-sm text-gray-800">
                <li>طبقة الأعمال → العمليات/الخدمات المرجعية (نورة توجاف)</li>
                <li>طبقة التطبيقات → الكتالوج والحوكمة البرمجية</li>
                <li>طبقة البيانات → إدارة الجودة والخصوصية والاعتماد</li>
                <li>طبقة التقنية → الموارد والبنية التحتية</li>
                <li>طبقة الأمان → سياسات الصلاحية والتحكم</li>
                <li>تجربة المستخدم → قنوات الخدمة والمعايير الوطنية</li>
              </ul>
            </div>
          </div>
        </section>
      </CardContent>
    </Card>
  </div>
);

export default TogafNoraIntro;
