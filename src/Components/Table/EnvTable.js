import React, { useState } from "react";
import GenericTable from "./GenericTable";
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import CheckIcon from '@mui/icons-material/Check';

const EnvTable = (props) => {
    const [envVarCopied, setEnvVarCopied] = useState(false);
    const [selectedVariableIndex, setSelectedVariableIndex] = useState(null);

    const handleCopyEnvVariableKey = (index) => {
        const selectedVariable = props.envVars[index];
        setSelectedVariableIndex(index);
        navigator.clipboard.writeText(`${selectedVariable.name}`);
        setEnvVarCopied(true);
        setTimeout(() => {
            setEnvVarCopied(false);
        }, 1000);
    };

    const columns = [
        { 
            header: "common.word.key", 
            accessor: (variable) => variable.name 
        },
        { 
            header: "common.word.value", 
            accessor: () => "****" 
        }
    ];

    const customActions = (index) => (
        <div onClick={() => handleCopyEnvVariableKey(index)} style={{ marginRight: '5px' }}>
            {envVarCopied && selectedVariableIndex === index 
                ? <CheckIcon className="whiteIcon" />
                : <ContentPasteIcon className="whiteIcon" />
            }
        </div>
    );

    return (
        <GenericTable
            title="dashboard.function.inputs.env_vars.title"
            addNewItem={props.addNewEnvVar}
            items={props.envVars}
            columns={columns}
            noItemsMessage="dashboard.function.inputs.env_vars.noEnvVars"
            editItem={props.editEnvVar}
            deleteItem={props.deleteEnvVar}
            customActions={customActions}
        />
    );
};

export default EnvTable;
