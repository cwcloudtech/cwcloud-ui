import List from "@mui/material/List";
// import Divider from "@mui/material/Divider";
import GlobalContext from "../../../Context/GlobalContext";
import { useContext } from "react";
import { useSidebarItems } from "../../../Hooks/useSidebarItems";
import SidebarMenuItem from "../../../Components/CollapsableSidebar/SidebarMenuItem/SidebarMenuItem";
import CollapsableSidebar from "../../../Components/CollapsableSidebar/CollapsableSidebar";
import { useSidebar } from "../../../Hooks/useSidebar";
import colors from "../../../Context/Colors";

function Sidebar() {
  const context = useContext(GlobalContext);
  const _mode = context.mode;
  const { open } = useSidebar();
  const { sidebarAdminItems, sidebarUserItems } = useSidebarItems();

  return (
    <CollapsableSidebar>
      <List style={{
          margin: "20px 0",
          backgroundColor: colors.navbar[_mode],
          borderRadius: "25px",
          borderTopLeftRadius: "0px",
          borderBottomLeftRadius: "0px",
        }}>
        {sidebarUserItems.map(
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
                key={`user-${id}`}
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
      {/* <Divider /> */}
      <List style={{
          margin: "20px 0",
          backgroundColor: colors.navbar[_mode],
          borderRadius: "25px",
          borderTopLeftRadius: "0px",
          borderBottomLeftRadius: "0px",
        }}>
        {context.user.is_admin && sidebarAdminItems.map(
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
                key={`admin-${id}`}
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
