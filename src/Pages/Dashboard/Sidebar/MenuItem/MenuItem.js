import React, { useContext } from "react";
import { Column, Row } from "simple-flexbox";
import { createUseStyles, useTheme } from "react-jss";
import CollapsibleContent from "../../../../Components/CollapsibleContent/CollapsibleContent";
import { useSidebar } from "../../../../Hooks/useSidebar";
import { useLocation } from "react-router-dom";
import GlobalContext from "../../../../Context/GlobalContext";
import colors from "../../../../Context/Colors";

const useStyles = createUseStyles({
    container: {
        display: "flex",
        height: ({ level }) => level > 1 ? 33 : 50,
        cursor: "pointer",
        paddingLeft: ({ level }) => 32 * level,
        transition: "all 0.2s ease-in-out",
        '&:hover': {
            backgroundColor: ({ hoverColor }) => hoverColor,
            '& $title': {
                fontSize: '15.5px',
            },
            '& $iconContainer': {
                transform: 'scale(1.2)',
            }
        },
    },
    leftBar: {
        borderLeft: ({ level, blue }) =>
            level > 1 ? "3px solid "+blue : "none",
    },
    title: {
        fontSize: 14,
        lineHeight: "20px",
        letterSpacing: "0.2px",
        color: ({ isActivated, blue, blueText }) => isActivated ? blue: blueText,
        marginLeft: 24,
        fontWeight: ({ isActivated }) => isActivated ? "600" : "400",
        transition: 'font-size 0.2s ease-in-out',
    },
    });

function MenuItem(props) {
    const theme = useTheme();
    const { pathname } = useLocation()
    const isCollapsible = props.children && props.children.length > 0;
    const { isExpanded, isActive, onItemClick } = useSidebar({
        isCollapsible,
        item: props.id,
        level: props.level,
        items: props.items || [],
    });
    const mode = useContext(GlobalContext).mode;
    const blue = colors.blue[mode];
    const blueText = colors.blueText[mode];
    const isActivated = props.isActive || isActive || pathname.split("/")[1] === props.title || pathname === props.id;
    const classes = useStyles({ theme, level: props.level || 1, isActivated, blue, blueText});
    const classNameColumn = isActivated ? classes.leftBar : "";
    const iconColor = isActivated ? blue: blueText;
    function onItemClicked(e) {
        if (props.onClick) {
            props.onClick(e);
        }
        onItemClick();
    }

    return (
        <Column key={props.id} className={classNameColumn}>
            <Row
                vertical="center"
                onClick={onItemClicked}
            >
                {props.icon && <div style={{ color: `${iconColor}`, width: '30px', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>{props.icon}</div>}
                <span className={classes.title} style={{width: '125px'}}>{props.title}</span>
                {props.children && <div style={{ color: `${iconColor}`, width: '30px', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginLeft: '10px' }}>
                    <i className={`fa-solid fa-chevron-${isExpanded ? 'up' : 'down'}`} style={{ color: iconColor, fontSize: '13px', fontWeight: '800' }}></i>
                </div>}
            </Row>
            {isCollapsible && (
                <CollapsibleContent expanded={isExpanded}>
                    {props.children.map((child) => child.type({ ...child.props }))}
                </CollapsibleContent>
            )}
        </Column>
    );
}

export default MenuItem;
