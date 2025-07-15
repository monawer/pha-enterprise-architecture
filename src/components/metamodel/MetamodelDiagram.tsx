import React, { useCallback, useMemo } from 'react';
import { 
  ReactFlow, 
  Controls, 
  Background, 
  useNodesState, 
  useEdgesState,
  Node,
  Edge
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
}

export const MetamodelDiagram: React.FC<MetamodelDiagramProps> = ({ data }) => {
  const { initialNodes, initialEdges } = useMemo(() => {
    if (!data || !data.layers || !data.components) {
      return { initialNodes: [], initialEdges: [] };
    }

    const sortedLayers = [...data.layers].sort((a, b) => a.order_num - b.order_num);
    const layerSpacing = 350;
    const componentSpacing = 220;
    const centerX = 400;

    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // Create layer group nodes and component nodes
    sortedLayers.forEach((layer, layerIndex) => {
      const layerY = layerIndex * layerSpacing + 50;
      const layerComponents = data.components.filter(comp => comp.layer_id === layer.id);
      
      // Create layer group node
      nodes.push({
        id: `layer-${layer.id}`,
        type: 'group',
        position: { x: centerX - 200, y: layerY },
        style: {
          width: 800,
          height: Math.max(150, Math.ceil(layerComponents.length / 3) * 120 + 80),
          backgroundColor: 'hsl(var(--muted))',
          border: '2px solid hsl(var(--border))',
          borderRadius: '8px',
        },
        data: { label: layer.name },
        draggable: false,
      });

      // Create layer header node
      nodes.push({
        id: layer.id,
        type: 'layer',
        position: { x: 20, y: 20 },
        data: {
          name: layer.name,
          description: layer.description,
          code: layer.code,
          componentCount: layer.componentCount,
          layerType: layer.code.toLowerCase()
        },
        parentId: `layer-${layer.id}`,
        extent: 'parent',
        draggable: true,
      });

      // Create component nodes within the layer
      layerComponents.forEach((component, compIndex) => {
        const componentsPerRow = 3;
        const row = Math.floor(compIndex / componentsPerRow);
        const col = compIndex % componentsPerRow;
        
        nodes.push({
          id: component.id,
          type: 'component',
          position: { 
            x: 350 + (col * componentSpacing), 
            y: 70 + (row * 120) 
          },
          data: {
            ...component,
            layerType: layer.code.toLowerCase()
          },
          parentId: `layer-${layer.id}`,
          extent: 'parent',
          draggable: true,
        });
      });
    });

    // Create edges between components based on relationships
    data.relationships.forEach(relationship => {
      edges.push({
        id: relationship.id,
        source: relationship.source_component_id,
        target: relationship.target_component_id,
        type: 'smoothstep',
        animated: relationship.source_component.layer_code !== relationship.target_component.layer_code,
        style: { 
          stroke: relationship.source_component.layer_code !== relationship.target_component.layer_code 
            ? 'hsl(var(--primary))' 
            : 'hsl(var(--muted-foreground))', 
          strokeWidth: 2 
        },
        label: relationship.relationship_type,
        labelStyle: { 
          fill: 'hsl(var(--foreground))', 
          fontSize: 10,
          fontWeight: 500
        }
      });
    });

    return { initialNodes: nodes, initialEdges: edges };
  }, [data]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  if (!data || !data.layers || data.layers.length === 0) {
    return (
      <div className="h-96 bg-muted/20 rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">لا توجد بيانات لعرضها</p>
      </div>
    );
  }

  return (
    <div className="h-[800px] bg-background border rounded-lg overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.1 }}
        attributionPosition="bottom-left"
        minZoom={0.2}
        maxZoom={1.5}
      >
        <Controls />
        <Background color="hsl(var(--muted))" gap={16} />
      </ReactFlow>
    </div>
  );
};