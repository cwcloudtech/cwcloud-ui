import React from "react";
import BaseModal from "./BaseModal";

const HttpHeaderModal = (props) => (
    <BaseModal
        {...props}
        inputs={[
            { key: 'name', label: 'dashboard.monitor.inputs.headerName.placeholder' },
            { key: 'value', label: 'dashboard.monitor.inputs.headerValue.placeholder' }
        ]}
        onSave={(index, name, value) => props.onClick(index, name, value)}
    />
);

export default HttpHeaderModal;
