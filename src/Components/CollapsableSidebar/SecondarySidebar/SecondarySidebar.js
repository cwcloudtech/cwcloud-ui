import { useContext, useState } from "react";
import { createPortal } from "react-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import GlobalContext from "../../../Context/GlobalContext";
import { SidebarContext } from "../../../Context/SidebarContext";
import { useSidebar } from "../../../Hooks/useSidebar";
import Tooltip from "../../Common/Tooltip";
import styles from "./SecondarySidebar.module.css";

const readCollapsed = (key) => {
  try {
    return window.localStorage.getItem(key) === "1";
  } catch (e) {
    return false;
  }
};

const writeCollapsed = (key, value) => {
  try {
    window.localStorage.setItem(key, value ? "1" : "0");
  } catch (e) {
    // storage unavailable: keep the in-memory state only
  }
};

// A second sidebar next to the main one, collapsible on its own like cwclock's
// conversations rail: a thin rail with the toggle (and icon-only actions) when
// collapsed, the full panel when expanded. No logo, no "go back" entry.
// `children` may be a function of `open` to adapt the content to the rail.
// SidebarMenuItem entries inside follow this panel's state, not the main one.
function SecondarySidebar({ title, storageKey, children }) {
  const sidebar = useSidebar();
  const { counterpart } = useContext(GlobalContext);
  const [open, setOpen] = useState(() => !readCollapsed(storageKey));

  const setPanelOpen = (value) => {
    setOpen(value);
    writeCollapsed(storageKey, !value);
  };

  if (!sidebar.secondarySlot) return null;

  const toggleLabel = counterpart(open ? "sidebar.hidePanel" : "sidebar.showPanel");
  const panelContext = {
    ...sidebar,
    open,
    handleDrawerOpen: () => setPanelOpen(true),
    handleDrawerClose: () => setPanelOpen(false),
  };

  return createPortal(
    <aside className={`${styles.panel} ${open ? "" : styles.panelCollapsed}`}>
      <div className={styles.header}>
        <Tooltip label={toggleLabel} position="right">
          <button
            type="button"
            className={styles.collapseBtn}
            onClick={() => setPanelOpen(!open)}
            aria-label={toggleLabel}
          >
            {open ? <FiChevronLeft /> : <FiChevronRight />}
          </button>
        </Tooltip>
        {open && title && <span className={styles.title}>{title}</span>}
      </div>
      <SidebarContext.Provider value={panelContext}>
        {typeof children === "function" ? children(open) : children}
      </SidebarContext.Provider>
    </aside>,
    sidebar.secondarySlot
  );
}

export default SecondarySidebar;
