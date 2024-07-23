import { useContext, useState, useRef } from "react";
import { Row } from "simple-flexbox";
import classes from "./IndexNavbar.module.css";
import localStorage from "../../../utils/localStorageService";
import GlobalContext from "../../../Context/GlobalContext";
import colors from "../../../Context/Colors";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Col,
} from "reactstrap";
import Translate from "react-translate-component";
import { useLocation, useNavigate } from "react-router-dom";
import srcimage from "../../../utils/regions";
import SelectDropdown from "../../../Components/Dropdown/SelectDropdown";
import LanguageDropdown from "../../../Components/Dropdown/LanguageDropdown";
import Identicon from "react-identicons";

function IndexNavbar() {
  const context = useContext(GlobalContext);
  const _mode = context.mode;
  const [isOpenUserDropdown, setIsOpenUserDropdown] = useState(false);
  const [isOpenLanguageDropdown, setIsOpenLanguageDropdown] = useState(false);
  const userDropdownRef = useRef(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  let title =
    pathname.split("/")[1].charAt(0).toUpperCase(0) +
    pathname.split("/")[1].slice(1);
  if (title.search("-") !== -1) {
    title =
      title.split("-")[0].charAt(0).toUpperCase(0) +
      title.split("-")[0].slice(1) +
      " " +
      title.split("-")[1].charAt(0).toUpperCase(0) +
      title.split("-")[1].slice(1);
  }

  const handleLogout = () => {
    localStorage.clearToken();
    window.location.href = "/";
  };
  const selectProviderHandler = (providerName) => {
    const _providers = [...context.providers];
    const providerIndex = _providers.findIndex((p) => p.name === providerName);
    context.setSelectedProvider(_providers[providerIndex]);
  };
  const selectRegionHandler = (regionName) => {
    const _regions = [...context.selectedProvider.regions];
    const regionIndex = _regions.findIndex((r) => r.name === regionName);
    context.setRegion(_regions[regionIndex]);
  };
  const toggleUserDropdownHandler = (e) => {
    if (!isOpenUserDropdown) return setIsOpenUserDropdown(true);
    if (!userDropdownRef.current.contains(e.target))
      setIsOpenUserDropdown(false);
  };

  return (
    <Row
      className={classes.container}
      style={{ backgroundColor: colors.navbar[_mode] }}
      vertical="center"
      horizontal="space-between"
    >
      <span
        className={classes.title}
        style={{ color: colors.mainTitle[_mode] }}
      >
        {title}
      </span>
      <Row className={classes.rightPart} vertical="center">
        <Col>
          {!context.isGlobal && (
            <SelectDropdown
              labelId="demo-customized-select-label"
              id="demo-customized-select"
              value={
                !context.isGlobal ? context.selectedProvider.name : "global"
              }
              onChange={(e) => {
                selectProviderHandler(e.target.value);
              }}
              itemsList={context.providers}
              classes={classes}
            />
          )}
        </Col>
        <Col>
          {!context.isGlobal && (
            <SelectDropdown
              labelId="demo-customized-select-label"
              id="demo-customized-select"
              value={!context.isGlobal ? context.region.name : "global"}
              onChange={(e) => {
                selectRegionHandler(e.target.value);
              }}
              itemsList={context.selectedProvider.regions}
              withImage={true}
              classes={classes}
            />
          )}
        </Col>
        {!context.isGlobal && <div className={classes.separator}></div>}
        <div ref={userDropdownRef}>
          <Dropdown
            isOpen={isOpenUserDropdown}
            toggle={toggleUserDropdownHandler}
          >
            <DropdownToggle nav>
              <div style={{ display: "flex", alignItems: "center" }}>
                <h5
                  className={classes.name}
                  style={{
                    color: colors.mainText[_mode],
                    paddingRight: "10px",
                  }}
                >
                  {context.user.email}
                </h5>
                <Identicon
                  string={context.user.email}
                  size="28"
                  style={{ border: "1px solid " + colors.avatarBorder[_mode] }}
                />
              </div>
            </DropdownToggle>
            <DropdownMenu
              style={{ background: colors.secondBackground[_mode] }}
            >
              <DropdownItem>
                <Dropdown
                  direction="end"
                  isOpen={isOpenLanguageDropdown}
                  toggle={() =>
                    setIsOpenLanguageDropdown(!isOpenLanguageDropdown)
                  }
                >
                  <DropdownToggle id="langDropDown" nav>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <img
                        src={srcimage(context.language === "fr" ? "fr" : "uk")}
                        alt="language"
                        height="15px"
                      />
                      <h5
                        className={classes.dropdownItemText}
                        style={{
                          margin: "10px",
                          color: colors.menuText[_mode],
                        }}
                      >
                        <Translate content="navbar.language" />
                      </h5>
                    </div>
                  </DropdownToggle>
                  <DropdownMenu
                    style={{
                      marginRight: "15px",
                      marginTop: "-10px",
                      background: colors.secondBackground[_mode],
                    }}
                  >
                    <LanguageDropdown
                      languageShortName="fr"
                      languageNames={["French", "Français"]}
                      classes={classes}
                    />
                    <LanguageDropdown
                      languageShortName="uk"
                      languageNames={["English", "Anglais"]}
                      classes={classes}
                    />
                  </DropdownMenu>
                </Dropdown>
              </DropdownItem>
              {context.mode === "dark" ? (
                <DropdownItem onClick={() => context.setMode("light")}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <i
                      className="fa-solid fa-sun"
                      style={{ color: colors.menuText[_mode] }}
                    ></i>
                    <h5
                      className={classes.dropdownItemText}
                      style={{ margin: "10px", color: colors.menuText[_mode] }}
                    >
                      {context.language === "en"
                        ? "Light Mode"
                        : "Mode lumineux"}
                    </h5>
                  </div>
                </DropdownItem>
              ) : (
                <DropdownItem onClick={() => context.setMode("dark")}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <i
                      className="fa-sharp fa-solid fa-moon"
                      style={{ color: colors.menuText[_mode] }}
                    ></i>
                    <h5
                      className={classes.dropdownItemText}
                      style={{ margin: "10px", color: colors.menuText[_mode] }}
                    >
                      {context.language === "en" ? "Dark Mode" : "Mode sombre"}
                    </h5>
                  </div>
                </DropdownItem>
              )}
              <DropdownItem
                style={{ "&:hover": { background: "green !important" } }}
                onClick={() => {
                  navigate("/settings");
                  setIsOpenUserDropdown(false);
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <i
                    className="fa-solid fa-gear"
                    style={{ color: colors.menuText[_mode] }}
                  ></i>
                  <h5
                    className={classes.dropdownItemText}
                    style={{ margin: "10px", color: colors.menuText[_mode] }}
                  >
                    <Translate content="navbar.settings" />
                  </h5>
                </div>
              </DropdownItem>
              <DropdownItem
                onClick={() => {
                  navigate("/credentials");
                  setIsOpenUserDropdown(false);
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <i
                    className="fa-solid fa-key"
                    style={{ color: colors.menuText[_mode] }}
                  ></i>
                  <h5
                    className={classes.dropdownItemText}
                    style={{ margin: "10px", color: colors.menuText[_mode] }}
                  >
                    <Translate content="navbar.credentials" />
                  </h5>
                </div>
              </DropdownItem>
              {process.env.REACT_APP_DISABLE_PAYMENT_FEATURE.includes(
                "false"
              ) && (
                <DropdownItem
                  onClick={() => {
                    navigate("/vouchers");
                    setIsOpenUserDropdown(false);
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <i
                      className="fa-solid fa-ticket"
                      style={{ color: colors.menuText[_mode] }}
                    ></i>
                    <h5
                      className={classes.dropdownItemText}
                      style={{ margin: "10px", color: colors.menuText[_mode] }}
                    >
                      <Translate content="navbar.vouchers" />
                    </h5>
                  </div>
                </DropdownItem>
              )}
              {process.env.REACT_APP_DISABLE_PAYMENT_FEATURE.includes(
                "false"
              ) && (
                <DropdownItem
                  onClick={() => {
                    navigate("/billing");
                    setIsOpenUserDropdown(false);
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <i
                      className="fa-solid fa-credit-card"
                      style={{ color: colors.menuText[_mode] }}
                    ></i>
                    <h5
                      className={classes.dropdownItemText}
                      style={{ margin: "10px", color: colors.menuText[_mode] }}
                    >
                      <Translate content="navbar.billing" />
                    </h5>
                  </div>
                </DropdownItem>
              )}
              <DropdownItem
                onClick={() => {
                  navigate("/support");
                  setIsOpenUserDropdown(false);
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <i
                    className="fa-solid fa-comment-alt"
                    style={{ color: colors.menuText[_mode] }}
                  ></i>
                  <h5
                    className={classes.dropdownItemText}
                    style={{ margin: "10px", color: colors.menuText[_mode] }}
                  >
                    <Translate content="navbar.support" />
                  </h5>
                </div>
              </DropdownItem>
              <DropdownItem onClick={handleLogout}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <i
                    className="fa-solid fa-arrow-right-from-bracket"
                    style={{ color: "#d12546" }}
                  ></i>
                  <h5
                    className={classes.dropdownItemText}
                    style={{ color: "#d12546", margin: "10px" }}
                  >
                    <Translate content="navbar.logout" />
                  </h5>
                </div>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </Row>
    </Row>
  );
}

export default IndexNavbar;
