import React, { useRef } from "react";
import { MetamodelDiagram } from "@/components/metamodel/MetamodelDiagram";
import { MetamodelStats } from "@/components/metamodel/MetamodelStats";
import { useMetamodel } from "@/hooks/useMetamodel";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function Metamodel() {
  const { data: metamodelData, isLoading, error } = useMetamodel();
  const exportRef = useRef<{ exportToSvg: () => void }>(null);

  const handleExport = () => {
    if (exportRef.current) {
      exportRef.current.exportToSvg();
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">NORA TOGAF Metamodel</h1>
        <Button
          onClick={handleExport}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Export Diagram
        </Button>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3">
          <MetamodelDiagram data={metamodelData} exportRef={exportRef} />
        </div>
        <div className="xl:col-span-1">
          <MetamodelStats data={metamodelData} />
        </div>
      </div>
    </div>
  );
}