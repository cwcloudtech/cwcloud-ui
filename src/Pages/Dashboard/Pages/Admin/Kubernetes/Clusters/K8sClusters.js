import React, { useContext, useEffect, useState } from "react";
import DataTable from "../../../../../../Components/Table/DataTable";
import { Link, useNavigate } from "react-router-dom";
import classes from "./K8sClusters.module.css";
import { Row, Col } from "reactstrap";
import GlobalContext from "../../../../../../Context/GlobalContext";
import formateDate from "../../../../../../utils/FormateDate";
import CardComponent from "../../../../../../Components/Cards/CardComponent/CardComponent";
import DeleteModal from "../../../../../../Components/Modal/DeleteModal";
import UploadFileModal from "../../../../../../Components/Modal/UploadFileModal";
import Translate from "react-translate-component";
import {
  Fab,
  InputAdornment,
  TextField,
} from "@mui/material";
import Fade from "@mui/material/Fade";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { toast } from "react-toastify";
import Tooltip from "@mui/material/Tooltip";
import AddIcon from "@mui/icons-material/Add";
import axios from "../../../../../../utils/axios";
import CustomDeleteIcon from "../../../../../../Components/CustomIcon/CustomDeleteIcon";
import filteredListWithoutRemovedElement from "../../../../../../utils/filter";

export default function K8sClusters(props) {
  const { counterpart } = useContext(GlobalContext);
  const context = useContext(GlobalContext);
  const [selectedDeletionItems, setSelectedDeletionItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [showUploadFileModal, setShowUploadFileModal] = useState(false);
  const [multiSelection, setMultiSelection] = useState(false);
  const [filtredClusters, setFiltredClusters] = useState([]);
  const [clusters, setClusters] = useState([]);
  const [selectedCluster, setSlectedCluster] = useState(null);
  const navigate = useNavigate();

  const columns = [
    {
      field: "id",
      headerName: counterpart("dashboard.kubernetesMainPage.table.id"),
      flex: 0,
      renderCell: (params) => (
        <Link to={`/kubernetes/cluster/${params.id}`}>{params.id}</Link>
      ),
    },
    {
      field: "name",
      headerName: counterpart("dashboard.kubernetesMainPage.table.name"),
      flex: 2,
    },
    {
      field: "platform",
      headerName: counterpart("dashboard.kubernetesMainPage.table.provider"),
      flex: 2,
    },
    {
      field: "version",
      headerName: counterpart("dashboard.kubernetesMainPage.table.version"),
      flex: 2,
    },
    {
      field: "created_at",
      headerName: counterpart("dashboard.kubernetesMainPage.table.created"),
      flex: 2,
      renderCell: (params) => formateDate(params.row.created_at),
    },
    {
      field: 'action', headerName: counterpart("dashboard.kubernetesMainPage.table.actions"), flex: 2, renderCell: (params) => {
        const onClick = (e) => {
          e.stopPropagation();
          onPreDeleteHandler(params.id)
        };
        return <CustomDeleteIcon onClick={onClick} />
      }
    }
  ];

  useEffect(() => {
    setLoading(true);
    axios.get(`/admin/kubernetes/cluster`).then((res) => {
      setClusters(res.data);
      setFiltredClusters(res.data);
      setLoading(false);
    })
      .catch((err) => {
        navigate("/notfound");
      });
  }, [navigate]);

  const filterClusters = (e) => {
    const searchQuery = e.target.value.trim();
    if (!searchQuery || searchQuery === "") {
      setFiltredClusters(clusters);
    } else {
      var filteredItems = clusters.filter((clusters) =>
        clusters.name.includes(searchQuery)
      );
      setFiltredClusters(filteredItems);
    }
  };

  const preDeleteSelectionHandler = (selectedItems) => {
    setMultiSelection(true);
    setShowConfirmDeleteModal(true);
    setSelectedDeletionItems(selectedItems);
  };

  const onPreDeleteHandler = (clusterId) => {
    const clusterIndex = clusters.findIndex(p => p.id === clusterId)
    setSlectedCluster(clusters[clusterIndex])
    setShowConfirmDeleteModal(true)
  }

  const deleteClustersHandler = async () => {
    setLoading(true)
    new Promise((r, j) => {
      const deletedClusters = []
      selectedDeletionItems.forEach((projectId, index) => {
        axios.delete(`/admin/kubernetes/cluster/${projectId}`)
          .then(() => {
            deletedClusters.push(projectId)
            if (index === selectedDeletionItems.length - 1) {
              r(deletedClusters)
            }
          })
          .catch(() => {
            if (index === selectedDeletionItems.length - 1) {
              r(deletedClusters)
            }
          })
      })
    })
      .then((deleted_clusters) => {
        setClusters([...clusters.filter(p => !deleted_clusters.includes(p.id))])
        setFiltredClusters([...clusters.filter(p => !deleted_clusters.includes(p.id))])
        if (deleted_clusters.length > 0)
          toast.success(counterpart('dashboard.kubernetesMainPage.multipleDeleteSuccess'))
        setLoading(false)
        setShowConfirmDeleteModal(false)
      }).finally(() => {
        setMultiSelection(false)
      })
  };

  const deleteClusterHandler = () => {
    setLoading(true)
    axios.delete(`/admin/kubernetes/cluster/${selectedCluster.id}`).then(response => {
      setClusters(filteredListWithoutRemovedElement(selectedCluster.id, clusters))
      setFiltredClusters(filteredListWithoutRemovedElement(selectedCluster.id, filtredClusters))
      toast.success(counterpart('dashboard.kubernetesMainPage.deleteSuccess'))
      setShowConfirmDeleteModal(false)
      setLoading(false)
    }).catch(err => {
      setShowConfirmDeleteModal(false)
      setLoading(false)
    })
  }

  const uploadFileHandler = async (e) => {
    setUploadLoading(true);
    const fd = new FormData();
    fd.append("kubeconfig", e.target[0].files[0]);
    axios.post(`/admin/kubernetes/cluster`, fd).then((res) => {
      const file_id = res.data.file_id;
      axios.get(`/admin/kubernetes/cluster/${file_id}`).then((res) => {
        setClusters([...clusters, ...res.data]);
        setFiltredClusters([...clusters, ...res.data]);
        setShowUploadFileModal(false);
        setUploadLoading(false);
        toast.success(context.counterpart('dashboard.kubernetesMainPage.addKubeConfig.message.successAdd'))
      });
    }).catch((err) => {
      toast.error(context.counterpart('dashboard.kubernetesMainPage.addKubeConfig.message.errorAdd'))
    }).finally(() => {
      setUploadLoading(false);
    });
  };

  return (
    <CardComponent
      containerStyles={props.containerStyles}
      title={counterpart("dashboard.kubernetesMainPage.title")}
      subtitle={counterpart("dashboard.kubernetesMainPage.description")}
      link={counterpart("dashboard.kubernetesMainPage.learnMore")}
    >
      <DeleteModal
        resourceName={"cluster"}
        multi={multiSelection}
        isOpen={showConfirmDeleteModal}
        toggle={() => setShowConfirmDeleteModal(!showConfirmDeleteModal)}
        onMultiDelete={deleteClustersHandler}
        onDelete={deleteClusterHandler}
        loading={loading}
        name={selectedCluster?.name}
      />
      <Row>
        <Col>
          <div
            style={{ paddingBottom: "20px" }}
            className={classes.clusterCreation}
          >
            <TextField
              onChange={(e) => filterClusters(e)}
              placeholder={context.counterpart(
                "dashboard.kubernetesMainPage.searchPlaceholder"
              )}
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
            <Tooltip
              TransitionComponent={Fade}
              TransitionProps={{ timeout: 600 }}
              title={
                <h5 className="tootltipValue">
                  <Translate content="dashboard.kubernetesMainPage.importExisting" />
                </h5>
              }
              placement="bottom"
            >
              <Fab
                color="primary"
                aria-label="add"
                onClick={() => setShowUploadFileModal(true)}
                style={{ transform: "scale(0.7)" }}
              >
                <AddIcon className="whiteIcon" />
              </Fab>
            </Tooltip>
          </div>
        </Col>
      </Row>
      <UploadFileModal
        title={"Cluster"}
        isOpen={showUploadFileModal}
        toggle={() => setShowUploadFileModal(!showUploadFileModal)}
        onUpload={uploadFileHandler}
        loading={uploadLoading}
        btnText={counterpart("common.button.upload")}
        accept=".yaml, .yml"
        textIndicator={context.counterpart(
          "dashboard.kubernetesMainPage.addKubeConfig.inputs.file"
        )}
      >
      </UploadFileModal>
      <DataTable
        icon={"fa-solid fa-dharmachakra"}
        onCreate={() => {
          setShowUploadFileModal(true);
        }}
        emptyMessage={counterpart("dashboard.kubernetesMainPage.emptyMessage")}
        createMessage={counterpart("dashboard.kubernetesMainPage.importExisting")}
        checkboxSelection
        columns={columns}
        setMultiSelection={setMultiSelection}
        rows={filtredClusters}
        onDeleteSelection={preDeleteSelectionHandler}
        onDeelte
      />
    </CardComponent>
  );
}
