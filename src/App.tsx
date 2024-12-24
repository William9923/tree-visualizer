"use client";

import styles from "./App.module.css";
import Split from "@uiw/react-split";

import { TreeEditor } from "@/components/TreeEditor";
import { TreeVisualizer } from "@/components/TreeVisualizer";
import { Button } from "@/components/ui/button";
import { initialMockTreeStr, initialTreeData } from "@/mock/tree";
import { useToast } from "@/components/hooks/use-toast";

function App() {
  const { toast } = useToast();

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
                    console.log("format button clicked");
                    toast({
                      title: "Apply Format Successful!",
                    });
                  }}
                >
                  Format
                </Button>
                <Button
                  onClick={() => {
                    console.log("preview button clicked");
                    toast({
                      variant: "destructive",
                      title: "Preview Error!",
                    });
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
            value={initialMockTreeStr}
            onChange={function (): void {
              throw new Error("Function not implemented.");
            }}
          />
          {/* Change this tree editor into the RuleCard ? */}
          <TreeVisualizer tree={initialTreeData} />
        </Split>
      </Split>
    </div>
  );
}

export default App;
