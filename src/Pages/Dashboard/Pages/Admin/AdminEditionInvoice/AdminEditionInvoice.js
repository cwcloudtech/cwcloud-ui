import { Autocomplete, TextField } from '@mui/material';
import { useContext, useState, useEffect } from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Translate from 'react-translate-component';
import { Col, Container, Row } from "reactstrap";
import LoadingButton from '../../../../../Components/LoadingButton/LoadingButton';
import colors from '../../../../../Context/Colors';
import GlobalContext from '../../../../../Context/GlobalContext';
import axios from "../../../../../utils/axios";
import { isBlank } from "../../../../../utils/common";
import classes from "./AdminEditionInvoice.module.css";

function AdminEditionInvoice() {
    const context = useContext(GlobalContext);
    const _mode = context.mode;
    const [loadingGenerate, setLoadingGenerate] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const [users, setUsers] = useState([])
    const [invoiceRef, setInvoiceRef] = useState({});
    const navigate = useNavigate()

    useEffect(() => {
        context.setIsGlobal(true)        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        context.setIsGlobal(true)
        axios.get("/admin/user/all")
            .then(res => {
                setUsers(res.data.result)
            })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        setErrorMessage(null)
    }, [invoiceRef])

    const handleSubmit = (setLoadingFunction) => {
        if (isBlank(invoiceRef.ref)) {
            setErrorMessage(context.counterpart('dashboard.editionInvoice.errors.referenceIsEmpty'))
            return false;
        }

        if (isBlank(invoiceRef.email)) {
            setErrorMessage(context.counterpart('dashboard.editionInvoice.errors.emailIsEmpty'))
            return false;
        }

        setLoadingFunction(true)
        axios.post(`/admin/invoice/edition`, invoiceRef)
            .then(response => {
                setLoadingFunction(false)
                navigate('/admin/invoice/overview')
                toast.success(context.counterpart('dashboard.editionInvoice.message.success'))
            }).catch(err => {
                setLoadingFunction(false)
            })

        return true;
    }

    const handleEdit = () => {
        return handleSubmit(setLoadingGenerate);
    }

    return (
        <div>
            <Row>
                <Col>
                    <div className={classes.goBack}>
                        <NavLink to='/admin/invoice/overview' className={classes.link}>
                            <i className={["fa-solid fa-arrow-left", `${classes.iconStyle}`].join(" ")}></i>
                            <Translate content="dashboard.customInvoice.back" />
                        </NavLink>
                    </div>
                </Col>
            </Row>
            <Container fluid className={classes.container} style={{ padding: "5px 20px 20px 20px", marginTop: "20px" }} >
                <Row>
                    <Col className={classes.borderCol} style={{boxShadow: "0 3px " + colors.bottomShaddow[_mode]}}>
                        <h5 className={classes.textTitle}><Translate content="dashboard.editionInvoice.mainTitle" style={{color: colors.title[_mode]}} /></h5>
                    </Col>
                </Row>
                <Row style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Col md="9" className={classes.formContainer} style={{backgroundColor: colors.formBackground[_mode]}}>
                        <Row style={{ marginTop: "30px", marginBottom: "30px", marginRight: "0", marginLeft: "0", display: "flex", justifyContent: "center" }}>
                            <Col md="8" className={classes.estwicol}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-email"
                                    onChange={(event, newValue) => {
                                        setInvoiceRef({ ...invoiceRef, email: newValue})
                                    }}
                                    freeSolo
                                    options={users.map(u => u.email)}
                                    sx={{ width: "100%" }}
                                    renderInput={(params) =>
                                        <TextField
                                            style={{ marginTop: '10px', marginBottom: "15px"}}
                                            onChange={(e) => setInvoiceRef({ ...invoiceRef, email: e.target.value})} {...params} 
                                            label={context.counterpart('dashboard.addProject.inputs.email.placeholder')} fullWidth />}
                                />
                                <TextField
                                    style={{ marginTop: '10px', marginBottom: "15px"}}
                                    onChange={(e) => setInvoiceRef({...invoiceRef, ref: e.target.value})}
                                    label={context.counterpart("dashboard.editionInvoice.inputs.reference.placeholder")}
                                    fullWidth />
                                <TextField
                                    style={{ marginTop: '10px'}}
                                    onChange={(e) => setInvoiceRef({ ...invoiceRef, new_ref: e.target.value})}
                                    label={context.counterpart("dashboard.editionInvoice.inputs.newReference.placeholder")}
                                    fullWidth />
                            </Col>
                        </Row>
                        {errorMessage && <Row>
                            <Col>
                                <h5 style={{ fontSize: '12px', color: 'red', textAlign: 'center' }}>
                                    {errorMessage}
                                </h5>
                            </Col>
                        </Row>}
                        <Row style={{ paddingBottom: '8px' }}>
                            <Col style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <LoadingButton loading={loadingGenerate} icon={"fa-solid fa-edit"} onClick={handleEdit}>
                                    <Translate content="common.button.edition" />
                                </LoadingButton>
                            </Col>
                        </Row>
                    </Col>
                </Row>


            </Container>
        </div >
    )
}
export default AdminEditionInvoice

