import React, { useContext, useState } from "react";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import { useNavigate } from "react-router-dom";
import { createUseStyles } from "react-jss";
import { useLocation } from "react-router-dom";
import CollapsibleContent from "../../CollapsibleContent/CollapsibleContent";
import { convertSlugToUrl } from "../../../utils/sidebar";
import colors from "../../../Context/Colors";
import GlobalContext from "../../../Context/GlobalContext";

const useStyles = createUseStyles({
  item: {
    display: "flex",
    alignItems: "center",
    justifyContent: "self-start",
    minHeight: ({ level }) => (level > 1 ? 35 : 48),
    padding: "0 20px",
    "&:hover": {
      cursor: "pointer",
    },
    borderLeft: ({ level, blue, isActivated }) =>
      level > 1 && isActivated ? "3px solid " + blue : "none",
  },
  spacer: {
    display: "flex",
    flex: 1,
  },
  title: {
    fontSize: 14,
    letterSpacing: "0.3px",
    color: ({ isActivated, blue, blueText }) => (isActivated ? blue : blueText),
    marginLeft: 4,
    fontWeight: ({ isActivated }) => (isActivated ? "600" : "400"),
  },
  icon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 2,
    color: ({ isActivated, blue, blueText }) => (isActivated ? blue : blueText),
  },
  expandIcon: {
    fontSize: "13px",
    color: ({ isActivated, blue, blueText }) => (isActivated ? blue : blueText),
  },
  leftBar: {
    borderLeft: ({ level, blue }) => (level > 1 ? "3px solid " + blue : "none"),
  },
});

function SidebarMenuItem(props) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const mode = useContext(GlobalContext).mode;
  const blue = colors.blue[mode];
  const blueText = colors.blueText[mode];
  const isActivated =
    pathname === props.id || (props.items && props.items.includes(pathname));
  const [isExpanded, setIsExpanded] = useState(isActivated);
  const classes = useStyles({
    level: props.level || 1,
    isActivated,
    blue,
    blueText,
    open: props.open,
  });

  function handleNavigation(slug, parameters = {}) {
    if (props.children) {
      setIsExpanded((prev) => !prev);
      return;
    }
    navigate(convertSlugToUrl(slug, parameters));
  }

  return (
    <ListItem style={{padding: "0px"}} sx={{ display: "block" }}>
      <div
        onClick={() => handleNavigation(props.path)}
        className={classes.item}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: props.open ? 3 : "auto",
            justifyContent: "center",
          }}
        >
          <div className={classes.icon}>{props.icon}</div>
        </ListItemIcon>
        {props.open && (
          <>
            <span className={classes.title}>{props.title}</span>
            {props.children && (
              <>
                <div className={classes.spacer} />
                <i
                  className={`fa-solid fa-chevron-${
                    isExpanded ? "up" : "down"
                  } ${classes.expandIcon}`}
                />
              </>
            )}
          </>
        )}
      </div>
      {props.children && props.open && (
        <CollapsibleContent expanded={isExpanded}>
          {React.Children.map(props.children, (child) =>
            React.cloneElement(child, { open: props.open })
          )}
        </CollapsibleContent>
      )}
    </ListItem>
  );
}

export default SidebarMenuItem;
