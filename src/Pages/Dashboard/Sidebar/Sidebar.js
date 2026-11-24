import { useContext } from "react";
import GlobalContext from "../../../Context/GlobalContext";
import { useSidebarItems } from "../../../Hooks/useSidebarItems";
import SidebarMenuItem from "../../../Components/CollapsableSidebar/SidebarMenuItem/SidebarMenuItem";
import CollapsableSidebar, { SidebarSection } from "../../../Components/CollapsableSidebar/CollapsableSidebar";

// One sidebar, like cwclock, with the admin features in their own section
// below the user ones (for admins only), like uprodit.
function Sidebar() {
  const context = useContext(GlobalContext);
  const { sidebarAdminItems, sidebarUserItems } = useSidebarItems();
  const visible = (items) => items.filter(({ condition = true }) => condition);
  const userEntries = visible(sidebarUserItems);
  const adminEntries = context.user.is_admin ? visible(sidebarAdminItems) : [];

  const renderEntry = (prefix) => ({ id, titleKey, iconClass, path, items, children }) => (
    <SidebarMenuItem
      key={`${prefix}-${id}`}
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
  );

  return (
    <CollapsableSidebar>
      {userEntries.map(renderEntry("user"))}
      {adminEntries.length > 0 && (
        <SidebarSection title={context.counterpart("sidebar.administration")}>
          {adminEntries.map(renderEntry("admin"))}
        </SidebarSection>
      )}
    </CollapsableSidebar>
  );
}

export default Sidebar;
