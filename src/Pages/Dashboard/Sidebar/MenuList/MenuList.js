import React, { useState, useContext } from "react";
import { slide as Menu } from "react-burger-menu";
import GlobalContext from "../../../../Context/GlobalContext";
import colors from "../../../../Context/Colors";

const getMenuStyles = (mode) => ({
    bmBurgerButton: {
        position: "fixed",
        width: 26,
        height: 20,
        left: 50,
        top: 60,
        zIndex: 51,
    },
    bmBurgerBars: {
        background: colors.blue[mode]
    },
    bmBurgerBarsHover: {
        background: colors.blueHover[mode]
    },
    bmCrossButton: {
        display: "none",
    },
    bmCross: {
        background: "#d1d8df",
    },
    bmMenuWrap: {
        position: "fixed",
        height: "100%",
        width: 255,
        zIndex: 1000,
    },
    bmMenu: {
        //background: colors.mainBackground[mode]
    },
    bmItem: {
        outline: "none",
        "&:focus": {
            outline: "none",
        },
    },
    bmMorphShape: {
        fill: colors.blue[mode]
    },
    bmOverlay: {
        background: "rgba(0, 0, 0, 0.3)",
        zIndex: 20,
    },
});

function MenuComponent({ children, isMobile }) {
    const _mode = useContext(GlobalContext).mode;
    const menuStyles = getMenuStyles(_mode);
    const [isOpen, setIsOpen] = useState(false);
    return (
        <Menu
            id="main-sidebar"
            isOpen={!isMobile || isOpen}
            noOverlay={!isMobile}
            disableCloseOnEsc
            styles={menuStyles}
            onStateChange={(state) => setIsOpen(state.isOpen)}
        >
            {children}
        </Menu>
    );
}

export default MenuComponent;