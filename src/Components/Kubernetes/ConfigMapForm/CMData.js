import React, { useContext } from "react";
import { Input, Form, FormGroup, Col, Row, Label } from "reactstrap"
import GlobalContext from "../../../Context/GlobalContext";
import colors from "../../../Context/Colors";
import classes from "./configmap.module.css"
import LoadingButton from "../../LoadingButton/LoadingButton";
import ConfigMapFormContext from "../../../Context/kubernetes/ConfigMapFormContext";

function SingleCMData(props) {
    const { counterpart, mode } = useContext(GlobalContext);
    const _mode = mode;
    const { id, key, value } = props.cmData;
    const { removeSingleCmData, updateSingleCmData } = useContext(ConfigMapFormContext);
    return (
        <Row>
            <Col xs="5">
                <FormGroup>
                    <Label for={`cmkey-${id}`} style={{ color: colors.title[_mode] }}>
                        {counterpart('dashboard.kubernetesDashboardPages.common.form.key')}
                    </Label>
                    <Input id={`cmkey-${id}`} className="blackableInput" name="key"
                        value={key}
                        onChange={(e) =>
                            updateSingleCmData(id, {
                                ...props.cmData,
                                key: e.target.value,
                            })
                        }
                        placeholder={counterpart('dashboard.kubernetesDashboardPages.common.form.keyHolder')} />
                </FormGroup>
            </Col>
            <Col xs="5">
                <FormGroup>
                    <Label for={`cmvalue-${id}`} style={{ color: colors.title[_mode] }}>
                        {counterpart('dashboard.kubernetesDashboardPages.common.form.value')}
                    </Label>
                    <Input id={`cmvalue-${id}`} className="blackableInput" name="value"
                        value={value}
                        onChange={(e) =>
                            updateSingleCmData(id, {
                                ...props.cmData,
                                value: e.target.value,
                            })
                        }
                        placeholder={counterpart('dashboard.kubernetesDashboardPages.common.form.valueHolder')} />
                </FormGroup>
            </Col>
            <Col xs="2" style={{ display: "flex", alignItems: "center" }}>
                <LoadingButton 
                    icon={"fa-solid fa-trash"}
                    variant="text"
                    className={classes.removeButton}
                    tooltip={counterpart('dashboard.kubernetesDashboardPages.common.form.remove')}
                    onClick={() => removeSingleCmData(id)}
                >
                </LoadingButton>
                <LoadingButton
                    icon={"fa-solid fa-plus"}
                    variant="text"
                    className={classes.removeButton}
                    onClick={props.addSingleCmData}
                    tooltip={counterpart('dashboard.kubernetesDashboardPages.common.form.addSelector')}
                >
                </LoadingButton>
            </Col>
        </Row>
    );
}

export default function CMData(props) {
    const { cmData, addSingleCmData } = useContext(ConfigMapFormContext);
    return (
        <Form>
            {
                cmData.map((item) => <SingleCMData key={`cmdata-${item.id}`} cmData={item} addSingleCmData={addSingleCmData} />)
            }
        </Form>
    );
}
