import React from "react";
import BaseModal from "./BaseModal";

const SubdomainModal = (props) => (
    <BaseModal
        {...props}
        inputs={[
            { key: 'value', label: 'dashboard.addEnvironement.inputs.subdomains.placeholder' }
        ]}
        onSave={(index, value) => props.onClick(index, value)}
    />
);

export default SubdomainModal;
