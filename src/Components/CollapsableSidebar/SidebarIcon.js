import React from "react";
import {
  FiActivity,
  FiBox,
  FiCode,
  FiCornerUpLeft,
  FiCpu,
  FiDatabase,
  FiFileText,
  FiGlobe,
  FiGrid,
  FiLayers,
  FiLifeBuoy,
  FiMail,
  FiMessageSquare,
  FiMonitor,
  FiPackage,
  FiServer,
  FiTag,
  FiUsers,
  FiWifi,
  FiZap,
} from "react-icons/fi";
import { FaDocker } from "react-icons/fa";
import { SiKubernetes } from "react-icons/si";

// Font Awesome class (as declared in the sidebar item definitions) to the
// react-icons component used by cwclock's sidebar (Feather icons first).
const ICONS = {
  "fa-gauge": FiGrid,
  "fa-layer-group": FiLayers,
  "fa-cube": FiBox,
  "fa-brands fa-docker": FaDocker,
  "fa-microchip": FiCpu,
  "fa-dharmachakra": SiKubernetes,
  "fa-code": FiCode,
  "fa-database": FiDatabase,
  "fa-wifi": FiWifi,
  "fa-eye": FiActivity,
  "fa-wand-magic-sparkles": FiZap,
  "fa-envelope": FiMail,
  "fa-robot": FiMessageSquare,
  "fa-comment-alt": FiLifeBuoy,
  "fa-user-group": FiUsers,
  "fa-laptop-code": FiMonitor,
  "fa-server": FiGlobe,
  "fa-ticket": FiTag,
  "fa-file-invoice-dollar": FiFileText,
  "fa-boxes-stacked": FiPackage,
  "fa-brands fa-servicestack": FiServer,
  "fa-tower-observation": FiActivity,
  "fa-reply": FiCornerUpLeft,
};

const SidebarIcon = ({ iconClass, className }) => {
  const Icon = ICONS[iconClass];
  if (Icon) return <Icon className={className} />;
  const classes = iconClass?.startsWith("fa-brands") ? iconClass : `fa-solid ${iconClass}`;
  return <i className={`${classes} ${className || ""}`.trim()} />;
};

export default SidebarIcon;
