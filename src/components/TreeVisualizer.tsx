import React, { useState } from "react";
import { Tree as TreeType, TreeNode as TreeNodeType } from "@/typing";
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
import { ChevronDown, ChevronRight } from "lucide-react";

interface ExtendedTreeItem extends TreeItem {
  parentId: string | null;
}

interface ExtendedTreeData extends Omit<TreeData, "items"> {
  items: { [key: string]: ExtendedTreeItem };
}

// const getLevelColor = (depth: number): string => {
//   const colors = [
//     "bg-green-50",
//     "bg-lime-50",
//     "bg-emerald-50",
//     "bg-green-100",
//     "bg-lime-100",
//     "bg-emerald-100",
//   ];
//   return colors[depth % colors.length];
//
// };
interface TreeNodeProps {
  item: TreeItem;
  depth?: number;
  tree: TreeData;
  provided: RenderItemParams["provided"];
  snapshot: RenderItemParams["snapshot"];
  onExpand: (itemId: ItemId) => void;
  onCollapse: (itemId: ItemId) => void;
}

const TreeNodeVisualizer: React.FC<TreeNodeProps> = ({
  item,
  depth = 0,
  provided,
  snapshot,
  onExpand,
  onCollapse,
}) => {
  const hasChildren = item.children && item.children.length > 0;
  const indentationWidth = 64; // Width of each indentation level
  const leftPadding = (depth - 1) * indentationWidth + 32;

  return (
    <div>
      <div
        className={`relative mb-1 transition-all duration-200 ${
          snapshot.isDragging
            ? "bg-gray-200 shadow-2xl opacity-95 rounded-lg z-50"
            : ""
        }`}
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
      >
        <div
          style={{ marginLeft: `${leftPadding}px` }}
          className={`flex items-center rounded-lg ${!snapshot.isDragging ? "shadow-lg bg-slate-50" : ""} transition-colors duration-200  mb-4 py-2 ml-1`}
        >
          <button
            onClick={() =>
              item.isExpanded ? onCollapse(item.id) : onExpand(item.id)
            }
            className={`w-6 h-6 flex items-center justify-center ml-2 ${
              !hasChildren ? "invisible" : ""
            }`}
          >
            {hasChildren &&
              (item.isExpanded ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              ))}
          </button>

          <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center ml-2 mr-3">
            <span className="text-emerald-600 text-sm">A</span>
          </div>

          <div className="flex-1 py-2">
            <div className="text-sm font-medium">{item.data?.value}</div>
            <div className="text-xs text-slate-500">id: {item.id}</div>
          </div>
          <div className="mr-4 text-xs text-slate-500">
            {hasChildren ? `${item.children.length} children` : "0 children"}
          </div>
        </div>
      </div>
    </div>
  );
};

interface TreeVisualizerProps {
  tree: TreeType;
  onChange: (newTree: TreeType) => void;
}

const TreeVisualizer: React.FC<TreeVisualizerProps> = ({
  tree: currTree,
  onChange,
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

    onChange(transformBackToTree(newTree, currTree.id));
  };

  const renderItem = ({
    item,
    provided,
    snapshot,
    onExpand,
    onCollapse,
  }: RenderItemParams) => {
    const depth = calculateDepth(tree, item.id);
    return (
      <TreeNodeVisualizer
        item={item}
        tree={tree}
        depth={depth}
        provided={provided}
        snapshot={snapshot}
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
      <div
        className="flex-1 overflow-y-auto min-h-0"
        style={{
          backgroundImage: `repeating-linear-gradient(to right,
            transparent,
            transparent 31px,
            #e5e7eb 31px,
            #e5e7eb 32px,
            transparent 32px,
            transparent 64px
          )`,
          backgroundPosition: "36px 0",
          paddingLeft: "32px",
          backgroundClip: "content-box", // Ensure gradient stays within bounds
          clipPath: "inset(0 0 0 1px)", // Cuts off 1px from the left
        }}
      >
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

const transformBackToTree = (
  atlaskitTree: ExtendedTreeData,
  originalTreeId: string,
): TreeType => {
  const buildTreeNode = (itemId: string): TreeNodeType => {
    const item = atlaskitTree.items[itemId];
    return {
      id: itemId,
      value: item.data?.value || null,
      children: item.children.map((childId) =>
        buildTreeNode(childId as string),
      ),
    };
  };

  // Skip the root-id sentinel node and get the actual root node
  const actualRootId = atlaskitTree.items[atlaskitTree.rootId].children[0];

  return {
    id: originalTreeId as string,
    root: buildTreeNode(actualRootId as string),
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

export { TreeVisualizer };
