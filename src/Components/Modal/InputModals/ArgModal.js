import React from "react";
import BaseModal from "./BaseModal";

const ArgModal = (props) => (
    <BaseModal
        {...props}
        inputs={[
            { key: 'value', label: 'dashboard.function.inputs.args.placeholder' }
        ]}
        onSave={(index, value) => props.onClick(index, value)}
    />
);

export default ArgModal;
