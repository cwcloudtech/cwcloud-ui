import { useContext, useEffect, useState } from "react";
import {
  Col,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";
import CardComponent from "../../../../../../Components/Cards/CardComponent/CardComponent";
// import classes from "./AddK8sApplication.module.css"
import AddIcon from "@mui/icons-material/Add";
import { Fab, OutlinedInput, Stack } from "@mui/material";
import Fade from "@mui/material/Fade";
import Tooltip from "@mui/material/Tooltip";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import Translate from "react-translate-component";
import MiniCardComponent from "../../../../../../Components/Cards/MiniCardComponent/MiniCardComponent";
import DropdownComponent from "../../../../../../Components/Dropdown/Dropdown";
import EnvArgsForm from "../../../../../../Components/EnvArgsForm/EnvArgsForm";
import LoadingButton from "../../../../../../Components/LoadingButton/LoadingButton";
import LoadingSpinner from "../../../../../../Components/LoadingSpinner/LoadingSpinner";
import colors from "../../../../../../Context/Colors";
import GlobalContext from "../../../../../../Context/GlobalContext";
import "../../../../../../common.css";
import useAddK8sApplication from "./useAddK8sApplication";

function AddK8sApplication(props) {
  const context = useContext(GlobalContext);
  const _mode = context.mode;
  const [appInfo, setAppInfo] = useState({ name: "", description: "" });
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedCluster, setSelectedCluster] = useState(null);
  const [isInvalid, setIsInvalid] = useState({
    name: false,
    cluster: false,
    project: false,
    environment: false,
    metadata: false,
    values: false,
  });
  const { projects, clusters, environments, loading, deployApp } =
    useAddK8sApplication();
  const [selectedEnvironment, setSelectedEnvironment] = useState(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [selectedProjectEnv, setSelectedProjectEnv] = useState(null);
  const [argsValues, setArgsValues] = useState(null);
  const params = useSearchParams()[0];
  const navigate = useNavigate();

  useEffect(() => {
    context.setIsGlobal(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedEnvironment) return;
    let args = JSON.parse(selectedEnvironment.args);
    if (!args || args.length === 0) {
      setArgsValues(null);
      return;
    }
    let values = {};
    args.map((arg, index) => {
      values[arg] = "";
      return null
    });
    setArgsValues(values);
  }, [selectedEnvironment]);

  useEffect(() => {
    if (params.get("environment")) {
      const env = environments.find(
        (env) => env.name === params.get("environment")
      );
      if (env) {
        setSelectedEnvironment(env);
      }
    }
  }, [environments, params]);

  const addInstanceHandler = () => {
    let nameIsInvalid = appInfo.name === "";
    let clusterIsInvalid = selectedCluster === null;
    let projectIsInvalid = selectedProject === null;
    let environmentIsInvalid = selectedEnvironment === null;
    let valuesIsInvalid = argsValues
      ? Object.values(argsValues).some((value) => value === "")
      : false;

    setIsInvalid({
      name: nameIsInvalid,
      cluster: clusterIsInvalid,
      project: projectIsInvalid,
      environment: environmentIsInvalid,
      values: valuesIsInvalid,
    });

    if (
      nameIsInvalid ||
      clusterIsInvalid ||
      projectIsInvalid ||
      environmentIsInvalid ||
      valuesIsInvalid
    )
      return;
    setLoadingSubmit(true);
    deployApp(
      {
        name: appInfo.name,
        description: appInfo.description,
        project_id: selectedProject,
        cluster_id: selectedCluster,
        env_id: selectedEnvironment.id,
        args: argsValues,
      },
      () => {
        setLoadingSubmit(false);
        navigate("/k8s-applications");
      }
    );
  };

  if (loading) return <LoadingSpinner />;
  return (
    <div>
      <Row>
        <Col>
          <div className="goBack">
            <NavLink to="/k8s-applications" className="link fs-6">
              <i className="fa-solid fa-arrow-left iconStyle"></i>
              <Translate content="dashboard.k8sApplications.form.backToExplore" />
            </NavLink>
          </div>
        </Col>
      </Row>
      <Row
        style={{
          marginTop: "30px",
          marginBottom: "20px",
          margin: "10px 0px 0px",
        }}
      >
        <Col
          className="borderCol"
          style={{ boxShadow: "0 3px " + colors.bottomShaddow[_mode] }}
        >
          <h5 className="textTitle" style={{ color: colors.title[_mode] }}>
            <Translate content="dashboard.k8sApplications.form.title" />
          </h5>
        </Col>
      </Row>
      <CardComponent
        customMarginTop={"20px"}
        title={context.counterpart("dashboard.k8sApplications.form.title")}
      >
        <Form>
          <FormGroup>
            <Label for="app-name" style={{ color: colors.title[_mode] }}>
              {context.counterpart("dashboard.k8sApplications.form.nameLabel")}*
            </Label>
            <Input
              className="blackableInput"
              placeholder={context.counterpart(
                "dashboard.k8sApplications.form.namePlaceHolder"
              )}
              value={appInfo.name}
              id="app-name"
              onChange={(e) => setAppInfo({ ...appInfo, name: e.target.value })}
              invalid={isInvalid.name}
            />
            <FormFeedback>
              <Translate
                content="common.message.thisFieldIsRequired"
                className="errorText"
              />
            </FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label for="app-description" style={{ color: colors.title[_mode] }}>
              {context.counterpart(
                "dashboard.k8sApplications.form.descriptionLabel"
              )}
            </Label>
            <Input
              className="blackableInput"
              type="textarea"
              placeholder={context.counterpart(
                "dashboard.k8sApplications.form.descriptionPlaceholder"
              )}
              value={appInfo.description}
              id="app-description"
              onChange={(e) =>
                setAppInfo({ ...appInfo, description: e.target.value })
              }
            />
          </FormGroup>
        </Form>
      </CardComponent>
      <CardComponent
        title={
          context.counterpart("dashboard.k8sApplications.form.selectCluster") +
          "*"
        }
        subtitle={context.counterpart(
          "dashboard.k8sApplications.form.selectClusterSubtitle"
        )}
      >
        <Stack>
          <DropdownComponent
            inputLabelId="demo-multiple-name-label"
            name={context.counterpart("dashboard.k8sApplications.form.cluster")}
            selectLabelId="demo-multiple-name-label"
            selectId="demo-multiple-name"
            selectedItem={selectedCluster}
            onChange={(e) => setSelectedCluster(e.target.value)}
            input={<OutlinedInput label="Name" />}
            items={clusters}
          />
          {isInvalid.cluster ? (
            <Translate
              content="common.message.thisFieldIsRequired"
              className="errorText"
            />
          ) : null}
        </Stack>
      </CardComponent>
      <CardComponent
        title={
          context.counterpart("dashboard.k8sApplications.form.selectProject") +
          "*"
        }
        subtitle={context.counterpart(
          "dashboard.k8sApplications.form.selectProjectSubtitle"
        )}
      >
        <Stack>
          <Row>
            <DropdownComponent
              inputLabelId="demo-multiple-name-label"
              name={context.counterpart(
                "dashboard.k8sApplications.form.project"
              )}
              selectLabelId="demo-multiple-name-label"
              selectId="demo-multiple-name"
              selectedItem={selectedProject}
              onChange={(e) => {
                const env = projects.find((project) => {
                  return project.id === e.target.value;
                }).environment;
                if (env) {
                  setSelectedProjectEnv(env.name);
                  setSelectedEnvironment(
                    environments.find((e) => e.id === env.id)
                  );
                } else {
                  setSelectedProjectEnv(null);
                  setSelectedEnvironment(null);
                }
                setSelectedProject(e.target.value);
              }}
              input={<OutlinedInput label="Name" />}
              items={projects}
            />

            <Tooltip
              TransitionComponent={Fade}
              TransitionProps={{ timeout: 600 }}
              title={
                <h5 className="tootltipValue">
                  <Translate content="dashboard.k8sApplications.form.addNewProject" />
                </h5>
              }
              placement="right"
            >
              <Fab
                color="primary"
                aria-label="add"
                onClick={() => navigate("/projects/create")}
                style={{ transform: "scale(0.7)", top: "18px" }}
              >
                <AddIcon className="whiteIcon" />
              </Fab>
            </Tooltip>
            {selectedProjectEnv && (
              <div>
                <p style={{ color: colors.mainText[_mode] }}>
                  {context.counterpart(
                    "dashboard.k8sApplications.form.selectedProjectEnv"
                  ) + selectedProjectEnv}
                </p>
                <p style={{ color: colors.secondText[_mode] }}>
                  {context.counterpart(
                    "dashboard.k8sApplications.form.selectedProjectEnvWarn"
                  )}
                </p>
              </div>
            )}
          </Row>
          {isInvalid.project ? (
            <Translate
              content="common.message.thisFieldIsRequired"
              className="errorText"
            />
          ) : null}
        </Stack>
      </CardComponent>
      {selectedProjectEnv === null ? (
        <CardComponent
          title={context.counterpart(
            "dashboard.k8sApplications.form.selectEnvironement"
          )}
          subtitle={context.counterpart(
            "dashboard.k8sApplications.form.selectEnvironementSubtitle"
          )}
        >
          <Stack>
            <Row horizontal="center">
              {environments.map((environment) => {
                if (!environment.is_private || context.user.is_admin) {
                  return (
                    <MiniCardComponent
                      instancetitle={environment.name}
                      key={environment.id}
                      checked={
                        selectedEnvironment &&
                        selectedEnvironment.id === environment.id
                      }
                      onClick={() => {
                        if (
                          selectedEnvironment &&
                          selectedEnvironment.id === environment.id
                        ) {
                          return;
                        }
                        setSelectedEnvironment(environment);
                      }}
                    />
                  );
                }
                return null
              })}
            </Row>
            {isInvalid.environment ? (
              <Translate
                content="common.message.thisFieldIsRequired"
                className="errorText"
              />
            ) : null}
          </Stack>
        </CardComponent>
      ) : null}
      {selectedEnvironment && (
        <EnvArgsForm
          args={JSON.parse(selectedEnvironment.args) || []}
          title={context.counterpart("dashboard.addEnvironement.argsTitle")}
          subtitle={context.counterpart(
            "dashboard.addEnvironement.argsDescription"
          )}
          argsValues={argsValues}
          setArgsValues={setArgsValues}
          isInvalid={isInvalid.values}
        />
      )}
      <Row style={{ marginTop: "30px" }}>
        <Col
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LoadingButton
            loading={loadingSubmit}
            icon="fa-solid fa-floppy-disk"
            onClick={addInstanceHandler}
          >
            <Translate content="common.button.create" />
          </LoadingButton>
        </Col>
      </Row>
    </div>
  );
}

export default AddK8sApplication;
