import React, { useContext } from "react";
import { Input, Form, FormGroup, Col, Row, Label } from "reactstrap"
import GlobalContext from "../../../../Context/GlobalContext";
import colors from "../../../../Context/Colors";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import ServiceFormContext from "../../../../Context/kubernetes/ServiceFormContext";

export default function SessionAffinity(props) {
    const { counterpart, mode } = useContext(GlobalContext);
    const _mode = mode;
    const { affinity, updateAffinity } = useContext(ServiceFormContext);
    const { state, timeout } = affinity

    return (
        <Form>
            <Row>
                <Col>
                    <FormGroup>
                        <RadioGroup
                            name="affinityGroup"
                            defaultValue="disabled"
                            onChange={(event) => updateAffinity({ ...affinity, state: event.target.value })}
                            value={state}
                        >
                            <FormControlLabel value={'None'} control={<Radio />} label={counterpart('dashboard.kubernetesDashboardPages.serviceDisovery.services.form.form.affinityDisabled')} />
                            <FormControlLabel value={'ClientIP'} control={<Radio />} label={counterpart('dashboard.kubernetesDashboardPages.serviceDisovery.services.form.form.affinityEnabled')} />
                        </RadioGroup>
                    </FormGroup>
                </Col>
            </Row>
            {
                state === 'ClientIP' && <Row>
                    <Col xs="6">
                        <FormGroup>
                            <Label for="service-affinitySession" style={{ color: colors.title[_mode] }}>
                                {counterpart('dashboard.kubernetesDashboardPages.serviceDisovery.services.form.form.sessionStickyTime')}
                            </Label>
                            <Input id="service-affinitySession" type="number" className="blackableInput" value={timeout}
                                onChange={(event) => updateAffinity({ ...affinity, timeout: Number.parseInt(event.target.value) })}
                                placeholder={counterpart('dashboard.kubernetesDashboardPages.serviceDisovery.services.form.form.sessionStickyTimeHolder')} />
                        </FormGroup>
                    </Col>
                </Row>
            }
        </Form>
    );
}
