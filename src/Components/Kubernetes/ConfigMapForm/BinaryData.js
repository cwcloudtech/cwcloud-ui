import React, { useContext } from "react";
import { Input, Form, FormGroup, Col, Row, Label } from "reactstrap"
import GlobalContext from "../../../Context/GlobalContext";
import colors from "../../../Context/Colors";
import classes from "./configmap.module.css"
import LoadingButton from "../../LoadingButton/LoadingButton";
import ConfigMapFormContext from "../../../Context/kubernetes/ConfigMapFormContext";

function SingleBinaryData(props) {
    const { counterpart, mode } = useContext(GlobalContext);
    const _mode = mode;
    const { id, key, value } = props.binaryData;
    const { removeSingleBinaryData, updateSingleBinaryData } = useContext(ConfigMapFormContext);
    return (
        <Row>
            <Col xs="5">
                <FormGroup>
                    <Label for={`bdkey-${id}`} style={{ color: colors.title[_mode] }}>
                        {counterpart('dashboard.kubernetesDashboardPages.common.form.key')}
                    </Label>
                    <Input id={`bdkey-${id}`} className="blackableInput" name="key"
                        value={key}
                        onChange={(e) =>
                            updateSingleBinaryData(id, {
                                ...props.binaryData,
                                key: e.target.value,
                            })
                        }
                        placeholder={counterpart('dashboard.kubernetesDashboardPages.common.form.keyHolder')} />
                </FormGroup>
            </Col>
            <Col xs="5">
                <FormGroup>
                    <Label for={`bdvalue-${id}`} style={{ color: colors.title[_mode] }}>
                        {counterpart('dashboard.kubernetesDashboardPages.common.form.value')}
                    </Label>
                    <Input id={`bdvalue-${id}`} className="blackableInput" name="value"
                        value={value}
                        onChange={(e) =>
                            updateSingleBinaryData(id, {
                                ...props.binaryData,
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
                    onClick={() => removeSingleBinaryData(id)}
                    tooltip={counterpart('dashboard.kubernetesDashboardPages.common.form.remove')}
                >
                </LoadingButton>
                <LoadingButton
                    icon={"fa-solid fa-plus"}
                    variant="text"
                    className={classes.removeButton}
                    onClick={props.addSingleBinaryData}
                    tooltip={counterpart('dashboard.kubernetesDashboardPages.common.form.addSelector')}
                >
                </LoadingButton>
            </Col>
        </Row>
    );
}

export default function BinaryData(props) {
    const { binaryData, addSingleBinaryData } = useContext(ConfigMapFormContext);
    return (
        <Form>
            {
                binaryData.map((item) => <SingleBinaryData key={`bdata-${item.id}`} binaryData={item} addSingleBinaryData={addSingleBinaryData} />)
            }
        </Form>
    );
}
