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

const nodeTypes = {
  layer: LayerNode,
};

interface MetamodelDiagramProps {
  data?: MetamodelData;
}

export const MetamodelDiagram: React.FC<MetamodelDiagramProps> = ({ data }) => {
  const { initialNodes, initialEdges } = useMemo(() => {
    if (!data || !data.layers) {
      return { initialNodes: [], initialEdges: [] };
    }

    const sortedLayers = [...data.layers].sort((a, b) => a.order_num - b.order_num);
    const spacing = 200;
    const centerX = 300;

    // Create nodes for each layer
    const nodes: Node[] = sortedLayers.map((layer, index) => ({
      id: layer.id,
      type: 'layer',
      position: { 
        x: centerX - 150, 
        y: index * spacing + 50 
      },
      data: {
        name: layer.name,
        description: layer.description,
        code: layer.code,
        componentCount: layer.componentCount,
        layerType: layer.code.toLowerCase()
      },
      draggable: true,
    }));

    // Create edges between consecutive layers
    const edges: Edge[] = [];
    for (let i = 0; i < sortedLayers.length - 1; i++) {
      edges.push({
        id: `edge-${sortedLayers[i].id}-${sortedLayers[i + 1].id}`,
        source: sortedLayers[i].id,
        target: sortedLayers[i + 1].id,
        type: 'smoothstep',
        animated: true,
        style: { 
          stroke: 'hsl(var(--primary))', 
          strokeWidth: 2 
        },
        label: 'يعتمد على',
        labelStyle: { 
          fill: 'hsl(var(--muted-foreground))', 
          fontSize: 12 
        }
      });
    }

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
    <div className="h-[600px] bg-background border rounded-lg overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        attributionPosition="bottom-left"
      >
        <Controls />
        <Background color="hsl(var(--muted))" gap={16} />
      </ReactFlow>
    </div>
  );
};