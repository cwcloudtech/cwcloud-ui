import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Fab } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
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
import { fileDownloadFromResponse } from "../../../../../utils/fileApiDownloader";
import classes from "./AdminCustomInvoice.module.css";
import '../../../../../common.css';
import { Autocomplete } from '@mui/material';
import formateDate from '../../../../../utils/FormateDate';
import IOSSwitch from '../../../../../utils/iosswitch';

function AdminCustomInvoice() {
    const context = useContext(GlobalContext);
    const _mode = context.mode;
    const [loadingGenerate, setLoadingGenerate] = useState(false)
    const [loadingPreview, setLoadingPreview] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const items = useState([{ "price": 0, "label": '' }])
    const [invoice, setInvoice] = useState({
        date: '',
        send: true,
        preview: false,
        items: items
    });
    const [users, setUsers] = useState([])

    const navigate = useNavigate()

    useEffect(() => {
        context.setIsGlobal(true)        
    })

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
    }, [invoice])

    const updateItemLabelHandler = (index, value) => {
        const _invoice = { ...invoice }
        _invoice.items[index] = { price: _invoice.items[index].price, label: value }
        setInvoice({ ..._invoice })
    }

    const updateItemPriceHandler = (index, value) => {
        const _invoice = { ...invoice }
        _invoice.items[index] = { label: _invoice.items[index].label, price: parseFloat(value) }
        setInvoice({ ..._invoice })
    }

    const addItemHandler = () => {
        const _invoice = { ...invoice }
        _invoice.items.push({ "price": 0, "label": '' })
        setInvoice({ ..._invoice })
    }

    const handleSubmit = (setLoadingFunction, prev) => {
        if (isBlank(invoice.email)) {
            setErrorMessage(context.counterpart('dashboard.addUser.errors.missingInputs'))
            return false;
        }

        setLoadingFunction(true)
        setInvoice({...invoice, preview: prev})
        axios.post(`/admin/invoice/custom`, invoice)
            .then(response => {
                fileDownloadFromResponse(response, "application/pdf")
                toast.success(context.counterpart('dashboard.customInvoice.message.successCustom'))
                setLoadingFunction(false)
            }).catch(err => {
                setLoadingFunction(false)
            })

        return true;
    }

    const handleGenerate = () => {
        return handleSubmit(setLoadingGenerate, false);
    }

    const handlePreview = () => {
        return handleSubmit(setLoadingPreview, true);
    }

    return (
        <div>
            <Row>
                <Col>
                    <div className="goBack">
                        <NavLink to='/admin/invoice/overview' className="link">
                            <i className="fa-solid fa-arrow-left iconStyle"></i>
                            <Translate content="dashboard.customInvoice.back" />
                        </NavLink>
                    </div>
                </Col>
            </Row>
            <Container fluid style={{ padding: "5px 20px 20px 20px", marginTop: "20px" }} >
                <Row>
                    <Col className="borderCol" style={{boxShadow: "0 3px " + colors.bottomShaddow[_mode]}}>
                        <h5 className="textTitle"><Translate content="dashboard.customInvoice.mainTitle" style={{color: colors.title[_mode]}} /></h5>
                    </Col>
                </Row>
                <Row style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Col className="formContainer" style={{backgroundColor: colors.formBackground[_mode]}}>
                        <Row style={{ marginTop: "30px", marginBottom: "30px", marginRight: "0", marginLeft: "0", display: "flex", justifyContent: "center" }}>
                            <Col md="8" className={classes.estwicol}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-email"
                                    onChange={(event, newValue) => {
                                        setInvoice({ ...invoice, email: newValue });
                                    }}
                                    freeSolo
                                    options={users.map(u => u.email)}
                                    sx={{ width: "100%" }}
                                    renderInput={(params) =>
                                        <TextField onChange={(e) => setInvoice({ ...invoice, email: e.target.value })} {...params} label={context.counterpart('dashboard.customInvoice.inputs.email.placeholder')} />}
                                />
                            </Col>
                        </Row>
                        <Row style={{ marginTop: "30px", marginBottom: "30px", marginRight: "0", marginLeft: "0", display: "flex", justifyContent: "center" }}>
                            <Col md="8">
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        inputFormat="yyyy/MM/dd"
                                        label={context.counterpart('dashboard.customInvoice.inputs.date.placeholder')}
                                        value={invoice.date}
                                        onChange={(newValue) => setInvoice({ ...invoice, date: formateDate(newValue) })}
                                        renderInput={(params) => (
                                            <TextField {...params} helperText={params?.inputProps?.placeholder} sx={{ width: '100%' }} />
                                        )}
                                    />
                                </LocalizationProvider>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Row style={{ display: "flex", alignItems: "center" }}>
                                    <Col md="2" />
                                    <Col style={{ marginLeft: "10px" }} md="1">
                                        <h5 className={classes.labelName} style={{color: colors.title[_mode]}}>
                                            <Translate content="dashboard.customInvoice.inputs.items.title" />
                                            <span style={{ marginLeft: "2px", color: "red" }}>*</span></h5>
                                        <Fab color="primary" aria-label="add" onClick={addItemHandler} style={{ transform: 'scale(0.7)' }} >
                                            <AddIcon className="whiteIcon" />
                                        </Fab>
                                    </Col>
                                    <Col md="7">
                                        {invoice.items?.map((item, index) => (
                                            <Row key={index} style={{ display: 'flex', alignItems: 'center' }}>
                                                <Col md="6">
                                                    <TextField
                                                        style={{ marginTop: '10px'}}
                                                        onChange={(e) => updateItemLabelHandler(index, e.target.value)}
                                                        label={context.counterpart('dashboard.customInvoice.inputs.items.label.placeholder')}
                                                        fullWidth />
                                                </Col>
                                                <Col md="4">
                                                    <TextField
                                                        style={{ marginTop: '10px' }}
                                                        type="number"
                                                        onChange={(e) => updateItemPriceHandler(index, e.target.value)}
                                                        label={context.counterpart('dashboard.customInvoice.inputs.items.price.placeholder')}
                                                        inputProps={{ min: 0 }}
                                                        fullWidth />
                                                </Col>
                                                <Col md="1">
                                                    <Fab aria-label="delete" color='primary' onClick={() => setInvoice({ ...invoice, items: [...invoice.items.filter((s, i) => i !== index)] })} style={{ transform: 'scale(0.7)' }} >
                                                        <DeleteIcon className="whiteIcon" />
                                                    </Fab>
                                                </Col>
                                            </Row>
                                        ))}
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row style={{ marginTop: "30px", marginBottom: "30px", marginRight: "0", marginLeft: "10px", display: "flex", justifyContent: "center" }}>
                            <Col md="8" className={classes.estwicol}>
                                <FormControlLabel
                                    label={context.counterpart('dashboard.customInvoice.inputs.sendMail.title')}
                                    control={<IOSSwitch sx={{ m: 1 }} defaultChecked={invoice.send} />}
                                    onChange={(e) => setInvoice({ ...invoice, send: !invoice.send })}
                                />
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
                            <Col xs="2" />
                            <Col xs="4" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <LoadingButton loading={loadingGenerate} icon={"fa-solid fa-floppy-disk"} onClick={handleGenerate}>
                                    <Translate content="common.button.generate" />
                                </LoadingButton>
                            </Col>
                            <Col xs="4" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <LoadingButton loading={loadingPreview} icon={"fa-solid fa-eye"} onClick={handlePreview}>
                                    <Translate content="common.button.preview" />
                                </LoadingButton>
                            </Col>
                            <Col xs="2" />
                        </Row>
                    </Col>
                </Row>


            </Container>
        </div >
    )
}
export default AdminCustomInvoice;