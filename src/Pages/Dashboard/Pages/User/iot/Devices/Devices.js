import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import { toast } from 'react-toastify';
import CardComponent from "../../../../../../Components/Cards/CardComponent/CardComponent";
import CustomCopyIcon from '../../../../../../Components/CustomIcon/CustomCopyIcon';
import CustomDeleteIcon from '../../../../../../Components/CustomIcon/CustomDeleteIcon';
import DeleteModal from '../../../../../../Components/Modal/DeleteModal';
import DataTable from '../../../../../../Components/Table/DataTable';
import GlobalContext from '../../../../../../Context/GlobalContext';
import axios from "../../../../../../utils/axios";

function DevicesPage(props) {
    const context = useContext(GlobalContext);
    const { counterpart } = React.useContext(GlobalContext);
    const [loadingDelete, setLoadingDelete] = useState(false)
    const location = useLocation()
    const currentPath = location.pathname
    const is_admin = currentPath === "/admin/iot/devices"
    const [createLink, setCreateLink] = useState("/iot/add/device")

    const [devices, setDevices] = useState([])
    const [selectedDevice, setSelectedDevice] = useState(null)

    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false)
    const [multiSelection, setMultiSelection] = useState(false)
    const [selectedDeletionItems, setSelectedDeletionItems] = useState([])
    
    const columns = [
        { field: 'id', headerName: context.counterpart("dashboard.table.id"), width: 300, renderCell: (params) => params.id },
        { field: 'object type id', headerName: context.counterpart("dashboard.iot.table.objectTypeId"), width: 300, renderCell: (params) => (<Link to={`/admin/iot/object-type/${params.row.typeobject_id}`}>{params.row.typeobject_id}</Link>) },
        { field: 'owner', headerName: context.counterpart("dashboard.table.owner"), width: 180, renderCell: (params) => params.row.username },
        { field: 'status', headerName: context.counterpart("dashboard.table.state"), width: 100, renderCell: (params) => 
            params.row.active 
            ? <span style={{color: "#52B87A"}}>{context.counterpart("dashboard.table.active")}</span> 
            : <span style={{color: "#DE4452"}}>{context.counterpart("dashboard.table.inactive")}</span>
        },
        { field: 'actions', headerName: context.counterpart("dashboard.table.actions"), width: 100, renderCell: (params) => {
            const deleteObjectType = (e) => {
                e.stopPropagation();
                preDeleteDeviceHandler(params.id)
            };
            const copyObjectTypeId = (e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(params.id)
                toast.success(context.counterpart("dashboard.iot.message.successCopyDeviceId"))
            }
            return (    
                <React.Fragment>
                    <CustomCopyIcon onClick={copyObjectTypeId} title={counterpart("dashboard.iot.actions.copyDeviceId")} />
                    &nbsp;
                    <CustomDeleteIcon onClick={deleteObjectType}/>
                </React.Fragment>
            )
        }},
    ];

    useEffect(() => {
        context.setIsGlobal(true)
        var api_url = is_admin ? "/admin/iot/devices" : "/iot/devices"
        axios.get(api_url)
            .then(res => {
                setDevices(res.data)
            })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showConfirmDeleteModal])

    useEffect(() => {
        if (is_admin) {
            setCreateLink("/admin/iot/add/device")
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPath])

    const preDeleteDeviceHandler = (deviceId) => {
        const deviceIndex = devices.findIndex(device => device.id === deviceId)
        setSelectedDevice(devices[deviceIndex])
        setShowConfirmDeleteModal(true)
    }

    const deleteDeviceHandler = (deviceId) => {
        setLoadingDelete(true)
        var api_url = is_admin
            ? `/admin/iot/device/${selectedDevice.id}`
            : `/iot/device/${selectedDevice.id}`
        axios.delete(api_url)
            .then(res => {
                toast.success(context.counterpart("dashboard.iot.message.successDeleteDevice"))
                setLoadingDelete(false)
                setShowConfirmDeleteModal(false)
            })
            .catch(err => {
                toast.error(context.counterpart("dashboard.iot.message.errorDeleteDevice"))
                console.log("Error deleting device: ", err)
                setShowConfirmDeleteModal(false)
                setLoadingDelete(false)
            })
    }

    const preDeleteSelectionHandler = (selectedItems) => {
        setMultiSelection(true)
        setShowConfirmDeleteModal(true)
        setSelectedDeletionItems(selectedItems)
    }

    const deleteSelectedDevicesHandler = async () => {
        setLoadingDelete(true)
        const deletedDevices = []
        new Promise((resolve, reject) => {
            selectedDeletionItems.forEach((deviceId, index) => {
                var api_url = is_admin
                    ? `/admin/iot/device/${deviceId}`
                    : `/iot/device/${deviceId}`
                axios.delete(api_url)
                    .then(() => {
                        deletedDevices.push(deviceId)
                        if (index === selectedDeletionItems.length - 1) {
                            resolve(deletedDevices)
                        }
                    })
                    .catch(() => {
                        if (index === selectedDeletionItems.length - 1) {
                            resolve(deletedDevices)
                        }
                    })
                })
            })
            .then((deletedDevices) => {
                setDevices([...devices.filter(device => !deletedDevices.includes(device.id))])
                if (deletedDevices.length > 0) {
                    toast.success(context.counterpart("dashboard.iot.message.successDeleteDevices"))
                }
                setLoadingDelete(false)
                setShowConfirmDeleteModal(false)
            })
    }

    return (
        <CardComponent
            containerStyles={props.containerStyles}
            title={context.counterpart('dashboard.iot.devicesOverview.mainTitle')}
        >
            <DeleteModal
                resourceName={context.counterpart('dashboard.table.device').toLowerCase()} 
                multi={multiSelection}
                isOpen={showConfirmDeleteModal}
                toggle={() => setShowConfirmDeleteModal(!showConfirmDeleteModal)}
                onMultiDelete={deleteSelectedDevicesHandler}
                onDelete={deleteDeviceHandler}
                name={selectedDevice?.id}
                loading={loadingDelete}
            />
            <DataTable
                icon={'fa-solid fa-mobile-screen'}
                createUrl={createLink}
                emptyMessage={counterpart('dashboard.iot.message.deviceEmptyMessage')}
                createMessage={counterpart('dashboard.iot.message.createDeviceMessage')}
                checkboxSelection
                columns={columns}
                setMultiSelection={setMultiSelection}
                rows={devices} 
                onDeleteSelection={preDeleteSelectionHandler} 
            />
        </CardComponent>
    )
}

export default DevicesPage
