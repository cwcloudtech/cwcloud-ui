import AddIcon from "@mui/icons-material/Add";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Fab, InputAdornment, TextField } from "@mui/material";
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

export default function AdminDnsOverview(props) {
  const { counterpart } = useContext(GlobalContext);
  const [selectedDeletionItems, setSelectedDeletionItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [multiSelection, setMultiSelection] = useState(false);
  const [filteredDnsRecords, setFilteredDnsRecords] = useState([]);
  const [dnsRecords, setDnsRecords] = useState([]);
  const [selectedDnsRecord, setSelectedDns] = useState(null);

  const navigate = useNavigate();
  const context = useContext(GlobalContext);

  const columns = [
    {
      field: "record",
      headerName: counterpart("dashboard.dnsRecordsPage.explore.table.name"),
      flex: 2,
    },
    {
      field: "zone",
      headerName: counterpart("dashboard.dnsRecordsPage.explore.table.zone"),
      flex: 2,
    },
    {
      field: "data",
      headerName: counterpart("dashboard.dnsRecordsPage.explore.table.data"),
      flex: 2,
    },
    {
      field: "ttl",
      headerName: counterpart("dashboard.dnsRecordsPage.explore.table.ttl"),
      flex: 2,
    },
    {
      field: "type",
      headerName: counterpart("dashboard.dnsRecordsPage.explore.table.type"),
      flex: 2,
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
    axios
      .get(`/admin/dns/${context.selectedProvider.name}/list`)
      .then((res) => {
        setDnsRecords(res.data);
        setFilteredDnsRecords(res.data);
        setLoading(false);
      })
      .catch((err) => {
        navigate("/notfound");
      });
  }, [navigate, context.selectedProvider]);

  const filterDns = (e) => {
    const searchQuery = e.target.value.trim();
    if (!searchQuery || searchQuery === "") {
      setFilteredDnsRecords(dnsRecords);
    } else {
      var filteredItems = dnsRecords.filter((dns_record) =>
        dns_record.record.includes(searchQuery)
      );
      setFilteredDnsRecords(filteredItems);
    }
  };

  const preDeleteSelectionHandler = (selectedItems) => {
    setMultiSelection(true);
    setShowConfirmDeleteModal(true);
    setSelectedDeletionItems(
      selectedItems.map((item) => dnsRecords.find((p) => p.id === item))
    );
  };

  const onPreDeleteHandler = (clusterId) => {
    const recordIndex = dnsRecords.findIndex((p) => p.id === clusterId);
    setSelectedDns(dnsRecords[recordIndex]);
    setShowConfirmDeleteModal(true);
  };

  const deleteDnsRecordsHandler = async () => {
    setLoading(true);
    new Promise((r, j) => {
      const deletedEnvs = [];
      selectedDeletionItems.forEach((item, index) => {
        axios
          .patch(`/admin/dns/${context.selectedProvider.name}/delete`, {
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
      .patch(`/admin/dns/${context.selectedProvider.name}/delete`, {
        id: selectedDnsRecord.id,
        record_name: selectedDnsRecord.record,
        dns_zone: selectedDnsRecord.zone,
      })
      .then((response) => {
        setDnsRecords(
          filteredListWithoutRemovedElement(selectedDnsRecord.id, dnsRecords)
        );
        setFilteredDnsRecords(
          filteredListWithoutRemovedElement(
            selectedDnsRecord.id,
            dnsRecords
          )
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
      <Row>
        <Col>
          <div
            style={{ paddingBottom: "20px" }}
            className={classes.clusterCreation}
          >
            <TextField
              onChange={(e) => filterDns(e)}
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

            <div style={{ display: "flex" }}>
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
            </div>
          </div>
        </Col>
      </Row>
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
        rows={filteredDnsRecords}
        onDeleteSelection={preDeleteSelectionHandler}
      />
    </CardComponent>
  );
}
