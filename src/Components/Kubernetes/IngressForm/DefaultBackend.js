import React from "react";
import { useContext } from "react";
import { Col, FormFeedback, FormGroup, Input, Label, Row } from "reactstrap";
import GlobalContext from "../../../Context/GlobalContext";
import colors from "../../../Context/Colors";
import Translate from "react-translate-component";
import IngressFormContext from "../../../Context/kubernetes/IngressFormContext";

export default function DefaultBackend() {
  const { counterpart, mode } = useContext(GlobalContext);
  const { defaultBackend, updateDefaultBackend,servicesOptions } =
    useContext(IngressFormContext);

  const _mode = mode;

  return (
    <Row>
      <Col xs="6" md="5">
        <FormGroup>
          <Label
            for={`backend-targetService`}
            style={{ color: colors.title[_mode] }}
          >
            {counterpart(
              "dashboard.kubernetesDashboardPages.serviceDisovery.ingresses.form.targetService"
            )}
          </Label>
          <Input
            id={`backend-targetService`}
            name="protocol"
            type="select"
            className="blackableInput"
            style={{
              borderTopRightRadius: "0px",
              borderBottomRightRadius: "0px",
            }}
            value={defaultBackend.targetService}
            onChange={(e) => {
              updateDefaultBackend({
                ...defaultBackend,
                targetService: e.target.value,
              });
            }}
            placeholder={counterpart(
              "dashboard.kubernetesDashboardPages.serviceDisovery.ingresses.form.targetServiceHolder"
            )}
          >
            {servicesOptions.map((service) => (
              <option key={service.value}>{service.label}</option>
            ))}
          </Input>
          <FormFeedback>
            <Translate content="common.message.thisFieldIsRequired" />
          </FormFeedback>
        </FormGroup>
      </Col>
      <Col xs="6" md="4">
        <FormGroup>
          <Label for={`backend-port`} style={{ color: colors.title[_mode] }}>
            {counterpart(
              "dashboard.kubernetesDashboardPages.serviceDisovery.ingresses.form.port"
            )}
          </Label>
          <Input
            id={`backend-port`}
            name="name"
            className="blackableInput"
            value={defaultBackend.port}
            type="number"
            onChange={(e) => {
              updateDefaultBackend({
                ...defaultBackend,
                port: Number.parseInt(e.target.value),
              });
            }}
            style={{
              borderTopLeftRadius: "0px",
              borderBottomLeftRadius: "0px",
            }}
            placeholder={counterpart(
              "dashboard.kubernetesDashboardPages.serviceDisovery.ingresses.form.portHolder"
            )}
          />
          <FormFeedback>
            <Translate content="common.message.thisFieldIsRequired" />
          </FormFeedback>
        </FormGroup>
      </Col>
    </Row>
  );
}
