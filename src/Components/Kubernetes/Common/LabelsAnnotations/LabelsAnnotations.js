import React, { useContext } from "react";
import { Input, Form, FormGroup, Col, Row, Label } from "reactstrap";
import GlobalContext from "../../../../Context/GlobalContext";
import colors from "../../../../Context/Colors";
import Translate from "react-translate-component";
import classes from "./LabelsAnnotations.module.css";
import LoadingButton from "../../../LoadingButton/LoadingButton";
import MetadataFormContext from "../../../../Context/kubernetes/MetadataFormContext";

function Labels(props) {
  const { counterpart, mode } = useContext(GlobalContext);
  const _mode = mode;
  const {
    removeLabel,
    updateLabel
  } = useContext(MetadataFormContext);

  const {
    id,
    key,
    value,
  } = props.data;

  return (
    <Row>
      <Col xs="5">
        <FormGroup>
          <Label
            for={`LabelKey-${id}`}
            style={{ color: colors.title[_mode] }}
          >
            {counterpart("dashboard.kubernetesDashboardPages.common.form.key")}
          </Label>
          <Input
            id={`LabelKey-${id}`}
            className="blackableInput"
            name="key"
            value={key}
            onChange={(e)=>updateLabel(id, {value:value, key: e.target.value})}
            placeholder={counterpart(
              "dashboard.kubernetesDashboardPages.common.form.keyHolder"
            )}
          />
        </FormGroup>
      </Col>
      <Col xs="5">
        <FormGroup>
          <Label
            for={`LabelValue-${id}`}
            style={{ color: colors.title[_mode] }}
          >
            {counterpart(
              "dashboard.kubernetesDashboardPages.common.form.value"
            )}
          </Label>
          <Input
            id={`LabelValue-${id}`}
            className="blackableInput"
            name="value"
            value={value}
            onChange={(e)=>updateLabel(id, {key:key, value: e.target.value})}
            placeholder={counterpart(
              "dashboard.kubernetesDashboardPages.common.form.valueHolder"
            )}
          />
        </FormGroup>
      </Col>
      <Col xs="1" style={{ display: "flex", alignItems: "center" }}>
        <LoadingButton
          variant="text"
          className={classes.removeButton}
          onClick={() => removeLabel(id)}
        >
          <Translate content="dashboard.kubernetesDashboardPages.common.form.remove" />
        </LoadingButton>
      </Col>
    </Row>
  );
}

function Annotation(props) {
  const { counterpart, mode } = useContext(GlobalContext);
  const _mode = mode;
  const {
    removeAnnotation,
    updateAnnotation,
  } = useContext(MetadataFormContext);
  const {
    id,
    key,
    value,
  } = props.data;
  return (
    <Row>
      <Col xs="5">
        <FormGroup>
          <Label
            for={`AnnotationKey-${id}`}
            style={{ color: colors.title[_mode] }}
          >
            {counterpart("dashboard.kubernetesDashboardPages.common.form.key")}
          </Label>
          <Input
            id={`AnnotationKey-${id}`}
            className="blackableInput"
            name="key"
            value={key}
            onChange={(e)=>updateAnnotation(id, {key:e.target.value, value})}
            placeholder={counterpart(
              "dashboard.kubernetesDashboardPages.common.form.keyHolder"
            )}
          />
        </FormGroup>
      </Col>
      <Col xs="5">
        <FormGroup>
          <Label
            for={`AnnotationValue-${id}`}
            style={{ color: colors.title[_mode] }}
          >
            {counterpart(
              "dashboard.kubernetesDashboardPages.common.form.value"
            )}
          </Label>
          <Input
            id={`AnnotationValue-${id}`}
            className="blackableInput"
            name="value"
            value={value}
            onChange={(e)=>updateAnnotation(id, {value:e.target.value, key})}
            placeholder={counterpart(
              "dashboard.kubernetesDashboardPages.common.form.valueHolder"
            )}
          />
        </FormGroup>
      </Col>
      <Col xs="1" style={{ display: "flex", alignItems: "center" }}>
        <LoadingButton
          variant="text"
          className={classes.removeButton}
          onClick={()=> removeAnnotation(id)}
        >
          <Translate content="dashboard.kubernetesDashboardPages.common.form.remove" />
        </LoadingButton>
      </Col>
    </Row>
  );
}

export default function LabelsAnnotations() {
  const {
    labels,
    annotations,
    addLabel,
    addAnnotation,
  } = useContext(MetadataFormContext);

  return (
    <Form>
      <div>
        <div className={classes.titleContainer}>
          <Translate
            className={classes.title}
            content="dashboard.kubernetesDashboardPages.common.form.labels"
          />
        </div>
        {labels.map((item) => (
          <Labels
            key={`label-${item.id}`}
            data={item}
          />
        ))}
        <LoadingButton
          icon={"fa-solid fa-plus"}
          className={classes.addButton}
          variant="contained"
          onClick={addLabel}
        >
          <Translate content="dashboard.kubernetesDashboardPages.common.form.label" />
        </LoadingButton>
      </div>
      <div>
        <div className={classes.titleContainer} style={{ marginTop: "25px" }}>
          <Translate
            className={classes.title}
            content="dashboard.kubernetesDashboardPages.common.form.annotations"
          />
        </div>
        {annotations.map((item) => (
          <Annotation
            key={`annotation-${item.id}`}
            data={item}
          />
        ))}
        <LoadingButton
          icon={"fa-solid fa-plus"}
          className={classes.addButton}
          variant="contained"
          onClick={addAnnotation}
        >
          <Translate content="dashboard.kubernetesDashboardPages.common.form.annotation" />
        </LoadingButton>
      </div>
    </Form>
  );
}
