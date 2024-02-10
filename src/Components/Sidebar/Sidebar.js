import React, { useContext } from "react";
import MenuList from "../../Pages/Dashboard/Sidebar/MenuList/MenuList"
import MenuItem from "../../Pages/Dashboard/Sidebar/MenuItem/MenuItem";
import GlobalContext from "../../Context/GlobalContext"
import colors from "../../Context/Colors";
import "./Sidebar.module.css";

const Sidebar = (props) => {
    const context = useContext(GlobalContext);
    const _mode = context.mode;
    const isMobile = window.innerWidth <= 1080;

    return (
        <MenuList isMobile={isMobile}>
            <div style={{ backgroundColor: colors.sideBackground[_mode], borderRadius: '15px' }}>
                {
                    props.items.map((item, index) => {
                        return (
                            <MenuItem
                                key={index}
                                title={item.title}
                                icon={item.icon}
                                isActive={item.isActive}
                                onClick={props.onClickHandlers[index]}
                            />
                        )
                    })
                }
            </div>
        </MenuList>
    );
}
export default Sidebar;