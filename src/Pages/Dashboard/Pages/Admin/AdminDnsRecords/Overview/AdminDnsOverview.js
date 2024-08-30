import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Fab, InputAdornment, TextField } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Fade from "@mui/material/Fade";
import Tooltip from "@mui/material/Tooltip";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Translate from "react-translate-component";
import { Col, Row } from "reactstrap";
import CardComponent from "../../../../../../Components/Cards/CardComponent/CardComponent";
import CustomDeleteIcon from "../../../../../../Components/CustomIcon/CustomDeleteIcon";
import LoadingSpinner from "../../../../../../Components/LoadingSpinner/LoadingSpinner";
import DeleteModal from "../../../../../../Components/Modal/DeleteModal";
import DataTable from "../../../../../../Components/Table/DataTable";
import GlobalContext from "../../../../../../Context/GlobalContext";
import axios from "../../../../../../utils/axios";
import filteredListWithoutRemovedElement from "../../../../../../utils/filter";
import classes from "./AdminDnsOverview.module.css";
import colors from "../../../../../../Context/Colors";

export default function AdminDnsOverview(props) {
  const { counterpart } = useContext(GlobalContext);
  const [selectedDeletionItems, setSelectedDeletionItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [multiSelection, setMultiSelection] = useState(false);
  const [filteredDnsRecords, setFilteredDnsRecords] = useState([]);
  const [rawDnsRecords, setRawDnsRecords] = useState([]);
  const [dnsRecords, setDnsRecords] = useState([]);
  const [selectedDnsRecord, setSelectedDns] = useState(null);

  const navigate = useNavigate();
  const context = useContext(GlobalContext);
  const _mode = context.mode;

  const columns = [
    {
      field: "record",
      headerName: counterpart("dashboard.dnsRecordsPage.explore.table.name"),
      width: 200,
    },
    {
      field: "data",
      headerName: counterpart("dashboard.dnsRecordsPage.explore.table.data"),
      width: 900,
    },
    {
      field: "ttl",
      headerName: counterpart("dashboard.dnsRecordsPage.explore.table.ttl"),
      width: 100,
    },
    {
      field: "type",
      headerName: (
        <Tooltip
          title={context.counterpart(
            "dashboard.dnsRecordsPage.message.searchTip"
          )}
          placement="top"
        >
          <span>
            {context.counterpart("dashboard.dnsRecordsPage.explore.table.type")}
          </span>{" "}
        </Tooltip>
      ),
      width: 100,
    },
    {
      field: "action",
      headerName: counterpart("dashboard.dnsRecordsPage.explore.table.actions"),
      flex: 2,
      renderCell: (params) => {
        const onClick = (e) => {
          e.stopPropagation();
          onPreDeleteHandler(params.id);
        };
        return <CustomDeleteIcon onClick={onClick} />;
      },
    },
  ];

  useEffect(() => {
    setLoading(true);
    context.setIsGlobal(false);
    axios
      .get(`/admin/dns/${context.selectedDnsProvider}/list`)
      .then((res) => {
        // Group the records by zone
        setRawDnsRecords(res.data);
        const groupedData = res.data.reduce((acc, item) => {
          const zone = item.zone;
          if (!acc[zone]) {
            acc[zone] = {
              zone: zone,
              data: [],
            };
          }
          // Handle both string and array formats for the data field
          const formattedData = Array.isArray(item.data)
            ? item.data.join(" | ")
            : item.data.replace(/,/g, " | ");
  
          acc[zone].data.push({
            ...item,
            data: formattedData,
          });
          return acc;
        }, {});

        const data = Object.values(groupedData);
        setDnsRecords(data);
        setFilteredDnsRecords(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, context.selectedDnsProvider]);  

  const filterDns = (e, zone) => {
    const searchQuery = e.target.value.trim();
    const filteredData = dnsRecords.map((dnsRecord) => {
      if (dnsRecord.zone === zone) {
        let filteredItems;
        if (searchQuery.startsWith(":")) {
          const typeQuery = searchQuery.slice(1).toUpperCase();
          filteredItems = dnsRecord.data.filter(
            (record) => record.type.toUpperCase() === typeQuery
          );
        } else if (!searchQuery || searchQuery === "") {
          filteredItems = dnsRecord.data;
        } else {
          filteredItems = dnsRecord.data.filter((record) =>
            record.record.includes(searchQuery)
          );
        }
        return {
          ...dnsRecord,
          data: filteredItems,
        };
      }
      return dnsRecord;
    });

    setFilteredDnsRecords(filteredData);
  };

  const preDeleteSelectionHandler = (selectedItems) => {
    setMultiSelection(true);
    setShowConfirmDeleteModal(true);
    setSelectedDeletionItems(
      selectedItems.map((item) => rawDnsRecords.find((p) => p.id === item))
    );
  };

  const onPreDeleteHandler = (clusterId) => {
    const recordIndex = rawDnsRecords.findIndex((p) => p.id === clusterId);
    setSelectedDns(rawDnsRecords[recordIndex]);
    setShowConfirmDeleteModal(true);
  };

  const deleteDnsRecordsHandler = async () => {
    setLoading(true);
    new Promise((r, j) => {
      const deletedEnvs = [];
      selectedDeletionItems.forEach((item, index) => {
        axios
          .patch(`/admin/dns/${context.selectedDnsProvider}/delete`, {
            id: item.id,
            record_name: item.record,
            dns_zone: item.zone,
          })
          .then(() => {
            deletedEnvs.push(item);
            if (index === selectedDeletionItems.length - 1) {
              r(deletedEnvs);
            }
          })
          .catch(() => {
            if (index === selectedDeletionItems.length - 1) {
              r(deletedEnvs);
            }
          });
      });
    })
      .then((deleted_envs) => {
        setDnsRecords([
          ...dnsRecords.filter((p) => !deleted_envs.includes(p.id)),
        ]);
        setFilteredDnsRecords([
          ...dnsRecords.filter((p) => !deleted_envs.includes(p.id)),
        ]);
        if (deleted_envs.length > 0)
          toast.success(
            counterpart("dashboard.dnsRecordsPage.explore.successDeleteAll")
          );
        setLoading(false);
        setShowConfirmDeleteModal(false);
      })
      .finally(() => {
        setMultiSelection(false);
      });
  };

  const deleteDnsHandler = () => {
    setLoading(true);
    axios
      .patch(`/admin/dns/${context.selectedDnsProvider}/delete`, {
        id: selectedDnsRecord.id,
        record_name: selectedDnsRecord.record,
        dns_zone: selectedDnsRecord.zone,
      })
      .then((response) => {
        setDnsRecords(
          filteredListWithoutRemovedElement(selectedDnsRecord.id, dnsRecords)
        );
        setFilteredDnsRecords(
          filteredListWithoutRemovedElement(selectedDnsRecord.id, dnsRecords)
        );
        toast.success(
          counterpart("dashboard.dnsRecordsPage.explore.successDelete")
        );
        setShowConfirmDeleteModal(false);
        setLoading(false);
      })
      .catch((err) => {
        setShowConfirmDeleteModal(false);
        setLoading(false);
      });
  };

  const handleAddDnsRecord = () => {
    navigate("/admin/dns-records/add");
  };

  if (loading) return <LoadingSpinner />;
  return (
    <CardComponent
      containerStyles={props.containerStyles}
      title={counterpart("dashboard.dnsRecordsPage.explore.title")}
      subtitle={counterpart("dashboard.dnsRecordsPage.explore.description")}
      link={counterpart("dashboard.dnsRecordsPage.explore.learnMore")}
    >
      <DeleteModal
        resourceName={"DNS record"}
        multi={multiSelection}
        isOpen={showConfirmDeleteModal}
        toggle={() => setShowConfirmDeleteModal(!showConfirmDeleteModal)}
        onMultiDelete={deleteDnsRecordsHandler}
        onDelete={deleteDnsHandler}
        loading={loading}
        name={selectedDnsRecord?.name}
      />
      {filteredDnsRecords.map((dnsRecord) => (
        <Accordion key={dnsRecord.zone}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <h5 style={{ color: colors.title[_mode] }}>{dnsRecord.zone}</h5>
          </AccordionSummary>
          <AccordionDetails>
            <Row>
              <Col md="11">
                <div
                  style={{ paddingBottom: "20px" }}
                  className={classes.clusterCreation}
                >
                  <TextField
                    onChange={(e) => filterDns(e, dnsRecord.zone)}
                    placeholder={counterpart(
                      "dashboard.dnsRecordsPage.explore.searchPlaceholder"
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
                </div>
              </Col>
              <Col md="1">
                <Tooltip
                  TransitionComponent={Fade}
                  TransitionProps={{ timeout: 600 }}
                  title={
                    <h5 className="tootltipValue">
                      <Translate content="dashboard.dnsRecordsPage.explore.addDnsRecord" />
                    </h5>
                  }
                  placement="bottom"
                >
                  <Fab
                    color="primary"
                    aria-label="add"
                    onClick={handleAddDnsRecord}
                    style={{ transform: "scale(0.7)" }}
                  >
                    <AddIcon className="whiteIcon" />
                  </Fab>
                </Tooltip>
              </Col>
              <Col md="12">
                <DataTable
                  icon={"fa-solid fa-laptop-code"}
                  onCreate={handleAddDnsRecord}
                  emptyMessage={counterpart(
                    "dashboard.dnsRecordsPage.explore.emptyMessage"
                  )}
                  createMessage={counterpart(
                    "dashboard.dnsRecordsPage.explore.addDnsRecord"
                  )}
                  checkboxSelection
                  columns={columns}
                  setMultiSelection={setMultiSelection}
                  rows={dnsRecord.data}
                  onDeleteSelection={preDeleteSelectionHandler}
                />
              </Col>
            </Row>
          </AccordionDetails>
        </Accordion>
      ))}
    </CardComponent>
  );
}
