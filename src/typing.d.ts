import Tree, {
  TreeData,
  TreeItem,
} from "@atlaskit/tree";
export interface TreeNode {
  id: string;
  value: string;
  children: TreeNode[];
  isExpanded: boolean;
}

export interface Tree {
  id: string;
  root: TreeNode;
}

export interface ExtendedTreeItem extends TreeItem {
  parentId: string | null;
}

export interface ExtendedTreeData extends Omit<TreeData, "items"> {
  items: { [key: string]: ExtendedTreeItem };
}