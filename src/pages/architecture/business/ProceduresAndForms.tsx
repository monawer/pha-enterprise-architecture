
import React, { useState } from "react";
import Procedures from "./Procedures";
import Forms from "./Forms";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, ClipboardList } from "lucide-react";

const ProceduresAndForms = () => {
  const [tab, setTab] = useState("procedures");

  return (
    <div className="max-w-7xl mx-auto py-6 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-saudi-green-800 flex items-center gap-2">
          <FileText className="w-7 h-7 text-saudi-green-800" />
          إدارة الإجراءات والنماذج
        </h1>
        <TabsList className="bg-white border rounded-xl shadow py-1 px-2 flex gap-2">
          <TabsTrigger value="procedures" className={tab === "procedures" ? "!bg-saudi-green-700 !text-white" : ""} onClick={() => setTab("procedures")}>
            <FileText className="w-4 h-4 mr-1" /> الإجراءات
          </TabsTrigger>
          <TabsTrigger value="forms" className={tab === "forms" ? "!bg-orange-600 !text-white" : ""} onClick={() => setTab("forms")}>
            <ClipboardList className="w-4 h-4 mr-1" /> النماذج
          </TabsTrigger>
        </TabsList>
      </div>
      <Tabs value={tab} onValueChange={setTab} className="mt-3">
        <TabsContent value="procedures">
          <Procedures />
        </TabsContent>
        <TabsContent value="forms">
          <Forms />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProceduresAndForms;
