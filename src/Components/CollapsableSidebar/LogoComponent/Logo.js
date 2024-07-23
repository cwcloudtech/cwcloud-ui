import React, { useContext } from "react";
import classes from "./Logo.module.css"
import '../../../common.css'
import { Row, Col } from "reactstrap"
import logoimage from "../../../utils/customizedLogo";
import lightLogo from "../../../assets/images/logocomwork.png";
import darkLogo from "../../../assets/images/whiteLogoComwork.png";
import GlobalContext from "../../../Context/GlobalContext";

function LogoComponent() {
    const mode = useContext(GlobalContext).mode;
    return (
        <Row className={classes.container} horizontal="center" vertical="center">
            <Col>
            {mode === "dark"? (
                <img src={logoimage(darkLogo)} className={classes.comWorkLogo} alt="Comwork" />
                ): (<img src={logoimage(lightLogo)} className={classes.comWorkLogo} alt="Comwork" />
            )}
            </Col>
        </Row>
    );
}
export default LogoComponent;