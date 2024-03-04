import React, { useContext } from "react";
import Translate from "react-translate-component";
import {
    Modal,
    ModalBody,
    ModalHeader,
    Form,
    FormGroup,
    Label,
    Input,
    FormFeedback,
    ModalFooter,
} from "reactstrap";
import GlobalContext from "../../../../../../../Context/GlobalContext";
import colors from "../../../../../../../Context/Colors";
import LoadingButton from "../../../../../../../Components/LoadingButton/LoadingButton";

const AddExternalChartModal = (props) => {
    const { counterpart, mode } = useContext(GlobalContext);
    const [externalChart, setExternalChart] = React.useState({
        name: "",
        version: "",
        repository: "",
    });
    const [isInvalid, setIsInvalid] = React.useState({
        name: false,
        version: false,
        repository: false,
    });

    const modalStyle = {
        maxWidth: "980px", // Default maxWidth for small screens
        width: "50%",
    };

    // Media query for large screens (LG)
    const mediaQueryLarge = window.matchMedia("(min-width: 1200px)");

    // Check if the screen size is large and set maxWidth and height accordingly
    if (mediaQueryLarge.matches) {
        modalStyle.maxWidth = "1800px";
        modalStyle.height = "800px";
    } else {
        modalStyle.height = "600px";
    }

    const handleAddRole = () => {
        if (externalChart.name === '' || externalChart.version === '' || externalChart.repository === '') {
            setIsInvalid({ name: externalChart.name === '', version: externalChart.version === '', repository: externalChart.repository === '' });
            return;
        }
        props.onAddRole(externalChart);
        props.toggle();
        setExternalChart({ name: "", version: "", repository: "" });
    }

    return (
        <Modal centered isOpen={props.isOpen} toggle={props.toggle} style={modalStyle}>
            <ModalHeader toggle={props.toggle}>
                {counterpart("dashboard.k8sEnvironments.externalChartModal.title")}
            </ModalHeader>
            <ModalBody>
                <Form>
                    <FormGroup>
                        <Label for="extrole-name" style={{ color: colors.title[mode] }}>
                            {counterpart(
                                "dashboard.k8sEnvironments.externalChartModal.name"
                            )} *
                        </Label>
                        <Input
                            id="extrole-name"
                            value={externalChart.name}
                            onChange={(e) => {
                                setExternalChart({ ...externalChart, name: e.target.value })
                                setIsInvalid({ ...isInvalid, name: e.target.value === '' })
                            }}
                            name="name"
                            className="blackableInput"
                            placeholder={counterpart(
                                "dashboard.k8sEnvironments.externalChartModal.namePlaceholder"
                            )}
                            invalid={isInvalid.name}
                        />
                        <FormFeedback>
                            <Translate className="errorText" content="common.message.thisFieldIsRequired" />
                        </FormFeedback>
                    </FormGroup>
                    <FormGroup>
                        <Label for="extrole-version" style={{ color: colors.title[mode] }}>
                            {counterpart(
                                "dashboard.k8sEnvironments.externalChartModal.version"
                            )} *
                        </Label>
                        <Input
                            id="extrole-version"
                            value={externalChart.version}
                            onChange={(e) => {
                                setExternalChart({ ...externalChart, version: e.target.value })
                                setIsInvalid({ ...isInvalid, version: e.target.value === '' })
                            }}
                            name="version"
                            className="blackableInput"
                            placeholder={counterpart(
                                "dashboard.k8sEnvironments.externalChartModal.versionPlaceholder"
                            )}
                            invalid={isInvalid.version}
                        />
                        <FormFeedback>
                            <Translate className="errorText" content="common.message.thisFieldIsRequired" />
                        </FormFeedback>
                    </FormGroup>
                    <FormGroup>
                        <Label
                            for="extrole-repository"
                            style={{ color: colors.title[mode] }}
                        >
                            {counterpart(
                                "dashboard.k8sEnvironments.externalChartModal.repository"
                            )} *
                        </Label>
                        <Input
                            id="extrole-repository"
                            value={externalChart.repository}
                            onChange={(e) => {
                                setExternalChart({ ...externalChart, repository: e.target.value })
                                setIsInvalid({ ...isInvalid, repository: e.target.value === '' })
                            }}
                            name="repository"
                            className="blackableInput"
                            placeholder={counterpart(
                                "dashboard.k8sEnvironments.externalChartModal.repositoryPlaceholder"
                            )}
                            invalid={isInvalid.repository}
                        />
                        <FormFeedback>
                            <Translate className="errorText" content="common.message.thisFieldIsRequired" />
                        </FormFeedback>
                    </FormGroup>
                </Form>
            </ModalBody>
            <ModalFooter>
                <LoadingButton
                    color="error"
                    icon="fa-solid fa-xmark"
                    onClick={(e) => props.toggle()}
                    style={{ marginRight: "10px" }}
                >
                    {counterpart("common.button.cancel")}
                </LoadingButton>
                <LoadingButton
                    color="primary"
                    icon="fa-solid fa-plus"
                    onClick={handleAddRole}
                >
                    {counterpart("common.button.add")}
                </LoadingButton>
            </ModalFooter>
        </Modal>
    );
};

export default AddExternalChartModal;
