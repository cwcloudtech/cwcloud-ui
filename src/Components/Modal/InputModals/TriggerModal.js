import React from "react";
import BaseModal from "./BaseModal";

const TriggerModal = (props) => (
    <BaseModal
        {...props}
        inputs={[
            { key: 'value', label: 'dashboard.iot.inputs.triggers.triggerId.placeholder' }
        ]}
        onSave={(index, value) => props.onClick(index, value)}
    />
);

export default TriggerModal;
