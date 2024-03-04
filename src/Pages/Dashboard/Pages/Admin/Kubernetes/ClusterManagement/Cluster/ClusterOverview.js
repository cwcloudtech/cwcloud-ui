import React, { useContext, useEffect, useState } from "react";
import { Col, Row, Container, Input, FormGroup } from "reactstrap";
import GlobalContext from "../../../../../../../Context/GlobalContext";
import Translate from 'react-translate-component'
import classes from "./ClusterOverview.module.css"
import colors from "../../../../../../../Context/Colors";
import useClusterOverview from "../../../../../../../Hooks/kubernetes/useClusterOverview";
import ResourceUsage from "../../../../../../../Components/Kubernetes/Common/ResourceUsage/ResourceUsage";
import DataTable from "../../../../../../../Components/Table/DataTable";
import { Chip } from "@material-ui/core";
import LoadingSpinner from "../../../../../../../Components/LoadingSpinner/LoadingSpinner";
import ResourceItem from "../../../../User/UserDashboard/ResourceItem/ResourceItem";
import calculateObjectAge from "../../../../../../../utils/calculateObjectAge";
import { TextField } from "@mui/material";
import InputAdornment from '@mui/material/InputAdornment';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { getUniqueNamespaces } from "../../../../../../../utils/kubernetes";
import Tooltip from '@mui/material/Tooltip';

export default function ClusterOverview() {
  const context = useContext(GlobalContext);
  const _mode = context.mode;
  const { counterpart } = useContext(GlobalContext);
  const { loading, cpu, pods, memory, podsMetrics, resourcesCount, deployments } = useClusterOverview();
  const [filteredPods, setFilteredPods] = useState(pods);
  const [filteredDeployments, setFilteredDeployments] = useState(deployments);
  const [namespaces, setNamespaces] = useState([]);
  const [selectedPodNamespace, setSelectedPodNamespace] = useState("All");
  const [selectedDeploymentNamespace, setSelectedDeploymentNamespace] = useState("All");


  const columns = [
    {
      field: "name",
      headerName: counterpart("dashboard.kubernetesDashboardPages.clusterOverview.name"),
      flex: 3,
      renderCell: (params) => <ul style={{ marginBottom: 0 }}><li>{params.row.name}</li></ul>
    },
    {
      field: "namespace",
      headerName: counterpart("dashboard.kubernetesDashboardPages.clusterOverview.namespace"),
      flex: 2,
      renderCell: (params) => <div className={classes.tableRow}>{params.row.namespace}</div>
    },
    {
      field: "ip",
      headerName: counterpart("dashboard.kubernetesDashboardPages.clusterOverview.pods.ip"),
      flex: 2,
      renderCell: (params) => <div className={classes.tableRow}>{params.row.ip ?? counterpart("dashboard.kubernetesDashboardPages.clusterOverview.unknown")}</div>
    },
    {
      field: "status",
      headerName: counterpart("dashboard.kubernetesDashboardPages.clusterOverview.pods.status"),
      flex: 1,
      renderCell: (params) => {
        if (params.row.status.toUpperCase() === 'SUCCEEDED')
          return <Chip label={"Succeeded"}
            style={{
              backgroundColor: '#22c8a2',
              color: '#393939'
            }} variant="outlined" />
        else if (params.row.status.toUpperCase() === 'RUNNING') {
          return <Chip label={"Running"} className={classes.success}
            style={{
              backgroundColor: '#4ea8f7',
              color: '#242424'
            }} variant="outlined" />
        }
        else if (params.row.status.toUpperCase() === 'PENDING') {
          return <Chip label={"Pending"} className={classes.success}
            style={{
              backgroundColor: '#c58a37',
              color: '#242424'
            }} variant="outlined" />
        }
        else if (params.row.status.toUpperCase() === 'FAILED') {
          return <Chip label={"Failed"} className={classes.success}
            style={{
              backgroundColor: '#de4452',
              color: '#111'
            }} variant="outlined" />
        }
        else {
          return <div className={classes.tableRow}>
            <Chip label={"Unknown"} variant="outlined" />
          </div>
        }
      }
    }
  ];

  const deploymentColumns = [
    {
      field: "name",
      headerName: counterpart("dashboard.kubernetesDashboardPages.clusterOverview.name"),
      flex: 3,
      renderCell: (params) => <ul style={{ marginBottom: 0 }}><li>{params.row.name}</li></ul>
    },
    {
      field: "namespace",
      headerName: counterpart("dashboard.kubernetesDashboardPages.clusterOverview.namespace"),
      flex: 2,
      renderCell: (params) => <div className={classes.tableRow}>{params.row.namespace}</div>
    },
    {
      field: "ready",
      headerName: counterpart("dashboard.kubernetesDashboardPages.clusterOverview.deployments.ready"),
      flex: 2,
      renderCell: (params) => <div className={classes.tableRow}>{params.row.ready_replicas}/{params.row.available_replicas}</div>
    },
    {
      field: "updated",
      headerName: counterpart("dashboard.kubernetesDashboardPages.clusterOverview.deployments.upToDate"),
      flex: 2,
      renderCell: (params) => <div className={classes.tableRow}>{params.row.updated_replicas}</div>
    },
    {
      field: "age",
      headerName: counterpart("dashboard.kubernetesDashboardPages.clusterOverview.deployments.age"),
      flex: 2,
      renderCell: (params) => <div className={classes.tableRow}>{calculateObjectAge(new Date(params.row.age))}</div>
    },
  ];

  function getRowId(row) {
    return `${row.name}#/#${row.namespace}`;
  }

  const getRowHeight = (params) => {
    return 'auto';
  };

  const filterPods = (e) => {
    const searchQuery = e.target.value.trim()
    var filtredPods = []
    if (searchQuery === '') {
      if (selectedPodNamespace === "All") {
        setFilteredPods(pods)
      } else {
        filtredPods = pods.filter(pod => pod.namespace === selectedPodNamespace)
        setFilteredPods(filtredPods)
      }
    } else {
      if (selectedPodNamespace === "All") {
        filtredPods = pods.filter(pod => pod.name.includes(searchQuery))
      } else {
        filtredPods = pods.filter(pod => pod.name.includes(searchQuery) && pod.namespace === selectedPodNamespace)
      }
      setFilteredPods(filtredPods)
    }
  }

  const filterDeployments = (e) => {
    const searchQuery = e.target.value.trim()
    var filtredDeployments = []
    if (searchQuery === '') {
      if (selectedDeploymentNamespace === "All") {
        setFilteredDeployments(deployments)
      } else {
        filtredDeployments = pods.filter(deployment => deployment.namespace === selectedDeploymentNamespace)
        setFilteredPods(filtredDeployments)
      }
    } else {
      if (selectedDeploymentNamespace === "All") {
        filtredDeployments = pods.filter(deployment => deployment.name.includes(searchQuery))
      } else {
        filtredDeployments = pods.filter(deployment => deployment.name.includes(searchQuery) && deployment.namespace === selectedDeploymentNamespace)
      }
      setFilteredDeployments(filtredDeployments)
    }
  }

  const filterPodsByNamespace = (namespace) => {
    setSelectedPodNamespace(namespace)
    if (namespace === "All") {
      setFilteredPods(pods)
      return
    }
    var filteredPodsByNamespace = pods.filter(pod => pod.namespace === namespace)
    setFilteredPods(filteredPodsByNamespace)
  }

  const filterDeploymentsByNamespace = (namespace) => {
    setSelectedDeploymentNamespace(namespace)
    if (namespace === "All") {
      setFilteredDeployments(deployments)
      return
    }
    var filteredDeploymentsByNamespace = deployments.filter(deployment => deployment.namespace === namespace)
    setFilteredDeployments(filteredDeploymentsByNamespace)
  }

  useEffect(() => {
    setFilteredPods(pods)
    setFilteredDeployments(deployments)
    var namespaces = getUniqueNamespaces(pods)
    namespaces.unshift("All")
    setNamespaces(namespaces)
  }, [pods, deployments])

  return (
    <Container fluid className={classes.container} style={{ padding: "0px 20px 20px 20px" }} >
      <Row style={{ marginTop: '10px', marginBottom: '10px' }}>
        <Col>
          <h1 className={classes.mainTitleText} style={{ color: colors.mainText[_mode] }}>
            <Translate content="dashboard.kubernetesDashboardPages.clusterOverview.title" />
          </h1>
        </Col>
      </Row>
      <Row className={classes.cardsRow}>
        <ResourceItem
          customStyles={{
            margin: "0px", flex: "0 0 auto", width: "32%"
          }}
          loading={loading}
          icon='fa-brands fa-mendeley'
          resourceCount={resourcesCount.nodes}
          onClick={() => null}
          resourceName={counterpart('dashboard.kubernetesDashboardPages.clusterOverview.totalNodes')} />
        <ResourceItem
          customStyles={{
            margin: "0px", flex: "0 0 auto", width: "32%"
          }}
          loading={loading}
          icon='fa-solid fa-layer-group'
          onClick={() => null}
          resourceCount={resourcesCount.namespaces}
          resourceName={counterpart('dashboard.kubernetesDashboardPages.clusterOverview.totalNamespaces')} />
        <ResourceItem
          customStyles={{
            margin: "0px", flex: "0 0 auto", width: "32%"
          }}
          loading={loading}
          icon='fa-solid fa-cube'
          onClick={() => null}
          resourceCount={resourcesCount.deployments}
          resourceName={counterpart('dashboard.kubernetesDashboardPages.clusterOverview.deploymentsTitle')} />
      </Row>
      <Row className={classes.cardsRow}>
        <ResourceUsage
          customStyles={{
            margin: "0px", flex: "0 0 auto", width: "32%"
          }}
          loading={loading}
          icon='fa-solid fa-tablets'
          resourceCount={2}
          usedText={podsMetrics.usedText}
          percentage={podsMetrics.percentage}
          resourceName={counterpart('dashboard.kubernetesDashboardPages.clusterOverview.podsTitle')} />
        <ResourceUsage
          customStyles={{
            margin: "0px", flex: "0 0 auto", width: "32%"
          }}
          loading={loading}
          icon='fa-solid fa-microchip'
          resourceCount={2}
          usedText={cpu.usedText}
          percentage={cpu.percentage}
          resourceName={counterpart('dashboard.kubernetesDashboardPages.clusterOverview.cpu')} />
        <ResourceUsage
          customStyles={{
            margin: "0px", flex: "0 0 auto", width: "32%"
          }}
          loading={loading}
          icon='fa-solid fa-memory'
          onClick={() => null}
          usedText={memory.usedText}
          percentage={memory.percentage}
          resourceCount={2}
          resourceName={counterpart('dashboard.kubernetesDashboardPages.clusterOverview.memory')} />
      </Row>
      {
        loading ?
          <LoadingSpinner disableBackgroundColor spinnerHeight={'45px'} spinnerWidth={'45px'} containerHeight={'400px'} borderWidth={'6px'} /> :
          <div>
            <Row style={{ margin: '20px 0px 20px 0px' }}>
              <Col>
                <h1 className={classes.primaryTitle} style={{ color: colors.mainText[_mode] }}>
                  <Translate content="dashboard.kubernetesDashboardPages.clusterOverview.pods.title" />
                </h1>
              </Col>
            </Row>
            <Row style={{ paddingBottom: "10px" }}>
              <Col md='10'>
                <TextField
                    style={{ marginRight: "2px" }}
                    onChange={(e) => filterPods(e) }
                    label={context.counterpart('dashboard.kubernetesDashboardPages.clusterOverview.pods.placeholder')}
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
              </Col>
              <Col md='2'>
                <Tooltip position="top" title='Namespace' >
                  <FormGroup style={{ paddingTop: "12px" }}>
                    <Input
                      id="service-namespace"
                      onChange={(e) => filterPodsByNamespace(e.target.value)}
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
              </Col>
            </Row>
            <DataTable
              icon={"fa-solid fa-tablets"}
              onCreate={() => null}
              emptyMessage={counterpart("dashboard.kubernetesDashboardPages.clusterOverview.pods.emptyMessage")}
              checkboxSelection={false}
              columns={columns}
              rows={filteredPods}
              getRowId={getRowId}
              getRowHeight={getRowHeight}
            />
            <Row style={{ margin: '20px 0px 20px 0px' }}>
              <Col>
                <h1 className={classes.primaryTitle} style={{ color: colors.mainText[_mode] }}>
                  <Translate content="dashboard.kubernetesDashboardPages.clusterOverview.deployments.title" />
                </h1>
              </Col>
            </Row>
            <Row style={{ paddingBottom: "10px" }}>
              <Col md='10'>
                <TextField
                    style={{ marginRight: "2px" }}
                    onChange={(e) => filterDeployments(e) }
                    label={context.counterpart('dashboard.kubernetesDashboardPages.clusterOverview.deployments.placeholder')}
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
              </Col>
              <Col md='2'>
                <Tooltip position="top" title='Namespace' >
                  <FormGroup style={{ paddingTop: "12px" }}>
                    <Input
                      id="service-namespace"
                      onChange={(e) => filterDeploymentsByNamespace(e.target.value)}
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
              </Col>
            </Row>
            <DataTable
              icon={"fa-solid fa-tablets"}
              onCreate={() => null}
              emptyMessage={counterpart("dashboard.kubernetesDashboardPages.clusterOverview.deployments.emptyMessage")}
              checkboxSelection={false}
              columns={deploymentColumns}
              rows={filteredDeployments}
              getRowId={getRowId}
              getRowHeight={getRowHeight}
            />
          </div>
      }
    </Container>
  );
}
