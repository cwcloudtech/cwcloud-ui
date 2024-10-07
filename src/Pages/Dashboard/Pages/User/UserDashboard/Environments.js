import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { useContext, useEffect, useState } from "react";
import { Col, Container, Row } from "reactstrap";
import colors from "../../../../../Context/Colors";
import GlobalContext from "../../../../../Context/GlobalContext";
import axios from "../../../../../utils/axios";
import EnvironmentSection from "./EnvironmentSection/EnvironmentSection";
import classes from "./UserDashboard.module.css";

import { InputAdornment, TextField } from "@mui/material";

import { useSearchParams } from "react-router-dom";
import Translate from "react-translate-component";
import FilterSwitch from "../../../../../Components/FilterSwitch";

const Environments = () => {
  const context = useContext(GlobalContext);
  const _mode = context.mode;
  const params = useSearchParams()[0];
  const [environments, setEnvironments] = useState([]);
  const [filteredEnvs, setFilteredEnv] = useState([]);
  const [loading, setLoading] = useState(true);
  const { counterpart } = useContext(GlobalContext);
  const [selectedType, setSelectedType] = useState(
    params.get("type") && params.get("type") === "k8s" ? "k8s" : "vm"
  );

  useEffect(() => {
    context.setIsGlobal(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const responseEnv = await axios.get(
        `/environment/all?type=${
          !context.user.enabled_features.k8sapi ? "vm" : selectedType
        }`
      );
      setEnvironments(responseEnv.data);
      setFilteredEnv(responseEnv.data);
      setLoading(false);
    };
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedType]);

  const onSearch = (e) => {
    const searchValue = e.target.value;
    const filteredEnvs = environments.filter((env) => {
      return env.name.toLowerCase().includes(searchValue.toLowerCase());
    });
    setFilteredEnv(filteredEnvs);
  };

  const filters = [
    {
      value: "vm",
      translationPath: "dashboard.userDashboard.availableEnvironments.vm",
    },
  ];

  if (context.user.enabled_features.k8sapi) {
    filters.push({
      value: "k8s",
      translationPath: "dashboard.userDashboard.availableEnvironments.k8s",
    });
  }

  return (
    <Container
      fluid
      className={classes.container}
      style={{ padding: "0px 20px 20px 20px" }}
    >
      <Row style={{ marginTop: "20px", marginBottom: "10px" }}>
        <Col>
          <h1
            className={classes.mainTitleText}
            style={{ color: colors.mainText[_mode] }}
          >
            <Translate content="dashboard.userDashboard.availableEnvironments.title" />
          </h1>
        </Col>
      </Row>
      <Row
        style={{
          marginBottom: "20px",
          justifyContent: "center",
          alignItems: "center",
        }}
        className={classes.filterContainer}
      >
        <Col
          xs={filters.length > 1 ? "8" : "12"}
          md={filters.length > 1 ? "11" : "12"}
        >
          <TextField
            onChange={onSearch}
            placeholder={counterpart(
              "dashboard.userDashboard.availableEnvironments.searchPlaceholder"
            )}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlinedIcon />
                </InputAdornment>
              ),
            }}
            size="small"
            fullWidth
          />
        </Col>
        {filters.length > 1 && (
          <Col xs="4" md="1">
            <FilterSwitch
              filters={filters}
              selectedValue={selectedType}
              setSelectedValue={setSelectedType}
            />
          </Col>
        )}
      </Row>
      <EnvironmentSection
        environments={filteredEnvs}
        loading={loading}
        maxItems={6}
        type={selectedType}
      ></EnvironmentSection>
      {!loading && filteredEnvs.length === 0 && (
        <Row
          style={{
            marginTop: "20px",
            marginBottom: "20px",
            alignItems: "center",
            height: "100px",
          }}
        >
          <Col style={{ textAlign: "center" }}>
            <h6 style={{ color: colors.mainText[_mode] }}>
              <Translate content="dashboard.userDashboard.availableEnvironments.noEnvironments" />
            </h6>
          </Col>
        </Row>
      )}
    </Container>
  );
};
export default Environments;
