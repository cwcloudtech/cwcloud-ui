import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Translate from "../../../Components/Translate/Translate";
import { Col } from "reactstrap";
import SelectDropdown from "../../../Components/Dropdown/SelectDropdown";
import colors from "../../../Context/Colors";
import GlobalContext from "../../../Context/GlobalContext";
import axios from "../../../utils/axios";
import localStorage from "../../../utils/localStorageService";
import classes from "./IndexNavbar.module.css";
import UserMenu from "./UserMenu";
import Tooltip from "../../../Components/Common/Tooltip";
import DnsDropdown from "../../../Components/Dropdown/DnsDropdown";
import SearchIcon from '@mui/icons-material/Search';


const Row = ({ vertical, horizontal, style, children, ...props }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "row",
      alignItems: vertical,
      justifyContent: horizontal,
      ...style,
    }}
    {...props}
  >
    {children}
  </div>
);

function IndexNavbar() {
  const context = useContext(GlobalContext);
  const _mode = context.mode;
  const [backendVersion, setBackendVersion] = useState("");
  const [selectedDnsProvider, setSelectedDnsProvider] = useState(context.selectedDnsProvider);
  const frontendVersion = process.env.REACT_APP_VERSION;
  const { pathname } = useLocation();
  const isDNSpage = pathname.includes("dns");
  const showProviderAndRegion = !context.isGlobal;
  const dnsProviders = context.dnsProviders;
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
  const selectDnsProviderHandler = (providerName) => {
    const _providers = [...context.dnsProviders];
    const providerIndex = _providers.findIndex((p) => p === providerName);
    setSelectedDnsProvider(_providers[providerIndex]);
    context.setSelectedDnsProvider(_providers[providerIndex]);
  };
  const selectRegionHandler = (regionName) => {
    const _regions = [...context.selectedProvider.regions];
    const regionIndex = _regions.findIndex((r) => r.name === regionName);
    context.setRegion(_regions[regionIndex]);
  };
  const handleSearchButtonClick = () => {
    const event = new KeyboardEvent('keydown', { key: 's' });
    window.dispatchEvent(event);
  };

  useEffect(() => {
    context.setIsGlobal(true);
    axios.get("/manifest").then((res) => {
      setBackendVersion(res.data.version);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Row
      className={classes.container}
      style={{ backgroundColor: colors.navbar[_mode], border: `1px solid ${colors.border[_mode]}`, boxShadow: colors.shadow[_mode] }}
      vertical="center"
      horizontal="space-between"
    >
      <Row vertical="center">
        <span
          className={classes.title}
          style={{ color: colors.mainTitle[_mode] }}
        >
          {title}
        </span>
        <Tooltip label="CTRL + s" position="bottom">
          <button
            className={`cw-input ${classes.searchButton}`}
            onClick={handleSearchButtonClick}
          >
            <SearchIcon style={{ fontSize: "20px" }} />
            <span style={{ marginLeft: '8px' }}>
              <Translate content="searchModal.searchButton" />
            </span>
          </button>
        </Tooltip>
      </Row>
      <Row className={classes.rightPart} vertical="center">
        {isDNSpage && <Col></Col>}
        <Col>
          {isDNSpage ? (
            <DnsDropdown
              labelid="demo-customized-select-label"
              id="demo-customized-select"
              value={selectedDnsProvider}
              onChange={(e) => {
                selectDnsProviderHandler(e.target.value);
              }}
              itemsList={dnsProviders}
                            disabled={context.isGlobal}
              is_dns={true}
            />
          ) : (
            <>
              {showProviderAndRegion && (
                <SelectDropdown
                  labelid="demo-customized-select-label"
                  id="demo-customized-select"
                  value={
                    showProviderAndRegion
                      ? context.selectedProvider.name
                      : "global"
                  }
                  onChange={(e) => {
                    selectProviderHandler(e.target.value);
                  }}
                  itemsList={context.providers}
                                    disabled={context.isGlobal}
                  is_dns={false}
                />
              )}
            </>
          )}
        </Col>
        {!isDNSpage && (
          <Col>
            {showProviderAndRegion && (
              <SelectDropdown
                labelid="demo-customized-select-label"
                id="demo-customized-select"
                value={showProviderAndRegion ? context.region.name : "global"}
                onChange={(e) => {
                  selectRegionHandler(e.target.value);
                }}
                itemsList={context.selectedProvider.regions}
                withImage={true}
                                disabled={context.isGlobal}
                is_dns={false}
              />
            )}
          </Col>
        )}
        {showProviderAndRegion && <div className={classes.separator}></div>}
        <UserMenu
          onLogout={handleLogout}
          backendVersion={backendVersion}
          frontendVersion={frontendVersion}
        />
      </Row>
    </Row>
  );
}

export default IndexNavbar;
