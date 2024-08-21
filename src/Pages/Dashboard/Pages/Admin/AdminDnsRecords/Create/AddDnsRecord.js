import { OutlinedInput, Stack } from "@mui/material";
import { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Translate from "react-translate-component";
import {
  Col,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";
import CardComponent from "../../../../../../Components/Cards/CardComponent/CardComponent";
import DropdownComponent from "../../../../../../Components/Dropdown/Dropdown";
import LoadingButton from "../../../../../../Components/LoadingButton/LoadingButton";
import LoadingSpinner from "../../../../../../Components/LoadingSpinner/LoadingSpinner";
import colors from "../../../../../../Context/Colors";
import GlobalContext from "../../../../../../Context/GlobalContext";
import "../../../../../../common.css";
import axiosInstance from "../../../../../../utils/axios";
import useDnsZones from "./useDnsZones";

const recordType = ["A", "AAAA", "NS", "CNAME", "DNAME", "TXT"];

function AddDnsRecord(props) {
  const context = useContext(GlobalContext);
  const _mode = context.mode; 

  const [data, setData] = useState({
    name: "",
    zone: "",
    type: "A",
    ttl: 3600,
    data: "",
  });
  const [selectedZone, setSelectedZone] = useState(null);

  const [isInvalid, setIsInvalid] = useState({
    name: false,
    zone: false,
    type: false,
    ttl: false,
    data: false,
  });
  const [invalidGcpCnameTargeForm, setInvalidGcpCnameTargeForm] = useState(false);
  const { dns_zones, loading } = useDnsZones();
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const navigate = useNavigate();

  const addDnsRecordHandler = () => {
    let nameIsInvalid = data.name === "";
    let zoneIsInvalid = selectedZone === null;
    let typeIsInvalid = data.type === "" || !recordType.includes(data.type);
    let ttlIsInvalid = data.ttl === null || data.ttl === "" || data.ttl < 0;
    let dataIsInvalid = data.data === "";
    if(context.selectedProvider.name === "gcp" && data.type === "CNAME" && !data.data.endsWith(".")){
      setInvalidGcpCnameTargeForm(true);
    }
    setIsInvalid({
      name: nameIsInvalid,
      zone: zoneIsInvalid,
      type: typeIsInvalid,
      ttl: ttlIsInvalid,
      data: dataIsInvalid,
    });
    if (nameIsInvalid || zoneIsInvalid || typeIsInvalid || ttlIsInvalid) {
      return;
    }
    setLoadingSubmit(true);

    axiosInstance
      .post(`/admin/dns/${context.selectedProvider.name}/create`, {
        record_name: data.name,
        dns_zone: dns_zones.find((zone) => zone.id === selectedZone).name,
        type: data.type,
        ttl: data.ttl,
        data: data.data,
      })
      .then(() => {
        setLoadingSubmit(false);
        navigate("/admin/dns-records/overview");
      })
      .catch(() => {
        setLoadingSubmit(false);
      });
  };

  if (loading) return <LoadingSpinner />;
  return (
    <div>
      <Row>
        <Col>
          <div className="goBack">
            <NavLink to="/admin/dns-records/overview" className="link fs-6">
              <i className="fa-solid fa-arrow-left iconStyle"></i>
              <Translate content="dashboard.dnsRecordsPage.form.backToExplore" />
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
            <Translate content="dashboard.dnsRecordsPage.form.title" />
          </h5>
        </Col>
      </Row>
      <CardComponent
        customMarginTop={"20px"}
        title={context.counterpart("dashboard.dnsRecordsPage.form.title")}
      >
        <Form>
          <FormGroup>
            <Label for="dns-record-name" style={{ color: colors.title[_mode] }}>
              {context.counterpart("dashboard.dnsRecordsPage.form.nameLabel")}*
            </Label>
            <Input
              className="blackableInput"
              placeholder={context.counterpart(
                "dashboard.dnsRecordsPage.form.namePlaceHolder"
              )}
              value={data.name}
              id="dns-record-name"
              onChange={(e) => setData({ ...data, name: e.target.value })}
              invalid={isInvalid.name}
            />
            <FormFeedback>
              <Translate
                content="dashboard.dnsRecordsPage.form.invalid"
                className="errorText"
              />
            </FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label for="dns-record-ttl" style={{ color: colors.title[_mode] }}>
              {context.counterpart("dashboard.dnsRecordsPage.form.ttlLabel")}*
            </Label>
            <Input
              className="blackableInput"
              placeholder={context.counterpart(
                "dashboard.dnsRecordsPage.form.ttlPlaceHolder"
              )}
              value={data.ttl}
              id="dns-record-ttl"
              type="number"
              min={0}
              onChange={(e) => setData({ ...data, ttl: e.target.value })}
              invalid={isInvalid.ttl}
            />
            <FormFeedback>
              <Translate
                content="dashboard.dnsRecordsPage.form.invalid"
                className="errorText"
              />
            </FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label for="dns-record-data" style={{ color: colors.title[_mode] }}>
              {context.counterpart("dashboard.dnsRecordsPage.form.targetLabel")}
              *
            </Label>
            <Input
              className="blackableInput"
              placeholder={context.counterpart(
                "dashboard.dnsRecordsPage.form.targetPlaceHolder"
              )}
              value={data.data}
              id="dns-record-data"
              onChange={(e) => setData({ ...data, data: e.target.value })}
              invalid={isInvalid.data || invalidGcpCnameTargeForm}
            />
            <FormFeedback>
              <Translate
                content="dashboard.dnsRecordsPage.form.invalid"
                className="errorText"
              />
              <br/>
              {
                invalidGcpCnameTargeForm && <Translate
                content="dashboard.dnsRecordsPage.form.pleaseAddApointatTheEnd"
                className="errorText" />
              }
            </FormFeedback>
          </FormGroup>
        </Form>
      </CardComponent>
      <CardComponent
        title={
          context.counterpart("dashboard.dnsRecordsPage.form.typeLabel") + "*"
        }
        subtitle={context.counterpart(
          "dashboard.dnsRecordsPage.form.selectTypeSubtitle"
        )}
      >
        <Stack>
          <DropdownComponent
            inputLabelId="demo-multiple-label"
            name={context.counterpart(
              "dashboard.dnsRecordsPage.form.typeLabel"
            )}
            selectLabelId="demo-multiple-type-label"
            selectId="demo-multiple-type"
            selectedItem={data.type}
            onChange={(e) => setData({ ...data, type: e.target.value })}
            input={<OutlinedInput label="Type" />}
            items={recordType.map((type) => ({ id: type, name: type }))}
          />
          {isInvalid.type ? (
            <Translate
              content="dashboard.dnsRecordsPage.form.invalid"
              className="errorText"
            />
          ) : null}
        </Stack>
      </CardComponent>
      <CardComponent
        title={
          context.counterpart("dashboard.dnsRecordsPage.form.selectZone") + "*"
        }
        subtitle={context.counterpart(
          "dashboard.dnsRecordsPage.form.selectZoneSubtitle"
        )}
      >
        <Stack>
          <DropdownComponent
            inputLabelId="demo-multiple-name-label"
            name={context.counterpart(
              "dashboard.dnsRecordsPage.form.zoneLabel"
            )}
            selectLabelId="demo-multiple-name-label"
            selectId="demo-multiple-name"
            selectedItem={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            input={<OutlinedInput label="Name" />}
            items={dns_zones}
          />
          {isInvalid.zone ? (
            <Translate
              content="dashboard.dnsRecordsPage.form.invalid"
              className="errorText"
            />
          ) : null}
        </Stack>
      </CardComponent>
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
            onClick={addDnsRecordHandler}
          >
            <Translate content="common.button.create" />
          </LoadingButton>
        </Col>
      </Row>
    </div>
  );
}

export default AddDnsRecord;
