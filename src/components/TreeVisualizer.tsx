import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tree, TreeNode } from "@/typing";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

const getLevelColor = (depth: number): string => {
  const colors = [
    "bg-green-50",
    "bg-lime-50",
    "bg-emerald-50",
    "bg-green-100",
    "bg-lime-100",
    "bg-emerald-100",
  ];
  return colors[depth % colors.length];
};

interface TreeVisualizerNodeProps {
  node: TreeNode;
  depth?: number;
}

const TreeNodeVisualizer: React.FC<TreeVisualizerNodeProps> = ({
  node,
  depth = 0,
}) => {
  const bgColor = getLevelColor(depth);

  return (
    <Card className={`w-9/10 mb-2 ${depth > 0 ? "ml-4" : ""} ${bgColor}`}>
      <CardHeader className="p-3 flex flex-row items-center justify-between">
        <div className="pl-2">
          <div className="font-semibold text-left">id: {node.id}</div>
          <div className="text-left">value: {node.value}</div>
        </div>
      </CardHeader>
      {node.children && node.children.length > 0 && (
        <CardContent className="p-3 pt-0">
          <Accordion type="single" collapsible>
            <AccordionItem value={node.id}>
              <AccordionTrigger>
                <div className="mb-2 px-2">children:</div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="border-l-2 border-gray-200 ml-4 pl-2">
                  {node.children.map((child, index) => (
                    <TreeNodeVisualizer
                      key={`${node.id}-${index}`}
                      node={child}
                      depth={depth + 1}
                    />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      )}
    </Card>
  );
};

interface TreeVisualizerProps {
  tree: Tree;
}

const TreeVisualizer: React.FC<TreeVisualizerProps> = ({ tree }) => {
  return (
    <div className="flex flex-col h-full flex-1 px-4 bg-slate-100">
      <div className="my-4">
        <h2>Tree: {tree.id}</h2>
      </div>
      <div className="flex-1 overflow-y-auto min-h-0">
        <TreeNodeVisualizer key={tree.root.id} node={tree.root} />
      </div>
    </div>
  );
};

export { TreeNodeVisualizer, TreeVisualizer };
