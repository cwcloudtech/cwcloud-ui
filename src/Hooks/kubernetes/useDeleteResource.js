import * as React from "react";
import axios from "../../utils/axios";
import { toast } from "react-toastify";
import GlobalContext from "../../Context/GlobalContext";
import { useParams } from "react-router-dom";


function useDeleteResource(props) {
    const [deletionLoading, setDeletionLoading] = React.useState(false);
    const [selectedDeletionItems, setSelectedDeletionItems] = React.useState([]);
    const [selectedResource, setSelectedResource] = React.useState(null);
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = React.useState(false);
    const [multiSelection, setMultiSelection] = React.useState(false);
    const { counterpart } = React.useContext(GlobalContext);
    const { clusterId } = useParams();

    const preDeleteSelectionHandler = (selectedItems) => {
        setMultiSelection(true);
        setShowConfirmDeleteModal(true);
        let newArr = [];
        selectedItems.map(item => {
            const values = item.split("#/#")
            newArr.push({
                name: values[0],
                namespace: values[1],
                kind: props.kind,
                cluster_id: clusterId
            })
            return null;
        })
        setSelectedDeletionItems(newArr);
    };

    const onPreDeleteHandler = (name, namespace) => {
        setSelectedResource({
            name: name,
            namespace: namespace,
            kind: props.kind,
            cluster_id: clusterId
        })
        setShowConfirmDeleteModal(true)
    }

    const deleteResourcesHandler = async () => {
        setDeletionLoading(true)
        new Promise((r, j) => {
            const deletedResources = []
            selectedDeletionItems.forEach((deleteSchema, index) => {
                deletedResources.push(deleteSchema)
                if (index === selectedDeletionItems.length - 1) {
                    r(deletedResources)
                }
                axios.delete(`/admin/kubernetes/object`, { data: deleteSchema })
                    .then(() => {
                        deletedResources.push(deleteSchema)
                        if (index === selectedDeletionItems.length - 1) {
                            r(deletedResources)
                        }
                    })
                    .catch(() => {
                        if (index === selectedDeletionItems.length - 1) {
                            r(deletedResources)
                        }
                    })
            })
        })
            .then((deleted_resources) => {
                let newArr = props.resources.filter(item => !deleted_resources.some(dr => item.name === dr.name && item.namespace === dr.namespace));
                props.setResources(newArr)
                props.setFiltredResources(newArr)
                if (deleted_resources.length > 0) {
                    toast.success(counterpart('dashboard.kubernetesDashboardPages.common.deletedAllResourcesSuccess'))
                }

                setDeletionLoading(false)
                setShowConfirmDeleteModal(false)
            })
            .finally(() => {
                setMultiSelection(false)
            })
    };

    const deleteResourceHandler = () => {
        setDeletionLoading(true)
        axios.delete(`/admin/kubernetes/object`, { data: selectedResource }).then(response => {
            const newArr = props.resources.filter(item => item.name !== selectedResource.name || item.namespace !== selectedResource.namespace);
            props.setResources(newArr)
            props.setFiltredResources(newArr)
            toast.success(counterpart('dashboard.kubernetesDashboardPages.common.deletedResourceSuccess'))
            setShowConfirmDeleteModal(false)
            setDeletionLoading(false)
        }).catch(err => {
            setShowConfirmDeleteModal(false)
            setDeletionLoading(false)
        })
    }

    return {
        deletionLoading,
        showConfirmDeleteModal,
        multiSelection,
        selectedResource,
        setMultiSelection,
        setShowConfirmDeleteModal,
        preDeleteSelectionHandler,
        onPreDeleteHandler,
        deleteResourcesHandler,
        deleteResourceHandler,
    };
}

export default useDeleteResource;
