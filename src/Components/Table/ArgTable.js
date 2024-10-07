import React from "react";
import GenericTable from "./GenericTable";

const ArgTable = (props) => {
    return (
        <GenericTable
            title="dashboard.function.inputs.args.title"
            addNewItem={props.addNewArg}
            items={props.args}
            columns={[
                { 
                    header: "dashboard.function.inputs.args.name", 
                    accessor: (arg) => arg 
                }
            ]}
            noItemsMessage="dashboard.function.inputs.args.noArgs"
            editItem={props.editArg}
            deleteItem={props.deleteArg}
        />
    );
};

export default ArgTable;
