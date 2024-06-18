import { useState, useContext, useEffect } from "react";
import { Container } from "reactstrap";
import classes from "./K8sOverview.module.css";
import { Row, Col, Button } from "reactstrap";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import axios from "../../../../../../utils/axios";
import { toast } from "react-toastify";
import DeleteModal from "../../../../../../Components/Modal/DeleteModal";
import GlobalContext from "../../../../../../Context/GlobalContext";
import Skeleton from "react-loading-skeleton";
import Translate from "react-translate-component";
import colors from "../../../../../../Context/Colors";
import { Chip } from "@mui/material";
import DataTable from "../../../../../../Components/Table/DataTable";
import generateRandomString from "../../../../../../utils/generateRandomString";

function K8sAppOverview() {
  const { appId } = useParams();
  const [deployedApp, setDeployedApp] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRequest, setloadingRequest] = useState(false);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const context = useContext(GlobalContext);
  const navigate = useNavigate();
  const _mode = context.mode;

  const containersColumns = [
    {
      field: "name",
      headerName: context.counterpart(
        "dashboard.kubernetesDashboardPages.k8sAppOverview.tableContainers.name"
      ),
      flex: 3,
    },
    {
      field: "image",
      headerName: context.counterpart(
        "dashboard.kubernetesDashboardPages.k8sAppOverview.tableContainers.image"
      ),
      flex: 2,
      renderCell: (params) => (
        <div className={classes.tableRow}>{params.row.image}</div>
      ),
    },
    {
      field: "ports",
      headerName: context.counterpart(
        "dashboard.kubernetesDashboardPages.serviceDisovery.services.explore.table.target"
      ),
      flex: 2,
      renderCell: (params) => {
        if (params.row.ports)
          return (
            <ul style={{ paddingTop: "15px" }}>
              {params.row.ports.map((port) => (
                <li key={`port-${generateRandomString(5)}`}>
                  <span>
                    {port.name ?? "_"}:{port.host_port ?? "_"}
                  </span>
                  <i
                    style={{ marginInline: "7px" }}
                    class="fa-solid fa-arrow-right-arrow-left"
                  ></i>
                  <span>
                    {port.container_port ?? "_"}/{port.protocol ?? "_"}
                  </span>
                </li>
              ))}
            </ul>
          );
      },
    },
    {
      field: "started",
      headerName: context.counterpart(
        "dashboard.kubernetesDashboardPages.k8sAppOverview.tableContainers.isStarted"
      ),
      flex: 1,
      renderCell: (params) => (
        <div className={classes.tableRow}>{params.row.started.toString()}</div>
      ),
    },
    {
      field: "restart_count",
      headerName: context.counterpart(
        "dashboard.kubernetesDashboardPages.k8sAppOverview.tableContainers.restartCount"
      ),
      flex: 1,
      renderCell: (params) => (
        <div className={classes.tableRow}>{params.row.restart_count}</div>
      ),
    },
    {
      field: "state",
      headerName: context.counterpart(
        "dashboard.kubernetesDashboardPages.k8sAppOverview.tableContainers.state"
      ),
      flex: 2,
      renderCell: (params) => {
        if (params.row.state.running)
          return (
            <Chip
              label={"Running"}
              style={{
                backgroundColor: "#22c8a2",
                color: "#393939",
              }}
              variant="outlined"
            />
          );
        else if (params.row.state.terminated) {
          return (
            <Chip
              label={"Success"}
              className={classes.success}
              style={{
                backgroundColor: "#4ea8f7",
                color: "#242424",
              }}
              variant="outlined"
            />
          );
        } else if (params.row.state.waiting) {
          return (
            <Chip
              label={"Pending"}
              className={classes.success}
              style={{
                backgroundColor: "#c58a37",
                color: "#242424",
              }}
              variant="outlined"
            />
          );
        } else {
          return (
            <div className={classes.tableRow}>
              <Chip label={"Unknown"} variant="outlined" />
            </div>
          );
        }
      },
    },
  ];

  const podsColumns = [
    {
      field: "name",
      headerName: context.counterpart(
        "dashboard.kubernetesDashboardPages.k8sAppOverview.tablePods.name"
      ),
      flex: 3,
    },
    {
      field: "started",
      headerName: context.counterpart(
        "dashboard.kubernetesDashboardPages.k8sAppOverview.tablePods.startTime"
      ),
      flex: 3,
      renderCell: (params) => (
        <div className={classes.tableRow}>
          {new Date(params.row.start_time).toUTCString()}
        </div>
      ),
    },
    {
      field: "ip",
      headerName: context.counterpart(
        "dashboard.kubernetesDashboardPages.k8sAppOverview.tablePods.ip"
      ),
      flex: 2,
    },
    {
      field: "state",
      headerName: context.counterpart(
        "dashboard.kubernetesDashboardPages.k8sAppOverview.tablePods.state"
      ),
      flex: 2,
      renderCell: (params) => {
        if (params.row.status === "Running")
          return (
            <Chip
              label={"Running"}
              style={{
                backgroundColor: "#22c8a2",
                color: "#393939",
              }}
              variant="outlined"
            />
          );
        else if (params.row.status === "Pending") {
          return (
            <Chip
              label={"Pending"}
              className={classes.success}
              style={{
                backgroundColor: "#c58a37",
                color: "#242424",
              }}
              variant="outlined"
            />
          );
        } else {
          return (
            <Chip
              label={params.row.status}
              style={{
                backgroundColor: "#cc0000",
                color: "#ffffff",
              }}
              variant="outlined"
            />
          );
        }
      },
    },
  ];

  const onPreDeleteHandler = () => {
    setShowConfirmDeleteModal(true);
  };

  useEffect(() => {
    context.setIsGlobal(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDeleteHandler = () => {
    setloadingRequest(true);
    axios
      .delete(
        `/deployedApp/${context.selectedProvider.name}/${context.region.name}/${deployedApp.id}`
      )
      .then((response) => {
        toast.success(
          context.context.counterpart(
            "dashboard.kubernetesDashboardPages.k8sAppOverview.message.successDelete"
          )
        );
        setShowConfirmDeleteModal(false);
        setloadingRequest(false);
        navigate("/k8s-applications");
      })
      .catch((err) => {
        setShowConfirmDeleteModal(false);
        setloadingRequest(false);
      });
  };
  const fetchdeployedApp = () => {
    setLoading(true);
    axios
      .get(`/kubernetes/deployment/${appId}`)
      .then((res) => {
        setDeployedApp(res.data);
      })
      .catch((err) => {
        navigate("/k8s-applications");
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    fetchdeployedApp();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <DeleteModal
        resourceName="deployedApp"
        isOpen={showConfirmDeleteModal}
        toggle={() => setShowConfirmDeleteModal(!showConfirmDeleteModal)}
        onDelete={onDeleteHandler}
        name={deployedApp.name}
        loading={loadingRequest}
      />
      <div className="goBack">
        <NavLink
          to="/k8s-applications"
          className="link"
          style={{ color: colors.blue[_mode] }}
        >
          <i
            className="fa-solid fa-arrow-left iconStyle"
            style={{ color: colors.blue[_mode] }}
          ></i>
          <Translate content="dashboard.kubernetesDashboardPages.k8sAppOverview.back" />
        </NavLink>
      </div>
      <div className="row">
        <Row>
          <Col className={classes.colinline}>
            <i
              className="fa-solid fa-dharmachakra iconProcessStyle"
              style={{ color: colors.blue[_mode] }}
            ></i>
            <div style={{ marginLeft: "20px" }}>
              <h6 style={{ color: colors.mainText[_mode] }}>
                {!loading ? (
                  deployedApp.name
                ) : (
                  <Skeleton
                    style={{ opacity: colors.opacity[_mode] }}
                    width={150}
                  />
                )}
              </h6>
              <h6 style={{ color: "#C3BCC3", fontWeight: "400" }}>
                {!loading ? (
                  deployedApp.namespace
                ) : (
                  <Skeleton
                    style={{ opacity: colors.opacity[_mode] }}
                    width={100}
                  />
                )}
              </h6>
            </div>
          </Col>
        </Row>
      </div>
      <Row className={classes.blocMargin}>
        <h2
          className={classes.titleStyle}
          style={{ color: colors.mainText[_mode] }}
        >
          <Translate content="dashboard.kubernetesDashboardPages.k8sAppOverview.fields.title" />
        </h2>
        <Container
          style={{
            backgroundColor: colors.secondBackground[_mode],
            border: "1px solid " + colors.border[_mode],
            borderRadius: "7px",
          }}
          fluid
        >
          <Row style={{ marginLeft: "15px", marginRight: "15px" }}>
            <Col xs="12" md="3" className="row">
              <h5
                className="textStyle"
                style={{ color: colors.mainText[_mode] }}
              >
                <Translate content="dashboard.kubernetesDashboardPages.k8sAppOverview.fields.environment" />
                :
              </h5>
              <h6
                className={classes.colInlineValue}
                style={{ color: colors.smallTitle[_mode] }}
              >
                {!loading ? (
                  deployedApp.environment?.name
                ) : (
                  <Skeleton style={{ opacity: colors.opacity[_mode] }} />
                )}
              </h6>
            </Col>
            <Col xs="12" md="3" className="row">
              <h5
                className="textStyle"
                style={{ color: colors.mainText[_mode] }}
              >
                <Translate content="dashboard.kubernetesDashboardPages.k8sAppOverview.fields.project" />
                :
              </h5>
              <h6
                className={classes.colInlineValue}
                style={{ color: colors.smallTitle[_mode] }}
              >
                {!loading ? (
                  <Link to={`/project/${deployedApp.project.id}`}>
                    {deployedApp.project.name}
                  </Link>
                ) : (
                  <h6 className={classes.colInlineValueSpec}>
                    <Skeleton
                      style={{ opacity: colors.opacity[_mode] }}
                      width={100}
                    />
                  </h6>
                )}
              </h6>
            </Col>
          </Row>
        </Container>
      </Row>
      {!loading ? (
        <div>
          <h3
            className={classes.titleStyle}
            style={{ color: colors.mainText[_mode] }}
          >
            <Translate content="dashboard.kubernetesDashboardPages.k8sAppOverview.pods" />
          </h3>
          <DataTable
            icon={"fa-solid fa-tablets"}
            onCreate={() => null}
            emptyMessage={context.counterpart(
              "dashboard.kubernetesDashboardPages.k8sAppOverview.emptyContainerMessage"
            )}
            checkboxSelection={false}
            columns={podsColumns}
            rows={deployedApp.pods}
          />
          <h3
            className={classes.titleStyle}
            style={{ color: colors.mainText[_mode],marginTop:"20px" }}
          >
            <Translate content="dashboard.kubernetesDashboardPages.k8sAppOverview.containers" />
          </h3>
          <DataTable
            icon={"fa-solid fa-tablets"}
            onCreate={() => null}
            emptyMessage={context.counterpart(
              "dashboard.kubernetesDashboardPages.k8sAppOverview.emptyContainerMessage"
            )}
            checkboxSelection={false}
            columns={containersColumns}
            rows={deployedApp.containers}
          />
        </div>
      ) : (
        <Skeleton style={{ opacity: colors.opacity[_mode] }} width={100} />
      )}
      {!loading && deployedApp.user_id === context.user.id && (
        <Row className="blocMargin">
          <h2
            className={classes.titleStyle}
            style={{ color: colors.mainText[_mode] }}
          >
            <Translate content="dashboard.kubernetesDashboardPages.k8sAppOverview.fields.deleteTitle" />
          </h2>
          <Container
            style={{
              backgroundColor: colors.secondBackground[_mode],
              border: "1px solid " + colors.border[_mode],
              borderRadius: "7px",
            }}
            fluid
          >
            <Row style={{ marginLeft: "15px", marginRight: "15px" }}>
              <Col xs="12" sm="12" md="9" className="rowD">
                <h6
                  className="test"
                  style={{ color: colors.mainText[_mode] }}
                >
                  <span style={{ color: "#DF4D7A", fontWeight: "bold" }}>
                    <Translate content="dashboard.kubernetesDashboardPages.k8sAppOverview.fields.warning" />
                    !{" "}
                  </span>
                  <Translate content="dashboard.kubernetesDashboardPages.k8sAppOverview.fields.deleteDescription" />
                </h6>
              </Col>
              <Col xs="12" sm="12" md="3" className="rowD">
                <Button
                  color="danger"
                  outline
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    whiteSpace: "nowrap",
                    height: "100%",
                  }}
                  onClick={onPreDeleteHandler}
                >
                  <i
                    className="fa-solid fa-trash-can"
                    style={{ marginRight: "8px" }}
                  ></i>
                  <h6
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      margin: "0",
                    }}
                  >
                    <Translate content="dashboard.kubernetesDashboardPages.k8sAppOverview.buttons.delete" />
                  </h6>
                </Button>
              </Col>
            </Row>
          </Container>
        </Row>
      )}
    </div>
  );
}

export default K8sAppOverview;
