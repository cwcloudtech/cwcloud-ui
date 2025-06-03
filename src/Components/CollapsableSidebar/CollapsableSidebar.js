import { styled } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import classes from "./CollapsableSidebar.module.css";
import LogoComponent from "./LogoComponent/Logo";
import { useContext, useEffect } from "react";
import GlobalContext from "../../Context/GlobalContext";
import colors from "../../Context/Colors";
import { useSidebar } from "../../Hooks/useSidebar";
import { useMediaQuery, useTheme } from "@mui/material";
// import { Divider } from "@material-ui/core";

function CollapsableSidebar(props) {
  const { open, handleDrawerClose, handleDrawerOpen, drawerWidth } = useSidebar();
  const context = useContext(GlobalContext);
  const _mode = context.mode;
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("md"));
  const isAdmin = context.user?.is_admin;

  useEffect(() => {
    if (matches) {
      handleDrawerClose();
      return;
    }
    handleDrawerOpen();
    //eslint-disable-next-line
  }, [matches]);

  const openedMixin = (theme) => ({
    width: drawerWidth,
    height: isAdmin ? '100%' : 'auto',
    maxHeight: '100vh',
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
    borderRight: 'none',
  });

  const closedMixin = (theme) => ({
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    height: isAdmin ? '100%' : 'auto',
    maxHeight: '100vh',
    width: `calc(${theme.spacing(9)} + 1px)`,
    [theme.breakpoints.up("sm")]: {
      width: `calc(${theme.spacing(8)} + 1px)`,
    },
    borderRight: 'none',
  });

  const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open",
  })(({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    zIndex: 10,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    ...(open && {
      ...openedMixin(theme),
      "& .MuiDrawer-paper": {
        ...openedMixin(theme),
        overflowY: "hidden",
        overflowX: "hidden",
        "&:hover": {
          overflowY: "auto",
        },
      },
    }),
    ...(!open && {
      ...closedMixin(theme),
      "& .MuiDrawer-paper": {
        ...closedMixin(theme),
        overflowY: "hidden",
        overflowX: "hidden",
        "&:hover": {
          overflowY: "auto",
        },
      },
    }),
  }));

  return (
    <Drawer variant={"permanent"} open={open} className={classes.noScrollbar}>
      <div
        className={`${classes.drawerHeader} ${classes.noScrollbar}`}
        style={{
          backgroundColor: colors.mainBackground[_mode],
        }}
      >
        <div className={classes.drawerHeaderContent}>
          {open && (
            <div className={classes.drawerHeaderCustomContent}>
              <LogoComponent />
              <span
                className={classes.drawerHeaderText}
                style={{
                  color: colors.mainTitle[_mode],
                }}
              >
                {process.env.REACT_APP_CWCLOUD_UI_LABEL}
                <span style={{ fontWeight: "700", display: "block" }}>
                  {process.env.REACT_APP_CWCLOUD_UI_URL}
                </span>
              </span>
            </div>
          )}
          <div
            onClick={open ? handleDrawerClose : handleDrawerOpen}
            className={classes.toggleDrawerIconContainer}
          >
            {open ? (
              <span
                className={classes.toggleDrawerIcon}
                style={{
                  color: colors.mainTitle[_mode],
                }}
              >
                <i class="fa-solid fa-angles-left" />
              </span>
            ) : (
              <span
                className={classes.toggleDrawerIcon}
                style={{
                  color: colors.mainTitle[_mode],
                }}
              >
                <i class="fa-solid fa-angles-right" />
              </span>
            )}
          </div>
        </div>
        {/* <Divider /> */}
      </div>
      <div
        style={{
          backgroundColor: colors.mainBackground[_mode]
        }}
      >
        {props.children && props.children}
      </div>
    </Drawer>
  );
}

export default CollapsableSidebar;
