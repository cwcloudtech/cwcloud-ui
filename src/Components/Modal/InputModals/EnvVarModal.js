import React from "react";
import BaseModal from "./BaseModal";

const EnvModal = (props) => (
    <BaseModal
        {...props}
        inputs={[
            { key: 'name', label: 'dashboard.function.inputs.env_vars.envVarName' },
            { key: 'value', label: 'dashboard.function.inputs.env_vars.envVarValue' }
        ]}
        onSave={(index, name, value) => props.onClick(index, name, value)}
    />
);

export default EnvModal;
