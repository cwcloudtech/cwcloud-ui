import { FormControlLabel } from "@material-ui/core";
import { saveAs } from "file-saver";
import { useContext, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Translate from "react-translate-component";
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
import DragDropList from "../../../../../../Components/DragDropList/DragDropList";
import EditorBox from "../../../../../../Components/EditorBox/EditorBox";
import LoadingButton from "../../../../../../Components/LoadingButton/LoadingButton";
import LoadingSpinner from "../../../../../../Components/LoadingSpinner/LoadingSpinner";
import ArgModal from "../../../../../../Components/Modal/ArgModal";
import EditorModal from "../../../../../../Components/Modal/EditorModal";
import ArgTable from "../../../../../../Components/Table/ArgTable";
import colors from "../../../../../../Context/Colors";
import GlobalContext from "../../../../../../Context/GlobalContext";
import useTableArgs from "../../../../../../Hooks/subdomain/useSubdomain";
import "../../../../../../common.css";
import axios from "../../../../../../utils/axios";
import IOSSwitch from "../../../../../../utils/iosswitch";
import AddExternalChartModal from "./AddExternalChartModal/AddExternalChartModal";
import useEnvironmentForm from "./useEnvironmentForm";

function K8sEnvironmentForm(props) {
  const context = useContext(GlobalContext);
  const { counterpart, mode } = context;
  const { envId } = useParams();
  const [showAddModal, setShowAddModal] = useState(false);
  const [loadingExport, setLoadingExport] = useState(false);
  const {
    env,
    setEnv,
    allObjects,
    selectedObjects,
    unselectedObjects,
    setSelectedObjects,
    setUnselectedObjects,
    loading,
    loadingSubmit,
    isInvalid,
    addEnvHandler,
    externalRoles,
    args,
    setArgs,
    handleExternalRoleAdd,
    handleExternalRoleDelete,
  } = useEnvironmentForm();
  const [showValuesEditorFullScreen, setShowValuesEditorFullScreen] =
    useState(false);
  const [showDocsEditorFullScreen, setShowDocsEditorFullScreen] =
    useState(false);
  const {
    showArgsModalForm,
    setShowArgsModalForm,
    selectedArg,
    handleChangeArgs,
    handleAddNewArgs,
    handleEditArgs,
    handleDeleteArgs,
  } = useTableArgs(args, setArgs);

  const showAddModalHandler = () => {
    setShowAddModal(true);
  };

  const exportEnvironmentHandler = () => {
    setLoadingExport(true);
    axios
      .get(`/admin/environment/${envId}/export`)
      .then((res) => {
        const byteCharacters = atob(res.data.blob.toString("base64"));
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const pdfBlob = new Blob([byteArray], { type: "application/json" });
        saveAs(pdfBlob, res.data.file_name);
        toast.success("Successfully exported environment");
        setLoadingExport(false);
      })
      .catch((err) => {
        setLoadingExport(false);
      });
  };

  if (loading) return <LoadingSpinner />;
  return (
    <div>
      <ArgModal
        title={
          selectedArg
            ? "dashboard.function.inputs.args.addModalTitle"
            : "dashboard.function.inputs.args.editModalTitle"
        }
        isOpen={showArgsModalForm}
        toggle={() => setShowArgsModalForm((prev) => !prev)}
        variable={args[args.length - 1]}
        index={args.length - 1}
        onClick={handleChangeArgs}
      />
      <AddExternalChartModal
        toggle={() => setShowAddModal(!showAddModal)}
        isOpen={showAddModal}
        onAddRole={handleExternalRoleAdd}
      />
      <Row style={{ alignItems: "center" }}>
        <Col xs="10">
          <div className="goBack">
            <NavLink to="/kubernetes/environments" className="link">
              <i className="fa-solid fa-arrow-left iconStyle"></i>
              <Translate content="dashboard.environmentOverview.back" />
            </NavLink>
          </div>
        </Col>
        {envId && (
          <Col xs="2" style={{ display: "flex", justifyContent: "flex-end" }}>
            <LoadingButton
              loading={loadingExport}
              onClick={exportEnvironmentHandler}
            >
              <Translate content="dashboard.k8sEnvironments.form.export" />
            </LoadingButton>
          </Col>
        )}
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
          style={{ boxShadow: "0 3px " + colors.bottomShaddow[mode] }}
        >
          <h5 className="textTitle" style={{ color: colors.title[mode] }}>
            <Translate
              content={
                envId
                  ? "dashboard.k8sEnvironments.explore.updateEnvironment"
                  : "dashboard.k8sEnvironments.explore.addEnvironement"
              }
            />
          </h5>
        </Col>
      </Row>
      <Row>
        <Col>
          <CardComponent
            containerStyles={props.containerStyles}
            customMarginTop={"20px"}
          >
            <Form>
              <FormGroup>
                <Label for="app-name" style={{ color: colors.title[mode] }}>
                  {counterpart("dashboard.k8sEnvironments.form.nameLabel")}
                </Label>
                <Input
                  className="blackableInput"
                  placeholder={counterpart(
                    "dashboard.k8sEnvironments.form.namePlaceHolder"
                  )}
                  value={env.name}
                  name="app-name"
                  onChange={(e) => setEnv({ ...env, name: e.target.value })}
                  invalid={isInvalid}
                />
                <FormFeedback>
                  <Translate
                    className="errorText"
                    content="common.message.thisFieldIsRequired"
                  />
                </FormFeedback>
              </FormGroup>
              <FormGroup>
                <Label for="app-path" style={{ color: colors.title[mode] }}>
                  {counterpart("dashboard.k8sEnvironments.form.pathLabel")}
                </Label>
                <Input
                  className="blackableInput"
                  placeholder={counterpart(
                    "dashboard.k8sEnvironments.form.pathPlaceHolder"
                  )}
                  value={env.path}
                  name="app-path"
                  onChange={(e) => setEnv({ ...env, path: e.target.value })}
                  invalid={isInvalid}
                />
                <FormFeedback>
                  <Translate
                    className="errorText"
                    content="common.message.thisFieldIsRequired"
                  />
                </FormFeedback>
              </FormGroup>
              <FormGroup>
                <Label
                  for="app-description"
                  style={{ color: colors.title[mode] }}
                >
                  {counterpart(
                    "dashboard.k8sEnvironments.form.descriptionLabel"
                  )}
                </Label>
                <Input
                  className="blackableInput"
                  type="textarea"
                  placeholder={counterpart(
                    "dashboard.k8sEnvironments.form.descriptionPlaceholder"
                  )}
                  value={env.description}
                  name="app-description"
                  onChange={(e) =>
                    setEnv({ ...env, description: e.target.value })
                  }
                />
              </FormGroup>
              <FormGroup>
                <Label for="app-logo" style={{ color: colors.title[mode] }}>
                  {counterpart("dashboard.k8sEnvironments.form.logoUrlLabel")}
                </Label>
                <Input
                  className="blackableInput"
                  placeholder={counterpart(
                    "dashboard.k8sEnvironments.form.logoUrlPlaceholder"
                  )}
                  value={env.logo_url}
                  name="app-logo"
                  onChange={(e) => setEnv({ ...env, logo_url: e.target.value })}
                />
              </FormGroup>
              <Row>
                <FormControlLabel
                  label={counterpart(
                    "dashboard.k8sEnvironments.form.isPrivate"
                  )}
                  control={
                    <IOSSwitch sx={{ m: 1 }} defaultChecked={env.is_private} />
                  }
                  onChange={(e) =>
                    setEnv({ ...env, is_private: e.target.checked })
                  }
                />
              </Row>
            </Form>
          </CardComponent>
        </Col>
      </Row>
      <div style={{ marginTop: "20px" }}>
        <DragDropList
          title="dashboard.k8sEnvironments.form.selectCharts"
          roles={allObjects}
          setUnselectedRoles={setUnselectedObjects}
          setSelectedRoles={setSelectedObjects}
          unselectedRoles={unselectedObjects}
          selectedRoles={selectedObjects}
          externalRolesEnabled
          addExternalRole={showAddModalHandler}
          externalRoles={externalRoles}
          removeExternalRole={handleExternalRoleDelete}
        />
      </div>
      <ArgTable
        args={args}
        addNewArg={handleAddNewArgs}
        editArg={handleEditArgs}
        deleteArg={handleDeleteArgs}
      />
      <Row
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <Col md="12">
          <EditorBox
            title={counterpart(
              "dashboard.addEnvironement.inputs.template.title"
            )}
            textToCopy={env.environment_template || ""}
            handleFullScreen={() => setShowValuesEditorFullScreen(true)}
            language="yaml"
            value={env.environment_template || ""}
            onChange={(v) => setEnv({ ...env, environment_template: v })}
          />
          <EditorModal
            isOpen={showValuesEditorFullScreen}
            toggle={() => setShowValuesEditorFullScreen((prev) => !prev)}
            language="yaml"
            value={env.environment_template || ""}
            onChange={(v) => setEnv({ ...env, environment_template: v })}
          />
        </Col>
      </Row>
      <Row
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <Col md="12">
          <EditorBox
            title={counterpart(
              "dashboard.addEnvironement.inputs.template.readme"
            )}
            textToCopy={env.doc_template || ""}
            handleFullScreen={() => setShowDocsEditorFullScreen(true)}
            language="markdown"
            value={env.doc_template || ""}
            onChange={(v) => setEnv({ ...env, doc_template: v })}
          />
          <EditorModal
            isOpen={showDocsEditorFullScreen}
            toggle={() => setShowDocsEditorFullScreen((prev) => !prev)}
            language="yaml"
            value={env.doc_template || ""}
            onChange={(v) => setEnv({ ...env, doc_template: v })}
          />
        </Col>
      </Row>
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
            onClick={addEnvHandler}
          >
            <Translate
              content={envId ? "common.button.update" : "common.button.create"}
            />
          </LoadingButton>
        </Col>
      </Row>
    </div>
  );
}

export default K8sEnvironmentForm;
