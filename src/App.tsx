"use client";

import React, { useState, useCallback } from "react";
import styles from "./App.module.css";
import Split from "@uiw/react-split";

import { TreeEditor } from "@/components/TreeEditor";
// import { TreeVisualizer } from "@/components/TreeVisualizer";
import { TreeVisualizerV2 } from "@/components/TreeVisualizerV2";
import { Button } from "@/components/ui/button";
import { initialTreeData, initialTreeStrFormatted } from "@/data/tree";
import { useToast } from "@/components/hooks/use-toast";
import { Tree } from "./typing";
import { isTree } from "./types";

const App: React.FC = () => {
  const { toast } = useToast();
  const [tree, setTree] = useState<Tree>(initialTreeData);
  const [code, setCode] = useState<string>(initialTreeStrFormatted);

  const formatJSON = useCallback(() => {
    if (code) {
      const formattedCode = formatJSONStr(code, 2);
      setCode(formattedCode);
    }
  }, [code]);

  const previewTree = useCallback(() => {
    if (code) {
      const jsonTree = convertJSONStrToTree(code);
      setTree(jsonTree);
    }
  }, [code]);

  const syncTreeToCode = useCallback(() => {
    if (tree) {
      const jsonCode = JSON.stringify(tree, null, 2);
      setCode(jsonCode);
    }
  }, [tree]);

  return (
    <div className={styles.app}>
      <Split mode="vertical" visible={false}>
        <div className={styles.header} style={{}}>
          <h1>Tree Editor / Previewer</h1>
          <div className={styles.toolbar}>
            <div className={styles.btn}>
              <div className="flex h-5 items-center space-x-4 text-sm">
                <Button
                  variant={"outline"}
                  onClick={() => {
                    try {
                      formatJSON();
                      toast({
                        title: "Apply Format Successful!",
                      });
                    } catch (err) {
                      if (err instanceof Error) {
                        const errMsg = err.message;
                        toast({
                          variant: "destructive",
                          title: "Apply Format Failed!",
                          description: errMsg,
                        });
                      }
                    }
                  }}
                >
                  Format
                </Button>
                <Button
                  onClick={() => {
                    try {
                      syncTreeToCode();
                      toast({
                        title: "Sync Code Successful!",
                      });
                    } catch (err) {
                      if (err instanceof Error) {
                        const errMsg = err.message;
                        toast({
                          variant: "destructive",
                          title: "Sync Code Failed!",
                          description: errMsg,
                        });
                      }
                    }
                  }}
                >
                  Sync Code
                </Button>
                <Button
                  onClick={() => {
                    try {
                      previewTree();
                      toast({
                        title: "Preview Successful!",
                      });
                    } catch (err) {
                      if (err instanceof Error) {
                        const errMsg = err.message;
                        toast({
                          variant: "destructive",
                          title: "Preview Failed!",
                          description: errMsg,
                        });
                      }
                    }
                  }}
                >
                  Preview
                </Button>
              </div>
              {/* Import / Export Button */}
            </div>
          </div>
        </div>
        <Split
          style={{
            flex: 1,
            height: "calc(100% - 50px)",
          }}
        >
          <TreeEditor
            value={code}
            onChange={(value: string) => {
              setCode(value);
            }}
          />
          {/* Change this tree editor into the RuleCard ? */}
          <TreeVisualizerV2
            tree={tree}
            onChange={(newTree) => {
              setTree(newTree);
            }}
          />
        </Split>
      </Split>
    </div>
  );
};

const formatJSONStr = (text: string, space: number): string => {
  const obj = JSON.parse(text);
  const str = JSON.stringify(obj, null, space);
  return str;
};

const convertJSONStrToTree = (text: string): Tree => {
  const obj = JSON.parse(text) as unknown;
  if (!isTree(obj)) {
    throw new Error("Invalid tree structure!");
  } else {
    return obj;
  }
};

export default App;
