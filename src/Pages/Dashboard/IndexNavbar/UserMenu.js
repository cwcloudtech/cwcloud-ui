import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FiGlobe, FiKey, FiLifeBuoy, FiLogOut, FiMoon, FiSettings, FiSun } from "react-icons/fi";
import Dropdown, { DropdownDivider, DropdownItem, DropdownText } from "../../../Components/Common/Dropdown";
import Tooltip from "../../../Components/Common/Tooltip";
import Identicon from "../../../Components/Identicon/Identicon";
import Translate from "../../../Components/Translate/Translate";
import GlobalContext from "../../../Context/GlobalContext";
import srcimage from "../../../utils/regions";
import styles from "./UserMenu.module.css";

const LANGUAGES = [
  { code: "fr", flag: "fr", labels: { en: "French", fr: "Français" } },
  { code: "en", flag: "uk", labels: { en: "English", fr: "Anglais" } },
];

// Profile menu, same layout as cwclock's: avatar trigger, account header,
// navigation entries, theme toggle, language picker, versions and logout.
const UserMenu = ({ onLogout, backendVersion, frontendVersion }) => {
  const context = useContext(GlobalContext);
  const navigate = useNavigate();
  const isDark = context.mode === "dark";
  const isEnglish = context.language !== "fr";

  const links = [
    { to: "/settings", Icon: FiSettings, labelKey: "navbar.settings" },
    { to: "/credentials", Icon: FiKey, labelKey: "navbar.credentials" },
    { to: "/support", Icon: FiLifeBuoy, labelKey: "navbar.support" },
  ];

  const themeLabel = isDark
    ? isEnglish ? "Light Mode" : "Mode lumineux"
    : isEnglish ? "Dark Mode" : "Mode sombre";

  return (
    <Dropdown
      align="end"
      triggerClassName={styles.profileTrigger}
      title={context.user.email}
      trigger={<Identicon string={context.user.email} size={26} className={styles.profileAvatar} />}
    >
      {(close) => (
        <>
          <DropdownText className={styles.profileEmail}>{context.user.email}</DropdownText>
          {links.map(({ to, Icon, labelKey }) => (
            <DropdownItem
              key={to}
              onClick={() => {
                navigate(to);
                close();
              }}
            >
              <Icon style={{ fontSize: "16px" }} />
              <Translate content={labelKey} />
            </DropdownItem>
          ))}
          <DropdownItem onClick={() => context.setMode(isDark ? "light" : "dark")}>
            {isDark ? <FiSun style={{ fontSize: "16px" }} /> : <FiMoon style={{ fontSize: "16px" }} />}
            {themeLabel}
          </DropdownItem>
          <DropdownText className={styles.languageLabel}>
            <FiGlobe style={{ fontSize: "14px" }} /> <Translate content="navbar.language" />
          </DropdownText>
          {LANGUAGES.map((lang) => (
            <DropdownItem
              key={lang.code}
              active={context.language === lang.code}
              onClick={() => context.setLanguage(lang.code)}
            >
              <img src={srcimage(lang.flag)} alt="" className={styles.flag} />
              {isEnglish ? lang.labels.en : lang.labels.fr}
            </DropdownItem>
          ))}
          <DropdownDivider />
          {(frontendVersion || (context.user.is_admin && backendVersion)) && (
            <DropdownText className={styles.versionLabelWrap}>
              {frontendVersion && <span className={styles.versionBadge}>v{frontendVersion}</span>}
              {context.user.is_admin && backendVersion && (
                <span className={`${styles.versionBadge} ${styles.versionBadgeApi}`}>API v{backendVersion}</span>
              )}
            </DropdownText>
          )}
          <Tooltip label={context.counterpart("navbar.logout")} className={styles.menuItemTooltip}>
            <DropdownItem onClick={onLogout} className={styles.logoutItem}>
              <FiLogOut style={{ fontSize: "16px" }} />
            </DropdownItem>
          </Tooltip>
        </>
      )}
    </Dropdown>
  );
};

export default UserMenu;
