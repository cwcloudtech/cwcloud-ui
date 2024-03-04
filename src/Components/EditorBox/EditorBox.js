import React, { useContext } from "react";
import Editor from "@monaco-editor/react";
import { Row, Col } from "reactstrap";
import EditorActions from "./EditorActions";
import GlobalContext from "../../Context/GlobalContext";

const EditorBox = (props) => {
  const context = useContext(GlobalContext);
  const _mode = context.mode;
  const isDark = _mode === "dark";
  return (
    <Row>
      <Col> 
        <div style={{ background: isDark ? "#2C3139" : "#0861AF", padding: "10px", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center", borderTopLeftRadius: "10px", borderTopRightRadius: "10px"  }}>
            <div>{props.title}</div>
            <EditorActions textToCopy={props.textToCopy} handleFullScreen={props.handleFullScreen} />
        </div>
        <Editor
          height="500px"
          theme="vs-dark"
          font={props.font}
          style={props.style}
          language={props.language}
          value={props.value}
          onChange={props.onChange}
        />
      </Col>
    </Row>
  );
};

export default EditorBox;
