import { Tree } from "../typing";

export const initialTreeData: Tree = {
  id: "6ec6da6d-f98f-4739-afcf-523726914861",
  root: {
    id: "070bc3da-ce7f-47dc-921c-760d32de2de4",
    rule: "Default Rule - Do Nothing",
    isExpanded: true,
    conditionGroup: [],
    children: [
      {
        id: "e76e691d-5866-4f76-b308-c3b0de43f665",
        rule: "When In Designated Area I - Apply Rule A",
        isExpanded: true,
        conditionGroup: [
          {
            variable: "Area",
            operator: "IN",
            values: ["Designated Area I"],
          },
        ],
        children: [
          {
            id: "1d9791a9-1bde-4896-95b7-8c0c9d4e85c3",
            rule: "Apply Special Restriction - Apply Rule B",
            isExpanded: true,
            conditionGroup: [
              {
                variable: "Area",
                operator: "IN",
                values: ["Special Area"],
              },
              {
                variable: "Restriction",
                operator: "EQUAL",
                values: ["APPLIED"],
              },
            ],
            children: [
              {
                id: "2973c672-072d-42f1-83fb-31713e1e4392",
                rule: "Cases NOT IN Certain Special Cases - Apply Rule C",
                conditionGroup: [
                  {
                    variable: "Users",
                    operator: "IN",
                    values: ["VIP-Users"],
                  },
                ],
                children: [],
                isExpanded: true,
              },
            ],
          },
        ],
      },
      {
        id: "baba283e-7cf2-4ff2-933e-58abc71e4a94",
        rule: "When In Designated Area - II - Apply Rule B",
        isExpanded: true,
        conditionGroup: [
          {
            variable: "Area",
            operator: "IN",
            values: ["Designated Area II"],
          },
        ],
        children: [
          {
            id: "e6cba76f-56f0-4718-bfe2-721b35ffd3e0",
            rule: "Apply Special Restriction - Apply Rule C",
            isExpanded: true,
            conditionGroup: [
              {
                variable: "Area",
                operator: "IN",
                values: ["Special Area"],
              },
              {
                variable: "Restriction",
                operator: "EQUAL",
                values: ["APPLIED"],
              },
            ],
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
