import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DataTable from "../../../../../../../../Components/Table/DataTable";
import GlobalContext from "../../../../../../../../Context/GlobalContext";
import CardComponent from "../../../../../../../../Components/Cards/CardComponent/CardComponent";
import DeleteModal from "../../../../../../../../Components/Modal/DeleteModal";
import axios from "../../../../../../../../utils/axios";
import K8sObjectActionsList from "../../../../../../../../Components/Kubernetes/Common/K8sObjectActionsList/K8sObjectActionsList";
import calculateObjectAge from "../../../../../../../../utils/calculateObjectAge";
import generateRandomString from "../../../../../../../../utils/generateRandomString";
import LoadingSpinner from "../../../../../../../../Components/LoadingSpinner/LoadingSpinner";
import classes from "../../styles.module.css";
import { Row, Col, FormGroup, Input } from "reactstrap";
import Translate from "react-translate-component";
import Fade from "@mui/material/Fade";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import Tooltip from "@mui/material/Tooltip";
import AddIcon from "@mui/icons-material/Add";
import {
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
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [namespaces, setNamespaces] = useState([]);
  const [selectedNamespace, setSelectedNamespace] = useState('');

  const { deletionLoading, showConfirmDeleteModal, multiSelection, selectedResource,
    setMultiSelection, setShowConfirmDeleteModal, preDeleteSelectionHandler,
    onPreDeleteHandler, deleteResourcesHandler, deleteResourceHandler } = useDeleteResource({
      resources: services,
      filtredResources: filteredServices,
      kind: "service",
      setResources: setServices,
      setFiltredResources: setFilteredServices,
    });
  const navigate = useNavigate();

  const fetchData = () => {
    setLoading(true);
    axios.get(`/admin/kubernetes/object/cluster/${clusterId}/services`).then((res) => {
      setServices(res.data);
      setFilteredServices(res.data);
      var namespaces = getUniqueNamespaces(res.data);
      namespaces.unshift("All");
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
    error
  } = useUpdateYaml(clusterId, '/admin/kubernetes/object/cluster/yaml',
    () => {
      setSelectedObject(null)
      fetchData()
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
      headerName: counterpart("dashboard.kubernetesDashboardPages.serviceDisovery.services.explore.table.name"),
      width: 250
    },
    {
      field: "namespace",
      headerName: counterpart("dashboard.kubernetesDashboardPages.serviceDisovery.services.explore.table.namespace"),
      width: 150
    },
    {
      field: "targets",
      headerName: counterpart("dashboard.kubernetesDashboardPages.serviceDisovery.services.explore.table.target"),
      width: 250,
      renderCell: (params) => {
        if (params.row.targets)
          return <div style={{ paddingTop: "15px", paddingLeft: "0px" }}>
            {
              params.row.targets.map(target =>
                <span key={`target-${generateRandomString(5)}`}>
                  <span>{target.name ?? '_'}:{target.port ?? '_'}</span>
                  <i style={{ marginInline: "7px" }} class="fa-solid fa-arrow-right-arrow-left"></i>
                  <span>{target.target_port ?? '_'}/{target.protocol ?? '_'}</span>
                </span>
              )
            }
          </div>
      }
    },
    {
      field: "selectors",
      headerName: counterpart("dashboard.kubernetesDashboardPages.serviceDisovery.services.explore.table.selector"),
      width: 400,
      renderCell: (params) => {
        if (params.row.selectors)
          return <ul style={{ paddingTop: "10px", paddingLeft: "0px" }}>
            {
              Object.keys(params.row.selectors).map(key => (
                <li key={`selector-${generateRandomString(5)}`} style={{ marginBottom: "3px" }}>{key}={params.row.selectors[key]}</li>
              ))
            }
          </ul>
      }
    },
    {
      field: "type",
      headerName: counterpart("dashboard.kubernetesDashboardPages.serviceDisovery.services.explore.table.type"),
      width: 100
    },
    {
      field: "creation_date",
      headerName: counterpart("dashboard.kubernetesDashboardPages.serviceDisovery.services.explore.table.age"),
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
      headerName: counterpart("dashboard.kubernetesDashboardPages.serviceDisovery.services.explore.table.actions"),
      width: 150,
      renderCell: (params) => {
        return <K8sObjectActionsList handleDelete={() => {
          onPreDeleteHandler(params.row.name, params.row.namespace)
        }}
          handleDownload={() => handleDownloadManifest({
            kind: "service",
            name: params.row.name,
            namespace: params.row.namespace,
            cluster_id: Number.parseInt(clusterId),
          })}
          handleEditYaml={() =>
            handleEditManifestYaml({
              kind: "service",
              name: params.row.name,
              namespace: params.row.namespace,
              cluster_id: Number.parseInt(clusterId),
            })
          } />
      }
    },
  ];

  const filterServices = (e) => {
    const searchQuery = e.target.value.trim();
    var filteredServices = []
    if (!searchQuery || searchQuery === "") {
      if (selectedNamespace === "All") {
        setFilteredServices(services);
      } else {
        filteredServices = services.filter((service) => service.namespace === selectedNamespace);
        setFilteredServices(filteredServices);
      }
    } else {
      if (selectedNamespace === "All") {
        filteredServices = services.filter((services) => services.name.includes(searchQuery));
      } else {
        filteredServices = services.filter((services) => services.name.includes(searchQuery) && services.namespace === selectedNamespace);
      }
      setFilteredServices(filteredServices);
    }
  };

  const filterServicesByNamespace = (namespace) => {
    setSelectedNamespace(namespace);
    if (namespace === "All") {
      setFilteredServices(services);
    } else {
      var filteredServices = services.filter((service) =>
        service.namespace === namespace
      );
      setFilteredServices(filteredServices);
    }
  }

  function getRowId(row) {
    return `${row.name}#/#${row.namespace}`;
  }

  const getRowHeight = (params) => {
    return 'auto';
  };

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  if (selectedObject) {
    return (
      <UpdateYaml
        yamlValue={yamlValue}
        setYamlValue={setYamlValue}
        setSelectedObject={setSelectedObject}
        updateLoading={updateLoading}
        updateYaml={updateYaml}
        selectedObject={selectedObject}
        error={error}
        translation={{
          backToExplore: "dashboard.kubernetesDashboardPages.serviceDisovery.services.form.backToExplore",
          updateTitle: "dashboard.kubernetesDashboardPages.serviceDisovery.services.form.updateTitle"
        }} />
    );
  }
  return (
    <CardComponent
      containerStyles={props.containerStyles}
      title={counterpart("dashboard.kubernetesDashboardPages.serviceDisovery.services.explore.title")}
      subtitle={counterpart("dashboard.kubernetesDashboardPages.serviceDisovery.services.explore.description")}
      link={counterpart("dashboard.kubernetesDashboardPages.serviceDisovery.services.explore.learnMore")}
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
                onChange={(e) => filterServices(e)}
                style={{ width: "80%" }}
                label={context.counterpart(
                  "dashboard.kubernetesDashboardPages.serviceDisovery.services.explore.searchLabel"
                )}
                placeholder={context.counterpart(
                  "dashboard.kubernetesDashboardPages.serviceDisovery.services.explore.searchPlaceholder"
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
                    id="service-namespace"
                    onChange={(e) => filterServicesByNamespace(e.target.value)}
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
                    <Translate content="dashboard.kubernetesDashboardPages.serviceDisovery.services.explore.createServiceDescription" />
                  </h5>
                }
                placement="bottom"
              >
                <Fab
                  color="primary"
                  aria-label="add"
                  onClick={() => navigate(`/kubernetes/cluster/${clusterId}/serviceDiscovery/services/create`)}
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
              navigate(`/kubernetes/cluster/${clusterId}/serviceDiscovery/services/create`);
            }}
            emptyMessage={counterpart("dashboard.kubernetesDashboardPages.serviceDisovery.services.explore.emptyMessage")}
            createMessage={counterpart("dashboard.kubernetesDashboardPages.serviceDisovery.services.explore.createServiceDescription")}
            checkboxSelection
            columns={columns}
            setMultiSelection={setMultiSelection}
            rows={filteredServices}
            onDeleteSelection={preDeleteSelectionHandler}
            getRowId={getRowId}
            getRowHeight={getRowHeight}
          />
      }
    </CardComponent>
  );
}

