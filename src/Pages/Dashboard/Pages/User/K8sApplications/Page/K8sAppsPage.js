import { useState, useContext, useEffect } from "react";
import { Row, Col } from "reactstrap";
import classes from "./K8sAppsPage.module.css";
import CardComponent from "../../../../../../Components/Cards/CardComponent/CardComponent";
import { Link, useNavigate } from "react-router-dom";
import GlobalContext from "../../../../../../Context/GlobalContext";
import Tooltip from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Translate from "react-translate-component";
import DeleteModal from "../../../../../../Components/Modal/DeleteModal";
import { toast } from 'react-toastify';
import DataTable from "../../../../../../Components/Table/DataTable";
import { TextField } from "@mui/material";
import InputAdornment from '@mui/material/InputAdornment';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import filteredListWithoutRemovedElement from "../../../../../../utils/filter";
import LoadingSpinner from "../../../../../../Components/LoadingSpinner/LoadingSpinner";
import axiosInstance from "../../../../../../utils/axios";
import CustomDeleteIcon from "../../../../../../Components/CustomIcon/CustomDeleteIcon";
import formateDate from "../../../../../../utils/FormateDate";

function K8sAppsPage(props) {
  const context = useContext(GlobalContext);
  const [depApplications, setDepApplications] = useState([]);
  const [filteredDepApplications, setFilteredDepApplications] = useState([]);
  const [loading, setLoading] = useState(true)
  const [deletionLoading, setDeletionLoading] = useState(false)
  const { counterpart } = useContext(GlobalContext)
  const [selectedDepApplication, setSelectedDepApplication] = useState(null)
  const [multiSelection, setMultiSelection] = useState(false)
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false)
  const [selectedDeletionItems, setSelectedDeletionItems] = useState([])
  const navigate = useNavigate()
  const columns = [
    {
      field: "id",
      headerName: counterpart("dashboard.kubernetesDashboardPages.deployedApplications.explore.table.id"),
      flex: 0,
    },
    {
      field: "name",
      headerName: counterpart("dashboard.kubernetesDashboardPages.deployedApplications.explore.table.name"),
      flex: 2,
      renderCell: (params) => (
        <Link to={`app/${params.row.id}`}>{params.row.name}</Link>
      ),
    },
    {
      field: "namespace",
      headerName: counterpart("dashboard.kubernetesDashboardPages.deployedApplications.explore.table.namespace"),
      flex: 2,
    },
    {
      field: "description",
      headerName: counterpart("dashboard.kubernetesDashboardPages.deployedApplications.explore.table.description"),
      flex: 3,
      renderCell: (params) => {
        const description = params.row.description;
        if (description && description !== '')
          return <span>{description}</span>
        return <Translate content={'dashboard.kubernetesDashboardPages.deployedApplications.explore.table.noDescription'} />
      }
    },
    {
      field: "created_at",
      headerName: counterpart("dashboard.kubernetesDashboardPages.deployedApplications.explore.table.creationDate"),
      flex: 1,
      renderCell: (params) => formateDate(params.row.created_at),
    },
    {
      field: "actions",
      headerName: counterpart("dashboard.kubernetesDashboardPages.deployedApplications.explore.table.actions"),
      flex: 1,
      renderCell: (params) => {
        const onClick = (e) => {
          e.stopPropagation();
          onPreDeleteHandler(params.id)
        };
        return <CustomDeleteIcon onClick={onClick} />
      }
    },
  ];

  useEffect(() => {
    context.setIsGlobal(true);
    setLoading(true)
    setDepApplications([])
    setFilteredDepApplications([])
    setLoading(false)
    axiosInstance.get(`/kubernetes/deployment`)
      .then(res => {
        setDepApplications(res.data)
        setFilteredDepApplications(res.data)
        setLoading(false)
      }).catch(() => {
        navigate('/notfound')
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const deleteDepApplicationHandler = () => {
    setDeletionLoading(true)
    axiosInstance.delete(`/kubernetes/deployment/${selectedDepApplication.id}`).then(() => {
      setDepApplications(filteredListWithoutRemovedElement(selectedDepApplication.id, depApplications))
      setFilteredDepApplications(filteredListWithoutRemovedElement(selectedDepApplication.id, filteredDepApplications))
      toast.success(counterpart('dashboard.kubernetesDashboardPages.deployedApplications.explore.successDelete'))
      setShowConfirmDeleteModal(false)
      setDeletionLoading(false)
    }).catch(() => {
      setShowConfirmDeleteModal(false)
      setDeletionLoading(false)
    })
  }

  const onPreDeleteHandler = (id) => {
    const index = depApplications.findIndex(p => p.id === id)
    setSelectedDepApplication(depApplications[index])
    setShowConfirmDeleteModal(true)
  }

  const preDeleteSelectionHandler = (selectedItems) => {
    setMultiSelection(true)
    setShowConfirmDeleteModal(true)
    setSelectedDeletionItems(selectedItems)
  }

  const deleteDepApplicationsHandler = async () => {
    setDeletionLoading(true)
    new Promise((r) => {
      const deleteItems = []
      selectedDeletionItems.forEach((id, index) => {
        axiosInstance.delete(`/kubernetes/deployment/${id}`)
          .then(() => {
            deleteItems.push(id)
            if (index === selectedDeletionItems.length - 1) {
              r(deleteItems)
            }
          })
          .catch(() => {
            if (index === selectedDeletionItems.length - 1) {
              r(deleteItems)
            }
          })
      })
    })
      .then((deleted_deployments) => {
        setDepApplications([...depApplications.filter(p => !deleted_deployments.includes(p.id))])
        setFilteredDepApplications([...depApplications.filter(p => !deleted_deployments.includes(p.id))])
        if (deleted_deployments.length > 0)
          toast.success(counterpart('dashboard.kubernetesDashboardPages.deployedApplications.explore.successDeleteAll'))
        setDeletionLoading(false)
        setShowConfirmDeleteModal(false)
      }).finally(() => {
        setMultiSelection(false)
      })
  }

  const filtreProjects = (e) => {
    const searchQuery = e.target.value.trim()
    if (searchQuery === '') {
      setFilteredDepApplications(depApplications)
    } else {
      var filteredDepApplications = depApplications.filter(project => project.name.includes(searchQuery))
      setFilteredDepApplications(filteredDepApplications)
    }
  }

  return (
    <CardComponent
      containerStyles={props.containerStyles}
      title={counterpart("dashboard.kubernetesDashboardPages.deployedApplications.explore.title")}
      subtitle={counterpart("dashboard.kubernetesDashboardPages.deployedApplications.explore.description")}
      link={counterpart("dashboard.kubernetesDashboardPages.deployedApplications.explore.learnMore")}>
      <Row>
        <DeleteModal resourceName={'application'}
          multi={multiSelection}
          isOpen={showConfirmDeleteModal}
          toggle={() => setShowConfirmDeleteModal(!showConfirmDeleteModal)}
          onMultiDelete={deleteDepApplicationsHandler}
          onDelete={deleteDepApplicationHandler}
          name={selectedDepApplication?.name}
          loading={deletionLoading} />
        <Col>
          <div style={{ paddingBottom: "20px" }} className={classes.instanceCreation}>
            <TextField
              onChange={(e) => filtreProjects(e)}
              placeholder={counterpart('dashboard.kubernetesDashboardPages.deployedApplications.explore.searchPlaceholder')}
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
              <Translate content="dashboard.kubernetesDashboardPages.deployedApplications.explore.deployApplication" />
            </h5>} placement="bottom">
              <Fab color="primary" aria-label="add" onClick={() => navigate(`/k8s-applications/create`)} style={{ transform: 'scale(0.7)' }} >
                <AddIcon className="whiteIcon" />
              </Fab>
            </Tooltip>
          </div>
        </Col>
      </Row>
      {
        loading ?
          <LoadingSpinner disableBackgroundColor spinnerHeight={'45px'} spinnerWidth={'45px'} containerHeight={'400px'} borderWidth={'6px'} />
          : <DataTable
            icon={'fa-solid fa-layer-group'}
            createUrl={`/k8s-applications/create`}
            emptyMessage={counterpart('dashboard.kubernetesDashboardPages.deployedApplications.explore.emptyMessage')}
            createMessage={counterpart('dashboard.kubernetesDashboardPages.deployedApplications.explore.deployApplication')}
            checkboxSelection
            columns={columns}
            setMultiSelection={setMultiSelection}
            rows={filteredDepApplications}
            onDeleteSelection={preDeleteSelectionHandler} />
      }
    </CardComponent>
  );
}

export default K8sAppsPage;
