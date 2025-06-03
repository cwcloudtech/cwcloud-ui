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
        const apiVersion = process.env.REACT_APP_APIVERSION || 'v1';
        var url = `${apiHost}/${apiVersion}/faas/invocation`;
        console.log(`url=${url}, apiVersion=${apiVersion}`)
        var syncUrlAddition = executionType === 'sync' ? '/sync' : '';
        var callFunctionId = generateUUID().replace(/-/g, '_');
        var headers = `{"accept": "application/json", "Content-Type": "application/json", "{{ user_auth_key }}" : "{{ user_auth_value }}" }`;
        var body = `{"content": {"function_id": ${functionId}, "args": ${args}} }`;
        var nested_func_url_name = `_${callFunctionId}_url`;
        var nested_func_headers_name = `_${callFunctionId}_headers`;
        var nested_func_body_name = `_${callFunctionId}_body`;
        var nested_func_request_name = `_${callFunctionId}_r`;
        var request = `requests.post(${nested_func_url_name}, headers=${nested_func_headers_name}, json=${nested_func_body_name})`;
        var resultVariable = pythonGenerator.valueToCode(block, 'RESULT_VAR', PY_Order.MEMBER) || '';
        var resultLine = resultVariable ? `${resultVariable} = _${callFunctionId}()` : `_${callFunctionId}()`;
        return `def _${callFunctionId}():\n`
                + `  ${nested_func_url_name} = "${url}${syncUrlAddition}"\n`
                + `  ${nested_func_headers_name} = ${headers}\n`
                + `  ${nested_func_body_name} = ${body}\n`
                + `  ${nested_func_request_name} = ${request}\n`
                + `  return cwcloud_parse_response(${nested_func_request_name})\n`
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

    // Update the Python generator for the "env" block
    pythonGenerator['env'] = function (block) {
        var key = block.getFieldValue('KEY');
        return [`"{{ env['${key}'] }}"`, PY_Order.MEMBER];
    };   
    
    // Update the Python generator for the "storage_kv_create" block
    pythonGenerator['storage_kv_create'] = function (block) {
        var key = pythonGenerator.valueToCode(block, 'KEY', PY_Order.MEMBER) || '""';
        var payload = pythonGenerator.valueToCode(block, 'PAYLOAD', PY_Order.MEMBER) || '{}';
        var ttl = pythonGenerator.valueToCode(block, 'TTL', PY_Order.MEMBER) || 'None';
        var resultVariable = pythonGenerator.valueToCode(block, 'RESULT_VAR', PY_Order.MEMBER) || '';
        
        const apiHost = process.env.REACT_APP_APIURL;
        const apiVersion = process.env.REACT_APP_APIVERSION || 'v1';
        var url = `${apiHost}/${apiVersion}/storage/kv`;
        console.log(`url=${url}, apiVersion=${apiVersion}`);
        var operationId = generateUUID().replace(/-/g, '_');
        var funcName = `_kv_create_${operationId}`;
        var reqUrlVar = `${funcName}_url`;
        var reqHeadersVar = `${funcName}_headers`;
        var reqBodyVar = `${funcName}_body`;
        var reqVar = `${funcName}_r`;
        
        var headers = `{"accept": "application/json", "Content-Type": "application/json", "{{ user_auth_key }}" : "{{ user_auth_value }}" }`;
        var body = `{"key": ${key}, "payload": ${payload}, "ttl": ${ttl}}`;
        var request = `requests.post(${reqUrlVar}, headers=${reqHeadersVar}, json=${reqBodyVar})`;
        
        var resultLine = resultVariable ? `${resultVariable} = ${funcName}()` : `${funcName}()`;
        
        return `def ${funcName}():\n`
                + `  ${reqUrlVar} = "${url}"\n`
                + `  ${reqHeadersVar} = ${headers}\n`
                + `  ${reqBodyVar} = ${body}\n`
                + `  ${reqVar} = ${request}\n`
                + `  return cwcloud_parse_response(${reqVar})\n`
                + `\n${resultLine}\n`;
    };

    // Update the Python generator for the "storage_kv_get" block
    pythonGenerator['storage_kv_get'] = function (block) {
        var key = pythonGenerator.valueToCode(block, 'KEY', PY_Order.MEMBER) || '""';
        var resultVariable = pythonGenerator.valueToCode(block, 'RESULT_VAR', PY_Order.MEMBER) || '';
        
        const apiHost = process.env.REACT_APP_APIURL;
        const apiVersion = process.env.REACT_APP_APIVERSION || 'v1';
        var url = `${apiHost}/${apiVersion}/storage/kv/`;
        console.log(`url=${url}, apiVersion=${apiVersion}`);
        
        var operationId = generateUUID().replace(/-/g, '_');
        var funcName = `_kv_get_${operationId}`;
        var reqUrlVar = `${funcName}_url`;
        var reqHeadersVar = `${funcName}_headers`;
        var reqVar = `${funcName}_r`;
        
        var headers = `{"accept": "application/json", "{{ user_auth_key }}" : "{{ user_auth_value }}" }`;
        var request = `requests.get(${reqUrlVar}, headers=${reqHeadersVar})`;
        
        var resultLine = resultVariable ? `${resultVariable} = ${funcName}()` : `${funcName}()`;
        
        return `def ${funcName}():\n`
                + `  ${reqUrlVar} = "${url}" + str(${key})\n`
                + `  ${reqHeadersVar} = ${headers}\n`
                + `  ${reqVar} = ${request}\n`
                + `  return cwcloud_parse_response(${reqVar})\n`
                + `\n${resultLine}\n`;
    };

    // Update the Python generator for the "storage_kv_update" block
    pythonGenerator['storage_kv_update'] = function (block) {
        var key = pythonGenerator.valueToCode(block, 'KEY', PY_Order.MEMBER) || '""';
        var payload = pythonGenerator.valueToCode(block, 'PAYLOAD', PY_Order.MEMBER) || '{}';
        var ttl = pythonGenerator.valueToCode(block, 'TTL', PY_Order.MEMBER) || 'None';
        var resultVariable = pythonGenerator.valueToCode(block, 'RESULT_VAR', PY_Order.MEMBER) || '';
        
        const apiHost = process.env.REACT_APP_APIURL;
        const apiVersion = process.env.REACT_APP_APIVERSION || 'v1';
        var url = `${apiHost}/${apiVersion}/storage/kv/`;
        console.log(`url=${url}, apiVersion=${apiVersion}`);
        
        var operationId = generateUUID().replace(/-/g, '_');
        var funcName = `_kv_update_${operationId}`;
        var reqUrlVar = `${funcName}_url`;
        var reqHeadersVar = `${funcName}_headers`;
        var reqBodyVar = `${funcName}_body`;
        var reqVar = `${funcName}_r`;
        
        var headers = `{"accept": "application/json", "Content-Type": "application/json", "{{ user_auth_key }}" : "{{ user_auth_value }}" }`;
        var body = `{"payload": ${payload}, "ttl": ${ttl}}`;
        var request = `requests.put(${reqUrlVar}, headers=${reqHeadersVar}, json=${reqBodyVar})`;
        
        var resultLine = resultVariable ? `${resultVariable} = ${funcName}()` : `${funcName}()`;
        
        return `def ${funcName}():\n`
                + `  ${reqUrlVar} = "${url}" + str(${key})\n`
                + `  ${reqHeadersVar} = ${headers}\n`
                + `  ${reqBodyVar} = ${body}\n`
                + `  ${reqVar} = ${request}\n`
                + `  return cwcloud_parse_response(${reqVar})\n`
                + `\n${resultLine}\n`;
    };

    // Update the Python generator for the "storage_kv_delete" block
    pythonGenerator['storage_kv_delete'] = function (block) {
        var key = pythonGenerator.valueToCode(block, 'KEY', PY_Order.MEMBER) || '""';
        var resultVariable = pythonGenerator.valueToCode(block, 'RESULT_VAR', PY_Order.MEMBER) || '';
        
        const apiHost = process.env.REACT_APP_APIURL;
        const apiVersion = process.env.REACT_APP_APIVERSION || 'v1';
        var url = `${apiHost}/${apiVersion}/storage/kv/`;
        console.log(`url=${url}, apiVersion=${apiVersion}`);
        
        var operationId = generateUUID().replace(/-/g, '_');
        var funcName = `_kv_delete_${operationId}`;
        var reqUrlVar = `${funcName}_url`;
        var reqHeadersVar = `${funcName}_headers`;
        var reqVar = `${funcName}_r`;
        
        var headers = `{"accept": "application/json", "{{ user_auth_key }}" : "{{ user_auth_value }}" }`;
        var request = `requests.delete(${reqUrlVar}, headers=${reqHeadersVar})`;
        
        var resultLine = resultVariable ? `${resultVariable} = ${funcName}()` : `${funcName}()`;
        
        return `def ${funcName}():\n`
                + `  ${reqUrlVar} = "${url}" + str(${key})\n`
                + `  ${reqHeadersVar} = ${headers}\n`
                + `  ${reqVar} = ${request}\n`
                + `  return cwcloud_parse_response(${reqVar})\n`
                + `\n${resultLine}\n`;
    };

    // Update the Python generator for the "send_email" block
    pythonGenerator['send_email'] = function (block) {
        var from = pythonGenerator.valueToCode(block, 'FROM', PY_Order.MEMBER) || '""';
        var to = pythonGenerator.valueToCode(block, 'TO', PY_Order.MEMBER) || '""';
        var cc = pythonGenerator.valueToCode(block, 'CC', PY_Order.MEMBER) || 'None';
        var bcc = pythonGenerator.valueToCode(block, 'BCC', PY_Order.MEMBER) || 'None';
        var subject = pythonGenerator.valueToCode(block, 'SUBJECT', PY_Order.MEMBER) || '""';
        var content = pythonGenerator.valueToCode(block, 'CONTENT', PY_Order.MEMBER) || '""';
        var resultVariable = pythonGenerator.valueToCode(block, 'RESULT_VAR', PY_Order.MEMBER) || '';
        
        const apiHost = process.env.REACT_APP_APIURL;
        const apiVersion = process.env.REACT_APP_APIVERSION || 'v1';
        var url = `${apiHost}/${apiVersion}/email`;
        console.log(`url=${url}, apiVersion=${apiVersion}`);
        
        var operationId = generateUUID().replace(/-/g, '_');
        var funcName = `_send_email_${operationId}`;
        var reqUrlVar = `${funcName}_url`;
        var reqHeadersVar = `${funcName}_headers`;
        var reqBodyVar = `${funcName}_body`;
        var reqVar = `${funcName}_r`;
        
        var headers = `{"accept": "application/json", "Content-Type": "application/json", "{{ user_auth_key }}" : "{{ user_auth_value }}" }`;
        var bodyParts = [
            `"from": ${from}`,
            `"to": ${to}`,
            `"subject": ${subject}`,
            `"content": ${content}`
        ];
        if (cc !== 'None') bodyParts.push(`"cc": ${cc}`);
        if (bcc !== 'None') bodyParts.push(`"bcc": ${bcc}`);
        var body = `{${bodyParts.join(', ')}}`;
        
        var request = `requests.post(${reqUrlVar}, headers=${reqHeadersVar}, json=${reqBodyVar})`;
        var resultLine = resultVariable ? `${resultVariable} = ${funcName}()` : `${funcName}()`;
        
        return `def ${funcName}():\n`
                + `  ${reqUrlVar} = "${url}"\n`
                + `  ${reqHeadersVar} = ${headers}\n`
                + `  ${reqBodyVar} = ${body}\n`
                + `  ${reqVar} = ${request}\n`
                + `  return cwcloud_parse_response(${reqVar})\n`
                + `\n${resultLine}\n`;
    };

    // Update the Python generator for the "webhook_notification" block
    pythonGenerator['webhook_notification'] = function(block) {
        const platform = block.getFieldValue('PLATFORM');
        const webhookUrl = pythonGenerator.valueToCode(block, 'WEBHOOK_URL', PY_Order.MEMBER) || "''";
        const message = pythonGenerator.valueToCode(block, 'MESSAGE', PY_Order.MEMBER) || "''";
        const resultVariable = pythonGenerator.valueToCode(block, 'RESULT_VAR', PY_Order.MEMBER) || '';
        
        const uniqueId = generateUUID().replace(/-/g, '_');
        const funcName = `_webhook_${uniqueId}`;
        const urlVar = `${funcName}_url`;
        const headersVar = `${funcName}_headers`;
        const dataVar = `${funcName}_data`;
        const reqVar = `${funcName}_r`;
        
        let code = `def ${funcName}():\n`;
        code += `  ${urlVar} = ${webhookUrl}\n`;
        code += `  ${headersVar} = {"Content-Type": "application/json"}\n`;
        
        if (platform === 'SLACK') {
        code += `  data_payload = {"text": ${message}}\n`;
        code += `  ${dataVar} = data_payload\n`;
        code += `  ${reqVar} = requests.post(${urlVar}, headers=${headersVar}, json=${dataVar})\n`;
        code += `  return {"status": "success" if ${reqVar}.status_code == 200 else "error", "response": ${reqVar}.text}\n`;
        } else {
        const botName = pythonGenerator.valueToCode(block, 'BOT_NAME', PY_Order.MEMBER) || '"Discord Bot"';
        const avatarUrl = pythonGenerator.valueToCode(block, 'AVATAR_URL', PY_Order.MEMBER) || 'None';
        
        code += `  data_payload = {"username": ${botName}, "content": ${message}}\n`;
        code += `  # Handle avatar URL if provided\n`;
        code += `  avatar_url_value = ${avatarUrl}\n`;
        code += `  if avatar_url_value != None and avatar_url_value != "":\n`;
        code += `    data_payload["avatar_url"] = avatar_url_value\n`;
        code += `  ${dataVar} = data_payload\n`;
        code += `  ${reqVar} = requests.post(${urlVar}, headers=${headersVar}, json=${dataVar})\n`;
        code += `  return {"status": "success" if ${reqVar}.status_code == 204 else "error", "response": ${reqVar}.text}\n`;
        }

        const resultLine = resultVariable ? `${resultVariable} = ${funcName}()` : `${funcName}()`;
        code += `\n${resultLine}\n`;
        
        return code;
    };
  
    // Update the Python generator for the "token_notification" block
    pythonGenerator['token_notification'] = function(block) {
        const platform = block.getFieldValue('PLATFORM');
        const token = pythonGenerator.valueToCode(block, 'TOKEN', PY_Order.MEMBER) || "''";
        const channel = pythonGenerator.valueToCode(block, 'CHANNEL', PY_Order.MEMBER) || "''";
        const message = pythonGenerator.valueToCode(block, 'MESSAGE', PY_Order.MEMBER) || "''";
        const resultVariable = pythonGenerator.valueToCode(block, 'RESULT_VAR', PY_Order.MEMBER) || '';
        
        const uniqueId = generateUUID().replace(/-/g, '_');
        const funcName = `_token_notification_${uniqueId}`;
        const reqVar = `${funcName}_r`;
        
        let code = `def ${funcName}():\n`;
        
        if (platform === 'SLACK') {
        const slackApiUrl = 'https://slack.com/api/chat.postMessage';
        code += `  slack_data = {\n`;
        code += `    'text': ${message},\n`;
        code += `    'channel': ${channel}\n`;
        code += `  }\n`;
        code += `  ${reqVar} = requests.post("${slackApiUrl}", headers={'Authorization': f"Bearer {${token}}"}, json=slack_data)\n`;
        code += `  return {"status": "success" if ${reqVar}.status_code == 200 else "error", "response": ${reqVar}.text}\n`;
        } else if (platform === 'DISCORD') {
        code += `  token = ${token}\n`;
        code += `  channel = ${channel}\n`;
        code += `  url = f"https://discord.com/api/v10/channels/{channel}/messages"\n`;
        code += `  headers = {"Authorization": f"Bot {token}", "Content-Type": "application/json"}\n`;
        code += `  data_payload = {"content": ${message}}\n`;
        code += `  ${reqVar} = requests.post(url, headers=headers, json=data_payload)\n`;
        code += `  return {"status": "success" if ${reqVar}.status_code in [200, 201, 204] else "error", "response": ${reqVar}.text}\n`;
        } else if (platform === 'TELEGRAM') {
        code += `  url = f"https://api.telegram.org/bot{${token}}/sendMessage"\n`;
        code += `  data_payload = {"chat_id": ${channel}, "text": ${message}}\n`;
        code += `  ${reqVar} = requests.post(url, json=data_payload)\n`;
        code += `  return {"status": "success" if ${reqVar}.status_code == 200 else "error", "response": ${reqVar}.text}\n`;
        }

        const resultLine = resultVariable ? `${resultVariable} = ${funcName}()` : `${funcName}()`;
        code += `\n${resultLine}\n`;
        
        return code;
    };
}
