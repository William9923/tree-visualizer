"use client";

import React, { useState } from "react";
import styles from "./App.module.css";
import Split from "@uiw/react-split";

import { TreeEditor } from "@/components/TreeEditor";
import { TreeVisualizer } from "@/components/TreeVisualizer";
import { Button } from "@/components/ui/button";
import { InfoButton } from "@/components/InfoButton";
import { initialTreeData, initialTreeStrFormatted } from "@/data/tree";
import { useToast } from "@/components/hooks/use-toast";
import { Palette } from "lucide-react";
import { Tree } from "./typing";
import { isTree } from "./types";
import { Toggle } from "@radix-ui/react-toggle";

const App: React.FC = () => {
  const { toast } = useToast();
  const [tree, setTree] = useState<Tree>(initialTreeData);
  const [code, setCode] = useState<string>(initialTreeStrFormatted);
  const [useColor, setUseColor] = useState<boolean>(false);

  const formatJSON = () => {
    if (code) {
      const formattedCode = formatJSONStr(code, 2);
      setCode(formattedCode);
    }
  };

  const previewTree = () => {
    if (code) {
      const jsonTree = convertJSONStrToTree(code);
      setTree(jsonTree);
    }
  };

  const syncTreeToCode = () => {
    if (tree) {
      const jsonCode = JSON.stringify(tree, null, 2);
      setCode(jsonCode);
    }
  };

  const onPreviewClick = () => {
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
  };

  const onSyncToCodeClick = () => {
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
  };

  const onFormatClick = () => {
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
  };

  return (
    <div className={styles.app}>
      <Split mode="vertical" visible={false}>
        <div className={styles.header} style={{}}>
          <h1>Tree Visualizer</h1>
          <div className={styles.toolbar}>
            <div className={styles.btn}>
              <div className="flex h-5 items-center space-x-4 text-sm">
                <Button variant={"outline"} onClick={onFormatClick}>
                  Format
                </Button>
                <Button onClick={onSyncToCodeClick}>Sync Code</Button>
                <Button onClick={onPreviewClick}>Preview</Button>
                <Toggle
                  aria-label="toggle-color"
                  onPressedChange={(pressed) => {
                    setUseColor(pressed);
                  }}
                >
                  <Palette style={{ color: useColor ? "green" : "black" }} />
                </Toggle>
                <InfoButton onClick={() => {}} />
              </div>
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
          <TreeVisualizer
            tree={tree}
            onChange={(newTree: Tree) => {
              setTree(newTree);
            }}
            useColor={useColor}
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
