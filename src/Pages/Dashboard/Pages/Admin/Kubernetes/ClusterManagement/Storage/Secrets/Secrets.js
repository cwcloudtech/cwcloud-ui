import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DataTable from "../../../../../../../../Components/Table/DataTable";
import GlobalContext from "../../../../../../../../Context/GlobalContext";
import CardComponent from "../../../../../../../../Components/Cards/CardComponent/CardComponent";
import DeleteModal from "../../../../../../../../Components/Modal/DeleteModal";
import axios from "../../../../../../../../utils/axios";
import K8sObjectActionsList from "../../../../../../../../Components/Kubernetes/Common/K8sObjectActionsList/K8sObjectActionsList";
import calculateObjectAge from "../../../../../../../../utils/calculateObjectAge";
import LoadingSpinner from "../../../../../../../../Components/LoadingSpinner/LoadingSpinner";
// import classes from "../../styles.module.css";
import '../../../../../../../../common.css';
import { Row, Col, FormGroup, Input } from "reactstrap";
import Translate from "react-translate-component";
import Fade from "@mui/material/Fade";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import Tooltip from "@mui/material/Tooltip";
import AddIcon from "@mui/icons-material/Add";
import { Fab, InputAdornment, TextField } from "@mui/material";
import useDeleteResource from "../../../../../../../../Hooks/kubernetes/useDeleteResource";
import UpdateYaml from "../../../../../../../../Components/Kubernetes/Common/UpdateYaml";
import useUpdateYaml from "../../../../../../../../Hooks/kubernetes/useUpdateYaml";
import { getUniqueNamespaces } from "../../../../../../../../utils/kubernetes";

export default function Secrets(props) {
  const { clusterId } = useParams();
  const { counterpart } = useContext(GlobalContext);
  const context = useContext(GlobalContext);
  const [loading, setLoading] = useState(true);
  const [secrets, setSecrets] = useState([]);
  const [filtredResources, setFiltredResources] = useState([]);
  const [namespaces, setNamespaces] = useState([]);
  const [selectedNamespace, setSelectedNamespace] = useState("All");

  const { deletionLoading, showConfirmDeleteModal, multiSelection, selectedResource,
    setMultiSelection, setShowConfirmDeleteModal, preDeleteSelectionHandler,
    onPreDeleteHandler, deleteResourcesHandler, deleteResourceHandler } = useDeleteResource({
      resources: secrets,
      filtredResources,
      kind: "secret",
      setResources: setSecrets,
      setFiltredResources,
    });

  const navigate = useNavigate();

  const fetchData = () => {
    setLoading(true);
    axios
      .get(`/admin/kubernetes/object/cluster/${clusterId}/secrets`)
      .then((res) => {
        setSecrets(res.data);
        setFiltredResources(res.data);
        var namespaces = getUniqueNamespaces(res.data);
        namespaces.unshift("All")
        setNamespaces(namespaces);
        setLoading(false);
      })
      .catch((err) => {
        navigate("/notfound");
      });
  }

  const {
    setSelectedObject,
    updateYaml,
    updateLoading,
    setYamlValue,
    selectedObject,
    yamlValue,
    getYaml,
  } = useUpdateYaml(clusterId, '/admin/kubernetes/object/cluster/yaml',
    () => {
      fetchData()
      setSelectedObject(null)
    });

  const handleDownloadManifest = (data) => {
    getYaml(data);
  };

  const handleEditManifestYaml = (data) => {
    setSelectedObject(data);
  };


  const columns = [
    {
      field: "name",
      headerName: counterpart(
        "dashboard.kubernetesDashboardPages.common.table.name"
      ),
      width: 220
    },
    {
      field: "namespace",
      headerName: counterpart(
        "dashboard.kubernetesDashboardPages.common.table.namespace"
      ),
      width: 150
    },
    {
      field: "type",
      headerName: counterpart(
        "dashboard.kubernetesDashboardPages.storage.secrets.explore.table.type"
      ),
      width: 220
    },
    {
      field: "creation_date",
      headerName: counterpart(
        "dashboard.kubernetesDashboardPages.common.table.age"
      ),
      width: 150,
      renderCell: (params) => {
        if (params.row.creation_date) {
          return calculateObjectAge(new Date(params.row.creation_date));
        }
        return "UKNOWN";
      },
    },
    {
      field: "actions",
      headerName: counterpart(
        "dashboard.kubernetesDashboardPages.common.table.actions"
      ),
      width: 150,
      renderCell: (params) => {
        return (
          <K8sObjectActionsList
            handleDelete={() => {
              onPreDeleteHandler(params.row.name, params.row.namespace);
            }}
            handleDownload={() => handleDownloadManifest({
              kind: "secret",
              name: params.row.name,
              namespace: params.row.namespace,
              cluster_id: Number.parseInt(clusterId),
            })}
            handleEditYaml={() =>
              handleEditManifestYaml({
                kind: "secret",
                name: params.row.name,
                namespace: params.row.namespace,
                cluster_id: Number.parseInt(clusterId),
              })
            }
          />
        );
      },
    },
  ];

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const filterSecrets = (e) => {
    const searchQuery = e.target.value.trim();
    var filteredSecrets = [];
    if (!searchQuery || searchQuery === "") {
      if (selectedNamespace === "All") {
        setFiltredResources(secrets);
      } else {
        filteredSecrets = secrets.filter(
          (services) => services.namespace === selectedNamespace
        );
        setFiltredResources(filteredSecrets);
      }
    } else {
      if (selectedNamespace === "All") {
        filteredSecrets = secrets.filter(secret => secret.name.includes(searchQuery));
      } else {
        filteredSecrets = secrets.filter(secret => secret.name.includes(searchQuery) && secret.namespace === selectedNamespace);
      }
      setFiltredResources(filteredSecrets);
    }
  };

  const filterSecretsByNamespace = (namespace) => {
    setSelectedNamespace(namespace);
    if (namespace === "All") {
      setFiltredResources(secrets);
    } else {
      var filteredServices = secrets.filter(
        (services) => services.namespace === namespace
      );
      setFiltredResources(filteredServices);
    }
  }

  function getRowId(row) {
    return `${row.name}/${row.namespace}`;
  }

  const getRowHeight = (params) => {
    return "auto";
  };

  if (selectedObject) {
    return (
      <UpdateYaml
        yamlValue={yamlValue}
        setYamlValue={setYamlValue}
        setSelectedObject={setSelectedObject}
        updateLoading={updateLoading}
        updateYaml={updateYaml}
        selectedObject={selectedObject}
        translation={{
          backToExplore: "dashboard.kubernetesDashboardPages.storage.secrets.form.backToExplore",
          updateTitle: "dashboard.kubernetesDashboardPages.storage.secrets.form.updateTitle"
        }} />
    );
  }
  return (
    <CardComponent
      containerStyles={props.containerStyles}
      title={counterpart(
        "dashboard.kubernetesDashboardPages.storage.secrets.explore.title"
      )}
      subtitle={counterpart(
        "dashboard.kubernetesDashboardPages.storage.secrets.explore.description"
      )}
      link={counterpart(
        "dashboard.kubernetesDashboardPages.storage.secrets.explore.learnMore"
      )}
    >
      <DeleteModal
        resourceName={"kubernetes service"}
        name={selectedResource?.name}
        multi={multiSelection}
        isOpen={showConfirmDeleteModal}
        toggle={() => setShowConfirmDeleteModal(!showConfirmDeleteModal)}
        onMultiDelete={deleteResourcesHandler}
        onDelete={deleteResourceHandler}
        loading={deletionLoading}
      />
      <Row>
        <Col>
          <div style={{ paddingBottom: "20px", display: "flex", alignItems:"center", justifyContent: "space-between" }}>
            <TextField
              onChange={(e) => filterSecrets(e)}
              style={{ width: "70%" }}
              label={context.counterpart(
                "dashboard.kubernetesDashboardPages.storage.secrets.explore.searchLabel"
              )}
              placeholder={context.counterpart(
                "dashboard.kubernetesDashboardPages.storage.secrets.explore.searchPlaceholder"
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
            <Tooltip position="top" title='Namespace' >
              <FormGroup style={{ paddingTop: "15px", paddingRight: "10px", paddingLeft: "10px  " }}>
                <Input
                  onChange={(e) => filterSecretsByNamespace(e.target.value)}
                  name="namespace"
                  type="select"
                  className="blackableInput text-center"
                >
                  {namespaces.map((ns) => (
                    <option key={ns} value={ns}>
                      {ns}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Tooltip>
            <Tooltip
              TransitionComponent={Fade}
              TransitionProps={{ timeout: 600 }}
              title={
                <h5 className="tootltipValue">
                  <Translate content="dashboard.kubernetesDashboardPages.storage.secrets.explore.addNewSecret" />
                </h5>
              }
              placement="bottom"
            >
              <Fab
                color="primary"
                aria-label="add"
                onClick={() =>
                  navigate(
                    `/kubernetes/cluster/${clusterId}/storage/secrets/create`
                  )
                }
                style={{ transform: "scale(0.7)" }}
              >
                <AddIcon className="whiteIcon" />
              </Fab>
            </Tooltip>
          </div>
        </Col>
      </Row>
      {loading ? (
        <LoadingSpinner
          disableBackgroundColor
          spinnerHeight={"45px"}
          spinnerWidth={"45px"}
          containerHeight={"400px"}
          borderWidth={"6px"}
        />
      ) : (
        <DataTable
          icon={"fa-solid fa-diagram-project"}
          onCreate={() => {
            navigate(`/kubernetes/cluster/${clusterId}/storage/secrets/create`);
          }}
          emptyMessage={counterpart(
            "dashboard.kubernetesDashboardPages.storage.secrets.explore.emptyMessage"
          )}
          createMessage={counterpart(
            "dashboard.kubernetesDashboardPages.storage.secrets.explore.createSecretDescription"
          )}
          checkboxSelection
          columns={columns}
          setMultiSelection={setMultiSelection}
          rows={filtredResources}
          onDeleteSelection={preDeleteSelectionHandler}
          getRowId={getRowId}
          getRowHeight={getRowHeight}
        />
      )}
    </CardComponent>
  );
}
