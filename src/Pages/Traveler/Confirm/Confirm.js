import { useContext, useState } from 'react';
import { Row, Col, Input, Form, FormGroup, Label } from 'reactstrap';
import classes from '../traveler.module.css';
import axios from '../../../utils/axios';
import { toast } from 'react-toastify';
import LoadingButton from '../../../Components/LoadingButton/LoadingButton';
import GlobalContext from '../../../Context/GlobalContext';
import Translate from 'react-translate-component';
import BackGroundImage from "../../../assets/images/background.png"
import { NavLink } from 'react-router-dom';
import logoimage from '../../../utils/logo';

const Confirm = (props) => {
    const [emailAdr, setEmailAdr] = useState('');
    const [loadingRequest, setLoadingRequest] = useState(false)
    const context = useContext(GlobalContext)

    const verifEmailHandler = () => {
        setLoadingRequest(true)
        axios
            .post('/user/confirmation-mail', {
                email: emailAdr,
            })
            .then((res) => {
                setLoadingRequest(false)
                toast.success(context.counterpart('confirm.messageSent'))
            })
    };

    return (
        <Row className={classes.row} >
            <Col md="4" sm="12" className={classes.mainContainer}>
                <Row style={{ width: "100%" }}>
                    <Col className={classes.logoContainer}>
                        <img src={logoimage()} className={classes.comWorkLogo} alt="logo" />
                    </Col>
                </Row>
                <Row style={{ width: "100%" }}>
                    <Col className={classes.formContainer}>
                        <Row className={classes.form}>
                            <Col style={{ padding: "0" }}>
                                <h4 className={classes.headerTitle}>
                                    Verify your email
                                </h4>
                            </Col>
                            <Col style={{ padding: "0" }}>
                                <Form>
                                    <FormGroup floating>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder={context.counterpart('confirm.inputEmail')}
                                            value={emailAdr}
                                            onChange={(e) => { setEmailAdr(e.target.value) }}
                                        />
                                        <Label for="email">
                                            <Translate content="confirm.inputEmail" />
                                        </Label>
                                    </FormGroup>
                                    {' '}
                                </Form>
                            </Col>
                            <Col style={{ padding: "0" }}>
                                <LoadingButton loading={loadingRequest} icon="fa-solid fa-right-to-bracket" className={classes.buttonStyle} onClick={verifEmailHandler}>
                                    <Translate content="common.button.send" style={{color: 'white'}}/>
                                </LoadingButton>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row className={classes.centerRow}>
                    <Col style={{ display: 'flex', justifyContent: "center", alignItems: "end" }}>
                        <h4 style={{ color: "rgb(130,130,130)", fontSize: '15px', textAlign: "center" }}>
                            <NavLink to="/" style={{ textDecoration: "none" }}>
                                <Translate content="signup.login" style={{color: '#0861AF'}}/>
                            </NavLink>
                        </h4>
                    </Col>
                </Row>
            </Col>
            <Col md="8" sm="0" className={classes.backgroundLogin}>
                <img className={classes.imageStyle} src={BackGroundImage} alt="background"></img>
            </Col>
        </Row>
    );
};

export default Confirm;
