import React, { useContext, useState, useEffect } from 'react';
import { Col, Row, Container, Spinner } from "reactstrap"
import classes from "./Invoices.module.css"
import axios from "../../../../../../../utils/axios";
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { saveAs } from 'file-saver';
import { Download } from "@mui/icons-material";
import Translate from 'react-translate-component';
import GlobalContext from '../../../../../../../Context/GlobalContext';
import colors from '../../../../../../../Context/Colors';
import LoadingButton from '../../../../../../../Components/LoadingButton/LoadingButton';
import DataTable from '../../../../../../../Components/Table/DataTable';
import ConfirmPaymentModal from './ConfirmPaymentModal/ConfirmPaymentModal';
import formateDate from '../../../../../../../utils/FormateDate';

function Invoices(props) {
    const _mode = useContext(GlobalContext).mode;
    const [invoiceDetails, setInvoiceDetails] = useState({
        from: null,
        to: null
    });
    const { counterpart } = React.useContext(GlobalContext)
    const [vouchers, setVouchers] = useState([]);
    const [showConfirmPayModal, setShowConfirmPayModal] = useState(false)
    const [selectedInvoiceRef, setSelectedInvoiceRef] = useState(null)
    const [loadingDownload, setLoadingDownload] = useState(null)
    const [loadingDownloadReceipt, setLoadingDownloadReceipt] = useState(null)
    const priceUnit = process.env.REACT_APP_PRICE_UNIT === null ? "" : process.env.REACT_APP_PRICE_UNIT;

    const columns = [
        { field: 'ref', headerName: counterpart("dashboard.invoicesPage.table.reference"), width: 150 },
        { field: 'date_created', headerName: counterpart("dashboard.invoicesPage.table.date"), width: 150 },
        { field: 'period', headerName: counterpart("dashboard.invoicesPage.table.period"), width: 200, renderCell: (params) => { return <span>{params.row.from_date} - {params.row.to_date}</span> } },
        {
            field: 'status', headerName: counterpart("dashboard.invoicesPage.table.status"), width: 150, renderCell: (params) => {
                if (params.row.status === "paid")
                    return (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ borderRadius: '50%', background: '#22C8A2', height: '15px', width: '15px', marginRight: '10px' }}></div>
                            <h5 style={{ fontSize: '10px', margin: '0' }}>paid</h5>
                        </div>
                    )
                if (params.row.status === 'unpaid')
                    return (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ borderRadius: '50%', background: '#FF8D69', height: '15px', width: '15px', marginRight: '10px' }}></div>
                            <h5 style={{ fontSize: '10px', margin: '0' }}> not paid</h5>
                        </div>
                    )
                return (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ borderRadius: '50%', background: 'red', height: '15px', width: '15px', marginRight: '10px' }}></div>
                        <h5 style={{ fontSize: '10px', margin: '0' }}> canceled</h5>
                    </div>
                )
            }
        },
        { field: 'total_price', headerName: counterpart("dashboard.invoicesPage.table.totalPrice"), width: 100, renderCell: (params) => (`${params.row.total_price === null ? "" : params.row.total_price} ${priceUnit}`) },
        {
            field: 'download', headerName: counterpart("dashboard.invoicesPage.table.download"), width: 100, renderCell: (params) => {
                const onClick = (e) => {
                    e.stopPropagation();
                    downloadInvoiceHandler(params.row.ref)
                };
                return loadingDownload && loadingDownload === params.row.ref ? <Spinner style={{ color: 'red', height: '20px', width: '20px' }} color='red' /> : <Download style={{ color: "#DE4452", cursor: "pointer" }} onClick={onClick} />
            }
        },
        {
            field: 'receipt', headerName: counterpart("dashboard.invoicesPage.table.receipt"), width: 100, renderCell: (params) => {
                const onClick = (e) => {
                    e.stopPropagation();
                    downloadReceiptHandler(params.row.ref)
                };
                if (params.row.status === 'paid')
                    return loadingDownloadReceipt && loadingDownloadReceipt === params.row.ref ? <Spinner style={{ color: 'red', height: '20px', width: '20px' }} color='red' /> : <Download style={{ color: "#DE4452", cursor: "pointer" }} onClick={onClick} />
                return '-'
            }
        },
        {
            field: 'pay', headerName: counterpart("dashboard.invoicesPage.table.pay"), width: 200, renderCell: (params) => {
                if (params.row.status === 'unpaid'
                    && process.env.REACT_APP_DISABLE_PAYMENT_BUTTON.includes("false"))
                    return (
                        <LoadingButton loading={props.loadingPaymentInvoice === params.row.ref} onClick={() => prePayInvoiceHandler(params.row.ref)}>Pay</LoadingButton>
                    )
                return '-'
            }
        },
    ];

    useEffect(() => {
        axios.get(`/voucher`)
            .then(res => {
                const filteredVouchers = res.data.filter(voucher => voucher.credit > 0)
                setVouchers(filteredVouchers)
            })
    }, [])

    useEffect(() => {
        if (invoiceDetails.from && invoiceDetails.to) {
            axios.get(`/invoice?from=${invoiceDetails.from}&to=${invoiceDetails.to}`)
                .then(res => {
                    props.setInvoices(res.data.map(i => ({ ...i })))
                })
        }
    }, [invoiceDetails, props])

    const prePayInvoiceHandler = (invoiceRef) => {
        setSelectedInvoiceRef(invoiceRef)
        setShowConfirmPayModal(true)
    }

    const downloadInvoiceHandler = (invoiceRef) => {
        setLoadingDownload(invoiceRef)
        axios.get(`/invoice/${invoiceRef}/download`).then((res) => {
            const byteCharacters = atob(res.data.blob.toString("base64"));
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const pdfBlob = new Blob([byteArray], { type: 'application/pdf' });
            saveAs(pdfBlob, res.data.file_name);
            setLoadingDownload(null)

        })
    }

    const downloadReceiptHandler = (invoiceRef) => {
        setLoadingDownloadReceipt(invoiceRef)
        axios.get(`/receipt/${invoiceRef}/download`).then((res) => {
            const byteCharacters = atob(res.data.blob.toString("base64"));
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const pdfBlob = new Blob([byteArray], { type: 'application/pdf' });
            saveAs(pdfBlob, res.data.file_name);
            setLoadingDownloadReceipt(null)
        })
    }

    return (
        <Container fluid className={classes.container} style={{ padding: "5px 20px 20px 20px", marginTop: "20px" }} >
            <ConfirmPaymentModal vouchers={vouchers} resourceName="common.payment" isOpen={showConfirmPayModal} toggle={() => setShowConfirmPayModal(!showConfirmPayModal)} onConfirm={(voucherId) => { props.payInvoice(selectedInvoiceRef, voucherId); setShowConfirmPayModal(false) }} message={`Are you sure you want to pay invoice N ${selectedInvoiceRef}`} />
            <Row>
                <Col className={classes.formContainer} style={{backgroundColor: colors.formBackground[_mode]}}>
                    <Row style={{ marginTop: "30px", marginBottom: "30px" }}>
                        <Col md="6" xs="12" >
                            <Row style={{ marginBottom: '10px' }}>
                                <Col>
                                    <h4 className={classes.subtitleStyle}>
                                        <Translate content="dashboard.invoicesPage.inputs.startDate.title" />
                                        <span style={{ marginLeft: "2px", color: "red" }}>*</span></h4>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            inputFormat="yyyy/MM/dd"
                                            label={counterpart("dashboard.invoicesPage.inputs.startDate.placeholder")}
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
                                    <h4 className={classes.subtitleStyle}>
                                        <Translate content="dashboard.invoicesPage.inputs.endDate.title" />
                                        <span style={{ marginLeft: "2px", color: "red" }}>*</span></h4>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            inputFormat="yyyy/MM/dd"
                                            label={counterpart("dashboard.invoicesPage.inputs.endDate.placeholder")}
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
                </Col>
            </Row>
            <Row style={{ marginTop: '20px' }}>
                <Col>
                    <DataTable
                        columns={columns}
                        rows={props.invoices} />
                </Col>
            </Row>
        </Container>
    )
}
export default Invoices

