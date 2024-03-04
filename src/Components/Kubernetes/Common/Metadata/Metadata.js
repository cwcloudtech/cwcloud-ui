import React, { useContext } from "react";
import {
  Input,
  Form,
  FormGroup,
  FormFeedback,
  Col,
  Row,
  Label,
} from "reactstrap";
import GlobalContext from "../../../../Context/GlobalContext";
import colors from "../../../../Context/Colors";
import Translate from "react-translate-component";
import CardComponent from "../../../Cards/CardComponent/CardComponent";
import MetadataFormContext from "../../../../Context/kubernetes/MetadataFormContext";

export default function Metadata(props) {
  const { counterpart, mode } = useContext(GlobalContext);
  const _mode = mode;
  const { metadata, updateMetadata, namespaces } = useContext(MetadataFormContext);

  return (
    <CardComponent
      title={counterpart(
        "dashboard.kubernetesDashboardPages.common.form.metadata"
      )}
    >
      <Form>
        <Row>
          <Col xs="12" md="6">
            <FormGroup>
              <Label
                for="service-namespace"
                style={{ color: colors.title[_mode] }}
              >
                {counterpart(
                  "dashboard.kubernetesDashboardPages.common.form.namespace"
                )} *
              </Label>
              <Input
                id="service-namespace"
                value={metadata.namespace}
                onChange={(e) => updateMetadata({ ...metadata, namespace: e.target.value })}
                name="namespace"
                type="select"
                className="blackableInput"
              >
                {namespaces.map((ns) => (
                  <option key={ns} value={ns}>
                    {ns}
                  </option>
                ))}
              </Input>
            </FormGroup>
          </Col>
          <Col xs="12" md="6">
            <FormGroup>
              <Label for="service-name" style={{ color: colors.title[_mode] }}>
                {counterpart(
                  "dashboard.kubernetesDashboardPages.common.form.name"
                )} *
              </Label>
              <Input
                id="service-name"
                value={metadata.name}
                defaultValue={"default"}
                onChange={(e) => {
                  updateMetadata({ ...metadata, name: e.target.value })
                  props.setIsInvalid(e.target.value === '')
                }}
                name="name"
                className="blackableInput"
                placeholder={counterpart(
                  "dashboard.kubernetesDashboardPages.common.form.nameHolder"
                )}
                invalid={props.isInvalid}
              />
              <FormFeedback>
                <Translate content="common.message.thisFieldIsRequired" />
              </FormFeedback>
            </FormGroup>
          </Col>
        </Row>
        <FormGroup>
          <Label
            for="service-description"
            style={{ color: colors.title[_mode] }}
          >
            {counterpart(
              "dashboard.kubernetesDashboardPages.common.form.description"
            )}
          </Label>
          <Input
            id="description"
            name="description"
            className="blackableInput"
            type="textarea"
            value={metadata.description}
            onChange={(e) => updateMetadata({ ...metadata, description: e.target.value })}
            placeholder={counterpart(
              "dashboard.kubernetesDashboardPages.common.form.descriptionHolder"
            )}
          />
        </FormGroup>
      </Form>
    </CardComponent>
  );
}
