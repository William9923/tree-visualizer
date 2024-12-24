import React, { useRef } from "react";
import ReactCodeMirror, { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { json as jsonLang } from "@codemirror/lang-json";
import { githubLight } from "@uiw/codemirror-theme-github";

interface TreeEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const TreeEditor: React.FC<TreeEditorProps> = ({ value }) => {
  const cmRef = useRef<ReactCodeMirrorRef>(null);
  return (
    <div style={{ minWidth: 230, width: "40%", position: "relative" }}>
      <div
        style={{ overflow: "auto", height: "100%", boxSizing: "border-box" }}
      >
        <ReactCodeMirror
          value={value}
          ref={cmRef}
          height="100%"
          style={{ height: "100%" }}
          theme={githubLight}
          extensions={[jsonLang()]}
        />
      </div>
    </div>
  );
};
export { TreeEditor };
