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
import GlobalContext from "../../../Context/GlobalContext";
import IngressFormContext from "../../../Context/kubernetes/IngressFormContext";
import colors from "../../../Context/Colors";
import Translate from "react-translate-component";
import { Box, IconButton } from "@mui/material";
import LoadingButton from "../../LoadingButton/LoadingButton";
import classes from "./ingresses.module.css";
import CardComponent from "../../Cards/CardComponent/CardComponent";
import CloseIcon from "@mui/icons-material/Close";

const PathForm = (props) => {
  const { counterpart, mode } = useContext(GlobalContext);
  const { servicesOptions } = useContext(IngressFormContext);
  const _mode = mode;

  const {
    id,
    pathType,
    path,
    targetService,
    port,
  } = props.path;

  return (
      <Row>
        <Col xs="6" md="5">
          <FormGroup>
            <Label
              for={`path-${id}`}
              style={{ color: colors.title[_mode] }}
            >
              {counterpart(
                "dashboard.kubernetesDashboardPages.serviceDisovery.ingresses.form.path"
              )}
            </Label>
            <Box display={"flex"}>
              <Input
                id={`paths-${id}`}
                name="protocol"
                type="select"
                className="blackableInput"
                style={{
                  borderTopRightRadius: "0px",
                  borderBottomRightRadius: "0px",
                }}
                value={pathType}
                onChange={e => {
                  props.updatePath(id, { ...props.path, pathType: e.target.value })
                }}
              >
                <option>Prefix</option>
                <option>Exact</option>
                <option>ImplementationSpecific</option>
              </Input>
              <Input
                id={`path-${id}`}
                name="name"
                className="blackableInput"
                style={{
                  borderTopLeftRadius: "0px",
                  borderBottomLeftRadius: "0px",
                }}
                placeholder={counterpart(
                  "dashboard.kubernetesDashboardPages.serviceDisovery.ingresses.form.pathHolder"
                )}
                value={path}
                onChange={e => {
                  props.updatePath(id, { ...props.path, path: e.target.value })
                }}
              />
            </Box>
            <FormFeedback>
              <Translate content="common.message.thisFieldIsRequired" />
            </FormFeedback>
          </FormGroup>
        </Col>
        <Col xs="6" md="4">
          <FormGroup>
            <Label
              for={`targetService-${id}`}
              style={{ color: colors.title[_mode] }}
            >
              {counterpart(
                "dashboard.kubernetesDashboardPages.serviceDisovery.ingresses.form.targetService"
              )}
            </Label>

            <Input
              id={`targetService-${id}`}
              name="protocol"
              type="select"
              className="blackableInput"
              value={targetService}
              onChange={e => {
                props.updatePath(id, { ...props.path, targetService: e.target.value })
              }}
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
        <Col xs="3" md="2">
          <FormGroup>
            <Label
              for={`port-${id}`}
              style={{ color: colors.title[_mode] }}
            >
              {counterpart(
                "dashboard.kubernetesDashboardPages.serviceDisovery.ingresses.form.port"
              )}
            </Label>
            <Input
              id={`port-${id}`}
              name="name"
              className="blackableInput"
              placeholder={counterpart(
                "dashboard.kubernetesDashboardPages.serviceDisovery.ingresses.form.portHolder"
              )}
              value={port}
              type="number"
              onChange={e => {
                props.updatePath(id, { ...props.path, port: Number.parseInt(e.target.value)})
              }}
            />
            <FormFeedback>
              <Translate content="common.message.thisFieldIsRequired" />
            </FormFeedback>
          </FormGroup>
        </Col>
        <Col xs="3" md="1" style={{ display: "flex", alignItems: "center" }}>
          <LoadingButton
            variant="text"
            className={classes.removeButton}
            onClick={() => props.removePath(id)}
          >
            <Translate content="dashboard.kubernetesDashboardPages.serviceDisovery.services.form.form.remove" />
          </LoadingButton>
        </Col>
      </Row>
  );
};

function Rule(props) {
  const { counterpart, mode } = useContext(GlobalContext);
  const _mode = mode;
  const { id, host, paths } = props.rule;

  return (
    <CardComponent style={{
      position: "relative",
    }}>
      <IconButton
        className={classes.removeRuleButton}
        onClick={() => props.removeRule(id)}
      >
        <CloseIcon />
      </IconButton>
      <Row>
        <Col xs="6" md="5">
          <FormGroup>
            <Label for={`host-${id}`} style={{ color: colors.title[_mode] }}>
              {counterpart(
                "dashboard.kubernetesDashboardPages.serviceDisovery.ingresses.form.requestHost"
              )}
            </Label>
            <Input
              id={`host-${id}`}
              name="name"
              className="blackableInput"
              placeholder={counterpart(
                "dashboard.kubernetesDashboardPages.serviceDisovery.ingresses.form.requestHostHolder"
              )}
              value={host}
              onChange={(e) => {
                props.updateRule(id, { ...props.rule, host: e.target.value })
              }}
            />
            <FormFeedback>
              <Translate content="common.message.thisFieldIsRequired" />
            </FormFeedback>
          </FormGroup>
        </Col>
      </Row>
      {paths.map((path) => (
        <PathForm
          key={`rule-${id}-path-${path.id}`}
          path={path}
          removePath={(pathId) => props.removePath(id, pathId)}
          updatePath={(pathId, data) => props.updatePath(id, pathId, data)}
        />
      ))}
      <LoadingButton
        icon={"fa-solid fa-plus"}
        className="addButton"
        variant="contained"
        onClick={() => props.addPath(id)}
      >
        <Translate content="dashboard.kubernetesDashboardPages.serviceDisovery.services.form.form.addPort" />
      </LoadingButton>
    </CardComponent>
  );
}

export default function Rules() {
  const {
    rules,
    addRule,
    removeRule,
    addPath,
    removePath,
    updateRule,
    updatePath,
  } = useContext(IngressFormContext);

  return (
    <Form>
      <CardComponent>
        {rules.map((rule) => (
          <Rule
            key={rule.id}
            rule={rule}
            addPath={addPath}
            removePath={removePath}
            removeRule={removeRule}
            updateRule={updateRule}
            updatePath={updatePath}
          />
        ))}
        <LoadingButton
          icon={"fa-solid fa-plus"}
          className="addButton"
          variant="contained"
          onClick={() => addRule()}
        >
          <Translate content="dashboard.kubernetesDashboardPages.serviceDisovery.ingresses.form.addRule" />
        </LoadingButton>
      </CardComponent>
    </Form>
  );
}
