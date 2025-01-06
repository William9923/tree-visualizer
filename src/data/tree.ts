import { Tree } from "../typing";

export const initialTreeData: Tree = {
  id: "6ec6da6d-f98f-4739-afcf-523726914861",
  root: {
    id: "070bc3da-ce7f-47dc-921c-760d32de2de4",
    value: "Default Rule",
    isExpanded: true,
    children: [
      {
        id: "e76e691d-5866-4f76-b308-c3b0de43f665",
        value: "When In Designated Area I",
        isExpanded: true,
        children: [
          {
            id: "1d9791a9-1bde-4896-95b7-8c0c9d4e85c3",
            value: "Apply Special Restriction",
            isExpanded: true,
            children: [
              {
                id: "2973c672-072d-42f1-83fb-31713e1e4392",
                value: "Exclude Certain Special Cases",
                children: [],
                isExpanded: true,
              },
            ],
          },
        ],
      },
      {
        id: "baba283e-7cf2-4ff2-933e-58abc71e4a94",
        value: "When In Designated Area - II",
        isExpanded: true,
        children: [
          {
            id: "e6cba76f-56f0-4718-bfe2-721b35ffd3e0",
            value: "Apply Special Restriction",
            isExpanded: true,
            children: [],
          },
        ],
      },
    ],
  },
};

export const initialTreeStrCompressed: string = JSON.stringify(
  initialTreeData,
  null,
  0,
);
export const initialTreeStrFormatted: string = JSON.stringify(
  initialTreeData,
  null,
  2,
);
