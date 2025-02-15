import React from "react";
import ReactCodeMirror from "@uiw/react-codemirror";
import { json as jsonLang } from "@codemirror/lang-json";
import { githubLight } from "@uiw/codemirror-theme-github";

interface TreeEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const TreeEditor: React.FC<TreeEditorProps> = ({ value, onChange }) => {
  return (
    <div style={{ minWidth: 230, width: "45%", position: "relative" }}>
      <div
        style={{ overflow: "auto", height: "100%", boxSizing: "border-box" }}
      >
        <ReactCodeMirror
          value={value}
          height="100%"
          style={{ height: "100%" }}
          theme={githubLight}
          extensions={[jsonLang()]}
          onChange={onChange}
        />
      </div>
    </div>
  );
};
export { TreeEditor };
