import React from "react";
import GenericTable from "./GenericTable";

const SubdomainTable = (props) => {

    return (
        <GenericTable
            title="dashboard.addEnvironement.inputs.subdomains.title"
            addNewItem={props.addNewSubdomain}
            items={props.subdomains}
            columns={[
                { 
                    header: "dashboard.addEnvironement.inputs.subdomains.title", 
                    accessor: (subdomain) => subdomain 
                }
            ]}
            noItemsMessage="dashboard.addEnvironement.inputs.subdomains.noSubdomains"
            editItem={props.editSubdomain}
            deleteItem={props.deleteSubdomain}
        />
    );
};

export default SubdomainTable;
