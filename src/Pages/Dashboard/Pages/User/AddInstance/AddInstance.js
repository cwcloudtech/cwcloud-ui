import { useContext, useState, useEffect } from "react";
import CardComponent from "../../../../../Components/Cards/CardComponent/CardComponent";
import { Input, Form, FormGroup, FormFeedback, Col, Row } from "reactstrap";
import "../../../../../common.css";
import axios from "../../../../../utils/axios";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import GlobalContext from "../../../../../Context/GlobalContext";
import colors from "../../../../../Context/Colors";
import { Fab, OutlinedInput, TextField } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import Fade from "@mui/material/Fade";
import AddIcon from "@mui/icons-material/Add";
import Translate from "react-translate-component";
import LoadingSpinner from "../../../../../Components/LoadingSpinner/LoadingSpinner";
import ServiceNotAvailable from "../../../../../Components/ServiceNotAvailable/ServiceNotAvailable";
import LoadingButton from "../../../../../Components/LoadingButton/LoadingButton";
import MiniCardComponent from "../../../../../Components/Cards/MiniCardComponent/MiniCardComponent";
import SuggestionsAutoComplete from "../../../../../Components/SuggestionsAutoComplete/SuggestionsAutoComplete";
import DropdownComponent from "../../../../../Components/Dropdown/Dropdown";
import DropdownComponentWithoutId from "../../../../../Components/Dropdown/DropdownWithoutItemId";
import SimpleDropdown from "../../../../../Components/Dropdown/SimpleDropdown";
import { getPriceWithUnit } from "../../../../../utils/common";
import EnvArgsForm from "../../../../../Components/EnvArgsForm/EnvArgsForm";

function AddInstance(props) {
  const context = useContext(GlobalContext);
  const _mode = context.mode;
  const location = useLocation();
  const currentPath = location.pathname;
  const is_admin = currentPath.includes("admin");
  const queryParams = new URLSearchParams(location.search);
  const preSelectedEnvironment = queryParams.get("environment");
  const nextPath = is_admin ? "/admin/instances" : "/instances";
  const [selectedEnvironment, setSelectedEnvironment] = useState(null);
  const [instanceInfo, setInstanceInfo] = useState({ type: "" });
  const [disabled, setdisabled] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [environments, setEnvironments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [dns_zones, setDnsZones] = useState([]);
  const [prices, setPrices] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedDnsZone, setSelectedDnsZone] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [zone, setZone] = useState(null);
  const [instancesTypesAvailability, setInstancesTypesAvailability] = useState(
    []
  );
  const [isInvalid, setIsInvalid] = useState({
    values: false,
    environment: false,
  });
  const [serviceNotAvailable, setServiceNotAvailable] = useState(false);
  const [queryParam, setQueryParam] = useState("");
  const [argsValues, setArgsValues] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedEnvironment) return;
    let args = JSON.parse(selectedEnvironment.args);
    if (!args || args.length === 0) {
      setArgsValues(null);
      return;
    }
    let values = {};
    args.map((arg, index) => {
      values[arg] = "";
      return null;
    });
    setArgsValues(values);
  }, [selectedEnvironment]);

  useEffect(() => {
    context.setIsGlobal(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setdisabled(false);
  }, [instanceInfo]);

  useEffect(() => {
    setZone(null);
  }, [context.region]);

  useEffect(() => {
    if (zone) {
      axios
        .get(
          `/provider/${context.selectedProvider.name}/instance/${context.region.name}/${zone}/pricing`
        )
        .then((res) => {
          setPrices(res.data.types);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zone]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setServiceNotAvailable(false);
      const responseInstanceAvailibility = await axios.get(
        `/provider/${context.selectedProvider.name}/instance`
      );
      if (
        !responseInstanceAvailibility.data.availability
          .map((a) => a.region)
          .includes(context.region.name)
      ) {
        setLoading(false);
        return setServiceNotAvailable(true);
      }
      const availabilityIndex =
        responseInstanceAvailibility.data.availability.findIndex(
          (a) => a.region === context.region.name
        );
      setInstancesTypesAvailability(
        responseInstanceAvailibility.data.availability[availabilityIndex].zones
      );
      if (is_admin) {
        const responseUsers = await axios.get("/admin/user/all");
        setUsers(responseUsers.data.result);
      }
      if (
        context.user.enabled_features.daasapi &&
        context.user.enabled_features.k8sapi
      ) {
        setQueryParam("?type=all");
      } else if (context.user.enabled_features.k8sapi) {
        setQueryParam("?type=k8s");
      } else if (context.user.enabled_features.daasapi) {
        setQueryParam("?type=vm");
      }
      var project_url = is_admin ? "/project" : `/project${queryParam}`;
      const responseProjects = await axios.get(project_url);
      setProjects(responseProjects.data);
      var environment_url = is_admin
        ? "/admin/environment/all"
        : `/environment/all${queryParam}`;
      const responseEnvironments = await axios.get(environment_url);
      setEnvironments(responseEnvironments.data);
      if (preSelectedEnvironment) {
        const environmentIndex = responseEnvironments.data.findIndex(
          (e) => e.path === preSelectedEnvironment
        );
        setSelectedEnvironment(responseEnvironments.data[environmentIndex]);
      }
      const responseDnsZones = await axios.get(`/dns_zones`);
      setDnsZones(responseDnsZones.data.zones);
      setLoading(false);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.region]);

  useEffect(() => {
    if (instanceInfo.email) {
      const userIndex = users.findIndex((u) => u.email === instanceInfo.email);
      setSelectedUser({ ...users[userIndex] });
    }
  }, [instanceInfo, users]);

  useEffect(() => {
    if (selectedUser && selectedUser.id) {
      axios.get(`/admin/project/user/${selectedUser.id}`).then((res) => {
        setProjects(res.data);
      });
    }
  }, [context.selectedProvider, context.region, selectedUser]);

  const addInstanceHandler = () => {
    let environmentIsInvalid = selectedEnvironment === null;
    let valuesIsInvalid = argsValues
      ? Object.values(argsValues).some((value) => value === "")
      : false;

    setIsInvalid({
      environment: environmentIsInvalid,
      values: valuesIsInvalid,
    });

    if (environmentIsInvalid || valuesIsInvalid) return;
    setLoadingSubmit(true);
    setdisabled(!instanceInfo.name);
    var api_url = is_admin
      ? `/admin/instance/${context.selectedProvider.name}/${context.region.name}/${zone}/provision/${selectedEnvironment.path}`
      : `/instance/${context.selectedProvider.name}/${context.region.name}/${zone}/provision/${selectedEnvironment.path}`;
    axios
      .post(api_url, {
        ...instanceInfo,
        project_id: selectedProject,
        root_dns_zone: selectedDnsZone,
        args: argsValues,
      })
      .then((response) => {
        setLoadingSubmit(false);
        toast.success(
          context.counterpart("dashboard.addInstance.message.successAdd")
        );
        var nextPath = is_admin
          ? `/admin/instance/${response.data.id}`
          : `/instance/${response.data.id}`;
        navigate(nextPath);
      })
      .catch((err) => {
        setLoadingSubmit(false);
      });
  };

  if (loading) return <LoadingSpinner />;
  if (serviceNotAvailable)
    return (
      <ServiceNotAvailable region={context.region.name} backLink={nextPath} />
    );
  return (
    <div>
      <Row>
        <Col>
          <div className="goBack">
            <NavLink to={nextPath} className="link fs-6">
              <i className="fa-solid fa-arrow-left iconStyle"></i>
              <Translate content="dashboard.addInstance.back" />
            </NavLink>
          </div>
        </Col>
      </Row>
      <Row
        style={{
          marginTop: "30px",
          marginBottom: "20px",
          margin: "10px 0px 0px",
        }}
      >
        <Col
          className="borderCol"
          style={{ boxShadow: "0 3px " + colors.bottomShaddow[_mode] }}
        >
          <h5 className="textTitle" style={{ color: colors.title[_mode] }}>
            <Translate content="dashboard.addInstance.mainTitle" />
          </h5>
        </Col>
      </Row>
      <CardComponent
        containerStyles={props.containerStyles}
        title={context.counterpart("dashboard.addInstance.inputs.name.title")}
      >
        <Form>
          <FormGroup>
            <Input
              className="blackableInput"
              placeholder={context.counterpart(
                "dashboard.addInstance.inputs.name.placeholder"
              )}
              value={instanceInfo.name}
              onChange={(e) =>
                setInstanceInfo({ ...instanceInfo, name: e.target.value })
              }
              invalid={disabled}
            />
            <FormFeedback>
              <Translate content="common.message.thisFieldIsRequired" />
            </FormFeedback>
          </FormGroup>
        </Form>
      </CardComponent>
      {is_admin && (
        <CardComponent
          containerStyles={props.containerStyles}
          title="Enter user email address"
          subtitle="The email in which the instance will be affected to."
        >
          <SuggestionsAutoComplete
            id="combo-box-email"
            onChange={(event, newValue) => {
              setInstanceInfo({ ...instanceInfo, email: newValue });
            }}
            options={users.map((u) => u.email)}
            renderInput={(params) => (
              <TextField
                onChange={(e) =>
                  setInstanceInfo({ ...instanceInfo, email: e.target.value })
                }
                {...params}
                label="Email"
              />
            )}
            feedbackMessage="common.message.thisFieldIsRequired"
            hint="common.message.pleaseEnterAnEmail"
          />
        </CardComponent>
      )}
      <CardComponent
        containerStyles={props.containerStyles}
        title={context.counterpart("dashboard.addInstance.inputs.zone.title")}
      >
        <SimpleDropdown
          selectedItem={zone}
          onChange={(e) => {
            setZone(e.target.value);
          }}
          placeholder="dashboard.addInstance.inputs.zone.placeholder"
          items={instancesTypesAvailability}
        />
      </CardComponent>
      <CardComponent
        containerStyles={props.containerStyles}
        title={context.counterpart("dashboard.addInstance.inputs.type.title")}
        subtitle={context.counterpart(
          "dashboard.addInstance.inputs.type.subtitle"
        )}
      >
        <Row horizontal="center">
          {prices.map((price) => (
            <MiniCardComponent
              instancetitle={price.name}
              value={getPriceWithUnit(price)}
              key={price.name}
              checked={instanceInfo.type === price.name}
              onClick={() =>
                setInstanceInfo({ ...instanceInfo, type: price.name })
              }
            />
          ))}
        </Row>
      </CardComponent>
      <CardComponent
        containerStyles={props.containerStyles}
        title={context.counterpart(
          "dashboard.addInstance.inputs.project.title"
        )}
        subtitle={context.counterpart(
          "dashboard.addInstance.inputs.project.subtitle"
        )}
      >
        <DropdownComponent
          inputLabelId="demo-multiple-name-label"
          name="Project"
          selectLabelId="demo-multiple-name-label"
          selectId="demo-multiple-name"
          selectedItem={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          input={<OutlinedInput label="Name" />}
          items={projects}
        />
        <Tooltip
          TransitionComponent={Fade}
          TransitionProps={{ timeout: 600 }}
          title={
            <h5 className="tootltipValue">
              <Translate content="dashboard.addInstance.inputs.addProject.title" />
            </h5>
          }
          placement="right"
        >
          <Fab
            color="primary"
            aria-label="add"
            onClick={() => navigate("/projects/create")}
            style={{ transform: "scale(0.7)", top: "18px" }}
          >
            <AddIcon className="whiteIcon" />
          </Fab>
        </Tooltip>
      </CardComponent>

      {dns_zones.length > 0 && (
        <CardComponent
          containerStyles={props.containerStyles}
          title={context.counterpart("dashboard.addInstance.inputs.dns.title")}
          subtitle={context.counterpart(
            "dashboard.addInstance.inputs.dns.subtitle"
          )}
        >
          <DropdownComponentWithoutId
            inputLabelId="dns-zone-label"
            name="DNS"
            labelid="dns-zone-label"
            selectId="dns-zone-multiple-name"
            selectedItem={selectedDnsZone}
            onChange={(e) => setSelectedDnsZone(e.target.value)}
            input={<OutlinedInput label="Name" />}
            items={dns_zones}
          />
        </CardComponent>
      )}

      <CardComponent
        containerStyles={props.containerStyles}
        title={context.counterpart(
          "dashboard.addInstance.inputs.environment.title"
        )}
        subtitle={context.counterpart(
          "dashboard.addInstance.inputs.environment.subtitle"
        )}
      >
        <Row horizontal="center">
          {environments.map((environment) => {
            if (!environment.is_private || context.user.is_admin) {
              return (
                <MiniCardComponent
                  instancetitle={environment.name}
                  key={environment.id}
                  checked={
                    selectedEnvironment &&
                    selectedEnvironment.path === environment.path
                  }
                  onClick={() => setSelectedEnvironment(environment)}
                />
              );
            }
            return null
          })}
        </Row>
        {isInvalid.environment ? (
          <Translate
            content="common.message.thisFieldIsRequired"
            className="errorText"
          />
        ) : null}
      </CardComponent>
      {selectedEnvironment && (
        <EnvArgsForm
          args={JSON.parse(selectedEnvironment.args) || []}
          title={context.counterpart("dashboard.addEnvironement.argsTitle")}
          subtitle={context.counterpart(
            "dashboard.addEnvironement.argsDescription"
          )}
          argsValues={argsValues}
          setArgsValues={setArgsValues}
          isInvalid={isInvalid.values}
        />
      )}
      <Row style={{ marginTop: "30px" }}>
        <Col
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LoadingButton
            loading={loadingSubmit}
            icon="fa-solid fa-floppy-disk"
            onClick={addInstanceHandler}
          >
            <Translate content="common.button.create" />
          </LoadingButton>
        </Col>
      </Row>
    </div>
  );
}

export default AddInstance;
