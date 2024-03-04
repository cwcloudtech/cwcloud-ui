import * as React from "react";
import CardComponent from "../../../../../../../../../Components/Cards/CardComponent/CardComponent";
import { Col, Row } from "reactstrap";
import classes from "../../../form.module.css";
import { NavLink, useNavigate } from "react-router-dom";
import GlobalContext from "../../../../../../../../../Context/GlobalContext";
import { Container } from "reactstrap";
import Translate from "react-translate-component";
import LoadingButton from "../../../../../../../../../Components/LoadingButton/LoadingButton";
import { useParams } from "react-router-dom";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import ServicePorts from "../../../../../../../../../Components/Kubernetes/AddServices/ServicePorts/ServicePorts";
import IpAddresses from "../../../../../../../../../Components/Kubernetes/AddServices/IpAddresses/IpAddresses";
import Selectors from "../../../../../../../../../Components/Kubernetes/AddServices/Selectors/Selectors";
import LabelsAnnotations from "../../../../../../../../../Components/Kubernetes/Common/LabelsAnnotations/LabelsAnnotations";
import SessionAffinity from "../../../../../../../../../Components/Kubernetes/AddServices/SessionAffinity/SessionAffinity";
import Metadata from "../../../../../../../../../Components/Kubernetes/Common/Metadata/Metadata";
import ConfirmationModal from "../../../../../../../../../Components/Kubernetes/Common/ConfirmationModal/ConfirmationModal";
import { MetadataFormProvider } from "../../../../../../../../../Context/kubernetes/MetadataFormContext";
import { ServiceProvider } from "../../../../../../../../../Context/kubernetes/ServiceFormContext";
import useServiceFormYaml from "../../../../../../../../../Hooks/kubernetes/useServiceFormYaml";
import useCreateK8sObject from "../../../../../../../../../Hooks/kubernetes/useCreateK8sObject";
import { toast } from "react-toastify";
import { CustomTabPanel, ENV_INITAL_VALUE, a11yProps } from "../../../moduleConstants";
import ErrorCard from "../../../../../../../../../Components/Kubernetes/Common/ErrorCard/ErrorCard";
import EditorBox from "../../../../../../../../../Components/EditorBox/EditorBox";

function ServiceForm(props) {
  const { clusterId } = useParams();
  const context = React.useContext(GlobalContext);
  const [codeEditionActive, setCodeEditionActive] = React.useState(false);
  const navigate = useNavigate();
  const [value, setValue] = React.useState(0);
  const [showDiscardChangesModal, setShowDiscardChangesModal] =
    React.useState(false);
  const [discardModalCondition, setDiscardModalCondition] =
    React.useState(false);
  const [prevEnvironment, setPrevEnvironment] =
    React.useState(ENV_INITAL_VALUE);
  const { loading, yamlValue, setYamlValue, updateValues } =
    useServiceFormYaml();
  const { loading: createLoading, createObject, error } = useCreateK8sObject();
  const [isInvalid, setIsInvalid] = React.useState(false)

  React.useEffect(() => {
    if (codeEditionActive) setDiscardModalCondition(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yamlValue]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const addObjectHandler = () => {
    createObject(
      {
        cluster_id: clusterId,
        kind: "service",
      },
      yamlValue,
      () => {
        toast.success(
          context.counterpart(
            "dashboard.kubernetesDashboardPages.serviceDisovery.services.form.successCreate"
          )
        );
        navigate(
          `/kubernetes/cluster/${clusterId}/serviceDiscovery/services/explore`
        );
      },
      () => {
        setIsInvalid(true)
      }
    );
  };

  return (
    <MetadataFormProvider update={updateValues} clusterId={clusterId}>
      <ServiceProvider update={updateValues}>
        <Container style={{ padding: "0" }}>
          <ConfirmationModal
            isOpen={showDiscardChangesModal}
            toggle={() => setShowDiscardChangesModal(!showDiscardChangesModal)}
            onConfirm={() => {
              setYamlValue(prevEnvironment);
              setShowDiscardChangesModal(false);
              setCodeEditionActive(false);
            }}
            message={"dashboard.kubernetesDashboardPages.common.confirmDiscard"}
            title={"dashboard.kubernetesDashboardPages.common.backToForm"}
            onCancel={() => {
              setShowDiscardChangesModal(false);
            }}
          />
          <Row>
            <Col>
              <div className={classes.goBack}>
                <NavLink
                  to={`/kubernetes/cluster/${clusterId}/serviceDiscovery/services/explore`}
                  className={classes.link}
                >
                  <i
                    className={[
                      "fa-solid fa-arrow-left",
                      `${classes.iconStyle}`,
                    ].join(" ")}
                  ></i>
                  <Translate content="dashboard.kubernetesDashboardPages.serviceDisovery.services.form.backToExplore" />
                </NavLink>
              </div>
            </Col>
          </Row>
          {!codeEditionActive && (
            <div>
              <Row style={{ marginTop: "20px" }}>
                <Col>
                  <Metadata isInvalid={isInvalid} setIsInvalid={setIsInvalid} />
                </Col>
              </Row>
              <Row>
                <Col>
                  <CardComponent containerStyles={props.containerStyles}>
                    <Box sx={{ width: "100%" }}>
                      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                        <Tabs value={value} onChange={handleChange}>
                          <Tab label="Service Ports" {...a11yProps(0)} />
                          <Tab label="IP Addresses" {...a11yProps(1)} />
                          <Tab label="Selectors" {...a11yProps(2)} />
                          <Tab label="Session Affinity" {...a11yProps(3)} />
                          <Tab label="Labels & Annotations" {...a11yProps(4)} />
                        </Tabs>
                      </Box>
                      <CustomTabPanel value={value} index={0}>
                        <ServicePorts />
                      </CustomTabPanel>
                      <CustomTabPanel value={value} index={1}>
                        <IpAddresses />
                      </CustomTabPanel>
                      <CustomTabPanel value={value} index={2}>
                        <Selectors />
                      </CustomTabPanel>
                      <CustomTabPanel value={value} index={3}>
                        <SessionAffinity />
                      </CustomTabPanel>
                      <CustomTabPanel value={value} index={4}>
                        <LabelsAnnotations />
                      </CustomTabPanel>
                    </Box>
                  </CardComponent>
                </Col>
              </Row>
            </div>
          )}
          {codeEditionActive && (
            <Row style={{ marginTop: "20px" }}>
              <Col style={{ padding: "0px" }}>
                <EditorBox
                  title={<Translate content="dashboard.kubernetesDashboardPages.serviceDisovery.services.form.title" />}
                  language="yaml"
                  value={yamlValue}
                  textToCopy={yamlValue}
                  onChange={(v) => setYamlValue(v)}
                />
              </Col>
            </Row>
          )}
          {
            error && (
              <ErrorCard error={error} />
            )
          }
          <Row style={{ marginTop: "20px", marginBottom: "20px" }}>
            <Col
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {codeEditionActive ? (
                <LoadingButton
                  color={"error"}
                  className={classes.actionButton}
                  loading={loading}
                  icon={"fa-solid fa-xmark"}
                  onClick={() => {
                    if (discardModalCondition) setShowDiscardChangesModal(true);
                    else {
                      setCodeEditionActive(!codeEditionActive);
                    }
                  }}
                >
                  <Translate content="common.button.cancel" />
                </LoadingButton>
              ) : (
                <LoadingButton
                  className={classes.actionButton}
                  loading={loading}
                  icon={"fa-solid fa-pen"}
                  onClick={() => {
                    setPrevEnvironment(yamlValue);
                    setDiscardModalCondition(false);
                    setCodeEditionActive(!codeEditionActive);
                  }}
                >
                  <Translate content="dashboard.kubernetesDashboardPages.common.editYaml" />
                </LoadingButton>
              )}

              <LoadingButton
                loading={createLoading}
                icon={"fa-solid fa-floppy-disk"}
                onClick={addObjectHandler}
              >
                <Translate content="common.button.create" />
              </LoadingButton>
            </Col>
          </Row>
        </Container>
      </ServiceProvider>
    </MetadataFormProvider>
  );
}

export default ServiceForm;
