import React, { useContext } from "react";
import { Input, Form, FormGroup, FormFeedback, Col, Row, Label } from "reactstrap"
import GlobalContext from "../../../../Context/GlobalContext";
import colors from "../../../../Context/Colors";
import Translate from "react-translate-component";
import classes from "./ServicePorts.module.css"
import LoadingButton from "../../../LoadingButton/LoadingButton";
import ServiceFormContext from "../../../../Context/kubernetes/ServiceFormContext";

function ServicePort(props) {
    const { counterpart, mode } = useContext(GlobalContext);
    const _mode = mode;
    const { id, name, protocol, port, targetPort } = props.servicePort;
    const { updateServicePort, removeServicePort } = useContext(ServiceFormContext);
    return (
        <Row>
            <Col xs="6" md="5">
                <FormGroup>
                    <Label for={`portName-${id}`} style={{ color: colors.title[_mode] }}>
                        {counterpart('dashboard.kubernetesDashboardPages.serviceDisovery.services.form.form.portName')}
                    </Label>
                    <Input id={`portName-${id}`}
                        name="name"
                        className="blackableInput"
                        value={name}
                        onChange={(e) =>
                            updateServicePort(id, {
                                ...props.servicePort,
                                name: e.target.value,
                            })
                        }
                        placeholder={counterpart('dashboard.kubernetesDashboardPages.serviceDisovery.services.form.form.portNameHolder')} />
                    <FormFeedback>
                        <Translate content="common.message.thisFieldIsRequired" />
                    </FormFeedback>
                </FormGroup>
            </Col>
            <Col xs="6" md="2">
                <FormGroup>
                    <Label for={`listPort-${id}`} style={{ color: colors.title[_mode] }}>
                        {counterpart('dashboard.kubernetesDashboardPages.serviceDisovery.services.form.form.listPort')}
                    </Label>
                    <Input id={`listPort-${id}`}
                        name="name"
                        className="blackableInput"
                        type="number"
                        value={port}
                        onChange={(e) =>
                            updateServicePort(id, {
                                ...props.servicePort,
                                port: Number.parseInt(e.target.value),
                            })
                        }
                        placeholder={counterpart('dashboard.kubernetesDashboardPages.serviceDisovery.services.form.form.listPortHolder')} />
                </FormGroup>
            </Col>
            <Col xs="3" md="2">
                <FormGroup>
                    <Label for={`protocol-${id}`} style={{ color: colors.title[_mode] }}>
                        {counterpart('dashboard.kubernetesDashboardPages.serviceDisovery.services.form.form.protocol')}
                    </Label>
                    <Input id={`protocol-${id}`}
                        type="select"
                        name="name"
                        className="blackableInput"
                        value={protocol}
                        onChange={(e) =>
                            updateServicePort(id, {
                                ...props.servicePort,
                                protocol: e.target.value,
                            })
                        }>
                        <option>TCP</option>
                        <option>UDP</option>
                    </Input>
                </FormGroup>
            </Col>
            <Col xs="3" md="2">
                <FormGroup>
                    <Label for={`targetPort-${id}`} style={{ color: colors.title[_mode] }}>
                        {counterpart('dashboard.kubernetesDashboardPages.serviceDisovery.services.form.form.targetPort')}
                    </Label>
                    <Input id={`targetPort-${id}`}
                        name="name"
                        className="blackableInput"
                        type="number"
                        value={targetPort}
                        onChange={(e) =>
                            updateServicePort(id, {
                                ...props.servicePort,
                                targetPort: Number.parseInt(e.target.value),
                            })
                        }
                        placeholder={counterpart('dashboard.kubernetesDashboardPages.serviceDisovery.services.form.form.targetPortHolder')} />
                </FormGroup>
            </Col>
            <Col xs="3" md="1" style={{ display: "flex", alignItems: "center" }}>
                <LoadingButton variant="text" className={classes.removeButton} onClick={() => removeServicePort(id)}>
                    <Translate content="dashboard.kubernetesDashboardPages.serviceDisovery.services.form.form.remove" />
                </LoadingButton>
            </Col>
        </Row>
    );
}



export default function ServicePorts(props) {
    const { servicePorts, addServicePort } = useContext(ServiceFormContext);
    return (
        <Form>
            {
                servicePorts.map((sp) => <ServicePort key={`servicePort-${sp.id}`} servicePort={sp} />)
            }
            <LoadingButton icon={"fa-solid fa-plus"} className={classes.addButton} variant="contained" onClick={addServicePort}>
                <Translate content="dashboard.kubernetesDashboardPages.serviceDisovery.services.form.form.addPort" />
            </LoadingButton>
        </Form>
    );
}
