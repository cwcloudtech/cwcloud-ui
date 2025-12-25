import TextField from '@mui/material/TextField';
import { useContext, useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Translate from 'react-translate-component';
import { Col, Container, Row } from "reactstrap";
import LoadingButton from '../../../../../../Components/LoadingButton/LoadingButton';
import SuggestionsAutoComplete from '../../../../../../Components/SuggestionsAutoComplete/SuggestionsAutoComplete';
import colors from '../../../../../../Context/Colors';
import GlobalContext from '../../../../../../Context/GlobalContext';
import axios from '../../../../../../utils/axios';

const AddContactForm = () => {
    const context = useContext(GlobalContext);
    const _mode = context.mode;
    const location = useLocation()
    const navigate = useNavigate();
    const currentPath = location.pathname
    const is_admin = currentPath.includes("admin")
    const nextPath = is_admin ? "/admin/contactForms" : "/contactForms"
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    const [form, setForm] = useState({
        name: '',
        mail_from: '',
        mail_to: '',
        copyright_name: '',
        logo_url: '',
        ...(is_admin && { user_id: 0 })
    });
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (is_admin) {
            axios.get("/admin/user/all")
                .then(response => {
                    setUsers(response.data.result);
                })
                .catch(error => {
                    toast.error(error.response?.data?.message || context.counterpart("common.message.errorFetchingUsers"));
                });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_admin]);

    const handleSubmit = () => {
        if (!form.name || !form.mail_from || !form.mail_to) {
            toast.error(context.counterpart("dashboard.contactForm.message.fieldsRequired"));
            return;
        }

        if (is_admin && !form.user_id) {
            toast.error(context.counterpart("dashboard.contactForm.message.userRequired"));
            return;
        }

        setLoadingSubmit(true);
        var api_url = is_admin ? "/admin/contactform" : "/contactform"
        axios.post(api_url, form)
            .then(response => {
                setLoadingSubmit(false);
                toast.success(context.counterpart("dashboard.contactForm.message.created"));
                navigate(nextPath);
            })
            .catch(error => {
                setLoadingSubmit(false);
                toast.error(error.response?.data?.message || context.counterpart("dashboard.contactForm.message.creationError"));
            });
    };

    return (
        <div>
            <Row>
                <Col>
                    <div onClick={() => navigate(nextPath)} className="goBack">
                        <NavLink className="link fs-6">
                            <i className="fa-solid fa-arrow-left iconStyle"></i>
                            <Translate content="dashboard.contactForm.back" />
                        </NavLink>
                    </div>
                </Col>
            </Row>
            <Container fluid style={{ padding: "5px 20px 20px 20px", marginTop: "20px" }}>
                <Row>
                    <Col className="border-bottom pb-2 mb-4" style={{borderColor: colors.bottomShaddow[_mode]}}>
                        <h5 className="textTitle" style={{color: colors.title[_mode]}}>
                            <Translate content="dashboard.contactForm.addNew" />
                        </h5>
                    </Col>
                </Row>
                <Row style={{ margin: "30px 0px" }}>
                    <Col>
                        <Row style={{ display: "flex", alignItems: "center" }}>
                            <Col md="4">
                                <h5 className="labelName" style={{color: colors.title[_mode]}}>
                                    <Translate content="dashboard.contactForm.inputs.name.title" />
                                    <span style={{ marginLeft: "2px", color: "red" }}>*</span></h5>
                            </Col>
                            <Col md="6">
                                <TextField 
                                    id="name"
                                    name="name"
                                    label={context.counterpart('dashboard.contactForm.inputs.name.placeholder')}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    required 
                                    fullWidth
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row style={{ margin: "30px 0px" }}>
                    <Col>
                        <Row style={{ display: "flex", alignItems: "center" }}>
                            <Col md="4">
                                <h5 className="labelName" style={{color: colors.title[_mode]}}>
                                    <Translate content="dashboard.contactForm.inputs.mail_from.title" />
                                    <span style={{ marginLeft: "2px", color: "red" }}>*</span>
                                </h5>
                            </Col>
                            <Col md="6">
                                <TextField 
                                    id="mail_from"
                                    name="mail_from"
                                    label={context.counterpart('dashboard.contactForm.inputs.mail_from.placeholder')}
                                    onChange={e => setForm({ ...form, mail_from: e.target.value })}
                                    required 
                                    fullWidth
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row style={{ margin: "30px 0px" }}>
                    <Col>
                        <Row style={{ display: "flex", alignItems: "center" }}>
                            <Col md="4">
                                <h5 className="labelName" style={{color: colors.title[_mode]}}>
                                    <Translate content="dashboard.contactForm.inputs.mail_to.title" />
                                    <span style={{ marginLeft: "2px", color: "red" }}>*</span>
                                </h5>
                            </Col>
                            <Col md="6">
                                <TextField 
                                    id="mail_to"
                                    name="mail_to"
                                    label={context.counterpart('dashboard.contactForm.inputs.mail_to.placeholder')}
                                    onChange={e => setForm({ ...form, mail_to: e.target.value })}
                                    required 
                                    fullWidth
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row style={{ margin: "30px 0px" }}>
                    <Col>
                        <Row style={{ display: "flex", alignItems: "center" }}>
                            <Col md="4">
                                <h5 className="labelName" style={{color: colors.title[_mode]}}>
                                    <Translate content="dashboard.contactForm.inputs.copyright_name.title" />
                                </h5>
                            </Col>
                            <Col md="6">
                                <TextField 
                                    id="copyright_name"
                                    name="copyright_name"
                                    label={context.counterpart('dashboard.contactForm.inputs.copyright_name.placeholder')}
                                    onChange={e => setForm({ ...form, copyright_name: e.target.value })}
                                    fullWidth
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row style={{ margin: "30px 0px" }}>
                    <Col>
                        <Row style={{ display: "flex", alignItems: "center" }}>
                            <Col md="4">
                                <h5 className="labelName" style={{color: colors.title[_mode]}}>
                                    <Translate content="dashboard.contactForm.inputs.logo_url.title" />
                                </h5>
                            </Col>
                            <Col md="6">
                                <TextField 
                                    id="logo_url"
                                    name="logo_url"
                                    label={context.counterpart('dashboard.contactForm.inputs.logo_url.placeholder')}
                                    onChange={e => setForm({ ...form, logo_url: e.target.value })}
                                    fullWidth
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
                { is_admin && (
                        <Row style={{ margin: "30px 0px" }}>
                            <Col>
                                <Row style={{ display: "flex", alignItems: "center" }}>
                                    <Col md="4">
                                        <h5 className="labelName" style={{color: colors.title[_mode]}}>
                                            <Translate content="dashboard.contactForm.inputs.owner.title" />
                                            <span style={{ marginLeft: "2px", color: "red" }}>*</span>
                                        </h5>
                                    </Col>
                                    <Col md="6">
                                    <SuggestionsAutoComplete
                                        id="combo-box-email"
                                        onChange={(event, newValue) => {
                                            const selectedUserObj = users.find(u => u.email === newValue);
                                            setForm(prev => ({
                                                ...prev,
                                                user_id: selectedUserObj ? selectedUserObj.id : 0
                                            }));
                                        }}
                                        options={users.map((u) => u.email)}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label={context.counterpart('dashboard.contactForm.inputs.owner.placeholder')}
                                            />
                                        )}
                                    />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    )
                }
                <Row className="mt-4">
                    <Col className="d-flex justify-content-center">
                        <LoadingButton
                            icon="fa-solid fa-floppy-disk"
                            loading={loadingSubmit}
                            onClick={handleSubmit}
                            style={{ width: "250px", height: "50px" }}
                            variant="outlined"
                        >
                            <Translate content="common.button.create" />
                        </LoadingButton>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default AddContactForm;
