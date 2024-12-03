import React from "react";
import GenericTable from "./GenericTable";

const HttpHeadersTable = (props) => {
    const columns = [
        { 
            header: "dashboard.monitor.inputs.headerName.title", 
            accessor: (header) => header.name 
        },
        { 
            header: "dashboard.monitor.inputs.headerValue.title", 
            accessor: (header) => header.value 
        }
    ];

    return (
        <GenericTable
            title="dashboard.monitor.inputs.headers.title"
            addNewItem={props.addNewHeader}
            items={props.headers}
            columns={columns}
            noItemsMessage="dashboard.monitor.inputs.headers.noHeaders"
            editItem={props.editHeader}
            deleteItem={props.deleteHeader}
        />
    );
};

export default HttpHeadersTable;
