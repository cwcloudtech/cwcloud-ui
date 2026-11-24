import React, { useContext } from "react";
import "./Sidebar.module.css";
import GlobalContext from "../../../../../../../Context/GlobalContext";
import SidebarMenuItem from "../../../../../../../Components/CollapsableSidebar/SidebarMenuItem/SidebarMenuItem";
import SecondarySidebar from "../../../../../../../Components/CollapsableSidebar/SecondarySidebar/SecondarySidebar";
import { useK8sSideBar } from "./useK8sSideBar";

// Cluster navigation as a second sidebar next to the main one.
function Sidebar() {
  const context = useContext(GlobalContext);
  const { sidebarKubernetesItems } = useK8sSideBar();

  return (
    <SecondarySidebar storageKey="cwcloudK8sPanelCollapsed">
      {sidebarKubernetesItems
        .filter(({ condition = true }) => condition)
        .map(({ id, titleKey, iconClass, path, items, children }) => (
          <SidebarMenuItem
            key={`k8s-${id}`}
            id={id}
            items={items}
            title={context.counterpart(titleKey)}
            iconClass={iconClass}
            path={path}
          >
            {children &&
              children.map((child) => (
                <SidebarMenuItem
                  key={child.id}
                  id={child.id}
                  title={context.counterpart(child.titleKey)}
                  level={2}
                  path={child.path}
                />
              ))}
          </SidebarMenuItem>
        ))}
    </SecondarySidebar>
  );
}

export default Sidebar;
