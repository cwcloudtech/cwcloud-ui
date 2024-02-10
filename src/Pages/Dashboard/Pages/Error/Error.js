import React from 'react';
import Translate from 'react-translate-component'
import { Row } from 'reactstrap';
import FileSearching from "../../../../assets/images/file-searching.svg"
import classes from "./Error.module.css"

function Error() {
    return (
        <div className={classes.center}>
            <Row style={{ margin: "10px 0px", display: "flex", justifyContent: "center" }}>
                <img className={classes.imageStyle} src={FileSearching} alt="file-searching" ></img>
            </Row>
            <Row style={{ margin: "10px 0px", textAlign: "center" }}>
                <h1 className={classes.textError}>404</h1>
            </Row>
            <Row style={{ margin: "10px 0px", textAlign: "center" }}>
                <h5 className={classes.textNotFound}>
                    <Translate content="dashboard.pageNotFound.message" />
                </h5>
            </Row>
            <Row style={{ margin: "10px 0px", textAlign: "center" }}>
                <h6 className={classes.textMuted}>
                    <Translate content="dashboard.pageNotFound.description" /></h6>
            </Row>
        </div>
    )
}

export default Error