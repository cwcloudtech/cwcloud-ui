import TextField from '@mui/material/TextField';
import { useContext, useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Translate from 'react-translate-component';
import { Col, Container, Row } from "reactstrap";
import LoadingButton from '../../../../../../Components/LoadingButton/LoadingButton';
import SuggestionsAutoComplete from '../../../../../../Components/SuggestionsAutoComplete/SuggestionsAutoComplete';
import colors from '../../../../../../Context/Colors';
import GlobalContext from '../../../../../../Context/GlobalContext';
import axios from '../../../../../../utils/axios';
import { shortname } from '../../../../../../utils/hash';

const ContactFormOverview = () => {
    const context = useContext(GlobalContext);
    const { id } = useParams();
    const _mode = context.mode;
    const location = useLocation();
    const currentPath = location.pathname;
    const is_admin = currentPath.includes("admin");
    const nextPath = is_admin ? "/admin/contactForms" : "/contactForms";
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [loadingFetch, setLoadingFetch] = useState(true);
    const [form, setForm] = useState({
        name: '',
        mail_from: '',
        mail_to: '',
        copyright_name: '',
        logo_url: '',
        trusted_ips: '',
        ...(is_admin && { user_id: 0 })
    });
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

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

    useEffect(() => {
        const fetchContactFormDetails = async () => {
            try {
                setLoadingFetch(true);
                var api_url = is_admin ? `/admin/contactform/${id}` : `/contactform/${id}`;
                const response = await axios.get(api_url);
                const fetchedForm = response.data;
                fetchedForm.name = shortname(fetchedForm.name, fetchedForm.hash);
                setForm(fetchedForm);
                setLoadingFetch(false);
            } catch (error) {
                setLoadingFetch(false);
                toast.error(context.counterpart("dashboard.contactForm.message.errorFetchingForms"));
                navigate(nextPath);
            }
        };

        fetchContactFormDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, navigate, context]);

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

        const formData = {
            name: form.name,
            mail_from: form.mail_from,
            mail_to: form.mail_to,
            copyright_name: form.copyright_name || null,
            logo_url: form.logo_url || null
        };

        if (is_admin && form.user_id) {
            formData.user_id = form.user_id
        }
    
        var api_url = is_admin ? `/admin/contactform/${id}` : `/contactform/${id}`;
        axios.put(api_url, formData)
            .then(response => {
                setLoadingSubmit(false);
                toast.success(context.counterpart("dashboard.contactForm.message.updated"));
                navigate(nextPath);
            })
            .catch(error => {
                setLoadingSubmit(false);
                toast.error(error.response?.data?.message || context.counterpart("dashboard.contactForm.message.errorUpdatingContactForm"));
            });
    };

    if (loadingFetch) {
        return (
            <Container fluid className="p-4 mt-4">
                <div className="text-center">
                    <Translate content="common.loading" />
                </div>
            </Container>
        );
    }

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
                            <Translate content="dashboard.contactForm.formOverview" />
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
                                    id="cf_name"
                                    name="cf_name"
                                    label={context.counterpart('dashboard.contactForm.inputs.name.placeholder')}
                                    value={form.name}
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
                                    id="cf_mail_from"
                                    name="cf_mail_from"
                                    label={context.counterpart('dashboard.contactForm.inputs.mail_from.placeholder')}
                                    value={form.mail_from}
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
                                    id="cf_mail_to"
                                    name="cf_mail_to"
                                    label={context.counterpart('dashboard.contactForm.inputs.mail_to.placeholder')}
                                    value={form.mail_to}
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
                                    id="cf_copyright_name"
                                    name="cf_copyright_name"
                                    label={context.counterpart('dashboard.contactForm.inputs.copyright_name.placeholder')}
                                    value={form.copyright_name}
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
                                    id="cf_logo_url"
                                    name="cf_logo_url"
                                    label={context.counterpart('dashboard.contactForm.inputs.logo_url.placeholder')}
                                    value={form.logo_url}
                                    onChange={e => setForm({ ...form, logo_url: e.target.value })}
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
                                    <Translate content="dashboard.contactForm.trusted_ips.logo_url.title" />
                                </h5>
                            </Col>
                            <Col md="6">
                                <TextField
                                    id="cf_trusted_ips"
                                    name="cf_trusted_ips"
                                    label={context.counterpart('dashboard.contactForm.inputs.trusted_ips.placeholder')}
                                    value={form.logo_url}
                                    onChange={e => setForm({ ...form, trusted_ips: e.target.value })}
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
                                        value={users.find(u => u.id === form.user_id)?.email || ''}
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
                            <Translate content="common.button.update" />
                        </LoadingButton>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default ContactFormOverview;
