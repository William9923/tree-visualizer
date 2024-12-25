import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tree as TreeType, TreeNode as TreeNodeType } from "@/typing";
import { Accordion, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Separator } from "@/components/ui/separator";
import Tree, {
  mutateTree,
  moveItemOnTree,
  TreeData,
  TreeItem,
  ItemId,
  TreeSourcePosition,
  TreeDestinationPosition,
  RenderItemParams,
} from "@atlaskit/tree";

interface ExtendedTreeItem extends TreeItem {
  parentId: string | null;
}

interface ExtendedTreeData extends Omit<TreeData, "items"> {
  items: { [key: string]: ExtendedTreeItem };
}

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

interface TreeNodeProps {
  item: TreeItem;
  depth?: number;
  tree: TreeData;
  provided: RenderItemParams["provided"];
  onExpand: (itemId: ItemId) => void;
  onCollapse: (itemId: ItemId) => void;
}

const TreeNodeVisualizerV2: React.FC<TreeNodeProps> = ({
  item,
  depth = 0,
  provided,
  onExpand,
  onCollapse,
}) => {
  const bgColor = getLevelColor(depth - 1);
  const hasChildren = item.children && item.children.length > 0;

  // Calculate margin and border styles
  const leftMargin = (depth - 1) * 4; // Adjust multiplier as needed
  const additionalStyles = depth > 1 ? `ml-${leftMargin} pl-2` : "";

  return (
    <div className={additionalStyles}>
      <Separator orientation="vertical" />
      <Card
        className={`mb-3  ${bgColor}`}
        style={{ marginLeft: `${leftMargin}px` }}
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
      >
        <CardHeader className="p-3 flex flex-row items-center justify-between">
          <div className="pl-2">
            <div className="font-semibold text-left">id: {item.id}</div>
            <div className="text-left">value: {item.data?.value}</div>
          </div>
        </CardHeader>
        {hasChildren && (
          <CardContent className="p-3 pt-0">
            <Accordion type="single" collapsible>
              <AccordionItem value={item.id.toString()}>
                <AccordionTrigger
                  onClick={() =>
                    item.isExpanded ? onCollapse(item.id) : onExpand(item.id)
                  }
                >
                  <div className="px-2">Subrule:</div>
                </AccordionTrigger>
              </AccordionItem>
            </Accordion>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

interface TreeVisualizerPropsV2 {
  tree: TreeType;
}

const TreeVisualizerV2: React.FC<TreeVisualizerPropsV2> = ({
  tree: currTree,
}) => {
  const [tree, setTree] = useState<ExtendedTreeData>(
    transformToAtlaskitTree(currTree),
  );

  const onExpand = (itemId: ItemId) => {
    setTree(safeMutateTree(tree, itemId, { isExpanded: true }));
  };

  const onCollapse = (itemId: ItemId) => {
    setTree(safeMutateTree(tree, itemId, { isExpanded: false }));
  };

  const onDragEnd = (
    source: TreeSourcePosition,
    destination?: TreeDestinationPosition,
  ) => {
    if (!destination) return;
    const newTree = safeMoveItemOnTree(tree, source, destination);
    setTree(newTree);
  };

  const renderItem = ({
    item,
    provided,
    onExpand,
    onCollapse,
  }: RenderItemParams) => {
    const depth = calculateDepth(tree, item.id);
    return (
      <TreeNodeVisualizerV2
        item={item}
        tree={tree}
        depth={depth}
        provided={provided}
        onExpand={onExpand}
        onCollapse={onCollapse}
      />
    );
  };

  return (
    <div className="flex flex-col h-full flex-1 px-4 bg-slate-100">
      <div className="my-4">
        <h2 className="font-semibold">Tree Id: {currTree.id}</h2>
      </div>
      <div className="flex-1 overflow-y-auto min-h-0">
        <Tree
          tree={tree}
          renderItem={renderItem}
          onExpand={onExpand}
          onCollapse={onCollapse}
          onDragEnd={onDragEnd}
          isDragEnabled
          isNestingEnabled
          offsetPerLevel={0}
        />
      </div>
    </div>
  );
};

const transformToAtlaskitTree = (tree: TreeType): ExtendedTreeData => {
  const transformNode = (
    node: TreeNodeType,
    parentId: string | null = null,
  ): ExtendedTreeItem => {
    return {
      id: node.id,
      children: node.children
        ? node.children.map((child: TreeNodeType) => child.id)
        : [],
      hasChildren: node.children ? node.children.length > 0 : false,
      isExpanded: true,
      isChildrenLoading: false,
      data: {
        value: node.value,
      },
      parentId,
    };
  };

  const items: Record<string, ExtendedTreeItem> = {};
  // dummy sentinal node
  items["root-id"] = transformNode({
    id: "root-id",
    value: "",
    children: [tree.root],
  });
  const processNode = (node: TreeNodeType, parentId: string | null = null) => {
    items[node.id] = transformNode(node, parentId);
    if (node.children) {
      node.children.forEach((child: TreeNodeType) =>
        processNode(child, node.id),
      );
    }
  };

  processNode(tree.root, "root-id");

  return {
    rootId: "root-id",
    items,
  };
};

const safeMutateTree = (
  tree: ExtendedTreeData,
  itemId: ItemId,
  mutation: Partial<TreeItem>,
): ExtendedTreeData => {
  const newTree = mutateTree(tree, itemId, mutation);
  return {
    ...newTree,
    items: Object.fromEntries(
      Object.entries(newTree.items).map(([id, item]) => [
        id,
        { ...item, parentId: tree.items[id].parentId },
      ]),
    ),
  };
};

const safeMoveItemOnTree = (
  tree: ExtendedTreeData,
  source: TreeSourcePosition,
  destination: TreeDestinationPosition,
): ExtendedTreeData => {
  const newTree = moveItemOnTree(tree, source, destination);

  const newItems: { [key: string]: ExtendedTreeItem } = {};

  Object.entries(newTree.items).forEach(([id, item]) => {
    const parentId =
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(newTree.items).find(([_, potentialParent]): boolean =>
        potentialParent.children.includes(id),
      )?.[0] || null;

    newItems[id] = {
      ...item,
      parentId,
    } as ExtendedTreeItem;
  });

  return {
    rootId: newTree.rootId,
    items: newItems,
  };
};

const calculateDepth = (
  tree: ExtendedTreeData,
  itemId: ItemId,
  depth = 0,
): number => {
  const item = tree.items[itemId];
  if (!item.parentId) return depth;
  return calculateDepth(tree, item.parentId, depth + 1);
};

export { TreeVisualizerV2 };
