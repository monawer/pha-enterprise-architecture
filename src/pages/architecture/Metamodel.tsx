import { MetamodelDiagram } from "@/components/metamodel/MetamodelDiagram";
import { MetamodelStats } from "@/components/metamodel/MetamodelStats";

export default function Metamodel() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-primary">NORA TOGAF Metamodel</h1>
      
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3">
          <MetamodelDiagram />
        </div>
        
        <div className="xl:col-span-1">
          <MetamodelStats />
        </div>
      </div>
    </div>
  );
}