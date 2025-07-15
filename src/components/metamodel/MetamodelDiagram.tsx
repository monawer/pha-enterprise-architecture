import React, { useCallback, useMemo, useRef } from 'react';
import { 
  ReactFlow, 
  Controls, 
  Background, 
  useNodesState, 
  useEdgesState,
  Node,
  Edge,
  MarkerType,
  ReactFlowProvider
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { MetamodelData } from '@/hooks/useMetamodel';
import { LayerNode } from './LayerNode';
import { ComponentNode } from './ComponentNode';

const nodeTypes = {
  layer: LayerNode,
  component: ComponentNode,
};

interface MetamodelDiagramProps {
  data?: MetamodelData;
  exportRef?: React.RefObject<{ exportToSvg: () => void }>;
}

const MetamodelDiagramInner: React.FC<MetamodelDiagramProps> = ({ data, exportRef }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { initialNodes, initialEdges } = useMemo(() => {
    if (!data || !data.layers || !data.components) {
      return { initialNodes: [], initialEdges: [] };
    }

    const sortedLayers = [...data.layers].sort((a, b) => a.order_num - b.order_num);
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // Configuration for clean layout
    const layerWidth = 1000;
    const layerSpacing = 300;
    const componentSpacing = 240;
    const startX = 100;
    const startY = 50;

    // Create organized layers with components
    sortedLayers.forEach((layer, layerIndex) => {
      const layerY = startY + (layerIndex * layerSpacing);
      const layerComponents = data.components.filter(comp => comp.layer_id === layer.id);
      
      // Calculate layer height based on components
      const componentsPerRow = 4;
      const componentRows = Math.ceil(layerComponents.length / componentsPerRow);
      const layerHeight = Math.max(120, 60 + (componentRows * 110));

      // Create layer header node (no group background for cleaner look)
      nodes.push({
        id: `layer-header-${layer.id}`,
        type: 'layer',
        position: { x: startX, y: layerY },
        data: {
          name: layer.name,
          description: layer.description,
          code: layer.code,
          componentCount: layer.componentCount,
          layerType: layer.code.toLowerCase()
        },
        draggable: false,
        style: {
          zIndex: 1000
        }
      });

      // Create component nodes in organized grid
      layerComponents.forEach((component, compIndex) => {
        const row = Math.floor(compIndex / componentsPerRow);
        const col = compIndex % componentsPerRow;
        
        nodes.push({
          id: component.id,
          type: 'component',
          position: { 
            x: startX + 350 + (col * componentSpacing), 
            y: layerY + 20 + (row * 110)
          },
          data: {
            ...component,
            layerType: layer.code.toLowerCase()
          },
          draggable: true,
        });
      });

      // Add layer separator line (visual element)
      if (layerIndex < sortedLayers.length - 1) {
        nodes.push({
          id: `separator-${layer.id}`,
          type: 'default',
          position: { x: startX + 50, y: layerY + layerHeight + 20 },
          data: { label: '' },
          style: {
            width: layerWidth - 100,
            height: 2,
            background: 'hsl(var(--border))',
            border: 'none',
            borderRadius: 0,
            opacity: 0.3
          },
          draggable: false,
          selectable: false,
        });
      }
    });

    // Create clean edges for relationships
    const crossLayerRelationships = data.relationships.filter(rel => 
      rel.source_component.layer_code !== rel.target_component.layer_code
    );

    const sameLayerRelationships = data.relationships.filter(rel => 
      rel.source_component.layer_code === rel.target_component.layer_code
    );

    // Cross-layer relationships (more prominent)
    crossLayerRelationships.forEach((relationship, index) => {
      edges.push({
        id: `cross-${relationship.id}`,
        source: relationship.source_component_id,
        target: relationship.target_component_id,
        type: 'smoothstep',
        animated: true,
        style: { 
          stroke: 'hsl(var(--primary))', 
          strokeWidth: 3,
          strokeOpacity: 0.8
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: 'hsl(var(--primary))',
        },
        label: relationship.relationship_type,
        labelStyle: { 
          fill: 'hsl(var(--foreground))', 
          fontSize: 11,
          fontWeight: 600,
          backgroundColor: 'hsl(var(--background))',
          padding: '2px 6px',
          borderRadius: '4px'
        }
      });
    });

    // Same-layer relationships (subtle)
    sameLayerRelationships.forEach((relationship, index) => {
      edges.push({
        id: `same-${relationship.id}`,
        source: relationship.source_component_id,
        target: relationship.target_component_id,
        type: 'straight',
        style: { 
          stroke: 'hsl(var(--muted-foreground))', 
          strokeWidth: 2,
          strokeOpacity: 0.4,
          strokeDasharray: '5,5'
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: 'hsl(var(--muted-foreground))',
        }
      });
    });

    return { initialNodes: nodes, initialEdges: edges };
  }, [data]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const downloadImage = useCallback((dataUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.download = fileName;
    link.href = dataUrl;
    link.click();
  }, []);

  const exportToSvg = useCallback(() => {
    const reactFlowElement = containerRef.current?.querySelector('.react-flow');
    if (!reactFlowElement) {
      console.warn('React Flow element not found');
      return;
    }

    // Get the SVG element from React Flow
    const svgElement = reactFlowElement.querySelector('.react-flow__renderer svg') as SVGElement;
    if (!svgElement) {
      console.warn('SVG element not found');
      return;
    }

    try {
      // Clone the SVG to avoid modifying the original
      const clonedSvg = svgElement.cloneNode(true) as SVGElement;
      
      // Set proper dimensions and viewBox
      const rect = reactFlowElement.getBoundingClientRect();
      clonedSvg.setAttribute('width', '1200');
      clonedSvg.setAttribute('height', '800');
      clonedSvg.setAttribute('viewBox', `0 0 ${rect.width} ${rect.height}`);
      clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

      // Convert to string and create blob
      const svgString = new XMLSerializer().serializeToString(clonedSvg);
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      
      downloadImage(url, 'metamodel-diagram.svg');
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting SVG:', error);
    }
  }, [downloadImage]);

  // Expose export function to parent
  React.useImperativeHandle(exportRef, () => ({
    exportToSvg
  }), [exportToSvg]);

  if (!data || !data.layers || data.layers.length === 0) {
    return (
      <div className="h-96 bg-muted/20 rounded-lg flex items-center justify-center animate-fade-in">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-muted-foreground">لا توجد بيانات لعرضها</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="h-[900px] bg-background border rounded-lg overflow-hidden animate-fade-in">
      <div className="absolute top-4 left-4 z-10 bg-background/95 backdrop-blur-sm border rounded-lg p-3 shadow-sm">
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-primary rounded" />
            <span>علاقات عبر الطبقات</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-muted-foreground rounded opacity-40" style={{background: 'repeating-linear-gradient(to right, hsl(var(--muted-foreground)) 0, hsl(var(--muted-foreground)) 3px, transparent 3px, transparent 6px)'}} />
            <span>علاقات داخل الطبقة</span>
          </div>
        </div>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ 
          padding: 0.15,
          minZoom: 0.3,
          maxZoom: 1.2
        }}
        attributionPosition="bottom-left"
        minZoom={0.2}
        maxZoom={1.5}
        defaultViewport={{ x: 0, y: 0, zoom: 0.7 }}
      >
        <Controls 
          showZoom={true}
          showFitView={true}
          showInteractive={false}
          position="top-right"
        />
        <Background 
          color="hsl(var(--muted))" 
          gap={20} 
          size={1}
        />
      </ReactFlow>
    </div>
  );
};

export const MetamodelDiagram: React.FC<MetamodelDiagramProps> = ({ data, exportRef }) => {
  return (
    <ReactFlowProvider>
      <MetamodelDiagramInner data={data} exportRef={exportRef} />
    </ReactFlowProvider>
  );
};