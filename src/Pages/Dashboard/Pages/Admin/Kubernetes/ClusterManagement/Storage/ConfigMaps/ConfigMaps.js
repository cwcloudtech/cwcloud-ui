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
import classes from "../styles.module.css";
import { Row, Col, FormGroup, Input } from "reactstrap";
import Translate from "react-translate-component";
import Fade from "@mui/material/Fade";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import Tooltip from "@mui/material/Tooltip";
import AddIcon from "@mui/icons-material/Add";
import {
  ButtonGroup,
  Fab,
  InputAdornment,
  TextField,
} from "@mui/material";
import useDeleteResource from "../../../../../../../../Hooks/kubernetes/useDeleteResource";
import useUpdateYaml from "../../../../../../../../Hooks/kubernetes/useUpdateYaml";
import UpdateYaml from "../../../../../../../../Components/Kubernetes/Common/UpdateYaml";
import { getUniqueNamespaces } from "../../../../../../../../utils/kubernetes";

export default function Services(props) {
  const { clusterId } = useParams();
  const { counterpart } = useContext(GlobalContext);
  const context = useContext(GlobalContext);
  const [loading, setLoading] = useState(true);
  const [configMaps, setConfigMaps] = useState([]);
  const [filteredConfigMaps, setFilteredConfigMaps] = useState(configMaps);
  const [namespaces, setNamespaces] = useState([]);
  const [selectedNamespace, setSelectedNamespace] = useState('All')

  const {
    deletionLoading,
    showConfirmDeleteModal,
    multiSelection,
    selectedResource,
    setMultiSelection,
    setShowConfirmDeleteModal,
    preDeleteSelectionHandler,
    onPreDeleteHandler,
    deleteResourcesHandler,
    deleteResourceHandler
  } = useDeleteResource({
      resources: configMaps,
      filtredResources: filteredConfigMaps,
      kind: "configmap",
      setResources: setConfigMaps,
      setFiltredResources: setFilteredConfigMaps,
    });
  const navigate = useNavigate();

  const fetchData = () => {
    setLoading(true);
    axios.get(`/admin/kubernetes/object/cluster/${clusterId}/configMaps`).then((res) => {
      setConfigMaps(res.data);
      setFilteredConfigMaps(res.data);
      var namespaces = getUniqueNamespaces(res.data)
      namespaces.unshift("All")
      setNamespaces(namespaces)
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
  }

  const columns = [
    {
      field: "name",
      headerName: counterpart("dashboard.kubernetesDashboardPages.storage.configMaps.explore.table.name"),
      width: 200
    },
    {
      field: "namespace",
      headerName: counterpart("dashboard.kubernetesDashboardPages.storage.configMaps.explore.table.namespace"),
      width: 150
    },
    {
      field: "data_type",
      headerName: counterpart("dashboard.kubernetesDashboardPages.storage.configMaps.explore.table.type"),
      width: 400,
      renderCell: (params) => {
        if (params.row.data_type)
          return 
          (<ButtonGroup>
            {
              params.row.data_type.map(item => (
                <span>{item}</span>
              ))
            }
          </ButtonGroup>)
      }
    },
    {
      field: "creation_date",
      headerName: counterpart("dashboard.kubernetesDashboardPages.storage.configMaps.explore.table.age"),
      width: 130,
      renderCell: (params) => {
        if (params.row.creation_date) {
          return calculateObjectAge(new Date(params.row.creation_date))
        }
        return 'UKNOWN'
      },
    },
    {
      field: "actions",
      headerName: counterpart("dashboard.kubernetesDashboardPages.storage.configMaps.explore.table.actions"),
      width: 150,
      renderCell: (params) => {
        return <K8sObjectActionsList handleDelete={() => {
          onPreDeleteHandler(params.row.name, params.row.namespace)
        }}
          handleDownload={() => handleDownloadManifest({
            kind: "configmap",
            name: params.row.name,
            namespace: params.row.namespace,
            cluster_id: Number.parseInt(clusterId),
          })}
          handleEditYaml={() =>
            handleEditManifestYaml({
              kind: "configmap",
              name: params.row.name,
              namespace: params.row.namespace,
              cluster_id: Number.parseInt(clusterId),
            })
          } />
      }
    },
  ];

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const filterConfigMaps = (e) => {
    const searchQuery = e.target.value.trim();
    var filteredConfigMaps = []
    if (!searchQuery || searchQuery === "") {
      if (selectedNamespace === "All") {
        setFilteredConfigMaps(configMaps);
      } else {
        filteredConfigMaps = configMaps.filter((configMaps) => configMaps.namespace === selectedNamespace);
        setFilteredConfigMaps(filteredConfigMaps);
      }
    } else {
      if (selectedNamespace === "All") {
        filteredConfigMaps = configMaps.filter((configMaps) => configMaps.name.includes(searchQuery));
      } else {
        filteredConfigMaps = configMaps.filter((configMaps) => configMaps.name.includes(searchQuery) && configMaps.namespace === selectedNamespace);
      }
      setFilteredConfigMaps(filteredConfigMaps);
    }
  };

  const filterConfigMapsByNamespace = (namespace) => {
    setSelectedNamespace(namespace)
    if (namespace === "All") {
      setFilteredConfigMaps(configMaps)
    } else {
      var filteredConfigMaps = configMaps.filter(configMap => configMap.namespace === namespace)
      setFilteredConfigMaps(filteredConfigMaps)
    }
  }

  function getRowId(row) {
    return `${row.name}#/#${row.namespace}`;
  }

  const getRowHeight = (params) => {
    return 'auto';
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
          backToExplore: "dashboard.kubernetesDashboardPages.storage.configMaps.form.backToExplore",
          updateTitle: "dashboard.kubernetesDashboardPages.storage.configMaps.form.updateTitle"
        }} />
    );
  }
  return (
    <CardComponent
      containerStyles={props.containerStyles}
      title={counterpart("dashboard.kubernetesDashboardPages.storage.configMaps.explore.title")}
      subtitle={counterpart("dashboard.kubernetesDashboardPages.storage.configMaps.explore.description")}
      link={counterpart("dashboard.kubernetesDashboardPages.storage.configMaps.explore.learnMore")}
    >
      <DeleteModal
        resourceName={"kubernetes ConfigMap"}
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
              onChange={(e) => filterConfigMaps(e)}
              style={{ width: "70%" }}
              label={context.counterpart(
                "dashboard.kubernetesDashboardPages.storage.configMaps.explore.searchLabel"
              )}
              placeholder={context.counterpart(
                "dashboard.kubernetesDashboardPages.storage.configMaps.explore.searchPlaceholder"
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
              title='Namespace'
              placement="bottom"
            >
              <FormGroup style={{ paddingTop: "15px", paddingRight: "10px", paddingLeft: "10px  " }}>
                <Input
                  onChange={(e) => filterConfigMapsByNamespace(e.target.value)}
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
                <h5 className={classes.tootltipValue}>
                  <Translate content="dashboard.kubernetesDashboardPages.storage.configMaps.explore.createServiceDescription" />
                </h5>
              }
              placement="bottom"
            >
              <Fab
                color="primary"
                aria-label="add"
                onClick={() => navigate(`/kubernetes/cluster/${clusterId}/storage/configMaps/create`)}
                style={{ transform: "scale(0.7)" }}
              >
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
            icon={"fa-solid fa-diagram-project"}
            onCreate={() => {
              navigate(`/kubernetes/cluster/${clusterId}/storage/configMaps/create`);
            }}
            emptyMessage={counterpart("dashboard.kubernetesDashboardPages.storage.configMaps.explore.emptyMessage")}
            createMessage={counterpart("dashboard.kubernetesDashboardPages.storage.configMaps.explore.createServiceDescription")}
            checkboxSelection
            columns={columns}
            setMultiSelection={setMultiSelection}
            rows={filteredConfigMaps}
            onDeleteSelection={preDeleteSelectionHandler}
            getRowId={getRowId}
            getRowHeight={getRowHeight}
          />
      }
    </CardComponent>
  );
}
