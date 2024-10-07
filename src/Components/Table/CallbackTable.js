import React, { useEffect, useState } from "react";
import GenericTable from "./GenericTable";
import { isEmpty } from "../../utils/common";

const CallbackTable = (props) => {
    const [showToken, setShowToken] = useState(false);

    useEffect(() => {
        props.callbacks?.forEach((callback) => {
            if (!isEmpty(callback.token)) {
                setShowToken(true);
            }
        });
    }, [props.callbacks]);

    const columns = [
        { 
            header: "dashboard.function.inputs.callbacks.callbackEndpoint", 
            accessor: (callback) => callback.endpoint 
        },
        { 
            header: "dashboard.function.inputs.callbacks.callbackType", 
            accessor: (callback) => callback.type.toUpperCase() 
        }
    ];

    if (showToken) {
        columns.splice(1, 0, { 
            header: "dashboard.function.inputs.callbacks.callbackToken", 
            accessor: () => "****" 
        });
    }

    return (
        <GenericTable
            title="dashboard.function.inputs.callbacks.title"
            addNewItem={props.addNewCallback}
            items={props.callbacks}
            columns={columns}
            noItemsMessage="dashboard.function.inputs.callbacks.noCallbacks"
            editItem={props.editCallback}
            deleteItem={props.deleteCallback}
        />
    );
};

export default CallbackTable;
