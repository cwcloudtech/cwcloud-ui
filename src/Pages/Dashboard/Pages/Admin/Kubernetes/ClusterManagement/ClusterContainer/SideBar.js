import React, { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Sidebar.module.css";
import GlobalContext from "../../../../../../../Context/GlobalContext";
import { Drawer, List, IconButton } from "@mui/material";
import SidebarMenuItem from "../../../../../../../Components/SidebarMenuItem/SidebarMenuItem";
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';

function Sidebar() {
  const context = useContext(GlobalContext);
  const navigate = useNavigate();
  const { clusterId } = useParams();
  const [open, setOpen] = React.useState(true);
  const prefix = `/kubernetes/cluster/${clusterId}`;

  function convertSlugToUrl(slug, parameters) {
    let url = slug;
    Object.entries(parameters).forEach(([key, value]) => {
      url = url.replace(`:${key}`, value);
    });
    return url;
  }

  const resetMainSidebarScroll = () => {
    let myelement = document.getElementById("main-sidebar");
    if (myelement && myelement.firstChild) myelement.firstChild.scrollTop = 0;
  }

  const handleDrawerToggle = () => {
    setOpen(!open);
    resetMainSidebarScroll();
  };

  function onClick(slug, parameters = {}) {
    navigate(convertSlugToUrl(slug, parameters));
  }

  useEffect(() => {
    resetMainSidebarScroll();
  }, []);

  return (
    <>
      <IconButton
        onClick={handleDrawerToggle}
        sx={{ position: "fixed", zIndex: 1000, left: 255, top: 400 }}
        style={{ color: "#0861AF"}}
      >
        {
          open 
          ? <KeyboardDoubleArrowRightIcon style={{ fontSize: "30px" }} />
          : <KeyboardDoubleArrowLeftIcon style={{ fontSize: "30px" }} />

        }
      </IconButton>
      <Drawer
        variant="persistent"
        anchor="left"
        open={open}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          width: 255,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: "245px",
            height: "150vh",
            boxSizing: "border-box",
            marginTop: "105px",
            borderTopRightRadius: "15px",
            zIndex: "1000"
          },
        }}
      >
        <List>
          <SidebarMenuItem
            items={[]}
            icon={<i className="fa-solid fa-reply" style={{ fontSize: "18px"}}></i>}
            title={context.counterpart("common.button.goBack")}
            onClick={handleDrawerToggle}
          />
          <SidebarMenuItem
            id={prefix}
            items={[]}
            icon={<i className="fa-solid fa-tower-observation" style={{ fontSize: "18px" }}></i>}
            title={context.counterpart("dashboard.kubernetesDashboardPages.sidebar.clusterOverview.title")}
            onClick={() => onClick(prefix)}
          />
          <SidebarMenuItem
            id={"serviceDiscovery"}
            items={[`${prefix}/serviceDiscovery/services/explore`, `${prefix}/serviceDiscovery/ingresses/explore`]}
            icon={<i className="fa-brands fa-servicestack" style={{ fontSize: "18px" }}></i>}
            title={context.counterpart(
              "dashboard.kubernetesDashboardPages.sidebar.serviceDiscovery.title"
            )}
          >
            <SidebarMenuItem
              id={`${prefix}/serviceDiscovery/services/explore`}
              title={context.counterpart(
                "dashboard.kubernetesDashboardPages.sidebar.serviceDiscovery.services"
              )}
              level={2}
              onClick={() => onClick("serviceDiscovery/services/explore")}
            />
            <SidebarMenuItem
              id={`${prefix}/serviceDiscovery/ingresses/explore`}
              title={context.counterpart(
                "dashboard.kubernetesDashboardPages.sidebar.serviceDiscovery.ingress"
              )}
              level={2}
              onClick={() => onClick("serviceDiscovery/ingresses/explore")}
            />
          </SidebarMenuItem>

          <SidebarMenuItem
            id={"storage"}
            items={[`${prefix}/storage/configMaps/explore`, `${prefix}/storage/secrets/explore`]}
            icon={<i className="fa-solid fa-boxes-stacked" style={{ fontSize: "18px" }}></i>}
            title={context.counterpart(
              "dashboard.kubernetesDashboardPages.sidebar.storage.title"
            )}
          >
            <SidebarMenuItem
              id={`${prefix}/storage/configMaps/explore`}
              title={context.counterpart(
                "dashboard.kubernetesDashboardPages.sidebar.storage.configMap"
              )}
              level={2}
              onClick={() => onClick("storage/configMaps/explore")}
            />
            <SidebarMenuItem
              id={`${prefix}/storage/secrets/explore`}
              title={context.counterpart(
                "dashboard.kubernetesDashboardPages.sidebar.storage.secrets"
              )}
              level={2}
              onClick={() => onClick("storage/secrets/explore")}
            />
          </SidebarMenuItem>
        </List>
      </Drawer>
    </>
  );
}

export default Sidebar;
