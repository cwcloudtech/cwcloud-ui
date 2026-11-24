import { useContext, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import classes from "./CollapsableSidebar.module.css";
import GlobalContext from "../../Context/GlobalContext";
import { useSidebar } from "../../Hooks/useSidebar";
import Tooltip from "../Common/Tooltip";
import logoimage from "../../utils/customizedLogo";
import lightLogo from "../../assets/images/cwcloud-whitemode.png";
import darkLogo from "../../assets/images/cwcloud-darkmode.png";

const MOBILE_QUERY = "(max-width: 899.95px)";

// Same sidebar as cwclock: an icon rail that expands with labels, the toggle
// button right below the logo and before the navigation items.
function CollapsableSidebar(props) {
  const { open, handleDrawerClose, handleDrawerOpen } = useSidebar();
  const context = useContext(GlobalContext);
  const isEnglish = context.language !== "fr";

  useEffect(() => {
    const media = window.matchMedia(MOBILE_QUERY);
    if (media.matches) handleDrawerClose();
    const onChange = (e) => e.matches && handleDrawerClose();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
    //eslint-disable-next-line
  }, []);

  const expandedLogo = logoimage(context.mode === "dark" ? darkLogo : lightLogo);
  const collapsedLogo = logoimage("/favicon.ico");
  const toggleLabel = open
    ? isEnglish ? "Collapse sidebar" : "Réduire le menu"
    : isEnglish ? "Expand sidebar" : "Déplier le menu";

  return (
    <aside className={`${classes.sidebarCol} ${open ? classes.sidebarColExpanded : ""} ${classes.noScrollbar}`}>
      <div className={classes.logoBlock}>
        {open ? (
          <>
            <img src={expandedLogo} className={classes.logo} alt="CWCloud" />
            {(process.env.REACT_APP_CWCLOUD_UI_LABEL || process.env.REACT_APP_CWCLOUD_UI_URL) && (
              <span className={classes.logoText}>
                {process.env.REACT_APP_CWCLOUD_UI_LABEL}
                <span className={classes.logoUrl}>{process.env.REACT_APP_CWCLOUD_UI_URL}</span>
              </span>
            )}
          </>
        ) : (
          <img src={collapsedLogo} className={classes.logoSmall} alt="CWCloud" />
        )}
      </div>
      <Tooltip label={toggleLabel} position="right" className={classes.toggleTooltip}>
        <button
          type="button"
          className={classes.sidebarToggle}
          onClick={open ? handleDrawerClose : handleDrawerOpen}
          aria-label={toggleLabel}
        >
          {open ? <FaChevronLeft /> : <FaChevronRight />}
        </button>
      </Tooltip>
      <nav className={classes.nav}>{props.children}</nav>
    </aside>
  );
}

// A titled group of entries separated from the ones above (the admin
// features below the user ones, like uprodit). Collapsed, only the separator
// line remains.
export function SidebarSection({ title, children }) {
  const { open } = useSidebar();
  return (
    <div className={classes.section} role="group" aria-label={title}>
      {open && <span className={classes.sectionTitle}>{title}</span>}
      {children}
    </div>
  );
}

export default CollapsableSidebar;
