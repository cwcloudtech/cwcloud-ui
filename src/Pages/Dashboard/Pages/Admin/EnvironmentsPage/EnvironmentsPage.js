import { useContext, useState, useRef, useEffect } from 'react';
import CardComponent from "../../../../../Components/Cards/CardComponent/CardComponent";
import { Row, Col } from "reactstrap";
import classes from "./EnvironmentsPage.module.css";
import { TextField } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../../../../utils/axios";
import { isBlank } from "../../../../../utils/common";
import Tooltip from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';
import Fab from '@mui/material/Fab';
import GlobalContext from '../../../../../Context/GlobalContext';
import CustomDeleteIcon from '../../../../../Components/CustomDeleteIcon/CustomDeleteIcon';
import Translate from 'react-translate-component';
import formateDate from '../../../../../utils/FormateDate';
import filteredListWithoutRemovedElement from "../../../../../utils/filter";
import AddIcon from '@mui/icons-material/Add';
import PublishOutlinedIcon from '@mui/icons-material/PublishOutlined';
import DataTable from '../../../../../Components/DataTable/DataTable';
import DeleteModal from '../../../../../Components/DeleteModal/DeleteModal';
import { toast } from 'react-toastify';
import InputAdornment from '@mui/material/InputAdornment';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

function EnvironmentsPage(props) {
    const context = useContext(GlobalContext);
    const { counterpart } = useContext(GlobalContext);
    const [environments, setEnvironments] = useState([])
    const [filtredEnvironments, setFiltredEnvironments] = useState([])
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false)
    const [loadingDeleteEnv, setLoadingDeleteEnv] = useState(false)
    const [selectedEnvironment, setSeletedEnvironment] = useState(null)
    const [loadingUpload, setLoadingUpload] = useState(false)
    const uploadFileRef = useRef(null)
    const navigate = useNavigate()
    const columns = [
        { field: 'id', headerName: context.counterpart("dashboard.environmentsPage.table.id"), width: 100, renderCell: (params) => (<Link to={`/environment/${params.id}`}>{params.id}</Link>) },
        { field: 'name', headerName: context.counterpart("dashboard.environmentsPage.table.name"), width: 200 },
        { field: 'path', headerName: context.counterpart("dashboard.environmentsPage.table.path"), width: 200 },
        { field: 'private', headerName: context.counterpart("dashboard.environmentsPage.table.private"), width: 200, renderCell: (params) => (params.row.is_private ? 'yes' : 'no') },
        { field: 'created_at', headerName: context.counterpart("dashboard.environmentsPage.table.created"), width: 200, renderCell: (params) => (formateDate(params.row.created_at)) },
        {
            field: 'actions', headerName: context.counterpart("dashboard.environmentsPage.table.actions"), width: 200, renderCell: (params) => {
                const onClick = (e) => {
                    e.stopPropagation();
                    preDeleteEnvironmentHandler(params.id)
                };
                return (<CustomDeleteIcon onClick={onClick} />)
            }
        }
    ];

    useEffect(() => {
        context.setIsGlobal(true)
        axios.get("/admin/environment/all")
            .then(res => {
                setEnvironments(res.data)
                setFiltredEnvironments(res.data)
            })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showConfirmDeleteModal, loadingUpload])

    const preDeleteEnvironmentHandler = (environmentId) => {
        const envIndex = environments.findIndex(e => e.id === environmentId)
        setSeletedEnvironment(environments[envIndex])
        setShowConfirmDeleteModal(true)
    }

    const deleteEnvironmentHandler = (environmentId) => {
        setLoadingDeleteEnv(true)
        axios.delete(`/admin/environment/${selectedEnvironment.id}`)
            .then(res => {
                toast.success(counterpart('dashboard.environmentOverview.message.successDelete'))
                setEnvironments(filteredListWithoutRemovedElement(environmentId, environments))
                setFiltredEnvironments(filteredListWithoutRemovedElement(environmentId, filtredEnvironments))
                setLoadingDeleteEnv(false)
                setShowConfirmDeleteModal(false)
            })
            .catch(err => {
                setLoadingDeleteEnv(false)
            })
    }

    const uploadEnvironmentHandler = (e) => {
        if (e.target.files[0]) {
            setLoadingUpload(true)
            const fd = new FormData()
            fd.append('env', e.target.files[0])
            axios.post('/admin/environment/import', fd)
                .then(res => {
                    setEnvironments([...environments, res.data])
                    toast.success(`successfully import environment ${res.data.name}`)
                    setLoadingUpload(false)
                })
                .catch(err => {
                    setLoadingUpload(false)
                })
        }
    }

    const filterEnvironments = (e) => {
        const searchQuery = e.target.value.trim() 
        if (isBlank(searchQuery)) {
            setFiltredEnvironments(environments)
        } else {
            var filtredEnvironments = environments.filter(environment => environment.name.includes(searchQuery))
            setFiltredEnvironments(filtredEnvironments)
        }
    }

    return (
        <CardComponent
            containerStyles={props.containerStyles}
            title={context.counterpart('dashboard.environmentsPage.title')}
        >
            <DeleteModal resourceName={'environment'} isOpen={showConfirmDeleteModal} toggle={() => setShowConfirmDeleteModal(!showConfirmDeleteModal)} onDelete={deleteEnvironmentHandler} name={selectedEnvironment?.name} loading={loadingDeleteEnv} />
            <Row>
                <Col>
                    <div style={{ paddingBottom: "20px"  }} className={classes.envCreation}>
                        <TextField
                            style={{ marginRight: "5px" }}
                            onChange={(e) => filterEnvironments(e) }
                            label={context.counterpart('dashboard.addEnvironement.inputs.name.placeholder')}
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
                            <input accept='application/json`' type="file" style={{ display: 'none' }} onChange={uploadEnvironmentHandler} ref={uploadFileRef} />
                            <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} title={<h5 className={classes.tootltipValue}>
                                <Translate content="dashboard.environmentsPage.importEnvironment" />
                                </h5>} placement="bottom">
                                    <Fab color="primary" aria-label="import" onClick={() => uploadFileRef.current.click()} style={{ transform: 'scale(0.7)' }} >
                                        <PublishOutlinedIcon className="whiteIcon" />
                                    </Fab>
                            </Tooltip>
                            <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} title={<h5 className={classes.tootltipValue}>
                                <Translate content="dashboard.environmentsPage.addEnvironment" />
                            </h5>} placement="bottom">
                                <Fab color="primary" aria-label="add" onClick={() => navigate("/environment/add")} style={{ transform: 'scale(0.7)' }} >
                                    <AddIcon className="whiteIcon" />
                                </Fab>
                            </Tooltip>
                        </div>

                    </div>
                </Col>
            </Row>
            <DataTable
                columns={columns}
                rows={filtredEnvironments} />
        </CardComponent>
    )
}

export default EnvironmentsPage