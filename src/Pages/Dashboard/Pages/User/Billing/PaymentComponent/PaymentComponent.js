import { useContext, useState, useEffect, Fragment } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import axios from '../../../../../../utils/axios';
import { isBlank } from '../../../../../../utils/common';
import GlobalContext from '../../../../../../Context/GlobalContext';
import colors from '../../../../../../Context/Colors';
import { Col, Container, Row } from 'reactstrap';
import Translate from "react-translate-component";
import classes from './PaymentComponent.module.css';
import DataTable from '../../../../../../Components/DataTable/DataTable';
import LoadingButton from '../../../../../../Components/LoadingButton/LoadingButton';
import PaymentInfoModal from './PaymentInfoModal/PaymentInfoModal';
import { toast } from 'react-toastify';
import Invoices from './Invoices/Invoices';
import Checkbox from '@mui/material/Checkbox';
import CustomDeleteIcon from '../../../../../../Components/CustomDeleteIcon/CustomDeleteIcon';
import DeleteModal from '../../../../../../Components/DeleteModal/DeleteModal';
import { Tooltip } from '@mui/material';
import { saveAs } from 'file-saver';

function PaymentComponent() {
    const context = useContext(GlobalContext);
    const _mode = context.mode;
    const [paymentMethods, setPaymentMethods] = useState([])
    const [cards, setCards] = useState([])
    const [showPaymentInfoModal, setShowPaymentInfoModal] = useState(false)
    const [loadingSubmitCard, setLoadingSubmitCard] = useState(false)
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false)
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null)
    const [loadingDeletion, setLoadingDeletion] = useState(false)
    const [loadingPaymentInvoice, setLoadingPaymentInvoice] = useState(null)
    const [invoices, setInvoices] = useState([])
    const [iframeSrc, setIframeSrc] = useState('');
    const stripe = useStripe();
    const elements = useElements();

    useEffect(() => {
        context.setIsGlobal(true)
        axios.get('/invoice')
            .then(res => {
                setInvoices(res.data)
            })
        axios.get('/user/payment-method')
            .then(res => {
                if (res.data && res.data.payment_method) {
                    setPaymentMethods(res.data.payment_method.data)
                }
            })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (paymentMethods) {
            setCards([...paymentMethods.map(pm => ({ id: pm.id, card: `************ ${pm.card.last4}`, brand: pm.card.brand, expiration: `${pm.card.exp_month}/${pm.card.exp_year}` }))])
        }
    }, [paymentMethods])

    const columns = [
        {
            field: 'default', headerName: 'Default Card', width: 200, renderCell: (params) => {
                return (
                    <Checkbox
                        color="primary"
                        checked={params.id === context.user.st_payment_method_id}
                        inputProps={{ 'aria-label': 'controlled' }}
                        onChange={(e) => updateDefaultCardHandler(params.id)} />
                )
            }
        },
        { field: 'card', headerName: 'Card', width: 250 },
        { field: 'brand', headerName: 'Brand', width: 200 },
        { field: 'expiration', headerName: 'Expiration', width: 200 },
        {
            field: 'delete', headerName: 'Delete', width: 200, renderCell: (params) => {
                return <CustomDeleteIcon onClick={() => preDeletePaymentMethodHandler(params.id)} />
            }
        },
    ];

    const updateDefaultCardHandler = (paymentMethodId) => {
        axios.patch(`/user/payment-method/${paymentMethodId}`)
            .then(() => {
                context.setUser({ ...context.user, st_payment_method_id: paymentMethodId })
            })
    }

    const preDeletePaymentMethodHandler = (paymentMethodId) => {
        setSelectedPaymentMethod(paymentMethodId)
        setShowConfirmDeleteModal(true)
    }

    const deletePaymentMethodHandler = async () => {
        setLoadingDeletion(true)
        axios.delete(`/user/payment-method/${selectedPaymentMethod}`)
            .then(res => {
                setPaymentMethods([...paymentMethods.filter(pm => pm.id !== selectedPaymentMethod)])
                setLoadingDeletion(false)
                toast.success(context.counterpart('billing.card.deleted'))
                setShowConfirmDeleteModal(false)
            })
            .catch(err => {
                setLoadingDeletion(false)
            })
    }

    const updateUserAutoPaymentHandler = (status) => {
        axios.patch('/user/payment/auto-payment', { status: status })
            .then(res => {
                context.setUser({ ...context.user,
                    enabled_features: {
                        ...context.enabled_features,
                        auto_pay: status
                    }
                })
            })
    }

    const addUserPaymentMethodHandler = async () => {
        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            return;
        }
        setLoadingSubmitCard(true)
        const result_payment_method = await stripe.createPaymentMethod({
            type: "card",
            card: elements.getElement(CardElement),
            billing_details: {
                email: context.user.email
            }
        })
        if (result_payment_method.error) {
            toast.error(context.counterpart(`error_codes.${result_payment_method.error.code}`))
            setLoadingSubmitCard(false)
        } else {
            axios.post('/user/payment-method', { payment_method: result_payment_method.paymentMethod.id })
                .then(() => {
                    if (isBlank(context.user.st_payment_method_id)) {
                        context.setUser({ ...context.user, st_payment_method_id: result_payment_method.paymentMethod.id })
                    }

                    setPaymentMethods([result_payment_method.paymentMethod, ...paymentMethods])
                    toast.success(context.counterpart('billing.card.added'))
                    setLoadingSubmitCard(false)
                    setShowPaymentInfoModal(false)

                })
                .catch(err => {
                    setLoadingSubmitCard(false)
                })
        }

    }

    const payInvoiceHandler = (invoiceRef, voucherId) => {
        setLoadingPaymentInvoice(invoiceRef)
        const selectedVoucher = voucherId === "none" ? null : voucherId
        axios.post('/pay', { invoice_id: invoiceRef, voucher_id: selectedVoucher })
            .then((res) => {
                const byteCharacters = atob(res.data.blob.toString("base64"));
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const pdfBlob = new Blob([byteArray], { type: 'application/pdf' });
                saveAs(pdfBlob, res.data.file_name);
                if (!res.data.client_secret) {
                    const invoiceIndex = invoices.findIndex(i => i.ref === invoiceRef)
                    const _invoices = [...invoices]
                    _invoices[invoiceIndex].status = 'paid'
                    setInvoices([..._invoices])
                    return setLoadingPaymentInvoice(null)
                }
                const partner = res.data.partner
                const clientSecret = res.data.client_secret

                if (partner === "stripe") {
                    const paymentMethodId = res.data.payment_method
                    stripe.confirmCardPayment(clientSecret, {
                        payment_method: paymentMethodId,
                    }).then(result => {
                        if (result.error) {
                            toast.error(result.error.message)
                            setLoadingPaymentInvoice(null)
                        } else {
                            if (result.paymentIntent.status === "succeeded") {
                                const invoiceIndex = invoices.findIndex(i => i.ref === invoiceRef)
                                const _invoices = [...invoices]
                                _invoices[invoiceIndex].status = 'paid'

                                setInvoices([..._invoices])
                                setLoadingPaymentInvoice(null)
                            } else {
                                toast.error(`Payment failed with status ${result.paymentIntent.status}`)
                            }
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
                }
            })
            .catch(err => {
                setLoadingPaymentInvoice(null)
            })
    }
    return (
        <Container fluid className={classes.container} style={{ padding: "0px 20px 20px 20px", }} >
            <DeleteModal resourceName={'payment card'} isOpen={showConfirmDeleteModal} toggle={() => setShowConfirmDeleteModal(!showConfirmDeleteModal)} onDelete={deletePaymentMethodHandler} loading={loadingDeletion} />
            <PaymentInfoModal loading={loadingSubmitCard} isOpen={showPaymentInfoModal} onSave={addUserPaymentMethodHandler} toggle={() => setShowPaymentInfoModal(!showPaymentInfoModal)} />
            {context.user.enabled_features.auto_pay ?
                <div className={classes.colElement}>
                    <Tooltip title="disable auto payment" placement="bottom">
                        <i className={["fa-solid fa-toggle-on", classes.toggleOn].join(' ')} onClick={() => updateUserAutoPaymentHandler(false)}></i>
                    </Tooltip>
                </div>
                :
                <div className={classes.colElement}>
                    <Tooltip title="activate auto payment" placement='bottom' onClick={() => updateUserAutoPaymentHandler(true)}>
                        <i className={["fa-solid fa-toggle-off", classes.toggleOff].join(' ')}></i>
                    </Tooltip>
                </div>
            }
            {process.env.REACT_APP_DISABLE_STRIPE_FEATURE.includes("false") && <Fragment>
                <Row style={{ marginTop: '10px', marginBottom: '10px' }}>
                    <Col>
                        <h2 className={classes.mainTitleText} style={{color: colors.title[_mode]}}>
                            <Translate content="billing.method" />
                        </h2>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <DataTable
                            columns={columns}
                            rows={cards} />
                    </Col>
                </Row>
                <Row style={{ marginTop: '10px' }}>
                    <Col style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <LoadingButton style={{ width: '200px' }} onClick={() => setShowPaymentInfoModal(true)}>
                            <Translate content="billing.add" />
                        </LoadingButton>
                    </Col>
                </Row>
            </Fragment>}

            {iframeSrc &&
                <Fragment>
                    <Row style={{ marginTop: '10px', marginBottom: '10px' }}>
                        <Col>
                            <h2 className={classes.mainTitleText} style={{color: colors.title[_mode]}}>
                                <Translate content="billing.gateway" />
                            </h2>
                        </Col>
                    </Row>
                    <Row>
                        <Col><iframe src={iframeSrc} title="Billing iframe" style={{ width: "100%", minHeight: "500px", borderRadius: "8px" }} /></Col>
                    </Row>
                </Fragment>
            }

            <Row style={{ marginTop: '10px', marginBottom: '10px' }}>
                <Col>
                    <h2 className={classes.mainTitleText} style={{color: colors.title[_mode]}}>
                        <Translate content="billing.invoices" />
                    </h2>
                </Col>
            </Row>
            <Row style={{ marginTop: '10px', marginBottom: '10px' }}>
                <Col>
                    <Invoices
                        invoices={invoices}
                        setInvoices={setInvoices}
                        loadingPaymentInvoice={loadingPaymentInvoice}
                        payInvoice={payInvoiceHandler} />
                </Col>
            </Row>
        </Container>
    );
}

export default PaymentComponent;