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
import LabelsAnnotations from "../../../../../../../../../Components/Kubernetes/Common/LabelsAnnotations/LabelsAnnotations";
import Metadata from "../../../../../../../../../Components/Kubernetes/Common/Metadata/Metadata";
import useFormYaml from "./useFormYaml";
import Rules from "../../../../../../../../../Components/Kubernetes/IngressForm/Rules";
import Certificates from "../../../../../../../../../Components/Kubernetes/IngressForm/Certifcates";
import DefaultBackend from "../../../../../../../../../Components/Kubernetes/IngressForm/DefaultBackend";
import IngressClass from "../../../../../../../../../Components/Kubernetes/IngressForm/IngressClass";
import { IngressFormProvider } from "../../../../../../../../../Context/kubernetes/IngressFormContext";
import { MetadataFormProvider } from "../../../../../../../../../Context/kubernetes/MetadataFormContext";
import useCreateK8sObject from "../../../../../../../../../Hooks/kubernetes/useCreateK8sObject";
import { toast } from "react-toastify";
import ConfirmationModal from "../../../../../../../../../Components/Kubernetes/Common/ConfirmationModal/ConfirmationModal";
import { CustomTabPanel, ENV_INITAL_VALUE, a11yProps } from "../../../moduleConstants";
import ErrorCard from "../../../../../../../../../Components/Kubernetes/Common/ErrorCard/ErrorCard";
import EditorBox from "../../../../../../../../../Components/EditorBox/EditorBox";

function IngressFormPage(props) {
  const { clusterId } = useParams();
  const context = React.useContext(GlobalContext);
  const [codeEditionActive, setCodeEditionActive] = React.useState(false);
  const [value, setValue] = React.useState(0);
  const { loading: createLoading, createObject, error } = useCreateK8sObject();
  const navigate = useNavigate();
  const [isInvalid, setIsInvalid] = React.useState(false)
  const { loading, yamlValue, setYamlValue, updateValues } = useFormYaml({
    kind: "ingress",
  });
  const [showDiscardChangesModal, setShowDiscardChangesModal] = React.useState(false);
  const [discardModalCondition, setDiscardModalCondition] = React.useState(false);
  const [prevEnvironment, setPrevEnvironment] = React.useState(ENV_INITAL_VALUE)

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const addObjectHandler = () => {
    createObject(
      {
        cluster_id: clusterId,
        kind: "ingress",
      },
      yamlValue,
      () => {
        toast.success(
          context.counterpart(
            "dashboard.kubernetesDashboardPages.serviceDisovery.ingresses.form.successCreate"
          )
        );
        navigate(
          `/kubernetes/cluster/${clusterId}/serviceDiscovery/ingresses/explore`
        );
      },
      () => {
        setIsInvalid(true)
      }
    );
  };

  return (
    <MetadataFormProvider update={updateValues} clusterId={clusterId}>
      <IngressFormProvider update={updateValues} clusterId={clusterId}>
        <Container style={{ padding: "0" }}>
          <ConfirmationModal
            isOpen={showDiscardChangesModal}
            toggle={() => setShowDiscardChangesModal(!showDiscardChangesModal)}
            onConfirm={() => {
              setYamlValue(prevEnvironment)
              setShowDiscardChangesModal(false)
              setCodeEditionActive(false)
            }}
            message={"dashboard.kubernetesDashboardPages.common.confirmDiscard"}
            title={"dashboard.kubernetesDashboardPages.common.backToForm"}
            onCancel={() => {
              setShowDiscardChangesModal(false)
            }}
          />
          <Row>
            <Col>
              <div className="goBack">
                <NavLink
                  to={`/kubernetes/cluster/${clusterId}/serviceDiscovery/ingresses/explore`}
                  className="link"
                >
                  <i
                    className="fa-solid fa-arrow-left iconStyle"
                  ></i>
                  <Translate content="dashboard.kubernetesDashboardPages.serviceDisovery.ingresses.form.backToExplore" />
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
                          <Tab
                            label={context.counterpart(
                              "dashboard.kubernetesDashboardPages.serviceDisovery.ingresses.form.rules"
                            )}
                            {...a11yProps(0)}
                          />
                          <Tab
                            label={context.counterpart(
                              "dashboard.kubernetesDashboardPages.serviceDisovery.ingresses.form.defaultBackend"
                            )}
                            {...a11yProps(1)}
                          />
                          <Tab
                            label={context.counterpart(
                              "dashboard.kubernetesDashboardPages.serviceDisovery.ingresses.form.Certificates"
                            )}
                            {...a11yProps(2)}
                          />
                          <Tab
                            label={context.counterpart(
                              "dashboard.kubernetesDashboardPages.serviceDisovery.ingresses.form.ingressClass"
                            )}
                            {...a11yProps(3)}
                          />
                          <Tab
                            label={context.counterpart(
                              "dashboard.kubernetesDashboardPages.common.form.metadata"
                            )}
                            {...a11yProps(4)}
                          />
                        </Tabs>
                      </Box>
                      <CustomTabPanel value={value} index={0}>
                        <Rules />
                      </CustomTabPanel>
                      <CustomTabPanel value={value} index={1}>
                        <DefaultBackend />
                      </CustomTabPanel>
                      <CustomTabPanel value={value} index={2}>
                        <Certificates />
                      </CustomTabPanel>
                      <CustomTabPanel value={value} index={3}>
                        <IngressClass />
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
            <Row style={{ marginTop: "20px"}}>
              <Col style={{ padding: "0px" }}>
                <EditorBox
                  title={<Translate content="dashboard.kubernetesDashboardPages.serviceDisovery.ingresses.form.title" />}
                  language="yaml"
                  value={yamlValue}
                  textToCopy={yamlValue}
                  onChange={(value, event) => {
                    setYamlValue(value);
                  }}
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
              {
                codeEditionActive
                ? <LoadingButton
                  color={"error"}
                  className={classes.actionButton}
                  loading={loading}
                  icon={"fa-solid fa-xmark"}
                  onClick={() => {
                      if (discardModalCondition)
                        setShowDiscardChangesModal(true);
                      else {
                        setCodeEditionActive(!codeEditionActive)
                      }
                    }}
                >
                  <Translate content="common.button.cancel" />
                </LoadingButton>
                : <LoadingButton className={classes.actionButton} loading={loading} icon={"fa-solid fa-pen"} onClick={() => {
                    setPrevEnvironment(yamlValue)
                    setDiscardModalCondition(false);
                    setCodeEditionActive(!codeEditionActive);
                  }}>
                    <Translate content="dashboard.kubernetesDashboardPages.common.editYaml" />
                  </LoadingButton>
              }
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
      </IngressFormProvider>
    </MetadataFormProvider>
  );
}

export default IngressFormPage;
