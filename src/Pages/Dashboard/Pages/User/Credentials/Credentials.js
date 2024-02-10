import { useContext, useState, useEffect } from 'react';
import axios from '../../../../../utils/axios';
import GlobalContext from '../../../../../Context/GlobalContext';
import colors from '../../../../../Context/Colors';
import { Col, Container, Row } from 'reactstrap';
import classes from './Credentials.module.css';
import DataTable from '../../../../../Components/DataTable/DataTable';
import { toast } from 'react-toastify';
import CustomDeleteIcon from '../../../../../Components/CustomDeleteIcon/CustomDeleteIcon';
import DeleteModal from '../../../../../Components/DeleteModal/DeleteModal';
import formateDate from '../../../../../utils/FormateDate';
import filteredListWithoutRemovedElement from "../../../../../utils/filter";
import AddApiKeyModal from './AddApiKeyModal/AddApiKeyModal';
import GeneratedApiKeyModal from './GeneratedApiKeyModal/GeneratedApiKeyModal';
import AddAccessModal from './AddAccessModal/AddAccessModal';
import Translate from "react-translate-component";
import Tooltip from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import CardComponent from '../../../../../Components/Cards/CardComponent/CardComponent';
import CustomDownloadIcon from '../../../../../Components/CustomDownloadIcon/CustomDeleteIcon';

function Credentials() {
    const _mode = useContext(GlobalContext).mode;
    const [showAddApiKeyModal, setShowAddApiKeyModal] = useState(false)
    const [showAddAccessModal, setShowAddAccessModal] = useState(false)
    const [showConfirmDeleteApiKeyModal, setShowConfirmDeleteApiKeyModal] = useState(false)
    const [showConfirmDeleteAccessModal, setShowConfirmDeleteAccessModal] = useState(false)
    const [selectedAccessId, setSelectedAccessId] = useState(null)
    const [showGeneratedApiKeyModal, setShowGeneratedApiKeyModal] = useState(false)
    const [selectedApiKey, setSelectedApiKey] = useState(null)
    const [loadingDeletion, setLoadingDeletion] = useState(false)
    const [apiKeys, setApiKeys] = useState([])
    const [loadingSubmit, setLoadingSubmit] = useState(false)
    const [createdApiKey, setCreatedApiKey] = useState({})
    const context = useContext(GlobalContext)
    const [userBuckets, setUserBuckets] = useState([])
    const [userProjects, setUserProjects] = useState([])
    const [userInstances, setUserInstances] = useState([])
    const [userRegistries, setUserRegistries] = useState([])
    const [loadingAddAccess, setLoadingAddAccess] = useState(false)
    const [accesses, setAccesses] = useState({})

    useEffect(() => {
        context.setIsGlobal(true)
        axios.get('/api_keys')
            .then(res => {
                setApiKeys(res.data.api_keys)
            })

        axios.get('/access')
            .then(res => {
                setAccesses(res.data.access)
            })
        axios.get('/user/resources')
            .then(res => {
                setUserBuckets(res.data.buckets)
                setUserProjects(res.data.projects)
                setUserInstances(res.data.instances)
                setUserRegistries(res.data.registries)
            })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const columns = [
        { field: 'id', headerName: 'ID', width: 250 },
        { field: 'name', headerName: 'Name', width: 200 },
        {
            field: 'actions', headerName: 'Actions', width: 200, renderCell: (params) => {
                return <>
                    <CustomDeleteIcon onClick={() => preDeleteApiKeyHandler(params.id)} />
                    <CustomDownloadIcon onClick={() => {
                        downloadConfigFileHandler(params.id)
                    } } />
                </>
            }
        },
        { field: 'created_at', headerName: 'Created At', width: 200, renderCell: (params) => formateDate(params.row.created_at) },

    ];

    const columnsAcceses = [
        { field: 'id', headerName: 'ID', width: 250 },
        { field: 'object_type', headerName: 'Object type', width: 200 },
        { field: 'user_id', headerName: 'User ID', width: 200 },
        {
            field: 'actions', headerName: 'Actions', width: 200, renderCell: (params) => {
                return <CustomDeleteIcon onClick={() => preDeleteAccessHandler(params.id)} />
            }
        },
        { field: 'created_at', headerName: 'Created At', width: 200, renderCell: (params) => formateDate(params.row.created_at) },

    ];

    const preDeleteApiKeyHandler = (apiKeyId) => {
        setSelectedApiKey(apiKeyId)
        setShowConfirmDeleteApiKeyModal(true)
    }

    const preDeleteAccessHandler = (accessId) => {
        setSelectedAccessId(accessId)
        setShowConfirmDeleteAccessModal(true)
    }

    const deleteApiKeyHandler = async () => {
        setLoadingDeletion(true)
        axios.delete(`/api_keys/${selectedApiKey}`)
            .then(res => {
                setApiKeys([...apiKeys.filter(pm => pm.id !== selectedApiKey)])
                setLoadingDeletion(false)
                toast.success("Api key successfully deleted")
                setShowConfirmDeleteApiKeyModal(false)
            })
            .catch(err => {
                setLoadingDeletion(false)
            })
    }

    const generateApikeyHandler = async (name) => {
        setLoadingSubmit(true)
        axios.post('/api_keys', { name })
            .then(res => {
                setApiKeys([res.data, ...apiKeys])
                setCreatedApiKey(res.data)
                setLoadingSubmit(false)
                setShowAddApiKeyModal(false)
                setShowGeneratedApiKeyModal(true)
            })
    }

    const deleteAccessKeyHandler = () => {
        setLoadingDeletion(true)
        axios.delete(`/access/${selectedAccessId}`)
            .then(res => {
                setAccesses(filteredListWithoutRemovedElement(selectedAccessId, accesses))
                setLoadingDeletion(false)
                toast.success("Access successfully revoked")
                setShowConfirmDeleteAccessModal(false)
            })
    }

    const addAccessHandler = (access) => {
        setLoadingAddAccess(true)
        axios.post('/access', access)
            .then(res => {
                setAccesses([...access, res.data.access])
                setLoadingAddAccess(false)
                setShowAddAccessModal(false)
            })
    }

    const downloadConfigFileHandler = (api_key_id) => {
        axios.get(`/config/${api_key_id}`)
            .then((response) => {
                const contentDisposition = response.headers['content-disposition'];
                const filenameMatch = contentDisposition && contentDisposition.match(/filename="(.*?)"/);
                const filename = filenameMatch ? filenameMatch[1] : 'config.txt';
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', filename);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
                toast.success(context.counterpart('iam.apikey.message.successDownloadConfigFile'))
            }).catch(err => {
                console.log(err)
            })
    }

    return (
        <Container fluid className={classes.container} style={{ padding: "0px 20px 20px 20px", }} >
            <DeleteModal resourceName={'api key'} isOpen={showConfirmDeleteApiKeyModal} toggle={() => setShowConfirmDeleteApiKeyModal(!showConfirmDeleteApiKeyModal)} onDelete={deleteApiKeyHandler} loading={loadingDeletion} />
            <DeleteModal resourceName={'access'} isOpen={showConfirmDeleteAccessModal} toggle={() => setShowConfirmDeleteAccessModal(!showConfirmDeleteAccessModal)} onDelete={deleteAccessKeyHandler} loading={loadingDeletion} />
            <AddApiKeyModal isOpen={showAddApiKeyModal} toggle={() => setShowAddApiKeyModal(!showAddApiKeyModal)} onSave={generateApikeyHandler} loading={loadingSubmit} />
            <AddAccessModal
                isOpen={showAddAccessModal}
                toggle={() => setShowAddAccessModal(!showAddAccessModal)}
                userBuckets={userBuckets}
                loading={loadingAddAccess}
                userRegistries={userRegistries}
                userProjects={userProjects}
                userInstances={userInstances}
                onSave={addAccessHandler} />
            <GeneratedApiKeyModal isOpen={showGeneratedApiKeyModal} apiKey={createdApiKey} toggle={() => setShowGeneratedApiKeyModal(!showGeneratedApiKeyModal) && setCreatedApiKey({})} />
            <CardComponent>
                <Row>
                    <Col md="11">
                        <h1 className={classes.mainTitleText} style={{color: colors.mainText[_mode]}}>
                            <Translate content="iam.apikey.title" />
                        </h1>
                    </Col>
                    <Col className='text-end'>
                        <div style={{ paddingBottom: "20px"}}>
                            <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} title={<p className={classes.tootltipValue}>
                                <Translate content="iam.apikey.generate" />
                            </p>} placement="left">
                                <Fab color="primary" aria-label="add" style={{ transform: 'scale(0.7)' }} onClick={() => setShowAddApiKeyModal(true)} >
                                    <AddIcon className="whiteIcon" />
                                </Fab>
                            </Tooltip>
                        </div>
                    </Col>
                </Row>
                <DataTable
                    columns={columns}
                    rows={apiKeys} />
            </CardComponent>
            <br />
            <CardComponent>
                <Row>
                    <Col md="11">
                        <h1 className={classes.mainTitleText} style={{color: colors.mainText[_mode]}}>
                            <Translate content="iam.access.title" />
                        </h1>
                    </Col>
                    <Col className='text-end'>
                        <div style={{ paddingBottom: "20px"}}>
                            <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} title={<p className={classes.tootltipValue}>
                                <Translate content="iam.access.generate" />
                            </p>} placement="left">
                                <Fab color="primary" aria-label="add" style={{ transform: 'scale(0.7)' }} onClick={() => setShowAddAccessModal(true)} >
                                    <AddIcon className="whiteIcon" />
                                </Fab>
                            </Tooltip>
                        </div>
                    </Col>
                </Row>
                <DataTable
                    columns={columnsAcceses}
                    rows={accesses} />
            </CardComponent>
        </Container>
    );
}

export default Credentials;