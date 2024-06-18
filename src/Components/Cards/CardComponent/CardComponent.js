import React, { useContext } from "react";
import { Col, Row } from "reactstrap";
import GlobalContext from "../../../Context/GlobalContext";
import colors from "../../../Context/Colors";
import classes from "./CardComponent.module.css"
import "../../../common.css"

function CardComponent(props) {
    const context = useContext(GlobalContext);
    const _mode = context.mode;
    const docUrl = process.env.REACT_APP_DOCURL;
    return (
        <Row style={props.style}>
            <Col className={`${props.containerStyles} pb-0 pt-0`} style={{ backgroundColor: colors.secondBackground[_mode], border: '1px solid ' + colors.border[_mode], borderRadius: "7px", marginTop: props.customMarginTop ?? "3px", boxShadow: colors.shadow[_mode], padding: "23px 20px" }}>
                <Row >
                    <Col>
                        <div style={{ display: "flex", justifyContent: "space-between" }} >
                            <span className="card-title" style={{ color: colors.mainText[_mode] }}>{props.title}</span>
                            <span className={classes.link} style={{ color: colors.blue }}>
                                <a href={docUrl} target="_blank" rel="noreferrer" >{props.link}</a>
                            </span>
                        </div>
                        {
                            props.subtitle &&
                            <Row>
                                <span className={classes.subtitle} style={{ color: colors.secondText[_mode] }}>{props.subtitle}</span>
                                {props.subtitleTwo && (
                                    <span className={[classes.subtitle, classes.subtitle2].join(" ")} style={{ color: colors.secondText[_mode] }}>
                                        {props.subtitleTwo}
                                    </span>
                                )}
                            </Row>
                        }
                        {
                            props.title || props.subtitle ? <div style={{ marginTop: 16 }}></div> : null
                        }
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {props.children}
                    </Col>
                </Row>
            </Col>
        </Row>
    );
}

export default CardComponent;
