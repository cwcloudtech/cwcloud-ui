import { useContext } from "react";
import classes from "./InstanceItem.module.css"
import { NavLink } from "react-router-dom";
import formateDate from "../../../../../../utils/FormateDate";
import GlobalContext from "../../../../../../Context/GlobalContext";
import colors from "../../../../../../Context/Colors";

function InstanceItem(props) {
    const _mode = useContext(GlobalContext).mode; 
    return (
        <tr>
            <th scope="row">
                <div className={classes.NameWrapper}>
                    {(props.item.status === "active" || props.item.status === "poweredoff" || props.item.status === "starting")
                        ? <NavLink className={classes.linkstyle} to={
                            `/admin/instance/${props.item.id}`
                        } >
                            <h5 className={classes.itemTitleName} style={{color: colors.mainText[_mode]}}>
                                {props.item.name}
                            </h5>
                        </NavLink>
                        :
                        <h5 className={classes.itemTitleNameDisabled} style={{color: colors.mainText[_mode]}}>
                            {props.item.name}
                        </h5>
                    }

                </div>
            </th>
            <td className="itemTitle" style={{color: colors.secondText[_mode]}}>{props.item.type}</td>
            <td className="itemTitle" style={{color: colors.secondText[_mode]}}>{props.item.status}</td>
            <td className="itemTitle" style={{color: colors.secondText[_mode]}}>{formateDate(props.item.created_at)}</td>
        </tr>
    );
}

export default InstanceItem;
