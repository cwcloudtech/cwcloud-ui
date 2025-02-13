import React, { useContext } from "react";
import "./Sidebar.module.css";
import GlobalContext from "../../../../../../../Context/GlobalContext";
import SidebarMenuItem from "../../../../../../../Components/CollapsableSidebar/SidebarMenuItem/SidebarMenuItem";
import List from "@mui/material/List";
import { useSidebar } from "../../../../../../../Hooks/useSidebar";
import CollapsableSidebar from "../../../../../../../Components/CollapsableSidebar/CollapsableSidebar";
import { useK8sSideBar } from "./useK8sSideBar";
import colors from "../../../../../../../Context/Colors";

function Sidebar() {
  const context = useContext(GlobalContext);
  const _mode = context.mode;
  const { sidebarKubernetesItems } = useK8sSideBar();
  const { open } = useSidebar();

  return (
    <div style={{ position: 'relative', zIndex: 1100 }}>
      <CollapsableSidebar>
        <div style={{ 
          backgroundColor: colors.mainBackground[_mode],
          height: '100%',
          width: '100%',
          position: 'absolute',
          top: 0,
          left: 0
        }} />
        <List style={{
          margin: "20px 0",
          backgroundColor: colors.navbar[_mode],
          borderRadius: "25px",
          borderTopLeftRadius: "0px",
          borderBottomLeftRadius: "0px",
          position: 'relative'
        }}>
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
    </div>
  );
}

export default Sidebar;
