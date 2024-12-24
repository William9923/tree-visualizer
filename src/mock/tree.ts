import { Tree } from "../typing";

export const initialTreeData: Tree = {
  id: "6ec6da6d-f98f-4739-afcf-523726914861",
  root: {
    id: "6ec6da6d-f98f-4739-afcf-523726914860",
    value: "Example tree data 1",
    children: [
      {
        id: "e76e691d-5866-4f76-b308-c3b0de43f665",
        value: "Example children tree data 1",
        children: [
          {
            id: "e76e691d-5866-4f76-b308-c3b0de43f665",
            value: "Example children tree data 1",
            children: [
              {
                id: "e76e691d-5866-4f76-b308-c3b0de43f665",
                value: "Example children tree data 1",
                children: [],
              },
            ],
          },
        ],
      },
    ],
  },
};

export const initialMockTreeStr: string = `{
  "id": "6ec6da6d-f98f-4739-afcf-523726914861",
  "root": {
    "id": "6ec6da6d-f98f-4739-afcf-523726914860",
    "value": "Example tree data 1",
    "children": [
      {
        "id": "e76e691d-5866-4f76-b308-c3b0de43f665",
        "value": "Example children tree data 1",
        "children": []
      }
    ]
  }
}`;
