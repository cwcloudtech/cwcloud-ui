import React, { useContext } from "react";
import { Input, Form, FormGroup, Col, Row, Label } from "reactstrap"
import GlobalContext from "../../../../Context/GlobalContext";
import colors from "../../../../Context/Colors";
import classes from "./IpAddresses.module.css"
import LoadingButton from "../../../LoadingButton/LoadingButton";
import ServiceFormContext from "../../../../Context/kubernetes/ServiceFormContext";

function ExternalIp(props) {
    const counterpart = props.counterpart;
    const _mode = props.mode;
    const { id, exIp } = props.externalIp;
    const { removeExternalIp, updateExternalIp } = useContext(ServiceFormContext);

    return (
        <Row>
            <Col xs="4">
                <FormGroup>
                    <Label for={`externalIps-${id}`} style={{ color: colors.title[_mode] }}>
                        {counterpart('dashboard.kubernetesDashboardPages.serviceDisovery.services.form.form.externalIps')}
                    </Label>
                    <Input id={`externalIps-${id}`} name="exIp" className="blackableInput"
                        value={exIp}
                        onChange={(e) =>
                            updateExternalIp(id, {
                                ...props.servicePort,
                                exIp: e.target.value,
                            })
                        }
                        placeholder={counterpart('dashboard.kubernetesDashboardPages.serviceDisovery.services.form.form.externalIpsHolder')} />
                </FormGroup>
            </Col>
            <Col xs="1" style={{ display: "flex", alignItems: "center" }}>
                <LoadingButton 
                    icon={"fa-solid fa-trash"} 
                    variant="text" 
                    className={classes.removeButton} 
                    onClick={() => removeExternalIp(id)}
                    tooltip={counterpart('dashboard.kubernetesDashboardPages.serviceDisovery.services.form.form.remove')}
                />
                <LoadingButton 
                    icon={"fa-solid fa-plus"} 
                    variant="text" 
                    className={classes.removeButton} 
                    onClick={props.addExternalIp}
                    tooltip={counterpart('dashboard.kubernetesDashboardPages.serviceDisovery.services.form.form.addExternalIp')}
                />
            </Col>
        </Row>
    );
}

export default function IpAddresses() {
    const { counterpart, mode } = useContext(GlobalContext);
    const _mode = mode;
    const { ipAddresses, updateIpAddress, addExternalIp } = useContext(ServiceFormContext);

    return (
        <Form>
            <Row>
                <Col xs="4">
                    <FormGroup>
                        <Label for="service-ipAdd" style={{ color: colors.title[_mode] }}>
                            {counterpart('dashboard.kubernetesDashboardPages.serviceDisovery.services.form.form.ipAddresses')}
                        </Label>
                        <Input id="service-ipAdd" name="ipAddress" className="blackableInput"
                            value={ipAddresses.ipAddress}
                            onChange={(e) =>
                                updateIpAddress(e.target.value)
                            }
                            placeholder={counterpart('dashboard.kubernetesDashboardPages.serviceDisovery.services.form.form.ipAddressesHolder')} />
                    </FormGroup>
                </Col>
            </Row>
            {
                ipAddresses.externalIps.map((item) => <ExternalIp key={`extIpAddress-${item.id}`} externalIp={item} counterpart={counterpart} addExternalIp={addExternalIp} />)
            }
        </Form>
    );
}
