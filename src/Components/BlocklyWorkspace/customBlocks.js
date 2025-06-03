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
        .appendField(new Blockly.FieldDropdown([["async", "async"], ["sync", "sync"]]), "ASYNC")
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
      const dropdown = new Blockly.FieldDropdown([
        ['GET', 'GET'],
        ['POST', 'POST'],
        ['PUT', 'PUT'],
        ['PATCH', 'PATCH'],
        ['DELETE', 'DELETE']
      ]);
      
      this.appendValueInput('URL')
        .setCheck('String')
        .appendField('make a')
        .appendField(dropdown, 'REQUEST_TYPE')
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

      this.setOnChange(function(event) {
        if (event.type === Blockly.Events.BLOCK_CHANGE && 
            event.element === 'field' && 
            event.name === 'REQUEST_TYPE') {
          this.updateShape_(event.newValue);
        }
      });
    },
    
    updateShape_: function (requestType) {
      const dataInput = this.getInput('DATA');
      if (['POST', 'PUT', 'PATCH'].includes(requestType)) {
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
        .appendField('serverless function')
      this.appendValueInput('FUNCTION_ID') 
        .setAlign(Blockly.ALIGN_LEFT)
        .appendField('with ID');
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
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
    }
  };

  Blockly.Blocks['get_argument'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('argumemnt with key')
        .appendField(new Blockly.FieldTextInput('key'), 'ARG_KEY');
      this.setOutput(true, 'String');
      this.setColour("#0860AF");
      this.setTooltip('Get the value of an argument with a given key');
    }
  };

  Blockly.Blocks['get_arguments'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('arguments');
      this.setOutput(true, 'String');
      this.setColour("#0860AF");
      this.setTooltip('Get the value of an arguments list');
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

Blockly.Blocks['env'] = {
  init: function () {
    this.appendDummyInput()
      .appendField('env')
      .appendField(new Blockly.FieldTextInput('key'), 'KEY');
    this.setOutput(true, null);
    this.setColour("#9F5B92");
    this.setTooltip('Represents an environment variable.');
  }
};

Blockly.Blocks['storage_kv_create'] = {
  init: function () {
    this.appendDummyInput()
      .appendField('create kv entry');
    this.appendValueInput('KEY')
      .setCheck('String')
      .setAlign(Blockly.ALIGN_LEFT)
      .appendField('with key');
    this.appendValueInput('PAYLOAD')
      .setCheck('Object')
      .setAlign(Blockly.ALIGN_LEFT)
      .appendField('and payload');
    this.appendValueInput('TTL')
      .setCheck('Number')
      .setAlign(Blockly.ALIGN_LEFT)
      .appendField('with TTL (hours, optional)');
    this.appendValueInput('RESULT_VAR')
      .setCheck('String')
      .setAlign(Blockly.ALIGN_LEFT)
      .appendField('set result in variable');
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#A55B5B");
    this.setTooltip('Creates a new storage key-value pair');
  }
};

Blockly.Blocks['storage_kv_get'] = {
  init: function () {
    this.appendValueInput('KEY')
      .setCheck('String')
      .appendField('get value for key');
    this.appendValueInput('RESULT_VAR')
      .setCheck('String')
      .setAlign(Blockly.ALIGN_LEFT)
      .appendField('set result in variable');
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#A55B5B");
    this.setTooltip('Gets a storage value by its key');
  }
};

Blockly.Blocks['storage_kv_update'] = {
  init: function () {
    this.appendValueInput('KEY')
      .setCheck('String')
      .appendField('update entry with key');
    this.appendValueInput('PAYLOAD')
      .setCheck('Object')
      .setAlign(Blockly.ALIGN_LEFT)
      .appendField('with payload');
    this.appendValueInput('TTL')
      .setCheck('Number')
      .setAlign(Blockly.ALIGN_LEFT)
      .appendField('with TTL (hours, optional)');
    this.appendValueInput('RESULT_VAR')
      .setCheck('String')
      .setAlign(Blockly.ALIGN_LEFT)
      .appendField('set result in variable');
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#A55B5B");
    this.setTooltip('Updates an existing storage key-value pair');
  }
};

  Blockly.Blocks['storage_kv_delete'] = {
    init: function () {
      this.appendValueInput('KEY')
        .setCheck('String')
        .appendField('delete entry with key');
      this.appendValueInput('RESULT_VAR')
        .setCheck('String')
        .setAlign(Blockly.ALIGN_LEFT)
        .appendField('set result in variable');
      this.setInputsInline(false);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour("#A55B5B");
      this.setTooltip('Deletes a storage key-value pair');
    }
  };

  Blockly.Blocks['send_email'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('send email');
      this.appendValueInput('FROM')
        .setCheck('String')
        .setAlign(Blockly.ALIGN_LEFT)
        .appendField('from');
      this.appendValueInput('TO')
        .setCheck('String')
        .setAlign(Blockly.ALIGN_LEFT)
        .appendField('to');
      this.appendValueInput('CC')
        .setCheck('String')
        .setAlign(Blockly.ALIGN_LEFT)
        .appendField('cc (optional)');
      this.appendValueInput('BCC')
        .setCheck('String')
        .setAlign(Blockly.ALIGN_LEFT)
        .appendField('bcc (optional)');
      this.appendValueInput('SUBJECT')
        .setCheck('String')
        .setAlign(Blockly.ALIGN_LEFT)
        .appendField('subject');
      this.appendValueInput('CONTENT')
        .setCheck('String')
        .setAlign(Blockly.ALIGN_LEFT)
        .appendField('content');
      this.appendValueInput('RESULT_VAR')
        .setCheck('String')
        .setAlign(Blockly.ALIGN_LEFT)
        .appendField('set result in variable');
      this.setInputsInline(false);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour("#E67E22");
      this.setTooltip('Sends an email to the specified recipient');
    }
  };

  Blockly.Blocks['webhook_notification'] = {
    init: function() {
      this.appendDummyInput()
        .appendField("Send message to")
        .appendField(new Blockly.FieldDropdown([
          ["Slack", "SLACK"],
          ["Discord", "DISCORD"]
        ]), "PLATFORM");
      this.appendValueInput('WEBHOOK_URL')
        .setCheck('String')
        .setAlign(Blockly.ALIGN_LEFT)
        .appendField('with webhook URL');
      this.appendValueInput('MESSAGE')
        .setCheck('String')
        .setAlign(Blockly.ALIGN_LEFT)
        .appendField('set message content');
      this.appendValueInput('BOT_NAME')
        .setCheck('String')
        .setAlign(Blockly.ALIGN_LEFT)
        .appendField('set bot name (optional)');
      this.appendValueInput('AVATAR_URL')
        .setCheck('String')
        .setAlign(Blockly.ALIGN_LEFT)
        .appendField('set avatar URL (optional)');
      this.appendValueInput('RESULT_VAR')
        .setCheck('String')
        .setAlign(Blockly.ALIGN_LEFT)
        .appendField('set result in variable');
      this.setInputsInline(false);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour("#c47538");
      this.setTooltip('Sends a message to Slack or Discord using a webhook URL.');

      const thisBlock = this;
      this.updateShape_ = function() {
        const platform = thisBlock.getFieldValue('PLATFORM');
        const isDiscord = platform === 'DISCORD';

        if (isDiscord) {
          if (!thisBlock.getInput('BOT_NAME')) {
            thisBlock.appendValueInput('BOT_NAME')
              .setCheck('String')
              .setAlign(Blockly.ALIGN_LEFT)
              .appendField('set bot name (optional)');
          }
        } else {
          if (thisBlock.getInput('BOT_NAME')) {
            thisBlock.removeInput('BOT_NAME');
          }
        }

        if (isDiscord) {
          if (!thisBlock.getInput('AVATAR_URL')) {
            thisBlock.appendValueInput('AVATAR_URL')
              .setCheck('String')
              .setAlign(Blockly.ALIGN_LEFT)
              .appendField('avatar URL (optional)');
          }
        } else {
          if (thisBlock.getInput('AVATAR_URL')) {
            thisBlock.removeInput('AVATAR_URL');
          }
        }
      };

      this.setOnChange(function() {
        this.updateShape_();
      });
      
      this.updateShape_();
    },
    
    mutationToDom: function() {
      const container = document.createElement('mutation');
      container.setAttribute('platform', this.getFieldValue('PLATFORM'));
      return container;
    },
    
    domToMutation: function(xmlElement) {
      const platform = xmlElement.getAttribute('platform');
      if (platform) {
        this.getField('PLATFORM').setValue(platform);
      }
      if (this.updateShape_) {
        this.updateShape_();
      }
    }
  };

  Blockly.Blocks['token_notification'] = {
    init: function() {
      this.appendDummyInput()
        .appendField("Send message to")
        .appendField(new Blockly.FieldDropdown([
          ["Slack", "SLACK"],
          ["Discord", "DISCORD"],
          ["Telegram", "TELEGRAM"]
        ]), "PLATFORM");
      this.appendValueInput('TOKEN')
        .setCheck('String')
        .setAlign(Blockly.ALIGN_LEFT)
        .appendField('with bot token');
      this.appendValueInput('CHANNEL')
        .setCheck('String')
        .setAlign(Blockly.ALIGN_LEFT)
        .appendField('set channel (name, link, ID, or Chat ID)');
      this.appendValueInput('MESSAGE')
        .setCheck('String')
        .setAlign(Blockly.ALIGN_LEFT)
        .appendField('set message content');
      this.appendValueInput('RESULT_VAR')
        .setCheck('String')
        .setAlign(Blockly.ALIGN_LEFT)
        .appendField('set result in variable');
      this.setInputsInline(false);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour("#bf5c0b");
      this.setTooltip('Sends a message to Slack, Discord, or Telegram using a bot token.');
    },
    
    mutationToDom: function() {
      const container = document.createElement('mutation');
      container.setAttribute('platform', this.getFieldValue('PLATFORM'));
      return container;
    },
    
    domToMutation: function(xmlElement) {
      const platform = xmlElement.getAttribute('platform');
      if (platform) {
        this.getField('PLATFORM').setValue(platform);
      }
    }
  };
