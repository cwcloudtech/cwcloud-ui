import { Button } from "@material-ui/core";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Translate from "react-translate-component";
import { Col, Row } from "reactstrap";
import colors from "../../../../.../../../../Context/Colors";
import GlobalContext from "../../../../.../../../../Context/GlobalContext";
import EnvironmentCard from "../EnvironmentCard/EnvironmentCard";
import classes from "./EnvironmentSection.module.css";

function EnvironmentSection({
  type = "vm",
  environments,
  loading,
  titleTranslationPath,
  viewMoreLink,
  maxItems,
  hidden = false,
}) {
  const context = useContext(GlobalContext);
  const navigate = useNavigate();
  const _mode = context.mode;

  if ((!loading && environments.length === 0) || hidden) return null;
  return (
    <div className={classes.sectionContainer}>
      <Row style={{ marginTop: "10px", marginBottom: "10px" }}>
        <Col>
          <h6 style={{ color: colors.mainText[_mode] }}>
            <Translate content={titleTranslationPath} />
          </h6>
        </Col>
      </Row>
      <Row>
        {!loading
          ? environments.map((environment) => (
            <Col xs='5' md='3' className={classes.cardColumn}>
              <EnvironmentCard
                  key={environment.id}
                  name={environment.name}
                  logo_url={environment.logo_url}
                  description={environment.description}
                  onClick={() =>
                    type === "vm"
                      ? navigate(
                          `/instances/create?environment=${environment.path}`
                        )
                      : navigate(
                          `/k8s-applications/create?environment=${environment.name}`
                        )
                  }
                />
            </Col>
            ))
          : Array.from(maxItems).map((_, index) => (
            <Col xs='5' md='3' className={classes.cardColumn}>
              <EnvironmentCard loading key={index} onClick={() => {}} />
            </Col>
            ))}
      </Row>
      {!loading && environments.length === maxItems ? (
        <div className={classes.seeMoreContainer}>
          <Button
            variant="text"
            onClick={() => {
              navigate(viewMoreLink);
            }}
            style={{ color: colors.mainText[_mode] }}
          >
            <div className={classes.seeMoreButtonContent}>
              <Translate
                content={
                  "dashboard.userDashboard.availableEnvironments.seeMore"
                }
              />
              <i class="fa-solid fa-chevron-right" />
            </div>
          </Button>
        </div>
      ) : null}
    </div>
  );
}

export default EnvironmentSection;
