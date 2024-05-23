import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import Fade from '@mui/material/Fade';
import Tooltip from '@mui/material/Tooltip';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import Translate from 'react-translate-component';
import { Col, Row } from "reactstrap";
import CardComponent from "../../../../../../Components/Cards/CardComponent/CardComponent";
import CustomCopyIcon from '../../../../../../Components/CustomIcon/CustomCopyIcon';
import CustomDeleteIcon from '../../../../../../Components/CustomIcon/CustomDeleteIcon';
import DataTable from '../../../../../../Components/Table/DataTable';
import GlobalContext from '../../../../../../Context/GlobalContext';
import formateDate from '../../../../../../utils/FormateDate';
import axios from "../../../../../../utils/axios";
import classes from "./IotOverview.module.css";
import DeleteModal from '../../../../../../Components/Modal/DeleteModal';
import { isBlank } from '../../../../../../utils/common';
import { TextField } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import PublishOutlinedIcon from '@mui/icons-material/PublishOutlined';
import CustomPairIcon from '../../../../../../Components/CustomIcon/CustomPairIcon';

function IotOverviewPage(props) {
    const context = useContext(GlobalContext);
    const { counterpart } = React.useContext(GlobalContext);
    const [objectTypes, setObjectTypes] = useState([])
    const [filtredObjectTypes, setFiltredObjectTypes] = useState([])
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false)
    const [loadingDelete, setLoadingDelete] = useState(false)
    const [objectTypeUploaded, setObjectTypeUploaded] = useState(false)
    const [selectedObjectType, setSelectedObjectType] = useState(null)
    const [multiSelection, setMultiSelection] = useState(false)
    const [selectedDeletionItems, setSelectedDeletionItems] = useState([])
    const uploadFileRef = useRef(null)
    const navigate = useNavigate()
    const location = useLocation()
    const currentPath = location.pathname
    const is_admin = currentPath === "/admin/iot/overview"
    const [createLink, setCreateLink] = useState("/iot/add/object-type")
    const columns = [
        { field: 'id', headerName: context.counterpart("dashboard.table.id"), width: 300, renderCell: (params) => (<Link to={getObjectTypePageLink(params)}>{params.id}</Link>) },
        { field: 'name', headerName: context.counterpart("dashboard.iot.table.name"), width: 100, renderCell: (params) => params.row.content.name },
        { field: 'decoding function id', headerName: context.counterpart("dashboard.iot.table.decodingFunctionId"), width: 300, renderCell: (params) => (<Link to={getFunctionPageLink(params)}>{params.row.content.decoding_function}</Link>) },
        { field: 'visibility', headerName: context.counterpart("dashboard.table.visibility"), width: 100, renderCell: (params) => params.row.content.public ? context.counterpart("dashboard.table.public") : context.counterpart("dashboard.table.private")},
        { field: 'actions', headerName: context.counterpart("dashboard.table.actions"), width: 100, renderCell: (params) => {
            const deleteObjectType = (e) => {
                e.stopPropagation();
                preDeleteObjectTypeHandler(params.id)
            };
            const copyObjectTypeId = (e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(params.id)
                toast.success(context.counterpart("dashboard.iot.message.successCopyObjectTypeId"))
            }
            const pairDevice = (e) => {
                const addDevicePath = is_admin ? "/admin/iot/add/device" : "/iot/add/device"
                navigate(addDevicePath, { state: { typeObjectId: params.id } })
            }
            return (    
                <React.Fragment>
                    <CustomCopyIcon onClick={copyObjectTypeId} title={counterpart("dashboard.iot.actions.copyObjectTypeId")} />
                    &nbsp;
                    <CustomPairIcon onClick={pairDevice} title={counterpart("dashboard.iot.actions.pairDevice")}  />
                    &nbsp;
                    <CustomDeleteIcon onClick={deleteObjectType}/>
                </React.Fragment>
            )
        }},
        { field: 'created_at', headerName: context.counterpart("dashboard.table.createdAt"), width: 100, renderCell: (params) => formateDate(params.row.created_at) },
        { field: 'updated_at', headerName: context.counterpart("dashboard.table.updatedAt"), width: 100, renderCell: (params) => formateDate(params.row.updated_at) },
    ];

    useEffect(() => {
        context.setIsGlobal(true)
        var api_url = is_admin ? "/admin/iot/object-types" : "/iot/object-types"
        axios.get(api_url)
            .then(res => {
                setObjectTypes(res.data)
                setFiltredObjectTypes(res.data)
            })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showConfirmDeleteModal, objectTypeUploaded])

    useEffect(() => {
        if (is_admin) {
            setCreateLink("/admin/iot/add/object-type")
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPath])

    const getObjectTypePageLink = (params) => {
        var objectTypePageLink = is_admin ? `/admin/iot/object-type/${params.id}` : `/iot/object-type/${params.id}`
        return objectTypePageLink
    }

    const getFunctionPageLink = (params) => {
        var functionPageLink = is_admin ? `/admin/function/${params.row.content.decoding_function}` : `/function/${params.row.content.decoding_function}`
        return functionPageLink
    }

    const preDeleteObjectTypeHandler = (objectTypeId) => {
        const objectTypeIndex = objectTypes.findIndex(objectType => objectType.id === objectTypeId)
        setSelectedObjectType(objectTypes[objectTypeIndex])
        setShowConfirmDeleteModal(true)
    }

    const deleteObjectTypeHandler = (objectTypeId) => {
        setLoadingDelete(true)
        axios.delete(`/iot/object-type/${selectedObjectType.id}`)
            .then(res => {
                toast.success(context.counterpart("dashboard.iot.message.successDeleteObjectType"))
                setLoadingDelete(false)
                setShowConfirmDeleteModal(false)
            })
            .catch(err => {
                toast.error(context.counterpart("dashboard.iot.message.errorDeleteObjectType"))
                setShowConfirmDeleteModal(false)
                setLoadingDelete(false)
            })
    }

    const preDeleteSelectionHandler = (selectedItems) => {
        setMultiSelection(true)
        setShowConfirmDeleteModal(true)
        setSelectedDeletionItems(selectedItems)
    }

    const deleteSelectedObjectTypesHandler = async () => {
        setLoadingDelete(true)
        const deletedObjectTypes = []
        new Promise((resolve, reject) => {
            selectedDeletionItems.forEach((objectTypeId, index) => {
                axios.delete(`/iot/object-type/${objectTypeId}`)
                    .then(() => {
                        deletedObjectTypes.push(objectTypeId)
                        if (index === selectedDeletionItems.length - 1) {
                            resolve(deletedObjectTypes)
                        }
                    })
                    .catch(() => {
                        if (index === selectedDeletionItems.length - 1) {
                            resolve(deletedObjectTypes)
                        }
                    })
                })
            })
            .then((deletedObjectTypes) => {
                setObjectTypes([...objectTypes.filter(objectType => !deletedObjectTypes.includes(objectType.id))])
                if (deletedObjectTypes.length > 0) {
                    toast.success(context.counterpart("dashboard.iot.message.successDeleteObjectTypes"))
                }
                setLoadingDelete(false)
                setShowConfirmDeleteModal(false)
            })
    }

    const filterObjectTypes = (e) => {
        const searchQuery = e.target.value.trim()
        if (isBlank(searchQuery)) {
            setFiltredObjectTypes(objectTypes)
        } else {
            var filtredObjectTypes = objectTypes.filter(objectType => objectType.content.name.includes(searchQuery))
            setFiltredObjectTypes(filtredObjectTypes)
        }
    }

    const uploadObjectTypeHandler = (e) => {
        if (e.target.files[0]) {
            const fd = new FormData()
            fd.append('object_type_file', e.target.files[0])
            axios.post('/iot/object-type/import', fd)
                .then(res => {
                    toast.success(context.counterpart("dashboard.iot.message.successImportObjectType"))
                    setObjectTypeUploaded(true)
                })
                .catch(err => {
                    toast.error(context.counterpart("dashboard.iot.message.errorImportObjectType"))
                    console.log(err)
                })
        }
    }

    return (
        <CardComponent
            containerStyles={props.containerStyles}
            title={context.counterpart('dashboard.iot.objectTypesOverview.mainTitle')}
        >
            <DeleteModal
                resourceName={context.counterpart('dashboard.table.objectType').toLowerCase()} 
                multi={multiSelection}
                isOpen={showConfirmDeleteModal}
                toggle={() => setShowConfirmDeleteModal(!showConfirmDeleteModal)}
                onMultiDelete={deleteSelectedObjectTypesHandler}
                onDelete={deleteObjectTypeHandler}
                name={selectedObjectType?.id}
                loading={loadingDelete}
            />
            <Row>
                <Col>
                <div style={{ paddingBottom: "20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <TextField
                            onChange={(e) => filterObjectTypes(e) }
                            label={context.counterpart('dashboard.iot.inputs.name.placeholder')}
                            InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <SearchOutlinedIcon />
                                  </InputAdornment>
                                ),
                              }}
                            size="small"
                            fullWidth 
                        />
                        <div style={{ display: 'flex' }}>
                            <input accept='application/json`' type="file" style={{ display: 'none' }} onChange={uploadObjectTypeHandler} ref={uploadFileRef} />
                            <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} title={<h5 className={classes.tootltipValue}>
                                <Translate content="dashboard.function.import" />
                            </h5>} placement="bottom">
                                <Fab color="primary" aria-label="import" onClick={() => uploadFileRef.current.click()} style={{ transform: 'scale(0.7)' }} >
                                    <PublishOutlinedIcon className="whiteIcon" />
                                </Fab>
                            </Tooltip>
                            <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} title={
                                <h5 className={classes.tootltipValue}>
                                    <Translate content="dashboard.iot.addObjectType.mainTitle" />
                                </h5>}
                                placement="bottom">
                                <Fab color="primary" aria-label="add" onClick={() => navigate(createLink)} style={{ transform: 'scale(0.7)' }} >
                                    <AddIcon className="whiteIcon" />
                                </Fab>
                            </Tooltip>
                        </div>
                    </div>
                </Col>
            </Row>
            <DataTable
                icon={'fa-solid fa-object-group'}
                createUrl={createLink}
                emptyMessage={counterpart('dashboard.iot.message.objectTypeEmptyMessage')}
                createMessage={counterpart('dashboard.iot.message.createObjectTypeMessage')}
                checkboxSelection
                columns={columns}
                setMultiSelection={setMultiSelection}
                rows={filtredObjectTypes} 
                onDeleteSelection={preDeleteSelectionHandler} 
            />
        </CardComponent>
    )
}

export default IotOverviewPage
