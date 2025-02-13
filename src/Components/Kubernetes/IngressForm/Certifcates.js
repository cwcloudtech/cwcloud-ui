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
import colors from "../../../Context/Colors";
import Translate from "react-translate-component";
import { IconButton } from "@mui/material";
import LoadingButton from "../../LoadingButton/LoadingButton";
import classes from "./ingresses.module.css";
import CardComponent from "../../Cards/CardComponent/CardComponent";
import CloseIcon from "@mui/icons-material/Close";
import IngressFormContext from "../../../Context/kubernetes/IngressFormContext";

const Host = (props) => {
  const { counterpart, mode } = useContext(GlobalContext);
  const _mode = mode;
  const { updateHost } = useContext(IngressFormContext);
  const { id, host } = props.host;

  return (
    <Row>
      <Col xs="9">
        <FormGroup>
          <Label
            for={`host-${props.crtId}-${id}`}
            style={{ color: colors.title[_mode] }}
          >
            {counterpart(
              "dashboard.kubernetesDashboardPages.serviceDisovery.ingresses.form.host"
            )}
          </Label>

          <Input
            for={`host-${props.crtId}-${id}`}
            className="blackableInput"
            value={host}
            onChange={(e) =>
              updateHost(props.crtId,id, {
                ...props.host,
                host: e.target.value,
              })
            }
            placeholder={counterpart(
              "dashboard.kubernetesDashboardPages.serviceDisovery.ingresses.form.hostHolder"
            )}
          />
          <FormFeedback>
            <Translate content="common.message.thisFieldIsRequired" />
          </FormFeedback>
        </FormGroup>
      </Col>
      <Col xs="3" style={{ display: "flex", alignItems: "center" }}>
        <LoadingButton
          icon={"fa-solid fa-trash"}
          variant="text"
          className={classes.removeButton}
          onClick={() => props.removeHost(id)}
          tooltip={counterpart("dashboard.kubernetesDashboardPages.serviceDisovery.services.form.form.remove")}
        >
        </LoadingButton>
        <LoadingButton
          icon={"fa-solid fa-plus"}
          className={classes.removeButton}
          variant="text"
          onClick={() => props.addHost(props.crtId)}
          tooltip={counterpart("dashboard.kubernetesDashboardPages.serviceDisovery.ingresses.form.addHost")}
        >
        </LoadingButton>
      </Col>
    </Row>
  );
};

function Certificate(props) {
  const { counterpart, mode } = useContext(GlobalContext);
  const _mode = mode;
  const { id, certSecret, hosts } = props.certificate;
  const { removeCertificate, addHost, removeHost, updateCertificate } =
    useContext(IngressFormContext);

  return (
    <CardComponent
      style={{
        position: "relative",
      }}
    >
      <IconButton
        className={classes.removeRuleButton}
        onClick={() => removeCertificate(id)}
      >
        <CloseIcon />
      </IconButton>
      <Row>
        <Col xs="12">
          <FormGroup>
            <Label for={`certn-${id}`} style={{ color: colors.title[_mode] }}>
              {counterpart(
                "dashboard.kubernetesDashboardPages.serviceDisovery.ingresses.form.certificate"
              )}
            </Label>
            <Input
              id={`cert-${id}`}
              name="name"
              className="blackableInput"
              value={certSecret}
              onChange={(e) =>
                updateCertificate(id, {
                  ...props.certificate,
                  certSecret: e.target.value,
                })
              }
              placeholder={counterpart(
                "dashboard.kubernetesDashboardPages.serviceDisovery.ingresses.form.certificateHolder"
              )}
            />
            <FormFeedback>
              <Translate content="common.message.thisFieldIsRequired" />
            </FormFeedback>
          </FormGroup>
        </Col>
      </Row>
      {hosts.map((host) => (
        <Host
          key={host.id}
          host={host}
          crtId={id}
          removeHost={(hostId) => removeHost(id, hostId)}
          addHost={addHost}
        />
      ))}
    </CardComponent>
  );
}

export default function Certificates(props) {
  const { certificates, addCertificate } = useContext(IngressFormContext);

  return (
    <Form>
      <CardComponent>
        {certificates.map((crt) => (
          <Certificate key={crt.id} certificate={crt} />
        ))}
        <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
          <LoadingButton
            icon={"fa-solid fa-plus"}
            className={classes.removeButton}
            variant="contained"
            onClick={() => addCertificate()}
            style={{ width: "200px" }}
          >
            <Translate content="dashboard.kubernetesDashboardPages.serviceDisovery.ingresses.form.addCertificate" />
          </LoadingButton>
        </div>
      </CardComponent>
    </Form>
  );
}
