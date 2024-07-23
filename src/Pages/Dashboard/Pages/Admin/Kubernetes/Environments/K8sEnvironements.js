import React, { useContext, useEffect, useRef, useState } from "react";
import DataTable from "../../../../../../Components/Table/DataTable";
import { Link, useNavigate } from "react-router-dom";
import classes from "./K8sEnvironements.module.css";
import { Row, Col } from "reactstrap";
import GlobalContext from "../../../../../../Context/GlobalContext";
import formateDate from "../../../../../../utils/FormateDate";
import CardComponent from "../../../../../../Components/Cards/CardComponent/CardComponent";
import DeleteModal from "../../../../../../Components/Modal/DeleteModal";
import Translate from "react-translate-component";
import { Fab, InputAdornment, TextField } from "@mui/material";
import Fade from "@mui/material/Fade";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { toast } from "react-toastify";
import Tooltip from "@mui/material/Tooltip";
import AddIcon from "@mui/icons-material/Add";
import axios from "../../../../../../utils/axios";
import CustomDeleteIcon from "../../../../../../Components/CustomIcon/CustomDeleteIcon";
import filteredListWithoutRemovedElement from "../../../../../../utils/filter";
import PublishOutlinedIcon from "@mui/icons-material/PublishOutlined";
import LoadingSpinner from "../../../../../../Components/LoadingSpinner/LoadingSpinner";

export default function K8sEnvironements(props) {
  const { counterpart } = useContext(GlobalContext);
  const [selectedDeletionItems, setSelectedDeletionItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [multiSelection, setMultiSelection] = useState(false);
  const [filteredEnv, setFilteredEnv] = useState([]);
  const [envs, setEnvs] = useState([]);
  const [selectedEnv, setSelectedEnv] = useState(null);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const uploadFileRef = useRef(null);
  const navigate = useNavigate();

  const columns = [
    {
      field: "id",
      headerName: counterpart("dashboard.k8sEnvironments.explore.table.id"),
      flex: 0,
    },
    {
      field: "name",
      headerName: counterpart("dashboard.k8sEnvironments.explore.table.name"),
      flex: 2,
      renderCell: (params) => (
        <Link to={`/kubernetes/environment/${params.row.id}/edit`}>
          {params.row.name}
        </Link>
      ),
    },
    {
      field: "description",
      headerName: counterpart(
        "dashboard.k8sEnvironments.explore.table.description"
      ),
      flex: 2,
    },
    {
      field: "created_at",
      headerName: counterpart(
        "dashboard.k8sEnvironments.explore.table.creationDate"
      ),
      flex: 2,
      renderCell: (params) => formateDate(params.row.created_at),
    },
    {
      field: "is_private",
      headerName: counterpart(
        "dashboard.k8sEnvironments.explore.table.isPrivate"
      ),
      flex: 2,
    },
    {
      field: "action",
      headerName: counterpart(
        "dashboard.k8sEnvironments.explore.table.actions"
      ),
      flex: 2,
      renderCell: (params) => {
        const onClick = (e) => {
          e.stopPropagation();
          onPreDeleteHandler(params.id);
        };
        return <CustomDeleteIcon onClick={onClick} />;
      },
    },
  ];

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/admin/environment/all?type=k8s`)
      .then((res) => {
        setEnvs(res.data);
        setFilteredEnv(res.data);
        setLoading(false);
      })
      .catch((err) => {
        navigate("/notfound");
      });
  }, [navigate]);

  const filterEnvs = (e) => {
    const searchQuery = e.target.value.trim();
    if (!searchQuery || searchQuery === "") {
      setFilteredEnv(envs);
    } else {
      var filteredItems = envs.filter((envs) =>
        envs.name.includes(searchQuery)
      );
      setFilteredEnv(filteredItems);
    }
  };

  const preDeleteSelectionHandler = (selectedItems) => {
    setMultiSelection(true);
    setShowConfirmDeleteModal(true);
    setSelectedDeletionItems(selectedItems);
  };

  const onPreDeleteHandler = (clusterId) => {
    const clusterIndex = envs.findIndex((p) => p.id === clusterId);
    setSelectedEnv(envs[clusterIndex]);
    setShowConfirmDeleteModal(true);
  };

  const deleteEnvsHandler = async () => {
    setLoading(true);
    new Promise((r, j) => {
      const deletedEnvs = [];
      selectedDeletionItems.forEach((id, index) => {
        axios
          .delete(`/admin/kubernetes/environment/${id}`)
          .then(() => {
            deletedEnvs.push(id);
            if (index === selectedDeletionItems.length - 1) {
              r(deletedEnvs);
            }
          })
          .catch(() => {
            if (index === selectedDeletionItems.length - 1) {
              r(deletedEnvs);
            }
          });
      });
    })
      .then((deleted_envs) => {
        setEnvs([...envs.filter((p) => !deleted_envs.includes(p.id))]);
        setFilteredEnv([...envs.filter((p) => !deleted_envs.includes(p.id))]);
        if (deleted_envs.length > 0)
          toast.success(
            counterpart("dashboard.k8sEnvironments.explore.successDeleteAll")
          );
        setLoading(false);
        setShowConfirmDeleteModal(false);
      })
      .finally(() => {
        setMultiSelection(false);
      });
  };

  const deleteEnvHandler = () => {
    setLoading(true);
    axios
      .delete(`/admin/environment/kubernetes/${selectedEnv.id}`)
      .then((response) => {
        setEnvs(filteredListWithoutRemovedElement(selectedEnv.id, envs));
        setFilteredEnv(
          filteredListWithoutRemovedElement(selectedEnv.id, filteredEnv)
        );
        toast.success(
          counterpart("dashboard.k8sEnvironments.explore.successDelete")
        );
        setShowConfirmDeleteModal(false);
        setLoading(false);
      })
      .catch((err) => {
        setShowConfirmDeleteModal(false);
        setLoading(false);
      });
  };

  const uploadEnvironmentHandler = (e) => {
    if (e.target.files[0]) {
      setLoadingUpload(true);
      const fd = new FormData();
      fd.append("env", e.target.files[0]);
      axios
        .post("/admin/environment/import", fd)
        .then((res) => {
          setEnvs([...envs, res.data]);
          setFilteredEnv([...filteredEnv, res.data]);
          toast.success(`Successfully import environment ${res.data.name}`);
          uploadFileRef.current.value = "";
        })
        .catch((err) => {
          toast.error(
            counterpart("dashboard.k8sEnvironments.explore.errors.upload")
          );
        })
        .finally(() => {
          setLoadingUpload(false);
        });
    }
  };

  const handleAddEnvClick = () => {
    navigate("/kubernetes/environment/create");
  };

  return (
    <CardComponent
      containerStyles={props.containerStyles}
      title={counterpart("dashboard.k8sEnvironments.explore.title")}
      subtitle={counterpart("dashboard.k8sEnvironments.explore.description")}
      link={counterpart("dashboard.k8sEnvironments.explore.learnMore")}
    >
      <DeleteModal
        resourceName={"environment"}
        multi={multiSelection}
        isOpen={showConfirmDeleteModal}
        toggle={() => setShowConfirmDeleteModal(!showConfirmDeleteModal)}
        onMultiDelete={deleteEnvsHandler}
        onDelete={deleteEnvHandler}
        loading={loading}
        name={selectedEnv?.name}
      />
      <Row>
        <Col>
          <div
            style={{ paddingBottom: "20px" }}
            className={classes.clusterCreation}
          >
            <TextField
              onChange={(e) => filterEnvs(e)}
              placeholder={counterpart(
                "dashboard.k8sEnvironments.explore.searchPlaceholder"
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

            <div style={{ display: "flex" }}>
              <input
                accept="application/json`"
                type="file"
                style={{ display: "none" }}
                onChange={uploadEnvironmentHandler}
                ref={uploadFileRef}
              />
              <Tooltip
                TransitionComponent={Fade}
                TransitionProps={{ timeout: 600 }}
                title={
                  <h5 className="tootltipValue">
                    <Translate content="dashboard.environmentsPage.importEnvironment" />
                  </h5>
                }
                placement="bottom"
              >
                <Fab
                  color="primary"
                  aria-label="import"
                  onClick={() => uploadFileRef.current.click()}
                  style={{ transform: "scale(0.7)" }}
                  load
                  disabled={loadingUpload}
                >
                  {loadingUpload ? (
                    <LoadingSpinner
                      spinnerHeight="20px"
                      spinnerWidth="20px"
                      disableBackgroundColor
                      borderWidth="2px"
                    />
                  ) : (
                    <PublishOutlinedIcon className="whiteIcon" />
                  )}
                </Fab>
              </Tooltip>
              <Tooltip
                TransitionComponent={Fade}
                TransitionProps={{ timeout: 600 }}
                title={
                  <h5 className="tootltipValue">
                    <Translate content="dashboard.environmentsPage.addEnvironment" />
                  </h5>
                }
                placement="bottom"
              >
                <Fab
                  color="primary"
                  aria-label="add"
                  onClick={handleAddEnvClick}
                  style={{ transform: "scale(0.7)" }}
                >
                  <AddIcon className="whiteIcon" />
                </Fab>
              </Tooltip>
            </div>
          </div>
        </Col>
      </Row>
      <DataTable
        icon={"fa-solid fa-laptop-code"}
        onCreate={handleAddEnvClick}
        emptyMessage={counterpart(
          "dashboard.k8sEnvironments.explore.emptyMessage"
        )}
        createMessage={counterpart(
          "dashboard.k8sEnvironments.explore.addEnvironement"
        )}
        checkboxSelection
        columns={columns}
        setMultiSelection={setMultiSelection}
        rows={filteredEnv}
        onDeleteSelection={preDeleteSelectionHandler}
      />
    </CardComponent>
  );
}
