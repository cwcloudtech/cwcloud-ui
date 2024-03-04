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
import { Fab, InputAdornment, TextField } from "@mui/material";
import useDeleteResource from "../../../../../../../../Hooks/kubernetes/useDeleteResource";
import useUpdateYaml from "../../../../../../../../Hooks/kubernetes/useUpdateYaml";
import UpdateYaml from "../../../../../../../../Components/Kubernetes/Common/UpdateYaml";
import { getUniqueNamespaces } from "../../../../../../../../utils/kubernetes";

export default function Ingresses(props) {
  const { clusterId } = useParams();
  const { counterpart } = useContext(GlobalContext);
  const context = useContext(GlobalContext);
  const [loading, setLoading] = useState(true);
  const [ingresses, setIngresses] = useState([]);
  const [filteredIngresses, setFilteredIngresses] = useState([]);
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
    deleteResourceHandler,
  } = useDeleteResource({
    resources: ingresses,
    filtredResources: filteredIngresses,
    kind: "ingress",
    setResources: setIngresses,
    setFiltredResources: setFilteredIngresses,
  });

  const fetchData = () => {
    setLoading(true);
    axios
      .get(`/admin/kubernetes/object/cluster/${clusterId}/ingresses`)
      .then((res) => {
        setIngresses(res.data);
        setFilteredIngresses(res.data);
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
    getYaml
  } = useUpdateYaml(clusterId, '/admin/kubernetes/object/cluster/yaml',
    () => {
      fetchData()
      setSelectedObject(null)
    });

  const navigate = useNavigate();

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
      width: 200
    },
    {
      field: "namespace",
      headerName: counterpart(
        "dashboard.kubernetesDashboardPages.common.table.namespace"
      ),
      width: 200
    },
    {
      field: "targets",
      headerName: counterpart(
        "dashboard.kubernetesDashboardPages.serviceDisovery.ingresses.explore.table.target"
      ),
      width: 400,
      renderCell: (params) => {
        if (params.row.targets)
          return (
            <ul style={{ paddingTop: "15px", paddingLeft: "0px" }}>
              {params.row.targets.map((target) => (
                <div key={`target-${generateRandomString(5)}`}>
                  <span>
                    {target.host ? `http://${target.host}` : target.path}
                  </span>
                  <i
                    style={{ marginInline: "7px" }}
                    class="fa-solid fa-angle-right"
                  ></i>
                  <span>{target.target_service}</span>
                </div>
              ))}
            </ul>
          );
      },
    },
    {
      field: "ingressClassName",
      headerName: counterpart(
        "dashboard.kubernetesDashboardPages.serviceDisovery.ingresses.explore.table.ingressClassName"
      ),
      width: 150,
      renderCell: (params) => {
        if (params.row.selectors)
          return (
            <ul style={{ paddingTop: "10px" }}>
              {Object.keys(params.row.selectors).map((key) => (
                <li
                  key={`selector-${generateRandomString(5)}`}
                  style={{ marginBottom: "3px" }}
                >
                  {key}={params.row.selectors[key]}
                </li>
              ))}
            </ul>
          );
      },
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
              kind: "ingress",
              name: params.row.name,
              namespace: params.row.namespace,
              cluster_id: Number.parseInt(clusterId),
            })}
            handleEditYaml={() =>
              handleEditManifestYaml({
                kind: "ingress",
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
    fetchData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const filterIngresses = (e) => {
    const searchQuery = e.target.value.trim();
    var filteredIngresses = []
    if (!searchQuery || searchQuery === "") {
      if (selectedNamespace === "All") {
        setFilteredIngresses(ingresses)
      } else {
        filteredIngresses = ingresses.filter((ingresses) => ingresses.namespace === selectedNamespace);
        setFilteredIngresses(filteredIngresses);
      }
    } else {
      if (selectedNamespace === "All") {
        filteredIngresses = ingresses.filter((services) => services.name.includes(searchQuery));
      } else {
        filteredIngresses = ingresses.filter((services) => services.name.includes(searchQuery) && services.namespace === selectedNamespace);
      }
      setFilteredIngresses(filteredIngresses);
    }
  };

  const filterIngressesByNamespace = (namespace) => {
    setSelectedNamespace(namespace)
    if (namespace === "All") {
      setFilteredIngresses(ingresses)
    } else {
      var filteredIngresses = ingresses.filter((service) =>
        service.namespace === namespace
      );
      setFilteredIngresses(filteredIngresses)
    }
  }

  function getRowId(row) {
    return `${row.name}#/#${row.namespace}`;
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
          backToExplore: "dashboard.kubernetesDashboardPages.serviceDisovery.ingresses.form.backToExplore",
          updateTitle: "dashboard.kubernetesDashboardPages.serviceDisovery.ingresses.form.updateTitle"
        }} />
    );
  }

  return (
    <CardComponent
      containerStyles={props.containerStyles}
      title={counterpart(
        "dashboard.kubernetesDashboardPages.serviceDisovery.ingresses.explore.title"
      )}
      subtitle={counterpart(
        "dashboard.kubernetesDashboardPages.serviceDisovery.ingresses.explore.description"
      )}
      link={counterpart(
        "dashboard.kubernetesDashboardPages.serviceDisovery.ingresses.explore.learnMore"
      )}
    >
      <DeleteModal
        resourceName={"kubernetes ingress"}
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
              onChange={(e) => filterIngresses(e)}
              style={{ width: "80%" }}
              label={context.counterpart(
                "dashboard.kubernetesDashboardPages.serviceDisovery.ingresses.explore.searchLabel"
              )}
              placeholder={context.counterpart(
                "dashboard.kubernetesDashboardPages.serviceDisovery.ingresses.explore.searchPlaceholder"
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
                  onChange={(e) => filterIngressesByNamespace(e.target.value)}
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
                  <Translate content="dashboard.kubernetesDashboardPages.serviceDisovery.ingresses.explore.createIngressDescription" />
                </h5>
              }
              placement="bottom"
            >
              <Fab
                color="primary"
                aria-label="add"
                onClick={() =>
                  navigate(
                    `/kubernetes/cluster/${clusterId}/serviceDiscovery/ingresses/create`
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
            navigate(
              `/kubernetes/cluster/${clusterId}/serviceDiscovery/ingresses/create`
            );
          }}
          emptyMessage={counterpart(
            "dashboard.kubernetesDashboardPages.serviceDisovery.ingresses.explore.emptyMessage"
          )}
          createMessage={counterpart(
            "dashboard.kubernetesDashboardPages.serviceDisovery.ingresses.explore.createIngressDescription"
          )}
          checkboxSelection
          columns={columns}
          setMultiSelection={setMultiSelection}
          rows={filteredIngresses}
          onDeleteSelection={preDeleteSelectionHandler}
          getRowId={getRowId}
          getRowHeight={getRowHeight}
        />
      )}
    </CardComponent>
  );
}
