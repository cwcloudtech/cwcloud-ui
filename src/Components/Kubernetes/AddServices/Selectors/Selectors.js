import React, { useContext } from "react";
import { Input, Form, FormGroup, Col, Row, Label } from "reactstrap"
import GlobalContext from "../../../../Context/GlobalContext";
import colors from "../../../../Context/Colors";
import Translate from "react-translate-component";
import classes from "./Selectors.module.css"
import LoadingButton from "../../../LoadingButton/LoadingButton";
import ServiceFormContext from "../../../../Context/kubernetes/ServiceFormContext";

function Selector(props) {
    const { counterpart, mode } = useContext(GlobalContext);
    const _mode = mode;
    const { id, key, value } = props.selector;
    const { removeSelector, updateSelector } = useContext(ServiceFormContext);
    return (
        <Row>
            <Col xs="5">
                <FormGroup>
                    <Label for={`key-${id}`} style={{ color: colors.title[_mode] }}>
                        {counterpart('dashboard.kubernetesDashboardPages.common.form.key')}
                    </Label>
                    <Input id={`key-${id}`} className="blackableInput" name="key"
                        value={key}
                        onChange={(e) =>
                            updateSelector(id, {
                                ...props.selector,
                                key: e.target.value,
                            })
                        }
                        placeholder={counterpart('dashboard.kubernetesDashboardPages.common.form.keyHolder')} />
                </FormGroup>
            </Col>
            <Col xs="5">
                <FormGroup>
                    <Label for={`value-${id}`} style={{ color: colors.title[_mode] }}>
                        {counterpart('dashboard.kubernetesDashboardPages.common.form.value')}
                    </Label>
                    <Input id={`value-${id}`} className="blackableInput" name="value"
                        value={value}
                        onChange={(e) =>
                            updateSelector(id, {
                                ...props.selector,
                                value: e.target.value,
                            })
                        }
                        placeholder={counterpart('dashboard.kubernetesDashboardPages.common.form.valueHolder')} />
                </FormGroup>
            </Col>
            <Col xs="1" style={{ display: "flex", alignItems: "center" }}>
                <LoadingButton variant="text" className={classes.removeButton} onClick={() => removeSelector(id)}>
                    <Translate content="dashboard.kubernetesDashboardPages.common.form.remove" />
                </LoadingButton>
            </Col>
        </Row>
    );
}



export default function Selectors(props) {
    const { selectors, addSelector } = useContext(ServiceFormContext);
    return (
        <Form>
            {
                selectors.map((item) => <Selector key={`selector-${item.id}`} selector={item} />)
            }
            <LoadingButton icon={"fa-solid fa-plus"} className="addButton" variant="contained" onClick={addSelector}>
                <Translate content="dashboard.kubernetesDashboardPages.common.form.addSelector" />
            </LoadingButton>
        </Form>
    );
}
