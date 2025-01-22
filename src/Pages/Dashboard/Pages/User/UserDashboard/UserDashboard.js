import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";
import colors from "../../../../../Context/Colors";
import GlobalContext from "../../../../../Context/GlobalContext";
import axios from "../../../../../utils/axios";
import EnvironmentSection from "./EnvironmentSection/EnvironmentSection";
import ResourceItem from "./ResourceItem/ResourceItem";
import classes from "./UserDashboard.module.css";

import Translate from "react-translate-component";
import CardComponent from "../../../../../Components/Cards/CardComponent/CardComponent";
import LoadingButton from "../../../../../Components/LoadingButton/LoadingButton";

const MAX_ENV_ITEMS_PER_TYPE = 6;

const UserDashboard = () => {
  const context = useContext(GlobalContext);
  const _mode = context.mode;
  const [vmEnvironments, setVmEnvironments] = useState([]);
  const [k8sEnvironments, setK8sEnvironments] = useState([]);
  const [k8sDeployments, setK8sDeployments] = useState([]);
  const [faasFunctions, setFaasFunctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState(0);
  const [instances, setInstances] = useState(0);
  const [registries, setRegistries] = useState(0);
  const [buckets, setBuckets] = useState(0);
  const navigate = useNavigate();
  const resourceItemStyle = { flex: "1 0 auto", marginRight: "10px", marginBottom: "10px" };

  useEffect(() => {
    context.setIsGlobal(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchDaasData = () => {
      const requests = [
        axios.get(
          `/environment/all?type=vm&start_index=0&max_results=${MAX_ENV_ITEMS_PER_TYPE}`
        ),
        axios.get(`/user/statistics`)
      ];

      Promise.all(requests).then(([
            vmEnvironments,
            responseUserResources
          ]) => {
            setVmEnvironments(vmEnvironments.data);
            setProjects(responseUserResources.data.projects);
            setInstances(responseUserResources.data.instances);
            setRegistries(responseUserResources.data.registries);
            setBuckets(responseUserResources.data.buckets);
            setLoading(false);
          }
        ).catch((error) => {
          console.error(error);
        });
    };

    const fetchk8sData = () => {
      const requests = [
        axios.get(
          `/environment/all?type=k8s&start_index=0&max_results=${MAX_ENV_ITEMS_PER_TYPE}`
        ),
        axios.get(`/kubernetes/deployment`),
      ];
      Promise.all(requests).then(([k8sEnvironments, k8sDeployments]) => {
          setK8sEnvironments(k8sEnvironments.data);
          setK8sDeployments(k8sDeployments.data.length);
          setLoading(false);
        }).catch((error) => {
          console.error(error);
        });
    };
    const fetchFaasData = () => {
      const requests = [axios.get(`/faas/functions`)];
      Promise.all(requests).then(([faasFunctions]) => {
          setFaasFunctions(faasFunctions.data.results.length);
          setLoading(false);
        }).catch((error) => {
          console.error(error);
        });
    };

    if (context.user.enabled_features.k8sapi) {
      fetchk8sData();
    }

    if (context.user.enabled_features.daasapi) {
      fetchDaasData();
    }

    if (context.user.enabled_features.faasapi) {
      fetchFaasData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.region]);

  return (
    <Container
      fluid
      className={classes.container}
      style={{ padding: "0px 20px 20px 20px", overflow: "hidden" }}
    >
      <Row>
        {!(
          context.user.enabled_features.daasapi ||
          context.user.enabled_features.k8sapi ||
          context.user.enabled_features.faasapi
        ) && (
          <Col md="12" className="text-center">
            <CardComponent>
              <h1
                className={classes.mainTitleText}
                style={{
                  color: colors.mainText[_mode],
                  paddingBottom: "10px",
                  paddingLeft: "5px",
                }}
              >
                <Translate content="dashboard.userDashboard.resourceOverview.noFlagsActivated" />
              </h1>
              <LoadingButton
                style={{ marginTop: "10px" }}
                icon={"fa-solid fa-headset"}
                onClick={() => navigate("/support")}
              >
                  <Translate content="navbar.support" />
              </LoadingButton>
            </CardComponent>
          </Col>
        )}
        <Col md="12">
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            {context.user.enabled_features.daasapi && (
              <>
                <ResourceItem
                  loading={loading}
                  icon="fa-solid fa-microchip"
                  resourceCount={instances}
                  onClick={() => navigate("/instances")}
                  resourceName={context.counterpart(
                    "dashboard.userDashboard.resourceOverview.instances"
                  )}
                  customStyles={resourceItemStyle}
                />
                <ResourceItem
                  loading={loading}
                  icon="fa-solid fa-layer-group"
                  onClick={() => navigate("/projects")}
                  resourceCount={projects}
                  resourceName={context.counterpart(
                    "dashboard.userDashboard.resourceOverview.projects"
                  )}
                  customStyles={resourceItemStyle}
                />
                <ResourceItem
                  loading={loading}
                  icon="fa-solid fa-cube"
                  onClick={() => navigate("/buckets")}
                  resourceCount={buckets}
                  resourceName={context.counterpart(
                    "dashboard.userDashboard.resourceOverview.buckets"
                  )}
                  customStyles={resourceItemStyle}
                />
                <ResourceItem
                  loading={loading}
                  icon="fa-brands fa-docker"
                  onClick={() => navigate("/registries")}
                  resourceCount={registries}
                  resourceName={context.counterpart(
                    "dashboard.userDashboard.resourceOverview.registries"
                  )}
                  customStyles={resourceItemStyle}
                />
              </>
            )}
            {context.user.enabled_features.k8sapi && (
              <ResourceItem
                loading={loading}
                icon="fa-solid fa-dharmachakra"
                onClick={() => navigate("/k8s-applications")}
                resourceCount={k8sDeployments}
                resourceName={context.counterpart(
                  "dashboard.userDashboard.resourceOverview.k8sApplications"
                )}
                customStyles={resourceItemStyle}
              />
            )}
            {context.user.enabled_features.faasapi && (
              <ResourceItem
                loading={loading}
                icon="fa-solid fa-code"
                onClick={() => navigate("/function/overview")}
                resourceCount={faasFunctions}
                resourceName={context.counterpart(
                  "dashboard.userDashboard.resourceOverview.functions"
                )}
                customStyles={resourceItemStyle}
              />
            )}
          </div>
        </Col>
      </Row>
      {(context.user.enabled_features.daasapi ||
        context.user.enabled_features.k8sapi) && (
        <Row>
          <Col style={{ marginTop: "20px" }}>
            <h1
              className={classes.mainTitleText}
              style={{ color: colors.mainText[_mode] }}
            >
              <Translate content="dashboard.userDashboard.availableEnvironments.title" />
            </h1>
          </Col>
        </Row>
      )}
      {context.user.enabled_features.daasapi && (
        <EnvironmentSection
          environments={vmEnvironments}
          type={"vm"}
          loading={loading}
          titleTranslationPath="dashboard.userDashboard.availableEnvironments.vmSubtitle"
          viewMoreLink="/dashboard/environments"
          maxItems={MAX_ENV_ITEMS_PER_TYPE}
        />
      )}
      {context.user.enabled_features.k8sapi && (
        <EnvironmentSection
          environments={k8sEnvironments}
          type={"k8s"}
          hidden={!context.user.enabled_features.k8sapi}
          loading={loading}
          titleTranslationPath="dashboard.userDashboard.availableEnvironments.k8sSubtitle"
          viewMoreLink="/dashboard/environments"
          maxItems={MAX_ENV_ITEMS_PER_TYPE}
        />
      )}
    </Container>
  );
};
export default UserDashboard;
