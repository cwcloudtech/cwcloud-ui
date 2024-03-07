import Blockly from 'blockly';
import generateUUID from '../../utils/uuid';
import { Order as PY_Order, pythonGenerator } from 'blockly/python';

export const customizePythonGenerator = () => {
    // Update the Python generator for the "procedures_defreturn" block
    pythonGenerator['procedures_defreturn'] = function (block) {
        var funcName = pythonGenerator.variableDB_.getName(
            block.getFieldValue('NAME'),
            Blockly.Procedures.NAME_TYPE
        );
        var branch = pythonGenerator.statementToCode(block, 'STACK');
        var returnValue = pythonGenerator.valueToCode(block, 'RETURN', PY_Order.FUNCTION_CALL) || 'None';

        // Remove the global declaration line if it exists
        branch = branch.replace(/^\s*global .*$/m, '');

        var code = `def ${funcName}():\n${branch}\nreturn ${returnValue}`;
        code = pythonGenerator.scrub_(block, code);
        pythonGenerator.definitions_[funcName] = code;

        return null;
    };

    // Update the Python generator for the "string_length" block
    pythonGenerator['string_length'] = function (block) {
        var value = pythonGenerator.valueToCode(block, 'VALUE', PY_Order.FUNCTION_CALL) || "''";
        return [value + '.length', PY_Order.MEMBER];
    };

    // Update the Python generator for the "append_value_to_list" block
    pythonGenerator['append_value_to_list'] = function (block) {
        var list = pythonGenerator.valueToCode(block, 'LIST', PY_Order.MEMBER) || '';
        var value = pythonGenerator.valueToCode(block, 'VALUE', PY_Order.MEMBER) || '';
        return `${list} = []\n${list}.append(${value})\n`;
    };

    // Update the Python generator for the "async_function" block
    pythonGenerator['async_function'] = function (block) {
        var asyncKeyword = block.getFieldValue('ASYNC') === 'async' ? 'async ' : '';
        var name = block.getFieldValue('NAME') || 'handle';
        var params = pythonGenerator.valueToCode(block, 'PARAMS', PY_Order.FUNCTION_CALL) || '';
        var actions = pythonGenerator.statementToCode(block, 'DO');
        var returnStatement = pythonGenerator.valueToCode(block, 'RETURN', PY_Order.FUNCTION_CALL) || 'None';

        // Adjusted the indentation for actions
        actions = actions ? Blockly.Python.prefixLines(actions, '  ') : '';

        return `${asyncKeyword}def ${name}(${params}):\n${actions}\n  return ${returnStatement}\n`;
    };

    // Update the Python generator for the "call_async_function" block
    pythonGenerator['call_async_function'] = function (block) {
        var functionName = block.getFieldValue('FUNCTION_NAME') || 'handle';
        return [`await ${functionName}()`, PY_Order.FUNCTION_CALL];
    };
   
    // Update the Python generator for the "await_block" block
    pythonGenerator['await_block'] = function (block) {
        var value = pythonGenerator.valueToCode(block, 'VALUE', PY_Order.FUNCTION_CALL) || '';
        return [`await ${value}`, PY_Order.MEMBER];
    };

    const get_request = (requestType, url, headers, body) => {
        // remove single quotes from the url if they exist
        url = url.replace(/'/g, '');
        var request = `requests.${requestType.toLowerCase()}("${url}"`;
        if (headers) {
            request += `, headers=${headers}`;
        }
        if (['POST', 'PUT', 'PATCH'].includes(requestType) && body) {
            request += `, data=${body}`;
        }
        request += ')';
        return request;
    };

    // Update the Python generator for the "http_request" block
    pythonGenerator['http_request'] = function (block) {
        var requestName = block.getFieldValue('REQUEST_NAME');
        var requestType = block.getFieldValue('REQUEST_TYPE');
        var url = pythonGenerator.valueToCode(block, 'URL', PY_Order.MEMBER) || '';
        var headers = pythonGenerator.valueToCode(block, 'HEADERS', PY_Order.MEMBER) || '';
        var body = pythonGenerator.valueToCode(block, 'DATA', PY_Order.MEMBER) || '';
        var request = get_request(requestType, url, headers, body);
        var resultVariable = pythonGenerator.valueToCode(block, 'RESULT_VAR', PY_Order.MEMBER) || '';
        var resultLine = resultVariable ? `${resultVariable} = ${requestName}()` : `${requestName}()`;
        return `def ${requestName}():\n`
                + `  r = ${request}\n`
                + `  return cwcloud_parse_response(r)\n`
                + `\n${resultLine}\n`;
    };

    // Update the Python generator for the "call_http_request" block
    pythonGenerator['call_http_request'] = function (block) {
        var requestName = block.getFieldValue('REQUEST_NAME');
        return [`${requestName}()`, PY_Order.MEMBER];
    };  

    // Update the Python generator for the "call_serverless_function" block
    pythonGenerator['call_serverless_function'] = function (block) {
        var functionId = pythonGenerator.valueToCode(block, 'FUNCTION_ID', PY_Order.MEMBER) || '';
        var executionType = block.getFieldValue('EXECUTION_TYPE') || '';
        var args = pythonGenerator.valueToCode(block, 'ARGUMENTS', PY_Order.MEMBER) || '[]';
        const apiHost = process.env.REACT_APP_APIURL;
        const apiVersion = process.env.REACT_APP_APIVERSION;
        var url = `${apiHost}/${apiVersion}/faas/invocation`;
        var syncUrlAddition = executionType === 'sync' ? '/sync' : '';
        var headers = `{"accept": "application/json", "Content-Type": "application/json", "{{ user_auth_key }}" : "{{ user_auth_value }}" }`;
        var body = `{ 'content': {"function_id": ${functionId},"args": ${args}} }`;
        var request = `requests.post(url, headers=headers, json=body)`;
        var resultVariable = pythonGenerator.valueToCode(block, 'RESULT_VAR', PY_Order.MEMBER) || '';
        var callFunctionId = "_" + generateUUID().replace(/-/g, '_');
        var resultLine = resultVariable ? `${resultVariable} = ${callFunctionId}()` : `${callFunctionId}()`;
        return `def ${callFunctionId}():\n`
                + `  url = "${url}${syncUrlAddition}"\n`
                + `  headers = ${headers}\n`
                + `  body = ${body}\n`
                + `  r = ${request}\n`
                + `  return cwcloud_parse_response(r)\n`
                + `\n${resultLine}\n`;
    }

    // Update the Python generator for the "set_argument" block
    pythonGenerator['set_argument'] = function (block) {
        var argumentKey = block.getFieldValue('ARG_KEY') || '';
        var argumentValue = pythonGenerator.valueToCode(block, 'ARG_VALUE', PY_Order.MEMBER) || '';
        return  `args = []\n`
                + `faas_arg_${argumentKey} = {`
                    + `"key": "${argumentKey}",`
                    + `"value": ${argumentValue}`
                + `}\n`
                + `args.append(faas_arg_${argumentKey})\n`;
    };

    // Update the Python generator for the "get_argument" block
    pythonGenerator['get_argument'] = function (block) {
        var argumentKey = block.getFieldValue('ARG_KEY') || '';
        return [`faas_arg_${argumentKey}`, PY_Order.MEMBER];
    };

    // Update the Python generator for the "get_arguments" block
    pythonGenerator['get_arguments'] = function (block) {
        return [`args`, PY_Order.MEMBER];
    };

    // Update the Python generator for the "object" block
    pythonGenerator['object'] = function (block) {
        var statements = pythonGenerator.statementToCode(block, 'PROPERTIES');
        return [`{${statements}}`, PY_Order.MEMBER];
    };

    // Update the Python generator for the "convert_object_to_json" block
    pythonGenerator['convert_object_to_json'] = function (block) {
        var object = pythonGenerator.valueToCode(block, 'OBJECT', PY_Order.MEMBER) || '';
        return [`json.dumps(${object}).encode('utf-8')`, PY_Order.MEMBER];
    };

    // Update the Python generator for the "convert_json_to_object" block
    pythonGenerator['convert_json_to_object'] = function (block) {
        var json = pythonGenerator.valueToCode(block, 'JSON', PY_Order.MEMBER) || '';
        return [`json.loads(${json})`, PY_Order.MEMBER];
    };

    // Update the Python generator for the "get_object_value" block
    pythonGenerator['get_object_value'] = function (block) {
        var object = pythonGenerator.valueToCode(block, 'OBJECT', PY_Order.MEMBER) || '';
        var key = pythonGenerator.valueToCode(block, 'KEY', PY_Order.MEMBER) || '';
        return [`${object}.get(${key})`, PY_Order.MEMBER];
    };

    // Update the Python generator for the "set_object_value" block
    pythonGenerator['set_object_value'] = function (block) {
        var object = pythonGenerator.valueToCode(block, 'OBJECT', PY_Order.MEMBER) || '';
        var key = pythonGenerator.valueToCode(block, 'KEY', PY_Order.MEMBER) || '';
        var newValue = pythonGenerator.valueToCode(block, 'VALUE', PY_Order.MEMBER) || ''; // Updated 'NEW_VALUE' to 'VALUE'
        return `${object} = {}\n${object}[${key}] = ${newValue};\n`; // Added semicolon to end the statement
    };

    pythonGenerator['env'] = function (block) {
        var key = block.getFieldValue('KEY');
        return [`"{{ env['${key}'] }}"`, PY_Order.MEMBER];
    };      
}
