import { useContext, useState, useEffect } from 'react';
import { Col, Row, Container } from "reactstrap"
import classes from "./AdminInvoicesOverview.module.css"
import '../../../../../common.css'
import axios from "../../../../../utils/axios";
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { saveAs } from 'file-saver';
import { Download } from "@mui/icons-material";
import Translate from "react-translate-component"
import GlobalContext from '../../../../../Context/GlobalContext';
import colors from '../../../../../Context/Colors';
import DataTable from '../../../../../Components/Table/DataTable';
import LoadingButton from '../../../../../Components/LoadingButton/LoadingButton';
import Tooltip from '@mui/material/Tooltip';
import { Autocomplete } from '@mui/material';
import formateDate from '../../../../../utils/FormateDate';

function AdminInvoicesOverview() {
    const context = useContext(GlobalContext);
    const _mode = context.mode;
    const [invoiceDetails, setInvoiceDetails] = useState({
        from: null,
        to: null
    });
    const [userEmail, setUserEmail] = useState(null)
    const [users, setUsers] = useState([])
    const [invoices, setInvoices] = useState([])
    const [loadingSearch, setLoadingSearch] = useState(false)
    const columns = [
        { field: 'id', headerName: context.counterpart("dashboard.invoicesPage.table.id"), width: 100 },
        { field: 'ref', headerName: context.counterpart("dashboard.invoicesPage.table.reference"), width: 200 },
        { field: 'date_created', headerName: context.counterpart("dashboard.invoicesPage.table.date"), width: 200 },
        { field: 'period', headerName: context.counterpart("dashboard.invoicesPage.table.period"), width: 200, renderCell: (params) => { return <span>{params.row.from_date} - {params.row.to_date}</span> } },
        { field: 'status', headerName: context.counterpart("dashboard.invoicesPage.table.status"), width: 200, renderCell: (params) => (<span>{params.row.status}</span>) },
        {
            field: 'cancel', headerName: context.counterpart("dashboard.invoicesPage.table.updateStatus"), width: 200, renderCell: (params) => {
                if (params.row.status === 'paid')
                    return (
                        <div style={{ display: 'flex' }}>
                            <Tooltip TransitionProps={{ timeout: 600 }} title={<span>Mark invoice as unpaid</span>} placement="bottom">
                                <div>
                                    <i className={`fa-solid fa-times ${classes.redIcon}`}
                                        onClick={() => updateInvoiceStatus(params.id, 'unpaid')}></i>
                                </div>
                            </Tooltip>
                            <Tooltip TransitionProps={{ timeout: 600 }} title={<span>Cancel invoice</span>} placement="bottom">
                                <div>
                                    <i className={`fa-solid fa-ban ${classes.redIcon}`}
                                        onClick={() => updateInvoiceStatus(params.id, 'canceled')}></i>
                                </div>
                            </Tooltip>
                        </div>
                    )
                if (params.row.status === 'unpaid')
                    return (
                        <div style={{ display: 'flex' }}>
                            <Tooltip TransitionProps={{ timeout: 600 }} title={<span>Mark invoice as paid</span>} placement="bottom">
                                <div>
                                    <i className={`fa-solid fa-check ${classes.checkIcon}`}
                                        onClick={() => updateInvoiceStatus(params.id, 'paid')}></i>
                                </div>
                            </Tooltip>
                            <Tooltip TransitionProps={{ timeout: 600 }} title={<span>Cancel invoice</span>} placement="bottom">
                                <div>
                                    <i className={`fa-solid fa-ban ${classes.redIcon}`}
                                        onClick={() => updateInvoiceStatus(params.id, 'canceled')}></i>
                                </div>
                            </Tooltip>
                        </div>
                    )
                if (params.row.status === 'canceled')
                    return (
                        <div style={{ display: 'flex' }}>
                            <Tooltip TransitionProps={{ timeout: 600 }} title={<span>Mark invoice as paid</span>} placement="bottom">
                                <div>
                                    <i className={`fa-solid fa-check ${classes.checkIcon}`}
                                        onClick={() => updateInvoiceStatus(params.id, 'paid')}></i>
                                </div>
                            </Tooltip>
                            <Tooltip TransitionProps={{ timeout: 600 }} title={<span>Mark invoice as unpaid</span>} placement="bottom">
                                <div>
                                    <i className={`fa-solid fa-times ${classes.redIcon}`}
                                        onClick={() => updateInvoiceStatus(params.id, 'unpaid')}></i>
                                </div>
                            </Tooltip>
                        </div>
                    )
            }
        },
        {
            field: 'download', headerName: context.counterpart("dashboard.invoicesPage.table.download"), width: 200, renderCell: (params) => {
                const onClick = (e) => {
                    e.stopPropagation();
                    downloadInvoiceHandler(params.row.ref)
                };
                return <Download style={{ color: "#DE4452", cursor: "pointer" }} onClick={onClick} />
            }
        },
        {
            field: 'download-receipt', headerName: context.counterpart("dashboard.invoicesPage.table.receipt"), width: 200, renderCell: (params) => {
                const onClick = (e) => {
                    e.stopPropagation();
                    downloadReceiptHandler(params.row.ref)
                };
                if (params.row.status === 'paid')
                    return <Download style={{ color: "#DE4452", cursor: "pointer" }} onClick={onClick} />
                return null
            }
        }
    ];

    useEffect(() => {
        context.setIsGlobal(true)
        axios.get("/admin/user/all")
            .then(res => {
                setUsers(res.data.result)
            })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    const searchInvoiceHandler = () => {
        if (userEmail) {
            setLoadingSearch(true)
            if (invoiceDetails.from && invoiceDetails.to)
                axios.get(`/admin/invoice/${userEmail}?from=${invoiceDetails.from}&to=${invoiceDetails.to}`)
                    .then(res => {
                        setInvoices(res.data)
                        setLoadingSearch(false)
                    })
                    .catch(() => {
                        setLoadingSearch(false)
                    })
            else
                axios.get(`/admin/invoice/${userEmail}`)
                    .then(res => {
                        setInvoices(res.data)
                        setLoadingSearch(false)
                    })
                    .catch(() => {
                        setLoadingSearch(false)
                    })
        }
    }

    const downloadInvoiceHandler = (invoiceId) => {
        axios.post(`/admin/invoice/${invoiceId}/download`, { email: userEmail }).then((res) => {
            const byteCharacters = atob(res.data.blob.toString("base64"));
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const pdfBlob = new Blob([byteArray], { type: 'application/pdf' });
            saveAs(pdfBlob, res.data.file_name);

        })
    }

    const downloadReceiptHandler = (invoiceId) => {
        axios.post(`/admin/receipt/${invoiceId}/download`, { email: userEmail }).then((res) => {
            const byteCharacters = atob(res.data.blob.toString("base64"));
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const pdfBlob = new Blob([byteArray], { type: 'application/pdf' });
            saveAs(pdfBlob, res.data.file_name);
        })
    }
    const updateInvoiceStatus = (invoiceId, status) => {
        axios.patch(`/admin/invoice/${invoiceId}`, { status: status })
            .then(res => {
                const invoiceIndex = invoices.findIndex(invoice => invoice.id === invoiceId)
                const _invoices = [...invoices]
                _invoices[invoiceIndex].status = status;
                setInvoices(_invoices)
            })
    }
    return (

        <Container fluid style={{ padding: "5px 20px 20px 20px", marginTop: "20px" }} >
            <Row>
                <Col className="formContainer" style={{backgroundColor: colors.formBackground[_mode]}}>
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
                    <Row style={{ marginTop: "30px", marginBottom: "30px", marginRight: "0", marginLeft: "0" }}>
                        <Col md="6" xs="12" >
                            <Row style={{ marginBottom: '10px' }}>
                                <Col>
                                    <h4 className="subtitleStyle">
                                        <Translate content="dashboard.invoicesPage.inputs.startDate.title" />
                                        <span style={{ marginLeft: "2px", color: "red" }}>*</span></h4>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            inputFormat="yyyy/MM/dd"
                                            label="start"
                                            value={invoiceDetails.from}
                                            onChange={(newValue) => setInvoiceDetails({ ...invoiceDetails, from: formateDate(newValue) })}
                                            renderInput={(params) => (
                                                <TextField {...params} helperText={params?.inputProps?.placeholder} sx={{ width: '100%' }} />
                                            )}

                                        />
                                    </LocalizationProvider>
                                </Col>
                            </Row>
                        </Col>
                        <Col md="6" xs="12" >
                            <Row style={{ marginBottom: '10px' }} >
                                <Col>
                                    <h4 className="subtitleStyle">
                                        <Translate content="dashboard.invoicesPage.inputs.startDate.title" />
                                        <span style={{ marginLeft: "2px", color: "red" }}>*</span></h4>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            inputFormat="yyyy/MM/dd"
                                            label="end"
                                            value={invoiceDetails.to}
                                            onChange={(newValue) => setInvoiceDetails({ ...invoiceDetails, to: formateDate(newValue) })}
                                            renderInput={(params) => (
                                                <TextField {...params} helperText={params?.inputProps?.placeholder} sx={{ width: '100%' }} />
                                            )}
                                        />
                                    </LocalizationProvider>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <LoadingButton icon="fa-solid fa-magnifying-glass" loading={loadingSearch} className={classes.buttonStyle} onClick={searchInvoiceHandler} >
                                <Translate content="common.button.search" />

                            </LoadingButton>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row style={{ marginTop: '20px' }}>
                <Col>
                    <DataTable
                        columns={columns}
                        rows={invoices} />
                </Col>
            </Row>
        </Container>
    )
}
export default AdminInvoicesOverview

