import { useContext } from "react";
import CardComponent from "../../../../../../Components/Cards/CardComponent/CardComponent";
import { Input, Form, FormGroup, FormFeedback, Col, Row, Label } from "reactstrap"
// import classes from "./K8sEnvironmentForm.module.css"
import '../../../../../../common.css'
import { NavLink, useParams } from "react-router-dom"
import GlobalContext from "../../../../../../Context/GlobalContext";
import colors from "../../../../../../Context/Colors";
import Translate from 'react-translate-component';
import LoadingSpinner from "../../../../../../Components/LoadingSpinner/LoadingSpinner";
import LoadingButton from "../../../../../../Components/LoadingButton/LoadingButton";
import { FormControlLabel } from "@material-ui/core";
import IOSSwitch from "../../../../../../utils/iosswitch";
import DragDropList from "../../../../../../Components/DragDropList/DragDropList";
import useEnvironmentForm from "./useEnvironmentForm";
import { useState } from "react";
import AddExternalChartModal from "./AddExternalChartModal/AddExternalChartModal";

function K8sEnvironmentForm(props) {
    const context = useContext(GlobalContext);
    const { counterpart, mode } = context;
    const { envId } = useParams();
    const [showAddModal, setShowAddModal] = useState(false);
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
        handleExternalRoleAdd,
        handleExternalRoleDelete
    } = useEnvironmentForm();

    const showAddModalHandler = () => {
        setShowAddModal(true);
    }

    if (loading)
        return <LoadingSpinner />
    return (
        <div>
            <AddExternalChartModal toggle={() => setShowAddModal(!showAddModal)} isOpen={showAddModal} onAddRole={handleExternalRoleAdd} />
            <Row>
                <Col>
                    <div className="goBack">
                        <NavLink to='/kubernetes/environments' className="link">
                            <i className="fa-solid fa-arrow-left iconStyle"></i>
                            <Translate content="dashboard.environmentOverview.back" />
                        </NavLink>
                    </div>
                </Col>
            </Row>
            <Row style={{ marginTop: "30px", marginBottom: "20px", margin: "10px 0px 0px" }}>
                <Col className="borderCol" style={{ boxShadow: "0 3px " + colors.bottomShaddow[mode] }}>
                    <h5 className="textTitle" style={{ color: colors.title[mode] }}>
                        <Translate content="dashboard.k8sEnvironments.form.title" />
                    </h5>
                </Col>
            </Row>
            <Row>
                <Col>
                    <CardComponent
                        containerStyles={props.containerStyles}
                        customMarginTop={"20px"}>
                        <Form>
                            <FormGroup>
                                <Label
                                    for="app-name"
                                    style={{ color: colors.title[mode] }}
                                >{counterpart('dashboard.k8sEnvironments.form.nameLabel')}</Label>
                                <Input className="blackableInput" placeholder={counterpart('dashboard.k8sEnvironments.form.namePlaceHolder')}
                                    value={env.name} name="app-name"
                                    onChange={(e) => setEnv({ ...env, name: e.target.value })} invalid={isInvalid} />
                                <FormFeedback>
                                    <Translate className="errorText" content="common.message.thisFieldIsRequired" />
                                </FormFeedback>
                            </FormGroup>
                            <FormGroup>
                                <Label
                                    for="app-description"
                                    style={{ color: colors.title[mode] }}
                                >{counterpart('dashboard.k8sEnvironments.form.descriptionLabel')}</Label>
                                <Input className="blackableInput" type="textarea" placeholder={counterpart('dashboard.k8sEnvironments.form.descriptionPlaceholder')}
                                    value={env.description} name="app-description"
                                    onChange={(e) => setEnv({ ...env, description: e.target.value })} />
                            </FormGroup>
                            <FormGroup>
                                <Label
                                    for="app-logo"
                                    style={{ color: colors.title[mode] }}
                                >{counterpart('dashboard.k8sEnvironments.form.logoUrlLabel')}</Label>
                                <Input className="blackableInput" placeholder={counterpart('dashboard.k8sEnvironments.form.logoUrlPlaceholder')}
                                    value={env.logo_url} name="app-logo"
                                    onChange={(e) => setEnv({ ...env, logo_url: e.target.value })} />
                            </FormGroup>
                            <Row>
                                <FormControlLabel
                                    label={counterpart("dashboard.k8sEnvironments.form.isPrivate")}
                                    control={<IOSSwitch sx={{ m: 1 }} defaultChecked={env.is_private} />}
                                    onChange={(e) => setEnv({ ...env, is_private: e.target.checked })} />
                            </Row>
                        </Form>
                    </CardComponent>
                </Col>
            </Row>
            <div style={{ marginTop: "20px" }} >
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
            <Row style={{ marginTop: '30px' }}  >
                <Col style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <LoadingButton
                        loading={loadingSubmit}
                        icon="fa-solid fa-floppy-disk"
                        onClick={addEnvHandler}  >
                        <Translate content={envId ? "common.button.update" : "common.button.create"} />
                    </LoadingButton>
                </Col>
            </Row>
        </div>
    )
}

export default K8sEnvironmentForm;
