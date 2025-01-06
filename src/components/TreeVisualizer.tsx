import React, { useMemo } from "react";
import { Tree as TreeType, TreeNode as TreeNodeType, ExtendedTreeData, ExtendedTreeItem, Condition } from "@/typing";
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
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

const getGreenColorPerDepth = (depth: number): string => {
  const colorValues = ["#40A578", "#9CDBA6", "#50B498", "#73EC8B"];
  return colorValues[depth % colorValues.length];
};

interface TreeNodeProps {
  item: TreeItem;
  depth?: number;
  tree: TreeData;
  provided: RenderItemParams["provided"];
  snapshot: RenderItemParams["snapshot"];
  onExpand: (itemId: ItemId) => void;
  onCollapse: (itemId: ItemId) => void;
  useColor: boolean;
}

const TreeNodeVisualizer: React.FC<TreeNodeProps> = ({
  item,
  depth = 0,
  provided,
  snapshot,
  onExpand,
  onCollapse,
  useColor,
}) => {
  const hasChildren = item.children && item.children.length > 0;
  const indentationWidth = 64; // Width of each indentation level
  const leftPadding = (depth - 1) * indentationWidth + 30;

  const gradientBgColor = `linear-gradient(to left, rgb(248 250 252), ${getGreenColorPerDepth(depth)})`;

  return (
    <div
      className={`relative mb-1 transition-all duration-150 `}
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
    >
      <div
        style={{
          marginLeft: `${leftPadding}px`,
          background: useColor ? gradientBgColor : undefined,
          borderWidth: useColor ? "0.1em" : undefined,
          borderColor: useColor ? "slategray" : undefined,
        }}
        className={`rounded-md
          ${snapshot.isDragging ? "bg-emerald-200 shadow-[4px_4px_12px_rgba(0,0,0,0.25),-2px_-2px_6px_rgba(255,255,255,0.5)] scale-105 opacity-95 z-50 border-2 border-slate-500" : `border-2 border-emerald-100 shadow-sm ${useColor ? gradientBgColor : "bg-slate-50"}`}
          transition-all duration-200 mb-4 py-2 mx-1`}
      >
        <div className="flex items-center">
          <ExpandButton
            isVisible={hasChildren}
            isExpanded={item.isExpanded ?? false}
            onClick={() => {
              console.log("button expand clicked")
              item.isExpanded ? onCollapse(item.id) : onExpand(item.id)
            }}
          />

          {/* TODO: A (Activated)/D (Deactivate) -> color change based on the situation -> Extract into small element  */}
          <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center ml-2 mr-3">
            <span className="text-emerald-600 text-sm">A</span>
          </div>

          <div className="flex-1 py-2">
            <div className="text-sm font-medium">{item.data?.rule}</div>
            <div className="text-xs text-slate-500">id: {item.id}</div>
          </div>

          <div className="mx-2 text-xs text-slate-500">
            {hasChildren ? `${item.children.length} children` : "0 children"}
          </div>
        </div>
        {!!item.isExpanded && (
          <div>
            <div className="mt-2 mx-4">
              <Separator />
            </div>
            <div className="px-4 pt-2">
              <div className="space-y-2">
                {item.data?.conditionGroup?.map((condition: Condition, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-8 h-8 flex items-center justify-center mr-2">
                        <span className="text-sm">{index + 1}</span>
                      </div>
                      <div className="w-16">
                        <span className={`px-2 py-1 bg-black text-white text-xs rounded ${index === 0 ? 'mr-4' : ''}`}>
                          {index === 0 ? 'IF' : 'AND'}
                        </span>
                      </div>
                      <Input
                        className="h-8 bg-gray-200"
                        style={{ width: `${Math.max(50 - depth * 10, 30) * 4}px` }}
                        value={condition.variable || ''}
                        disabled
                      />
                      <Input
                        className="h-8 bg-gray-200 w-20"
                        value={condition.operator || ''}
                        disabled
                      />
                      {condition.values && condition.values.length > 0 && (
                        <Input
                          className="h-8 bg-gray-200 flex-grow"
                          value={condition.values[0]}
                          disabled
                        />
                      )}
                    </div>
                ))}
              </div>
            </div>
            {/* // TODO: Add the small components here => Condition Group, can try to use the screenshot */}
          </div>
        )}

      </div>


    </div>
  );
};

interface ExpandButtonProps {
  isExpanded: boolean;
  isVisible: boolean;
  onClick: () => void;
}

const ExpandButton = ({
  isExpanded,
  isVisible,
  onClick,
}: ExpandButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`w-6 h-6 flex items-center justify-center ml-2 ${!isVisible ? "invisible" : ""
        }`}
    >
      {isVisible &&
        (isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
    </button>
  );
};

interface TreeVisualizerProps {
  tree: TreeType;
  onChange: (newTree: TreeType) => void;
  useColor: boolean;
}

const TreeVisualizer: React.FC<TreeVisualizerProps> = ({
  tree: currTree,
  onChange,
  useColor,
}) => {

  const tree = useMemo(() => transformToAtlaskitTree(currTree), [currTree]);

  const onExpand = (itemId: ItemId) => {
    const newTree = safeMutateTree(tree, itemId, { isExpanded: true });
    onChange(transformBackToTree(newTree, currTree.id));
  };

  const onCollapse = (itemId: ItemId) => {
    const newTree = safeMutateTree(tree, itemId, { isExpanded: false });
    onChange(transformBackToTree(newTree, currTree.id));
  };

  const onDragEnd = (
    source: TreeSourcePosition,
    destination?: TreeDestinationPosition,
  ) => {
    if (!destination) return;
    const newTree = safeMoveItemOnTree(tree, source, destination);
    onChange(transformBackToTree(newTree, currTree.id));
  };

  const renderItem = ({
    item,
    provided,
    snapshot,
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
        useColor={useColor}
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
      isExpanded: node.isExpanded,
      isChildrenLoading: false,
      data: {
        rule: node.rule,
        conditionGroup: node.conditionGroup
      },
      parentId,
    };
  };

  const items: Record<string, ExtendedTreeItem> = {};
  // dummy sentinal node
  items["root-id"] = transformNode({
    id: "root-id",
    rule: "",
    conditionGroup: [],
    children: [tree.root],
    isExpanded: true,
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
      rule: item.data?.rule || null,
      conditionGroup: item.data?.conditionGroup,
      children: item.children.map((childId) =>
        buildTreeNode(childId as string),
      ),
      isExpanded: item.isExpanded || false,
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
