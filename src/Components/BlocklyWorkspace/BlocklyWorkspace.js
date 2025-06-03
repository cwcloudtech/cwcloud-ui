import React, { useRef, useEffect, useContext } from 'react';
import Blockly from 'blockly';
import DarkTheme from '@blockly/theme-dark';
import {pythonGenerator} from 'blockly/python';
import { customizeBlocks } from './customBlocks';
import { customizePythonGenerator } from './customPyBlocks';
import { Tooltip } from '@mui/material';
import FullscreenOutlinedIcon from '@mui/icons-material/FullscreenOutlined';
import Translate from 'react-translate-component';
import GlobalContext from '../../Context/GlobalContext';
import { toast } from 'react-toastify';

const patchBlocklyRendering = () => {
  const originalRender = Blockly.BlockSvg.prototype.renderEfficiently;
  const originalFieldDropdownRender = Blockly.FieldDropdown.prototype.render_;
  const originalGetTextContent = Blockly.FieldDropdown.prototype.getTextContent;

  Blockly.FieldDropdown.prototype.getTextContent = function() {
    try {
      return originalGetTextContent.call(this);
    } catch (e) {
      console.warn("Error in Blockly FieldDropdown.getTextContent:", e);
      return "";
    }
  };

  Blockly.FieldDropdown.prototype.render_ = function() {
    try {
      return originalFieldDropdownRender.call(this);
    } catch (e) {
      console.warn("Error in Blockly FieldDropdown.render_:", e);
    }
  };

  Blockly.BlockSvg.prototype.renderEfficiently = function() {
    try {
      return originalRender.call(this);
    } catch (e) {
      console.warn("Error rendering Blockly block:", e);
      if (this.svgGroup_) {
        this.svgGroup_.setAttribute('opacity', '0.5');
      }
    }
  };
}

function BlocklyWorkspace(props) {
  const context = useContext(GlobalContext);
  const _mode = context.mode;
  const blocklyDivRef = useRef(null);
  const workspaceRef = useRef(null);
  const height = props.workspaceHeight ? props.workspaceHeight : '500px';

  useEffect(() => {
    if (blocklyDivRef.current) {
      try {
        patchBlocklyRendering();
        
        customizeBlocks();
        customizePythonGenerator();
        
        workspaceRef.current = Blockly.inject(blocklyDivRef.current, {
          toolbox: document.getElementById('toolbox'),
          theme: _mode === 'dark' ? DarkTheme : null,
          trashcan: false,
          scrollbars: props.showBlocklyFullScreen,
        });

        if (props.state) {
          try {
            Blockly.serialization.workspaces.load(props.state, workspaceRef.current);
          } catch (error) {
            console.error("Error loading Blockly state:", error);
            toast.error(context.counterpart('dashboard.function.message.blocklyBreakingChanges'));
            props.onWorkspaceChange(props.code, { error: true });
            return;
          }
        }
      } catch (error) {
        console.error("Error initializing Blockly:", error);
        toast.error(context.counterpart('dashboard.function.message.blocklyInitError'));
        return;
      }
    }

    const generateTheCode = () => {
      var code = '';
      code = pythonGenerator.workspaceToCode(workspaceRef.current);
      // Handle return statements that are not in a function
      const returnRegex = /\n\s*\n(\s*)return/g;
      code = code.replace(returnRegex, function(match, p1) {
        // Decrease the indentation by one level (2 spaces)
        const newIndent = p1.slice(0, -2);
        return '\n' + newIndent + 'return';
      });
      // if there's multiple imports of the same module (either "import name from name" or "import name"), remove the duplicates
      const importRegex = /import\s+((\w+\.)*\w+)\s+from\s+((\w+\.)*\w+)|import\s+((\w+\.)*\w+)/g;
      const importedModules = new Set();
      code = code.replace(importRegex, function(match, p1, p2, p3, p4, p5) {
        const moduleName = p1 || p3 || p5;
        if (importedModules.has(moduleName)) {
          return '';
        } else {
          importedModules.add(moduleName);
          return match;
        }
      });
      // Remove lines that start with "global"
      const globalRegex = /^\s*global.*$/gm;
      code = code.replace(globalRegex, '');
      // remove any duplicated lines
      code = code.split('\n').filter((line, index, self) => self.indexOf(line) === index).join('\n');
      // if "get_arguments" block args is not declared
      if (code.includes('args') && !code.includes('args = []')) {
        code = 'args = []\n' + code;
      }
      return code;
    }

    workspaceRef.current.addChangeListener(() => {
      try {
        var code = generateTheCode();
        const state = Blockly.serialization.workspaces.save(workspaceRef.current);
        props.onWorkspaceChange(code, state);
      } catch (error) {
        console.error("Error in Blockly change listener:", error);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (props.args) {
      // Create XML for arguments
      let argsXML = '';
      props.args.forEach(arg => {
          argsXML += `<arg name="${arg}"></arg>`;
      });

      // Find the function block
      const blocks = workspaceRef.current.getAllBlocks();
      const functionBlock = blocks.find(block => block.type === 'procedures_defreturn');

      if (functionBlock) {
          // Get the mutation DOM of the function block
          const mutationDom = functionBlock.mutationToDom();

          // Update the mutation DOM with the new arguments
          mutationDom.innerHTML = argsXML;

          // Apply the updated mutation DOM to the function block
          functionBlock.domToMutation(mutationDom);
      }
    }
}, [props.args]);

  return (
    <div>
      <div>
        {!props.showBlocklyFullScreen &&
          <div style={{ background: _mode === "dark" ? "#2C3139" : "#0861AF", padding: "10px", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center", borderTopLeftRadius: "10px", borderTopRightRadius: "10px"  }}>
            <div><Translate content="dashboard.function.inputs.blockly.title" /></div>
            <Tooltip title={context.counterpart('common.button.goFullScreen')}>
                <FullscreenOutlinedIcon className='fullscreenbtn' onClick={props.handleFullScreen} style={{ height: "30px" }} />
            </Tooltip>
          </div>
        }
        <div ref={blocklyDivRef} style={{ height: height, width: '100%' }}></div>
      </div>
      <xml xmlns="http://www.w3.org/1999/xhtml" id="toolbox" style={{ display: 'none' }}>
        <category name="Logic" colour="#5C81A6">
          <block type="controls_if"></block>
          <block type="logic_compare"></block>
          <block type="logic_operation"></block>
          <block type="logic_negate"></block>
          <block type="logic_boolean"></block>
          <block type="logic_null"></block>
          <block type="logic_ternary"></block>
        </category>
        <category name="Loops" colour="#5BA55B">
          <block type="controls_repeat_ext"></block>
          <block type="controls_whileUntil"></block>
          <block type="controls_for"></block>
          <block type="controls_flow_statements"></block>
        </category>
        <category name="Math" colour="#5B67A5">
          <block type="string_length"></block>
          <block type="math_number"></block>
          <block type="math_arithmetic"></block>
          <block type="math_single"></block>
          <block type="math_trig"></block>
          <block type="math_constant"></block>
          <block type="math_number_property"></block>
          <block type="math_round"></block>
          <block type="math_on_list"></block>
          <block type="math_modulo"></block>
          <block type="math_constrain"></block>
          <block type="math_random_int"></block>
        </category>
        <category name="Text" colour="#5BA58C">
          <block type="text"></block>
          <block type="text_join"></block>
          <block type="text_append"></block>
          <block type="text_length"></block>
          <block type="text_isEmpty"></block>
          <block type="text_indexOf"></block>
          <block type="text_charAt"></block>
          <block type="text_getSubstring"></block>
          <block type="text_changeCase"></block>
          <block type="text_trim"></block>
        </category>
        <category name="Lists" colour="#745BA5">
          <block type="lists_create_with"></block>
          <block type="lists_length"></block>
          <block type="append_value_to_list"></block>
        </category>
        <category name="Variables" custom="VARIABLE" colour="#A55B80">
          <block type="variables_get"></block>
          <block type="variables_set"></block>  
        </category>
        <category name="Environment" colour="#9F5B92">
          <block type="env"></block>
        </category>
        <category name="Functions" colour="#995BA5">
          <block type="procedures_defreturn">
            <field name="NAME">handle</field>
          </block>
          <block type="procedures_defnoreturn">
            <field name="NAME">handle</field>
          </block>
          <block type="procedures_callnoreturn"></block>
          <block type="procedures_callreturn"></block>
          <block type="async_function">handle</block>
          <block type="call_async_function"></block>
          <block type="await_block"></block>
        </category>
        <category name="HTTP" colour="#745BA5">
          <block type="http_request"></block>
          <block type="call_http_request"></block>
        </category>
        <category name="JSON" colour="#5B5BA5">
          <block type="object"></block>
          <block type="convert_object_to_json"></block>
          <block type="convert_json_to_object"></block>
          <block type="set_object_value"></block>
          <block type="get_object_value"></block>
        </category>
        <category name="FaaS" colour="#0860AF">
          <block type="call_serverless_function"></block>
          <block type="set_argument"></block>
          <block type="get_argument"></block>
          <block type="get_arguments"></block>
        </category>
        <category name="KV" colour="#A55B5B">
          <block type="storage_kv_create"></block>
          <block type="storage_kv_get"></block>
          <block type="storage_kv_update"></block>
          <block type="storage_kv_delete"></block>
        </category>
        <category name="Notifications" colour="#E67E22">
          <block type="send_email"></block>
          <block type="webhook_notification"></block>
          <block type="token_notification"></block>
        </category>
      </xml>
    </div>
  );
}

export default BlocklyWorkspace;
