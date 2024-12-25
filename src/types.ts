import { TreeNode, Tree } from "./typing";

export function isTreeNode(obj: unknown): obj is TreeNode {
  if (
    typeof obj === "object" &&
    obj !== null &&
    "id" in obj &&
    "value" in obj &&
    "children" in obj
  ) {
    const { id, value, children } = obj as {
      id: unknown;
      value: unknown;
      children: unknown;
    };

    return (
      typeof id === "string" &&
      typeof value === "string" &&
      Array.isArray(children) &&
      children.every(isTreeNode) // Recursively validate children
    );
  }
  return false;
}

export function isTree(obj: unknown): obj is Tree {
  if (typeof obj === "object" && obj !== null && "id" in obj && "root" in obj) {
    const { id, root } = obj as { id: unknown; root: unknown };

    return typeof id === "string" && isTreeNode(root); // Validate root node
  }
  return false;
}
