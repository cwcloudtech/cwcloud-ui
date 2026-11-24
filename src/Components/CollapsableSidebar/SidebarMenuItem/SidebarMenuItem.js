import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiChevronDown } from "react-icons/fi";
import CollapsibleContent from "../../CollapsibleContent/CollapsibleContent";
import Tooltip from "../../Common/Tooltip";
import SidebarIcon from "../SidebarIcon";
import { useSidebar } from "../../../Hooks/useSidebar";
import { convertSlugToUrl } from "../../../utils/sidebar";
import styles from "./SidebarMenuItem.module.css";

// cwclock's SidebarNav link: icon only on the collapsed rail (label in a
// tooltip), icon + label once expanded. An entry with children is a group:
// expanded it toggles its sub-links, collapsed it expands the sidebar first.
function SidebarMenuItem({ id, items, path, title, iconClass, icon, level = 1, children }) {
  const { pathname } = useLocation();
  const { open, handleDrawerOpen } = useSidebar();
  const isActive = pathname === id || (items || []).includes(pathname);
  const [isExpanded, setIsExpanded] = useState(isActive);
  const hasChildren = React.Children.count(children) > 0;

  const iconNode = iconClass ? <SidebarIcon iconClass={iconClass} className={styles.icon} /> : icon;

  if (level > 1) {
    return (
      <Link
        to={convertSlugToUrl(path, {})}
        className={`${styles.subLink} ${isActive ? styles.subLinkActive : ""}`}
      >
        {title}
      </Link>
    );
  }

  const content = (
    <>
      {iconNode && <span className={styles.iconWrap}>{iconNode}</span>}
      {open && <span className={styles.label}>{title}</span>}
      {open && hasChildren && (
        <FiChevronDown className={`${styles.chevron} ${isExpanded ? styles.chevronOpen : ""}`} />
      )}
    </>
  );
  const groupOpen = hasChildren && open && isExpanded;
  const linkClass = [
    styles.link,
    isActive ? styles.linkActive : "",
    groupOpen ? styles.linkExpanded : "",
    open ? "" : styles.linkCollapsed,
  ].filter(Boolean).join(" ");

  return (
    <div className={`${styles.item} ${groupOpen ? styles.itemExpanded : ""}`}>
      <Tooltip label={open ? null : title} position="right" className={styles.tooltipWrapper}>
        {hasChildren ? (
          <button
            type="button"
            className={linkClass}
            aria-expanded={open && isExpanded}
            onClick={() => {
              if (!open) {
                handleDrawerOpen();
                setIsExpanded(true);
                return;
              }
              setIsExpanded((prev) => !prev);
            }}
          >
            {content}
          </button>
        ) : (
          <Link to={convertSlugToUrl(path || id, {})} className={linkClass}>
            {content}
          </Link>
        )}
      </Tooltip>
      {hasChildren && open && (
        <CollapsibleContent expanded={isExpanded}>
          <div className={styles.subList}>{children}</div>
        </CollapsibleContent>
      )}
    </div>
  );
}

export default SidebarMenuItem;
