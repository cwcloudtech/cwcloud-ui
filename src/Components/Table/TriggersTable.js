import React from "react";
import GenericTable from "./GenericTable";

const TriggersTable = (props) => {
    return (
        <GenericTable
            title="dashboard.iot.inputs.triggers.title"
            addNewItem={props.addNewTrigger}
            items={props.triggers}
            columns={[
                { 
                    header: "dashboard.iot.inputs.triggers.triggerId.name", 
                    accessor: (trigger) => trigger 
                }
            ]}
            noItemsMessage="dashboard.iot.inputs.triggers.noTriggers"
            editItem={props.editTrigger}
            deleteItem={props.deleteTrigger}
        />
    );
};

export default TriggersTable;
