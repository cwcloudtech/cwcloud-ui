import { useState, useContext, useEffect } from "react";
import { Row, Col } from "reactstrap";
import classes from "./AdminProjectsPage.module.css";
import CardComponent from "../../../../../Components/Cards/CardComponent/CardComponent";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../../../../utils/axios";
import { isBlank } from "../../../../../utils/common";
import GlobalContext from "../../../../../Context/GlobalContext";
import { toast } from 'react-toastify';
import Tooltip from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Translate from "react-translate-component";
import DataTable from "../../../../../Components/DataTable/DataTable";
import DeleteModal from "../../../../../Components/DeleteModal/DeleteModal";
import CustomDeleteIcon from '../../../../../Components/CustomDeleteIcon/CustomDeleteIcon';
import filteredListWithoutRemovedElement from "../../../../../utils/filter";
import { TextField } from "@mui/material";
import InputAdornment from '@mui/material/InputAdornment';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

function AdminProjectsPage(props) {
    const context = useContext(GlobalContext);
    const [projects, setProjects] = useState([]);
    const [filtredProjects, setFiltredProjects] = useState([]);
    const { counterpart, setIsGlobal } = useContext(GlobalContext)
    const [loading, setLoading] = useState(true)
    const [selectedProject, setSelectedProject] = useState(null)
    const [multiSelection, setMultiSelection] = useState(false)
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false)
    const [selectedDeletionItems, setSelectedDeletionItems] = useState([])
    const navigate = useNavigate()
    const columns = [
        { field: 'id', headerName: counterpart("dashboard.projectsPage.table.id"), width: 300, renderCell: (params) => (<Link to={`/admin/project/${params.id}`}>{params.id}</Link>) },
        { field: 'name', headerName: counterpart("dashboard.projectsPage.table.name"), width: 200 },
        { field: 'instances', headerName: counterpart("dashboard.projectsPage.table.numberOfInstances"), width: 200 },
        {
            field: 'action', headerName: counterpart("dashboard.projectsPage.table.actions"), width: 200, renderCell: (params) => {
                const onClick = (e) => {
                    e.stopPropagation();
                    onPreDeleteHandler(params.id)
                };
                return <CustomDeleteIcon onClick={onClick} />
            }
        }
    ];

    useEffect(() => {
        setIsGlobal(true)
        axios.get(`/admin/project`)
            .then(res => {
                setProjects(res.data)
                setFiltredProjects(res.data)
                setLoading(false)
            })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showConfirmDeleteModal])

    const onPreDeleteHandler = (projectId) => {
        setMultiSelection(false)
        const projectIndex = projects.findIndex(p => p.id === projectId)
        setSelectedProject(projects[projectIndex])
        setShowConfirmDeleteModal(true)
    }

    const onDeleteHandler = () => {
        setLoading(true)
        axios.delete(`/admin/project/${selectedProject.id}`).then(response => {
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
        setSelectedDeletionItems(selectedItems)

    }
    const deleteProjectsHandler = async () => {
        setLoading(true)
        new Promise((r, j) => {
            const deletedProjects = []
            selectedDeletionItems.forEach((projectId, index) => {
                axios.delete(`/admin/project/${projectId}`)
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
                    onDelete={onDeleteHandler}
                    name={selectedProject?.name}
                    loading={loading} />
                <Col>
                    <div style={{ paddingBottom: "20px"  }} className={classes.instanceCreation}>
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
                        <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} title={<h5 className={classes.tootltipValue}>
                            <Translate content="dashboard.projectsPage.addProject" />
                        </h5>} placement="bottom">
                            <Fab color="primary" aria-label="add" onClick={() => navigate("/admin/projects/create")} style={{ transform: 'scale(0.7)' }} >
                                <AddIcon className="whiteIcon" />
                            </Fab>
                        </Tooltip>
                    </div>
                </Col>
            </Row>
            <DataTable
                icon={'fa-solid fa-layer-group'}
                createUrl='/admin/projects/create'
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

export default AdminProjectsPage;
