import React from "react";
import { useContext } from "react";
import { Col, FormFeedback, FormGroup, Input, Label, Row } from "reactstrap";
import GlobalContext from "../../../Context/GlobalContext";
import colors from "../../../Context/Colors";
import Translate from "react-translate-component";
import IngressFormContext from "../../../Context/kubernetes/IngressFormContext";

export default function IngressClass() {
  const { counterpart, mode } = useContext(GlobalContext);
  const _mode = mode;
  const {ingressClassOptions,ingressClass, updateIngressClass} = useContext(IngressFormContext);

  return (
    <Row>
      <Col xs="6" md="5">
        <FormGroup>
          <Label
            for={`backend-targetService`}
            style={{ color: colors.title[_mode] }}
          >
            {counterpart(
              "dashboard.kubernetesDashboardPages.serviceDisovery.ingresses.form.ingressClass"
            )}
          </Label>
          <Input
            id={`backend-targetService`}
            name="protocol"
            type="select"
            className="blackableInput"
            value={ingressClass}
            onChange={(e) => {
              updateIngressClass(e.target.value);
            }}
            style={{
              borderTopRightRadius: "0px",
              borderBottomRightRadius: "0px",
            }}
          >
            {
              ingressClassOptions.map((ingressClassOption) => {
                return (
                  <option key={ingressClassOption.name} value={ingressClassOption.name}>
                    {ingressClassOption.name}
                  </option>
                );
                })
            }
          </Input>
          <FormFeedback>
            <Translate content="common.message.thisFieldIsRequired" />
          </FormFeedback>
        </FormGroup>
      </Col>
    </Row>
  );
}
