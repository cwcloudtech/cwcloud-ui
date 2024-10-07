import { useState, useContext, useEffect } from "react";
import { Row, Col } from "reactstrap";
// import classes from "./InstancesPage.module.css";
import "../../../../../common.css";
import CardComponent from "../../../../../Components/Cards/CardComponent/CardComponent";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TextField } from "@mui/material";
import axios from "../../../../../utils/axios";
import { isBlank } from "../../../../../utils/common";
import GlobalContext from "../../../../../Context/GlobalContext";
import Tooltip from "@mui/material/Tooltip";
import Fade from "@mui/material/Fade";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import Translate from "react-translate-component";
import DeleteModal from "../../../../../Components/Modal/DeleteModal";
import { toast } from "react-toastify";
import DataTable from "../../../../../Components/Table/DataTable";
import formateDate from "../../../../../utils/FormateDate";
import filteredListWithoutRemovedElement from "../../../../../utils/filter";
import InputAdornment from "@mui/material/InputAdornment";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CustomPowerIcon from "../../../../../Components/CustomIcon/CustomPowerIcon";
import CustomRerunIcon from "../../../../../Components/CustomIcon/CustomRerunIcon";
import CustomDeleteIcon from "../../../../../Components/CustomIcon/CustomDeleteIcon";
import RebootModal from "../../../../../Components/Modal/ActionModals/RebootModal";
import PowerModal from "../../../../../Components/Modal/ActionModals/PowerModal";

function InstancesPage(props) {
  const location = useLocation();
  const currentPath = location.pathname;
  const is_admin = currentPath === "/admin/instances";
  const nextPath = is_admin ? "/admin/instances/create" : "/instances/create";
  const [instances, setInstances] = useState([]);
  const [filtredInstances, setFiltredInstances] = useState([]);
  const [loading, setLoading] = useState(true);
  const { selectedProvider, region, counterpart, setIsGlobal, user } =
    useContext(GlobalContext);
  const [selectedInstance, setSelectedInstance] = useState(null);
  const [multiSelection, setMultiSelection] = useState(false);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [showConfirmRebootModal, setshowConfirmRebootModal] = useState(false);
  const [showConfirmPowerModal, setshowConfirmPowerModal] = useState(false);
  const [selectedDeletionItems, setSelectedDeletionItems] = useState([]);
  const navigate = useNavigate();
  const columns = [
    {
      field: "id",
      headerName: counterpart("dashboard.instancesPage.table.id"),
      width: 200,
      renderCell: (params) => (
        <Link
          to={
            is_admin ? `/admin/instance/${params.id}` : `/instance/${params.id}`
          }
        >
          {params.id}
        </Link>
      ),
    },
    {
      field: "name",
      headerName: counterpart("dashboard.instancesPage.table.name"),
      width: 200,
    },
    {
      field: "type",
      headerName: counterpart("dashboard.instancesPage.table.size"),
      width: 100,
    },
    {
      field: "status",
      headerName: counterpart("dashboard.instancesPage.table.status"),
      width: 100,
    },
    {
      field: "created_at",
      headerName: counterpart("dashboard.instancesPage.table.created"),
      width: 200,
      renderCell: (params) => formateDate(params.row.created_at),
    },
    {
      field: "action",
      headerName: counterpart("dashboard.instancesPage.table.actions"),
      width: 100,
      renderCell: (params) => {
        const instanceIndex = instances.findIndex(
          (instance) => instance.id === params.id
        );
        setSelectedInstance(instances[instanceIndex]);
        return (
          <div>
            <CustomPowerIcon
              onClick={onPrePowerHandler}
              title={
                selectedInstance && selectedInstance?.status === "active"
                  ? "Power Off"
                  : "Power On"
              }
            />
            <span style={{ width: "10px" }}></span>
            <CustomRerunIcon
              onClick={onPreRebootHandler}
              title={counterpart("common.button.reboot")}
            />
            <span style={{ width: "10px" }}></span>
            <CustomDeleteIcon onClick={onPreDeleteHandler} />
          </div>
        );
      },
    },
  ];

  const fetchInstances = () => {
    var api_url = is_admin
      ? `/admin/instance/${selectedProvider.name}/${region.name}/all`
      : `/instance/${selectedProvider.name}/${region.name}`;
    axios
      .get(api_url)
      .then((res) => {
        setInstances(res.data);
        setFiltredInstances(res.data);
        setLoading(false);
      })
      .catch((err) => {
        navigate("/notfound");
      });
  };

  useEffect(() => {
    setIsGlobal(false);
    fetchInstances();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [region, navigate, selectedProvider, setIsGlobal, showConfirmDeleteModal]);

  const preDeleteSelectionHandler = (selectedItems) => {
    setMultiSelection(true);
    setShowConfirmDeleteModal(true);
    const allowedInstances = [
      ...instances.filter((b) => b.user_id === user.id).map((i) => i.id),
    ];
    setSelectedDeletionItems(
      selectedItems.filter((instanceId) =>
        allowedInstances.includes(instanceId)
      )
    );
  };

  const deleteInstancesHandler = async () => {
    setLoading(true);
    new Promise((r, j) => {
      const deletedInstances = [];
      selectedDeletionItems.forEach((instanceId, index) => {
        var api_url = is_admin
          ? `/admin/instance/${instanceId}`
          : `/instance/${selectedProvider.name}/${region.name}/${instanceId}`;
        axios
          .delete(api_url)
          .then(() => {
            deletedInstances.push(instanceId);
            if (index === selectedDeletionItems.length - 1) {
              r(deletedInstances);
            }
          })
          .catch(() => {
            if (index === selectedDeletionItems.length - 1) {
              r(deletedInstances);
            }
          });
      });
    }).then((delete_instances) => {
      setInstances([
        ...instances.filter((p) => !delete_instances.includes(p.id)),
      ]);
      if (delete_instances.length > 0)
        toast.success(
          counterpart("dashboard.instancesPage.message.successMultiDelete")
        );
      setLoading(false);
      setShowConfirmDeleteModal(false);
    });
  };

  const filterInstances = (e) => {
    const searchQuery = e.target.value.trim();
    if (isBlank(searchQuery)) {
      setFiltredInstances(instances);
    } else {
      var filtredInstances = instances.filter((instances) =>
        instances.name.includes(searchQuery)
      );
      setFiltredInstances(filtredInstances);
    }
  };

  const onPreDeleteHandler = () => {
    setShowConfirmDeleteModal(true);
  };

  const onDeleteHandler = () => {
    setLoading(true);
    var api_url = is_admin
      ? `/admin/instance/${selectedInstance.id}`
      : `/instance/${selectedProvider.name}/${selectedInstance.region}/${selectedInstance.id}`;
    axios
      .delete(api_url)
      .then((response) => {
        deleteInstance();
        toast.success(
          counterpart("dashboard.instanceOverview.message.successDelete")
        );
        setShowConfirmDeleteModal(false);
        setLoading(false);
      })
      .catch((err) => {
        setShowConfirmDeleteModal(false);
        setLoading(false);
        console.log(err);
      });
  };

  const onPreRebootHandler = () => {
    selectedInstance.status === "active"
      ? setshowConfirmRebootModal(true)
      : toast.error("you can't reboot your instance");
  };

  const onRebootHandler = () => {
    const payload = {
      status: "reboot",
    };
    var api_url = is_admin
      ? `/admin/instance/${selectedInstance?.id}`
      : `/instance/${selectedProvider.name}/${selectedInstance?.region}/${selectedInstance?.id}`;
    setLoading(true);
    axios
      .patch(api_url, payload)
      .then((response) => {
        toast.success(
          counterpart("dashboard.instanceOverview.message.successUpdate")
        );
        setshowConfirmRebootModal(false);
        setLoading(false);
      })
      .catch((err) => {
        setshowConfirmRebootModal(false);
        setLoading(false);
        console.log(err);
      });
  };

  const onPrePowerHandler = () => {
    setshowConfirmPowerModal(true);
  };

  const onPowerHandler = () => {
    const updatedStatus =
      selectedInstance.status === "active" ? "poweroff" : "poweron";
    setLoading(true);
    var api_url = is_admin
      ? `/admin/instance/${selectedInstance?.id}`
      : `/instance/${selectedProvider.name}/${selectedInstance?.region}/${selectedInstance?.id}`;
    axios
      .patch(api_url, { status: updatedStatus, type: selectedInstance?.type })
      .then((response) => {
        toast.success(
          counterpart("dashboard.instanceOverview.message.successUpdate")
        );
        const newInstanceStatus =
          updatedStatus === "poweroff" ? "poweredoff" : "active";
        updateInstanceStatus(newInstanceStatus);
        setshowConfirmPowerModal(false);
        setLoading(false);
      })
      .catch((err) => {
        setshowConfirmPowerModal(false);
        setLoading(false);
        console.log(api_url);
      });
  };

  const updateInstanceStatus = (instanceId, newStatus) => {
    const instanceIndex = instances.findIndex(
      (instance) => instance.id === instanceId
    );
    const _instances = [...instances];
    _instances[instanceIndex].status = newStatus;
    setInstances(_instances);
  };

  const deleteInstance = (instanceId) => {
    setInstances(filteredListWithoutRemovedElement(instanceId, instances));
    setFiltredInstances(
      filteredListWithoutRemovedElement(instanceId, filtredInstances)
    );
  };

  return (
    <CardComponent
      containerStyles={props.containerStyles}
      title={counterpart("dashboard.instancesPage.title")}
      subtitle={counterpart("dashboard.instancesPage.description")}
      link={counterpart("dashboard.instancesPage.learnMore")}
    >
      <RebootModal
        isOpen={showConfirmRebootModal}
        toggle={() => setshowConfirmRebootModal(!showConfirmRebootModal)}
        onReboot={onRebootHandler}
        name={selectedInstance ? selectedInstance.name : "undef"}
        loading={loading}
        type={selectedInstance ? selectedInstance.type : "undef"}
      />
      <PowerModal
        isOpen={showConfirmPowerModal}
        toggle={() => setshowConfirmPowerModal(!showConfirmPowerModal)}
        onPower={onPowerHandler}
        name={selectedInstance ? selectedInstance.name : "undef"}
        loading={loading}
        status={selectedInstance ? selectedInstance.status : "undef"}
      />
      <DeleteModal
        resourceName={"instance"}
        multi={multiSelection}
        isOpen={showConfirmDeleteModal}
        toggle={() => setShowConfirmDeleteModal(!showConfirmDeleteModal)}
        onMultiDelete={deleteInstancesHandler}
        onDelete={onDeleteHandler}
        name={selectedInstance ? selectedInstance.name : "undef"}
        loading={loading}
      />
      <Row>
        <Col>
          <div style={{ paddingBottom: "20px" }} className="instanceCreation">
            <TextField
              onChange={(e) => filterInstances(e)}
              label={counterpart(
                "dashboard.addInstance.inputs.name.placeholder"
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
            <Tooltip
              TransitionComponent={Fade}
              TransitionProps={{ timeout: 600 }}
              title={
                <h5 className="tootltipValue">
                  <Translate content="dashboard.instancesPage.addInstance" />
                </h5>
              }
              placement="bottom"
            >
              <Fab
                color="primary"
                aria-label="add"
                onClick={() => navigate(nextPath)}
                style={{ transform: "scale(0.7)" }}
              >
                <AddIcon className="whiteIcon" />
              </Fab>
            </Tooltip>
          </div>
        </Col>
      </Row>
      <DataTable
        icon={"fa-solid fa-microchip"}
        createUrl={nextPath}
        emptyMessage={counterpart("dashboard.instancesPage.emptyMessage")}
        createMessage={counterpart("dashboard.instancesPage.createMessage")}
        checkboxSelection
        columns={columns}
        setMultiSelection={setMultiSelection}
        rows={filtredInstances}
        onDeleteSelection={preDeleteSelectionHandler}
      />
    </CardComponent>
  );
}

export default InstancesPage;
