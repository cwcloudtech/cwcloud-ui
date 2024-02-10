import React, { useContext, useState, useEffect, useRef } from 'react';
import CardComponent from "../../../../../../Components/Cards/CardComponent/CardComponent";
import { Row, Col } from "reactstrap";
import classes from "./FunctionsPage.module.css";
import { TextField } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../../../../../utils/axios"
import { isBlank, isNotBlank, isUUID } from "../../../../../../utils/common"
import Tooltip from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';
import Fab from '@mui/material/Fab';
import GlobalContext from '../../../../../../Context/GlobalContext';
import CustomDeleteIcon from '../../../../../../Components/CustomDeleteIcon/CustomDeleteIcon';
import Translate from 'react-translate-component';
import AddIcon from '@mui/icons-material/Add';
import PublishOutlinedIcon from '@mui/icons-material/PublishOutlined';
import DataTable from '../../../../../../Components/DataTable/DataTable';
import { toast } from 'react-toastify'
import InputAdornment from '@mui/material/InputAdornment';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import DeleteModal from "../../../../../../Components/DeleteModal/DeleteModal";
import filteredListWithoutRemovedElement from "../../../../../../utils/filter";
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import CustomCopyIcon from '../../../../../../Components/CustomCopyIcon /CustomCopyIcon';
import formateDate from '../../../../../../utils/FormateDate';

function FunctionsPage(props) {
    const context = useContext(GlobalContext);
    const { counterpart } = React.useContext(GlobalContext);
    const [serverlessFunctions, setServerlessFunctions] = useState([])
    const [filtredServerlessFunctions, setFiltredServerlessFunctions] = useState([])
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false)
    const [loadingDelete, setLoadingDelete] = useState(false)
    const [selectedServerlessFunction, setSelectedServerlessFunction] = useState(null)
    const [multiSelection, setMultiSelection] = useState(false)
    const [selectedDeletionItems, setSelectedDeletionItems] = useState([])
    const uploadFileRef = useRef(null)
    const [functionUploaded, setFunctionUploaded] = useState(false)
    const navigate = useNavigate()
    const columns = [
        { field: 'id', headerName: context.counterpart("dashboard.table.id"), width: 340, renderCell: (params) => (<Link to={`/function/${params.id}`}>{params.id}</Link>) },
        { field: 'name', headerName: context.counterpart("dashboard.function.table.name"), width: 200, renderCell: (params) => (params.row.content.name) },
        { field: 'language', headerName: (<Tooltip title={context.counterpart("dashboard.function.message.searchbartip")} placement='top'><span>{context.counterpart("dashboard.function.table.language")}</span> </Tooltip>), width: 100, renderCell: (params) => (isNotBlank(params.row.content.blockly) ? "blockly" : params.row.content.language) },
        { field: 'actions', headerName: context.counterpart("dashboard.table.actions"), width: 130, renderCell: (params) => {
                const deleteFunction = (e) => {
                    e.stopPropagation();
                    preDeleteServerlessFunctionHandler(params.id)
                };
                const copyFunctionId = (e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(params.id)
                    toast.success(context.counterpart("dashboard.function.message.successCopyId"))
                }
                return (    
                    <React.Fragment>
                        <CustomCopyIcon onClick={copyFunctionId} title={counterpart("dashboard.function.actions.copyFunctionId")} />
                        &nbsp;
                        <Link to={`/invoke/${params.id}`}>
                            <Tooltip title={context.counterpart("dashboard.table.run")} placement='right'>
                                <SendOutlinedIcon className={`${classes.scheduleButton} sendBtn`} title={context.counterpart("dashboard.table.run")} />
                            </Tooltip>
                        </Link>
                        &nbsp;
                        <Link to={`/schedule/${params.id}`}>
                            <Tooltip title={context.counterpart("dashboard.table.schedule")} placement='right'>
                                <AccessTimeOutlinedIcon className={`${classes.scheduleButton} scheduleBtn`} title={context.counterpart("dashboard.table.schedule")} />
                            </Tooltip>
                        </Link>
                        &nbsp;
                        <CustomDeleteIcon onClick={deleteFunction} />
                    </React.Fragment>
                )
            }
        },
        { field: 'created_at', headerName: context.counterpart("dashboard.table.createdAt"), width: 100, renderCell: (params) => formateDate(params.row.created_at) },
        { field: 'updated_at', headerName: context.counterpart("dashboard.table.updatedAt"), width: 100, renderCell: (params) => formateDate(params.row.updated_at) },
    ];

    useEffect(() => {
        context.setIsGlobal(true)
        axios.get("/faas/functions")
            .then(res => {
                setServerlessFunctions(res.data.results)
                setFiltredServerlessFunctions(res.data.results)
            })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showConfirmDeleteModal, functionUploaded])

    const preDeleteServerlessFunctionHandler = (functionId) => {
        const functionIndex = serverlessFunctions.findIndex(e => e.id === functionId)
        setSelectedServerlessFunction(serverlessFunctions[functionIndex])
        setShowConfirmDeleteModal(true)
    }

    const deleteServerlessFunctionHandler = (functionId) => {
        setLoadingDelete(true)
        axios.delete(`/faas/function/${selectedServerlessFunction.id}`)
            .then(res => {
                toast.success(counterpart('dashboard.function.message.successDelete'))
                setServerlessFunctions(filteredListWithoutRemovedElement(functionId, serverlessFunctions))
                setFiltredServerlessFunctions(filteredListWithoutRemovedElement(functionId, filtredServerlessFunctions))
                setLoadingDelete(false)
                setShowConfirmDeleteModal(false)
            })
            .catch(err => {
                setLoadingDelete(false)
            })
    }

    const preDeleteSelectionHandler = (selectedItems) => {
        setMultiSelection(true)
        setShowConfirmDeleteModal(true)
        setSelectedDeletionItems(selectedItems)
    }

    const deleteSelectedServerlessFunctionsHandler = async () => {
        setLoadingDelete(true)
        new Promise((r, j) => {
            const deletedFunctions = []
            selectedDeletionItems.forEach((functionId, index) => {
                axios.delete(`/faas/function/${functionId}`)
                    .then(() => {
                        deletedFunctions.push(functionId)
                        if (index === selectedDeletionItems.length - 1) {
                            r(deletedFunctions)
                        }
                    })
                    .catch(() => {
                        if (index === selectedDeletionItems.length - 1) {
                            r(deletedFunctions)
                        }
                    })
            })
        })  
            .then((deleted_functions) => {
                setServerlessFunctions([...serverlessFunctions.filter(f => !deleted_functions.includes(f.id))])
                if (deleted_functions.length > 0)
                    toast.success(counterpart('dashboard.function.message.successMultiDelete'))
                setLoadingDelete(false)
                setShowConfirmDeleteModal(false)
            })
    }

    const filterServerlessFunction = (f) => {
        const searchQuery = f.target.value.trim();
        if (isBlank(searchQuery)) {
            setFiltredServerlessFunctions(serverlessFunctions);
        } else if (isUUID(searchQuery)) {
            var filtredServerlessFunctionsById = serverlessFunctions.filter(serverlessFunction => serverlessFunction.id === searchQuery);
            setFiltredServerlessFunctions(filtredServerlessFunctionsById);
        } else if (searchQuery.startsWith(":")) {
            const [, langValue] = searchQuery.split(':');
            const trimmedValue = langValue.trim();
    
            const filteredByLanguage = serverlessFunctions.filter(serverlessFunction => {
                const language = isNotBlank(serverlessFunction.content.blockly) ? "blockly" : serverlessFunction.content.language;
                return language.toLowerCase().includes(trimmedValue.toLowerCase());
            });
    
            setFiltredServerlessFunctions(filteredByLanguage);
        } else {
            var filtredServerlessFunctionsByName = serverlessFunctions.filter(serverlessFunction => serverlessFunction.content.name.includes(searchQuery));
            setFiltredServerlessFunctions(filtredServerlessFunctionsByName);
        }
    }

    const uploadFunctionHandler = (e) => {
        if (e.target.files[0]) {
            const fd = new FormData()
            fd.append('function_file', e.target.files[0])
            axios.post('/faas/function/import', fd)
                .then(res => {
                    setServerlessFunctions([...serverlessFunctions, res.data])
                    setFunctionUploaded(true)
                    toast.success(context.counterpart('dashboard.function.message.successImport'))
                })
                .catch(err => {
                    toast.error(context.counterpart('dashboard.function.message.errorImport'))
                })
        }
    }

    return (
        <CardComponent
            containerStyles={props.containerStyles}
            title={context.counterpart('dashboard.function.title.main')}
        >
            <DeleteModal
                resourceName={context.counterpart('dashboard.table.function').toLowerCase()} 
                multi={multiSelection} 
                isOpen={showConfirmDeleteModal}
                toggle={() => setShowConfirmDeleteModal(!showConfirmDeleteModal)}
                onMultiDelete={deleteSelectedServerlessFunctionsHandler}
                onDelete={deleteServerlessFunctionHandler}
                name={selectedServerlessFunction?.content.name} 
                loading={loadingDelete} 
            />
            <Row>
                <Col>
                    <div style={{ paddingBottom: "20px"  }} className={classes.envCreation}>
                        <TextField
                            style={{ marginRight: "5px" }}
                            onChange={(f) => filterServerlessFunction(f) }
                            label={context.counterpart('dashboard.table.filter')}
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
                            <input accept='application/json`' type="file" style={{ display: 'none' }} onChange={uploadFunctionHandler} ref={uploadFileRef} />
                            <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} title={<h5 className={classes.tootltipValue}>
                                <Translate content="dashboard.function.import" />
                            </h5>} placement="bottom">
                                <Fab color="primary" aria-label="import" onClick={() => uploadFileRef.current.click()} style={{ transform: 'scale(0.7)' }} >
                                    <PublishOutlinedIcon className="whiteIcon" />
                                </Fab>
                            </Tooltip>
                            <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} title={<h5 className={classes.tootltipValue}>
                                <Translate content="dashboard.function.add" />
                            </h5>} placement="bottom">
                                <Fab color="primary" aria-label="add" onClick={() => navigate("/function/add")} style={{ transform: 'scale(0.7)' }} >
                                    <AddIcon className="whiteIcon" />
                                </Fab>
                            </Tooltip>
                        </div>
                    </div>
                </Col>
            </Row>
            <DataTable
                icon={'fa-solid fa-code'}
                createUrl='/function/add'
                emptyMessage={counterpart('dashboard.function.message.emptyMessage')}
                createMessage={counterpart('dashboard.function.message.createMessage')}
                checkboxSelection
                columns={columns}
                setMultiSelection={setMultiSelection}
                rows={filtredServerlessFunctions} 
                onDeleteSelection={preDeleteSelectionHandler} 
            />
        </CardComponent>
    )
}

export default FunctionsPage