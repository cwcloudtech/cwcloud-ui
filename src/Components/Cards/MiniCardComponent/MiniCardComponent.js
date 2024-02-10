import React, { useContext } from "react";
import { Col } from "reactstrap";
import GlobalContext from "../../../Context/GlobalContext";
import classes from "./MiniCardComponent.module.css";

function MiniCardComponent({ className = "", instancetitle, value, onClick, checked }) {
    const context = useContext(GlobalContext);
    const _mode = context.mode;
    return (
        <Col
            className={_mode === 'dark'? (checked ? [classes.darkContainer, classes.darkContainerChecked].join(" ") : [classes.darkContainer, className].join(" ")):
            (checked ? [classes.miniContainer, classes.miniContainerChecked].join(" ") : [classes.miniContainer, className].join(" "))}
            onClick={onClick}
            md='2'
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px' }}
        >
            <div>
                <h5 className={checked ? classes.spanChecked : classes.instancetitle}>{instancetitle}</h5>
                {value ? <h5 className={checked ? classes.valueChecked : classes.value}>{value}</h5> : null}
            </div>
        </Col>
    );
}

export default MiniCardComponent;
