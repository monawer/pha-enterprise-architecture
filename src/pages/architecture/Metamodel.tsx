import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import metamodelSvg from './metamodel/metamodel.svg';
import viewsSvg from './metamodel/VIEWS_12.svg';

const MetamodelDiagram = () => {
  return (
    <div className="metamodel-container p-6">
      <h2 className="text-2xl font-bold mb-6">النموذج العام للبنية المؤسسية</h2>
      
      <Tabs defaultValue="metamodel" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="metamodel">النموذج العام</TabsTrigger>
          <TabsTrigger value="components">مكونات النموذج العام</TabsTrigger>
        </TabsList>
        
        <TabsContent value="metamodel" className="mt-6">
          <div className="diagram-wrapper">
            <img 
              src={metamodelSvg} 
              alt="النموذج العام" 
              className="w-full h-auto max-w-4xl mx-auto"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="components" className="mt-6">
          <div className="diagram-wrapper">
            <img 
              src={viewsSvg} 
              alt="مكونات النموذج العام" 
              className="w-full h-auto max-w-4xl mx-auto"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MetamodelDiagram;