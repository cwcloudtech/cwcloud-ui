import React, { useContext } from "react";
import EditIcon from '@mui/icons-material/Edit';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DeleteIcon from '@mui/icons-material/Delete';
import GlobalContext from "../../../../Context/GlobalContext";
import { Tooltip } from "@material-ui/core";

export default function K8sObjectActionsList(props) {
    const { counterpart } = useContext(GlobalContext);

    return (
        <div>
            {
                props.handleEditYaml &&
                    <Tooltip 
                        title={counterpart("dashboard.kubernetesDashboardPages.k8sObjectMenuActions.editYaml")} 
                        onClick={() => {
                            props.handleEditYaml()
                        }}
                    >
                        <EditIcon />
                    </Tooltip>
            }
            &nbsp;
            {
                props.handleDownload &&
                    <Tooltip 
                        title={counterpart("dashboard.kubernetesDashboardPages.k8sObjectMenuActions.download")}
                        onClick={() => {
                            props.handleDownload()
                        }}
                    >
                        <FileDownloadIcon />
                    </Tooltip>
            }
            &nbsp;
            {
                props.handleDelete &&
                    <Tooltip
                        title={counterpart("dashboard.kubernetesDashboardPages.k8sObjectMenuActions.delete")}
                        onClick={() => {
                            props.handleDelete()
                        }}
                    >
                        <DeleteIcon />
                    </Tooltip>
            }
        </div>
    );
}
