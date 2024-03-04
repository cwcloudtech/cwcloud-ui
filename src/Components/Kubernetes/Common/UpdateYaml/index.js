import React from "react";
import { NavLink } from "react-router-dom";
import Translate from "react-translate-component";
import { Col, Container, Row } from "reactstrap";
import LoadingButton from "../../../LoadingButton/LoadingButton";
import classes from "./style.module.css";
import ErrorCard from "../ErrorCard/ErrorCard";
import EditorBox from "../../../EditorBox/EditorBox";

export default function UpdateYaml({
  yamlValue,
  setYamlValue,
  setSelectedObject,
  updateLoading,
  updateYaml,
  selectedObject,
  translation,
  error
}) {

  return (
    <Container style={{ padding: "0" }}>
      <Row>
        <Col>
          <div className={classes.goBack}>
            <NavLink
              onClick={() => setSelectedObject(undefined)}
              className={classes.link}
            >
              <i
                className={[
                  "fa-solid fa-arrow-left",
                  `${classes.iconStyle}`,
                ].join(" ")}
              ></i>
              <Translate content={translation.backToExplore} />
            </NavLink>
          </div>
        </Col>
      </Row>
      <div style={{ marginTop: "20px" }}>
        <EditorBox
          title={<span><Translate content={translation.updateTitle}/>{selectedObject.name}</span>}
          language="yaml"
          value={yamlValue}
          onChange={(value, event) => {
            setYamlValue(value);
          }}
        />
      </div>
      {
        error && (
          <div style={{ margin: "22px 10px 10px 10px" }}>
            <ErrorCard error={error} />
          </div>
        )
      }
      <Row style={{ marginTop: "20px", marginBottom: "20px" }}>
        <Col
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LoadingButton
            color={"error"}
            className={classes.actionButton}
            loading={updateLoading}
            icon={"fa-solid fa-xmark"}
            onClick={() =>
              setYamlValue(undefined) & setSelectedObject(undefined)
            }
          >
            <Translate content="common.button.cancel" />
          </LoadingButton>
          <LoadingButton
            className={classes.actionButton}
            loading={updateLoading}
            icon={"fa-solid fa-pen"}
            onClick={() => updateYaml()}
          >
            <Translate content="dashboard.kubernetesDashboardPages.common.updateYaml" />
          </LoadingButton>
        </Col>
      </Row>
    </Container>
  );
}
