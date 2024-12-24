export interface TreeNode {
  id: string;
  value: string;
  children: TreeNode[];
}

export interface Tree {
  id: string;
  root: TreeNode;
}
