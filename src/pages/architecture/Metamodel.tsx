import React from 'react';
import metamodelSvg from './metamodel/metamodel.svg';

const MetamodelDiagram = () => {
  return (
    <div className="metamodel-container">
      <h2>النموذج العام للبنية المؤسسية </h2>
      <div className="diagram-wrapper">
        <img 
          src={metamodelSvg} 
          alt="النموذج العام" 
          className="w-full h-auto max-w-4xl mx-auto"
        />
      </div>
    </div>
  );
};

export default MetamodelDiagram;