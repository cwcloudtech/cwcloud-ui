import { useState, useContext, useEffect } from "react";
import { Row, Col } from "reactstrap";
// import classes from "./ProjectsPage.module.css";
import '../../../../../common.css';
import CardComponent from "../../../../../Components/Cards/CardComponent/CardComponent";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "../../../../../utils/axios";
import { isBlank } from "../../../../../utils/common";
import GlobalContext from "../../../../../Context/GlobalContext";
import Tooltip from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Translate from "react-translate-component";
import CustomDeleteIcon from '../../../../../Components/CustomIcon/CustomDeleteIcon';
import DeleteModal from "../../../../../Components/Modal/DeleteModal";
import { toast } from 'react-toastify';
import DataTable from "../../../../../Components/Table/DataTable";
import { TextField } from "@mui/material";
import InputAdornment from '@mui/material/InputAdornment';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import filteredListWithoutRemovedElement from "../../../../../utils/filter";

function ProjectsPage(props) {
    const context = useContext(GlobalContext);
    const currentPath = location.pathname
    const is_admin = currentPath.includes('admin')
    const createLink = is_admin ? "/admin/projects/create" : "/projects/create"
    const [projects, setProjects] = useState([]);
    const [filtredProjects, setFiltredProjects] = useState([]);
    const [loading, setLoading] = useState(true)
    const { counterpart, setIsGlobal, user } = useContext(GlobalContext)
    const [selectedProject, setSelectedProject] = useState(null)
    const [multiSelection, setMultiSelection] = useState(false)
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false)
    const [selectedDeletionItems, setSelectedDeletionItems] = useState([])
    const [users, setUsers] = useState([])
    const navigate = useNavigate()
    const columns = [
        { field: 'id', headerName: counterpart("dashboard.projectsPage.table.id"), width: 100, renderCell: (params) => (<Link to={is_admin ? `/admin/project/${params.id}`:`/project/${params.id}`}>{params.id}</Link>) },
        { field: 'name', headerName: counterpart("dashboard.projectsPage.table.name"), width: 200 },
        { field: 'instances', headerName: counterpart("dashboard.projectsPage.table.numberOfInstances"), width: 100, renderCell: (params) => (params.row.type === 'vm' ? params.instances : 'N/A')},
        { field: 'type', headerName: counterpart("dashboard.projectsPage.table.type"), width: 100 },
        ...(is_admin ? [{
            field: 'owned_by',
            headerName: counterpart("dashboard.projectsPage.table.ownedBy"),
            width: 300,
            renderCell: (params) => {
                const owner = users.find(user => user.id === params.row.userid);
                return owner ? owner.email : 'N/A';
            }
        }] : []),
        {
            field: 'action', headerName: counterpart("dashboard.projectsPage.table.actions"), width: 100, renderCell: (params) => {
                if (params.row.userid === user.id || is_admin) {
                    const onClick = (e) => {
                        e.stopPropagation();
                        onPreDeleteHandler(params.id)
                    };
                    return <CustomDeleteIcon onClick={onClick} />
                }
                return null
            }
        }
    ];

    useEffect(() => {
        if (is_admin) {
            axios.get("/admin/user/all")
                .then(response => {
                    setUsers(response.data.result);
                })
                .catch(error => {
                    toast.error(error.response?.data?.message || context.counterpart("common.message.errorFetchingUsers"));
                });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_admin]);

    const fetchProjects = () => {
        let queryParam = "";
        if (context.user.enabled_features.k8sapi && context.user.enabled_features.daasapi) {
            queryParam = "?type=all";
        } else if (context.user.enabled_features.k8sapi) {
            queryParam = "?type=k8s";
        } else if (context.user.enabled_features.daasapi) {
            queryParam = "?type=vm";
        }
        var api_url = is_admin ? "/admin/project" : `/project${queryParam}`
        axios.get(api_url)
            .then(res => {
                setProjects(res.data)
                setFiltredProjects(res.data)
                setLoading(false)
            })
            .catch(err => {
                setLoading(false)
            })
    }

    useEffect(() => {
        setIsGlobal(true)
        fetchProjects()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onPreDeleteHandler = (projectId) => {
        const projectIndex = projects.findIndex(p => p.id === projectId)
        setSelectedProject(projects[projectIndex])
        setShowConfirmDeleteModal(true)
    }

    const deleteProjectHandler = () => {
        setLoading(true)
        var api_url = is_admin ? `/admin/project/${selectedProject.id}` : `/project/${selectedProject.id}`
        axios.delete(api_url)
        .then(response => {
            setProjects(filteredListWithoutRemovedElement(selectedProject.id, projects))
            setFiltredProjects(filteredListWithoutRemovedElement(selectedProject.id, filtredProjects))
            toast.success(counterpart('dashboard.projectOverview.message.successDelete'))
            setShowConfirmDeleteModal(false)
            setLoading(false)
        }).catch(err => {
            setShowConfirmDeleteModal(false)
            setLoading(false)

        })
    }

    const preDeleteSelectionHandler = (selectedItems) => {
        setMultiSelection(true)
        setShowConfirmDeleteModal(true)
        const allowedProjects = [...projects.filter(b => b.userid === user.id).map(p => p.id)]
        setSelectedDeletionItems(selectedItems.filter(projectId => allowedProjects.includes(projectId)))
    }

    const deleteProjectsHandler = async () => {
        setLoading(true)
        new Promise((r, j) => {
            const deletedProjects = []
            selectedDeletionItems.forEach((projectId, index) => {
                var api_url = is_admin ? `/admin/project/${projectId}` : `/project/${projectId}`
                axios.delete(api_url)
                    .then(() => {
                        deletedProjects.push(projectId)
                        if (index === selectedDeletionItems.length - 1) {
                            r(deletedProjects)
                        }
                    })
                    .catch(() => {
                        if (index === selectedDeletionItems.length - 1) {
                            r(deletedProjects)
                        }
                    })
            })
        })
            .then((deleted_projects) => {
                setProjects([...projects.filter(p => !deleted_projects.includes(p.id))])
                if (deleted_projects.length > 0)
                    toast.success(counterpart('dashboard.projectOverview.message.successMultiDelete'))
                setLoading(false)
                setShowConfirmDeleteModal(false)
            })

    }

    const filtreProjects = (e) => {
        const searchQuery = e.target.value.trim()
        if (isBlank(searchQuery)) {
            setFiltredProjects(projects)
        } else {
            var filtredProjects = projects.filter(project => project.name.includes(searchQuery))
            setFiltredProjects(filtredProjects)
        }
    }

    return (
        <CardComponent
            containerStyles={props.containerStyles}
            title={counterpart("dashboard.projectsPage.title")}
            subtitle={counterpart("dashboard.projectsPage.description")}
            link={counterpart("dashboard.projectsPage.learnMore")}>
            <Row>
                <DeleteModal resourceName={'project'}
                    multi={multiSelection}
                    isOpen={showConfirmDeleteModal}
                    toggle={() => setShowConfirmDeleteModal(!showConfirmDeleteModal)}
                    onMultiDelete={deleteProjectsHandler}
                    onDelete={deleteProjectHandler}
                    name={selectedProject?.name}
                    loading={loading} />
                <Col>
                    <div style={{ paddingBottom: "20px"  }} className="instanceCreation">
                        <TextField
                            onChange={(e) => filtreProjects(e) }
                            label={context.counterpart('dashboard.addProject.inputs.name.placeholder')}
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
                        <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} title={<h5 className="tootltipValue">
                            <Translate content="dashboard.projectsPage.addProject" />
                        </h5>} placement="bottom">
                            <Fab color="primary" aria-label="add" onClick={() => navigate(createLink)} style={{ transform: 'scale(0.7)' }} >
                                <AddIcon className="whiteIcon" />
                            </Fab>
                        </Tooltip>
                    </div>
                </Col>
            </Row>
            <DataTable
                icon={'fa-solid fa-layer-group'}
                createUrl={createLink}
                emptyMessage={counterpart('dashboard.projectsPage.emptyMessage')}
                createMessage={counterpart('dashboard.projectsPage.createMessage')}
                checkboxSelection
                columns={columns}
                setMultiSelection={setMultiSelection}
                rows={filtredProjects.map(p => ({ ...p, instances: p.instances.length }))}
                onDeleteSelection={preDeleteSelectionHandler} />
        </CardComponent>
    );
}

export default ProjectsPage;
