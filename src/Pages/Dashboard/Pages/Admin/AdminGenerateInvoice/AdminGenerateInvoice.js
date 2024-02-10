import { useContext, useState, useEffect } from 'react';
import { Col, Row, Container } from "reactstrap"
import classes from "./AdminGenerateInvoice.module.css"
import axios from "../../../../../utils/axios";
import { toast } from "react-toastify";
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { saveAs } from 'file-saver';
import Translate from 'react-translate-component';
import GlobalContext from '../../../../../Context/GlobalContext';
import colors from '../../../../../Context/Colors';
import LoadingButton from '../../../../../Components/LoadingButton/LoadingButton';
import { Autocomplete } from '@mui/material';
import formateDate from '../../../../../utils/FormateDate';
import FormControlLabel from '@mui/material/FormControlLabel';
import IOSSwitch from '../../../../../utils/iosswitch';

function AdminGenerateInvoice() {
    const context = useContext(GlobalContext);
    const _mode = context.mode;
    const [loadingPreview, setLoadingPreview] = useState(false)
    const [loadingSend, setLoadingSend] = useState(false)
    const [userEmail, setUserEmail] = useState(null)
    const [sendMail, setSendMail] = useState(false)
    const [users, setUsers] = useState([])
    const [invoiceDetails, setInvoiceDetails] = useState({
        from: null,
        to: null
    });

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

    const handleClickButtonPreview = () => {
        setLoadingPreview(true)
        axios.post(`/admin/invoice/generate`, { ...invoiceDetails, email: userEmail, preview: true, send: false }).then((res) => {
            const byteCharacters = atob(res.data.blob.toString("base64"));
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const pdfBlob = new Blob([byteArray], { type: 'application/pdf' });
            saveAs(pdfBlob, res.data.file_name);
            toast.success(context.counterpart('dashboard.generateInvoice..message.successPreview'))
            setLoadingPreview(false)

        }).catch(err => {
            setLoadingPreview(false)
        })

    }
    const handleClickButtonSend = () => {
        setLoadingSend(true)
        axios.post(`/admin/invoice/generate`, { ...invoiceDetails, email: userEmail, send: sendMail, preview: false }).then((res) => {
            const byteCharacters = atob(res.data.blob.toString("base64"));
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const pdfBlob = new Blob([byteArray], { type: 'application/pdf' });
            saveAs(pdfBlob, res.data.file_name);
            toast.success(context.counterpart('dashboard.generateInvoice..message.succcesSent'))
            setLoadingPreview(false)
            setLoadingSend(false)
        }).catch(err => {
            setLoadingSend(false)
        })

    }

    return (
        <Container fluid className={classes.container} style={{ padding: "5px 20px 20px 20px", marginTop: "20px" }} >
            <Row>
                <Col md="6" className={classes.formContainer} style={{backgroundColor: colors.formBackground[_mode]}}>
                    <Row style={{ marginTop: "30px", marginBottom: "30px", marginRight: "0", marginLeft: "0", display: "flex", justifyContent: "center" }}>
                        <Col className={classes.estwicol}>
                            <Autocomplete
                                disablePortal
                                id="combo-box-email"
                                onChange={(event, newValue) => {
                                    setUserEmail(newValue);
                                }}
                                freeSolo
                                options={users.map(u => u.email)}
                                sx={{ width: "100%" }}
                                renderInput={(params) =>
                                    <TextField onChange={(e) => setUserEmail(e.target.value)} {...params} label={context.counterpart('dashboard.addProject.inputs.email.placeholder')} />}
                            />
                        </Col>
                    </Row>
                    <Row style={{ marginTop: "30px", marginBottom: "30px", marginRight: "0", marginLeft: "0", display: "flex", justifyContent: "center" }}>
                        <Col>
                            <h4 className={classes.subtitleStyle}>
                                <Translate content="dashboard.generateInvoice..inputs.startDate.title" />
                                <span style={{ marginLeft: "2px", color: "red" }}>*</span></h4>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: "30px", marginBottom: "30px", marginRight: "0", marginLeft: "0", display: "flex", justifyContent: "center" }}>
                        <Col>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    inputFormat="yyyy/MM/dd"
                                    label={context.counterpart('dashboard.generateInvoice..inputs.startDate.placeholder')}
                                    value={invoiceDetails.from}
                                    onChange={(newValue) => setInvoiceDetails({ ...invoiceDetails, from: formateDate(newValue) })}
                                    renderInput={(params) => (
                                        <TextField {...params} helperText={params?.inputProps?.placeholder} sx={{ width: '100%' }} />
                                    )}
                                />
                            </LocalizationProvider>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: "30px", marginBottom: "30px", marginRight: "0", marginLeft: "0", display: "flex", justifyContent: "center" }} >
                        <Col>
                            <h4 className={classes.subtitleStyle}>
                                <Translate content="dashboard.generateInvoice..inputs.endDate.title" />
                                <span style={{ marginLeft: "2px", color: "red" }}>*</span></h4>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: "30px", marginBottom: "10px", marginRight: "0", marginLeft: "0", display: "flex", justifyContent: "center" }} >
                        <Col>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    inputFormat="yyyy/MM/dd"
                                    label={context.counterpart('dashboard.generateInvoice..inputs.endDate.placeholder')}
                                    value={invoiceDetails.to}
                                    onChange={(newValue) => setInvoiceDetails({ ...invoiceDetails, to: formateDate(newValue) })}
                                    renderInput={(params) => (
                                        <TextField {...params} helperText={params?.inputProps?.placeholder} sx={{ width: '100%' }} />
                                    )}
                                />
                            </LocalizationProvider>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: "10px", marginBottom: "30px", marginRight: "0", marginLeft: "0", display: "flex", justifyContent: "center" }}>
                            <Col>
                                <FormControlLabel
                                    value={sendMail}
                                    label={context.counterpart('dashboard.customInvoice.inputs.sendMail.title')}
                                    control={<IOSSwitch sx={{ m: 1 }}/>}
                                    onChange={(e) => setSendMail(e.target.checked)}
                                />
                            </Col>
                        </Row>
                    <Row style={{ marginTop: '20px'}}>
                        <Col xs="2" />
                        <Col xs="4" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <LoadingButton loading={loadingSend} icon="fa-solid fa-paper-plane" onClick={handleClickButtonSend} >
                                <Translate content="common.button.generate" />
                            </LoadingButton>
                        </Col>
                        <Col xs="4" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <LoadingButton loading={loadingPreview} icon="fa-solid fa-download" onClick={handleClickButtonPreview} >
                                <Translate content="dashboard.generateInvoice..buttons.preview" />
                            </LoadingButton>
                        </Col>
                        <Col xs="2" />
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}
export default AdminGenerateInvoice

