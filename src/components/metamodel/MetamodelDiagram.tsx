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
  ReactFlowProvider,
  useReactFlow
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
  const { getNodes, getEdges, getViewport } = useReactFlow();
  
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
    try {
      const currentNodes = getNodes();
      const currentEdges = getEdges();
      const viewport = getViewport();
      
      if (currentNodes.length === 0) {
        console.warn('No nodes to export');
        return;
      }

      // Calculate bounds of all nodes
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      
      currentNodes.forEach(node => {
        const nodeWidth = node.width || 200;
        const nodeHeight = node.height || 100;
        
        minX = Math.min(minX, node.position.x);
        minY = Math.min(minY, node.position.y);
        maxX = Math.max(maxX, node.position.x + nodeWidth);
        maxY = Math.max(maxY, node.position.y + nodeHeight);
      });

      const padding = 50;
      const width = maxX - minX + (padding * 2);
      const height = maxY - minY + (padding * 2);
      
      // Create SVG
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', width.toString());
      svg.setAttribute('height', height.toString());
      svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
      svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      
      // Add background
      const background = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      background.setAttribute('width', '100%');
      background.setAttribute('height', '100%');
      background.setAttribute('fill', '#ffffff');
      svg.appendChild(background);
      
      // Add styles
      const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
      style.textContent = `
        .layer-node { fill: #f1f5f9; stroke: #e2e8f0; stroke-width: 2; }
        .component-node { fill: #ffffff; stroke: #d1d5db; stroke-width: 1; }
        .node-text { font-family: Arial, sans-serif; font-size: 12px; fill: #374151; }
        .layer-text { font-size: 14px; font-weight: bold; fill: #1f2937; }
        .edge-line { stroke: #6366f1; stroke-width: 2; fill: none; }
        .edge-dashed { stroke: #9ca3af; stroke-width: 1; stroke-dasharray: 5,5; fill: none; }
      `;
      svg.appendChild(style);
      
      // Draw edges first (so they appear behind nodes)
      currentEdges.forEach(edge => {
        const sourceNode = currentNodes.find(n => n.id === edge.source);
        const targetNode = currentNodes.find(n => n.id === edge.target);
        
        if (sourceNode && targetNode) {
          const sourceX = sourceNode.position.x - minX + padding + (sourceNode.width || 200) / 2;
          const sourceY = sourceNode.position.y - minY + padding + (sourceNode.height || 100) / 2;
          const targetX = targetNode.position.x - minX + padding + (targetNode.width || 200) / 2;
          const targetY = targetNode.position.y - minY + padding + (targetNode.height || 100) / 2;
          
          const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          const d = `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`;
          path.setAttribute('d', d);
          
          if (edge.type === 'straight' && edge.style?.strokeDasharray) {
            path.setAttribute('class', 'edge-dashed');
          } else {
            path.setAttribute('class', 'edge-line');
          }
          
          svg.appendChild(path);
          
          // Add arrow marker
          const marker = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
          const arrowMarker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
          arrowMarker.setAttribute('id', `arrow-${edge.id}`);
          arrowMarker.setAttribute('viewBox', '0 0 10 10');
          arrowMarker.setAttribute('refX', '8');
          arrowMarker.setAttribute('refY', '3');
          arrowMarker.setAttribute('markerWidth', '6');
          arrowMarker.setAttribute('markerHeight', '6');
          arrowMarker.setAttribute('orient', 'auto');
          
          const arrowPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          arrowPath.setAttribute('d', 'M 0 0 L 10 3 L 0 6 Z');
          arrowPath.setAttribute('fill', edge.style?.strokeDasharray ? '#9ca3af' : '#6366f1');
          
          arrowMarker.appendChild(arrowPath);
          marker.appendChild(arrowMarker);
          svg.appendChild(marker);
          
          path.setAttribute('marker-end', `url(#arrow-${edge.id})`);
        }
      });
      
      // Draw nodes
      currentNodes.forEach(node => {
        if (node.id.startsWith('separator-')) return; // Skip separator nodes
        
        const x = node.position.x - minX + padding;
        const y = node.position.y - minY + padding;
        const nodeWidth = node.width || 200;
        const nodeHeight = node.height || 100;
        
        // Node background
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', x.toString());
        rect.setAttribute('y', y.toString());
        rect.setAttribute('width', nodeWidth.toString());
        rect.setAttribute('height', nodeHeight.toString());
        rect.setAttribute('rx', '8');
        
        if (node.type === 'layer') {
          rect.setAttribute('class', 'layer-node');
        } else {
          rect.setAttribute('class', 'component-node');
        }
        
        svg.appendChild(rect);
        
        // Node text
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', (x + nodeWidth / 2).toString());
        text.setAttribute('y', (y + nodeHeight / 2).toString());
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'middle');
        text.setAttribute('class', node.type === 'layer' ? 'layer-text' : 'node-text');
        text.textContent = (node.data.name || node.data.label || '') as string;
        
        svg.appendChild(text);
      });
      
      // Export
      const svgString = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      
      downloadImage(url, 'metamodel-diagram.svg');
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error exporting SVG:', error);
    }
  }, [getNodes, getEdges, getViewport, downloadImage]);

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