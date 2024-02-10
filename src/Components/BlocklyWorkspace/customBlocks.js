import Blockly from 'blockly';

export const customizeBlocks = () => {
  Blockly.Blocks['string_length'] = {
    init: function () {
      this.appendValueInput('VALUE')
        .setCheck('String')
        .appendField('length of');
      this.setOutput(true, 'Number');
      this.setColour("#5B67A5");
      this.setTooltip('Returns number of letters in the provided text.');
      this.setHelpUrl('http://www.w3schools.com/jsref/jsref_length_string.asp');
    }
  };

  Blockly.Blocks['append_value_to_list'] = {
    init: function () {
      this.appendValueInput('VALUE')
        .setCheck(null) // Update the check type to the desired type (e.g., String, Number, etc.)
        .appendField('append value');
      this.appendValueInput('LIST')
        .setCheck('Array') // Set the check type to 'Array'
        .appendField('to list');
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour("745BA5");
      this.setTooltip('Appends a value to the end of a list.');
      this.setHelpUrl('https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push');
    }
  };

  Blockly.Blocks['async_function'] = {
    init: function () {
      this.appendValueInput('PARAMS')
        .setCheck(null)
        .appendField(new Blockly.FieldDropdown([["async", "async"], ["", ""]]), "ASYNC")
        .appendField('function');
      this.appendDummyInput()
        .appendField('named')
        .appendField(new Blockly.FieldTextInput('handle'), 'NAME');
      this.appendStatementInput('DO')
        .setCheck(null)
        .appendField('do');
      this.appendValueInput('RETURN')
        .setCheck(null)
        .appendField('return');
      this.setInputsInline(true, 'String');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour("#995BA5");
      this.setTooltip('Define an asynchronous function with actions before returning.');
      this.setHelpUrl('https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function');
    }
  };

  Blockly.Blocks['call_async_function'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('call async function named')
        .appendField(new Blockly.FieldTextInput('handle'), 'FUNCTION_NAME');
      this.setOutput(true, null);
      this.setColour("#995BA5");
      this.setTooltip('Call the previously defined asynchronous function.');
      this.setHelpUrl('https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function');
    }
  };

  Blockly.Blocks['await_block'] = {
    init: function () {
      this.appendValueInput('VALUE')
        .appendField('await');
      this.setOutput(true, null);
      this.setColour("#995BA5");
      this.setTooltip('Adds await before the given block.');
      this.setHelpUrl('https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await');
    }
  };

  Blockly.Blocks['http_request'] = {
    init: function () {
      this.appendValueInput('URL')
        .setCheck('String')
        .appendField('make a')
        .appendField(new Blockly.FieldDropdown([
          ['GET', 'GET'],
          ['POST', 'POST'],
          ['PUT', 'PUT'],
          ['PATCH', 'PATCH'],
          ['DELETE', 'DELETE']
        ], function (option) {
          this.getSourceBlock().updateShape_(option);
        }), 'REQUEST_TYPE')
        .appendField('request named')
        .appendField(new Blockly.FieldTextInput('request1'), 'REQUEST_NAME')
        .appendField('to');
      this.appendValueInput('HEADERS')
        .setCheck('Object')
        .setAlign(Blockly.ALIGN_LEFT)
        .appendField('with headers');
      this.appendValueInput('DATA')
        .setCheck('String')
        .setAlign(Blockly.ALIGN_LEFT)
        .appendField('with data');
      this.appendValueInput('RESULT_VAR')
        .setCheck('String')
        .setAlign(Blockly.ALIGN_LEFT)
        .appendField('set result in variable');
      this.setInputsInline(false); // Set to false for vertical arrangement
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour("#745BA5");
      this.setTooltip('Makes an HTTP request to the specified URL with the provided data, headers, and returns the response.');
      this.setHelpUrl('https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods');
    },
    updateShape_: function (option) {
      const dataInput = this.getInput('DATA');
      if (['POST', 'PUT', 'PATCH'].includes(option)) {
        if (!dataInput) {
          this.appendValueInput('DATA')
            .setCheck('String')
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField('with data');
        }
      } else {
        if (dataInput) {
          this.removeInput('DATA');
        }
      }
    }
  };

  Blockly.Blocks['call_http_request'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('call http_request named')
        .appendField(new Blockly.FieldTextInput('request1'), 'REQUEST_NAME');
      this.setOutput(true, null);
      this.setColour("#745BA5");
      this.setTooltip('Calls the http_request function.');
      this.setHelpUrl('https://example.com');
    }
  };

  Blockly.Blocks['call_serverless_function'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('call')
        .appendField(new Blockly.FieldDropdown([
          ['async', 'async'],
          ['sync', 'sync']
        ]), 'EXECUTION_TYPE')
        .appendField('serverless function with ID')
        .appendField(new Blockly.FieldTextInput('function_id'), 'FUNCTION_ID');
      this.appendValueInput('ARGUMENTS')
        .setAlign(Blockly.ALIGN_LEFT)
        .appendField('and arguments');
      this.appendValueInput('RESULT_VAR')
        .setCheck('String')
        .setAlign(Blockly.ALIGN_LEFT)
        .appendField('set result in variable');
      this.setInputsInline(false);
      this.setColour("#0860AF");
      this.setTooltip('Calls a serverless function you own with the given ID');
      this.setHelpUrl('https://example.com');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
    }
  };

  Blockly.Blocks['set_argument'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('set an argument with key')
        .appendField(new Blockly.FieldTextInput('key'), 'ARG_KEY');
      this.appendValueInput('ARG_VALUE')
        .setCheck('String')
        .setAlign(Blockly.ALIGN_LEFT)
        .appendField('and value');
      this.setInputsInline(false);
      this.setColour("#0860AF");
      this.setTooltip('Set an argument with a given name, key, and value');
      this.setHelpUrl('https://example.com');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
    }
  };

  Blockly.Blocks['get_argument'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('argument with key')
        .appendField(new Blockly.FieldTextInput('key'), 'ARG_KEY');
      this.setOutput(true, 'String');
      this.setColour("#0860AF");
      this.setTooltip('Get the value of an argument with a given key');
      this.setHelpUrl('https://example.com');
    }
  };

  Blockly.Blocks['get_arguments'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('arguments');
      this.setOutput(true, 'String');
      this.setColour("#0860AF");
      this.setTooltip('Get the value of an arguments list');
      this.setHelpUrl('https://example.com');
    }
  };  

  Blockly.Blocks['object'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('object');
      this.setInputsInline(true);
      this.setOutput(true, 'Object');
      this.setColour("5B5BA5");
      this.setTooltip('Creates an empty object.');
      this.setHelpUrl('https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON');
    }
  };

  Blockly.Blocks['convert_object_to_json'] = {
    init: function () {
      this.appendValueInput('OBJECT')
        .setCheck(null)
        .appendField('convert');
      this.appendDummyInput()
        .appendField('to JSON');
      this.setOutput(true, null);
      this.setColour("#5B5BA5");
      this.setTooltip('Converts the given variable to JSON format.');
      this.setHelpUrl('https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify');
    }
  };

  Blockly.Blocks['convert_json_to_object'] = {
    init: function () {
      this.appendValueInput('JSON')
        .setCheck(null)
        .appendField('convert');
      this.appendDummyInput()
        .appendField('to object');
      this.setOutput(true, null);
      this.setColour("#5B5BA5");
      this.setTooltip('Converts the given variable to JSON format.');
      this.setHelpUrl('https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify');
    }
  };

  Blockly.Blocks['get_object_value'] = {
    init: function () {
      this.appendValueInput('OBJECT')
        .setCheck('Object')
        .appendField('get value');
      this.appendValueInput('KEY')
        .setCheck('String')
        .appendField('from key');
      this.setInputsInline(true);
      this.setOutput(true, null);
      this.setColour("#5B5BA5");
      this.setTooltip('Gets the value from a specific key in a JSON object.');
      this.setHelpUrl('https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON');
    }
  };

  Blockly.Blocks['set_object_value'] = {
    init: function () {
      this.appendValueInput('OBJECT')
        .setCheck('Object')
        .appendField('set object');
      this.appendValueInput('KEY')
        .setCheck('String')
        .appendField('for key');
      this.appendValueInput('VALUE')
        .setCheck(null)
        .appendField('to value');
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour("#5B5BA5");
      this.setTooltip('Sets the value for a specific key in a JSON object.');
      this.setHelpUrl('https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON');
    }
  };
};
