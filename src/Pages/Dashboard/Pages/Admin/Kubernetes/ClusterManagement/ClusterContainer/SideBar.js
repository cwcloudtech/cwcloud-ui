import React, { useContext } from "react";
import "./Sidebar.module.css";
import GlobalContext from "../../../../../../../Context/GlobalContext";
import SidebarMenuItem from "../../../../../../../Components/CollapsableSidebar/SidebarMenuItem/SidebarMenuItem";
import List from "@mui/material/List";
import { useSidebar } from "../../../../../../../Hooks/useSidebar";
import CollapsableSidebar from "../../../../../../../Components/CollapsableSidebar/CollapsableSidebar";
import { useK8sSideBar } from "./useK8sSideBar";

function Sidebar() {
  const context = useContext(GlobalContext);
  const { sidebarKubernetesItems } = useK8sSideBar();
  const { open } = useSidebar();

  return (
    <CollapsableSidebar>
      <List style={{ margin: "20px 0" }}>
        {sidebarKubernetesItems.map(
          ({
            id,
            titleKey,
            iconClass,
            path,
            items,
            children,
            condition = true,
          }) =>
            condition && (
              <SidebarMenuItem
                key={`k8s-${id}`}
                id={id}
                items={items}
                open={open}
                title={context.counterpart(titleKey)}
                icon={
                  <i
                    className={`fa-solid ${iconClass}`}
                    style={{ fontSize: "18px" }}
                  ></i>
                }
                path={path}
              >
                {children &&
                  children.map(({ id, titleKey, path }) => (
                    <SidebarMenuItem
                      key={id}
                      id={id}
                      title={context.counterpart(titleKey)}
                      level={2}
                      path={path}
                    />
                  ))}
              </SidebarMenuItem>
            )
        )}
      </List>
    </CollapsableSidebar>
  );
}

export default Sidebar;
