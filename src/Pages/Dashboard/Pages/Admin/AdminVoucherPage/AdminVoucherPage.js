import { useEffect, useState, useContext } from 'react';
import { Container } from 'reactstrap';
import classes from "./AdminVoucherPage.module.css";
import { Row, Col, Button } from "reactstrap";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import axios from "../../../../../utils/axios";
import { toast } from 'react-toastify';
import DeleteModal from '../../../../../Components/Modal/DeleteModal';
import GlobalContext from '../../../../../Context/GlobalContext';
import Skeleton from 'react-loading-skeleton';
import Translate from 'react-translate-component';
import colors from '../../../../../Context/Colors';

function AdminVoucherPage() {
    const { voucherId } = useParams()
    const [voucher, setVoucher] = useState({})
    const [loading, setloading] = useState(true)
    const [loadingRequest, setloadingRequest] = useState(false)
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false)
    const context = useContext(GlobalContext);
    const _mode = context.mode;
    const navigate = useNavigate();
    const priceUnit = process.env.REACT_APP_PRICE_UNIT;

    useEffect(() => {
        context.setIsGlobal(true)
        axios.get(`/admin/voucher/${voucherId}`)
            .then(res => {
                setVoucher(res.data)
                setloading(false)
            })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onPreDeleteHandler = () => {
        setShowConfirmDeleteModal(true)
    }

    const onDeleteHandler = () => {
        setloadingRequest(true)
        axios.delete(`/admin/instance/${voucher.id}`).then(response => {
            toast.success(context.counterpart('dashboard.adminVouchersPage.message.successDelete'))
            setShowConfirmDeleteModal(false)
            setloadingRequest(false)
            navigate('/admin/voucher')
        }).catch(err => {
            setShowConfirmDeleteModal(false)
            setloadingRequest(false)
        })
    }

    return (
        <div>
            <DeleteModal resourceName="instance" isOpen={showConfirmDeleteModal} toggle={() => setShowConfirmDeleteModal(!showConfirmDeleteModal)} onDelete={onDeleteHandler} name={voucher?.code} loading={loadingRequest} />
            <div className={classes.goBack} >
                <NavLink to='/admin/vouchers' className={classes.link} style={{color: colors.blue[_mode]}}>
                    <i className={["fa-solid fa-arrow-left", `${classes.iconStyle}`].join(" ")} style={{color: colors.blue[_mode]}}></i>
                    <Translate content="dashboard.adminVouchersPage.back" />
                </NavLink>
            </div>
            <div className={classes.row}>
                <Row>
                    <Col className={classes.colinline} >
                        <i className={["fa-solid fa-ticket", classes.iconProcessStyle].join(' ')} style={{color: colors.blue[_mode]}}></i>
                        <div style={{ marginLeft: "20px" }}>
                            <h6 style={{color: colors.mainText[_mode]}}>{
                                !loading ? voucher?.code
                                    :
                                    <Skeleton width={150} />
                            }</h6>
                        </div>
                    </Col>
                </Row>
            </div>
            <Row className={classes.blocMargin}>
                <Container className={classes.container} style={{backgroundColor: colors.secondBackground[_mode], border: '1px solid '+colors.border[_mode]}} fluid>
                    <Row style={{ marginLeft: "15px", marginRight: "15px" }}>
                        <Col xs="12" md="3" className={classes.row}>
                            <h5 className={classes.textStyle} style={{color: colors.mainText[_mode]}}><Translate content="dashboard.adminVouchersPage.table.id" />:</h5>
                            <h6 className={classes.colInlineValue} style={{color: colors.smallTitle[_mode]}}>{
                                !loading ? voucher.id
                                    :
                                    <Skeleton />
                            }</h6>
                        </Col>
                        <Col xs="12" md="3" className={classes.row}>
                            <h5 className={classes.textStyle} style={{color: colors.mainText[_mode]}}><Translate content="dashboard.adminVouchersPage.table.validity" />:</h5>
                            <h6 className={classes.colInlineValue} style={{color: colors.smallTitle[_mode]}}>{
                                !loading ?
                                    voucher.validity
                                    :
                                    <Skeleton />
                            }</h6>
                        </Col>
                        {!loading && voucher.user_id !== 0 && <Col xs="12" md="3" className={classes.row}>
                            <h5 className={classes.textStyle} style={{color: colors.mainText[_mode]}}><Translate content="dashboard.adminVouchersPage.table.user" />:</h5>
                            <h6 className={classes.colInlineValue} style={{color: colors.smallTitle[_mode]}}>{
                                !loading ?
                                    <Link to={`/user/${voucher.user_id}`}>{voucher.user_id}</Link>
                                    :
                                    <Skeleton />
                            }</h6>
                        </Col>}
                    </Row>
                    <Row>
                        <Col>
                            <hr className={classes.separator} ></hr>
                        </Col>
                    </Row>
                    <Row style={{ marginLeft: "15px", marginRight: "15px" }}>
                        <Col xs="12" md="3" className={classes.row}>
                            <div className={classes.colinline}>
                                <h5 className={classes.textStyle} style={{color: colors.mainText[_mode]}}><Translate content="dashboard.adminVouchersPage.table.price" />: </h5>
                                <h6 className={classes.colInlineValue} style={{color: colors.smallTitle[_mode]}}>{!loading ? `${voucher.price} ${priceUnit}` : <Skeleton width={100} />}</h6>
                            </div>
                        </Col>
                        {!loading && voucher.user_id !== 0 && <Col xs="12" md="3" className={classes.row}>
                            <div className={classes.colinline}>
                                <h5 className={classes.textStyle} style={{color: colors.mainText[_mode]}}><Translate content="dashboard.adminVouchersPage.table.credit" />: </h5>
                                <h6 className={classes.colInlineValue} style={{color: colors.smallTitle[_mode]}}>{!loading ? `${voucher.credit} ${priceUnit}` : <Skeleton width={100} />}</h6>
                            </div>
                        </Col>}
                    </Row>
                </Container>
            </Row >
            {!loading && <Row className={classes.blocMargin}>
                <h2 className={classes.titleStyle} style={{color: colors.mainText[_mode]}}><Translate content="dashboard.adminVouchersPage.deleteTitle" /></h2>
                <Container className={classes.container} style={{backgroundColor: colors.secondBackground[_mode], border: '1px solid '+colors.border[_mode]}} fluid>
                    <Row style={{ marginLeft: "15px", marginRight: "15px" }}>
                        <Col xs="12" sm="12" md="9" className={classes.rowD}>
                            <h6 className={classes.test} style={{color: colors.mainText[_mode]}}>
                                <span style={{ color: "#DF4D7A", fontWeight: "bold" }}><Translate content="dashboard.adminVouchersPage.warning" />! </span>
                                <Translate content="dashboard.adminVouchersPage.deleteDescription" />
                            </h6>
                        </Col>
                        <Col xs="12" sm="12" md="3" className={classes.rowD}>
                            <Button color="danger" outline style={{ display: "flex", justifyContent: "center", alignItems: "center", whiteSpace: "nowrap", height: "100%" }} onClick={onPreDeleteHandler}>
                                <i className="fa-solid fa-trash-can" style={{ marginRight: "8px" }}></i>
                                <h6 style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "0" }}>
                                    <Translate content="common.button.delete" />
                                </h6>
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </Row>
            }
        </div >
    )
}

export default AdminVoucherPage