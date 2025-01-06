import Tree, {
  TreeData,
  TreeItem,
} from "@atlaskit/tree";

export interface Condition {
  variable: string;
  operator: "IN" | "NOT IN" | "EQUAL" | "NOT EQUAL" | "LESS_THAN" | "GREATER_THAN";
  values: string[];
}

export interface TreeNode {
  id: string;
  rule: string;
  conditionGroup: Condition[];
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