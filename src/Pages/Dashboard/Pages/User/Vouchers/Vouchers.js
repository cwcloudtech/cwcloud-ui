import { useContext, useState, useEffect } from "react"
import { Row, Col } from "reactstrap"
import classes from "./Vouchers.module.css"
import CardComponent from "../../../../../Components/Cards/CardComponent/CardComponent"
import { Link, useNavigate } from "react-router-dom"
import axios from "../../../../../utils/axios"
import GlobalContext from "../../../../../Context/GlobalContext";
import colors from "../../../../../Context/Colors"
import Tooltip from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Translate from "react-translate-component"
import DataTable from "../../../../../Components/Table/DataTable"
import formateDate from "../../../../../utils/FormateDate"
import AddVoucherModal from "./AddVoucherModal/AddVoucherModal"
import { toast } from "react-toastify"

const Vouchers = (props) => {
    const _mode = useContext(GlobalContext).mode;
    const [vouchers, setVouchers] = useState([]);
    const { counterpart, setIsGlobal } = useContext(GlobalContext)
    const [loading, setLoading] = useState(false)
    const [showAddVoucherModal, setShowAddVoucherModal] = useState(false)
    const navigate = useNavigate()
    const priceUnit = process.env.REACT_APP_PRICE_UNIT === null ? "" : process.env.REACT_APP_PRICE_UNIT;
    const columns = [
        { field: 'id', headerName: counterpart("dashboard.adminVouchersPage.table.id"), width: 200, renderCell: (params) => (<Link to={`/admin/instance/${params.id}`}>{params.id}</Link>) },
        { field: 'created_at', headerName: counterpart("dashboard.adminVouchersPage.table.created"), width: 200, renderCell: (params) => (formateDate(params.row.created_at)) },
        { field: 'code', headerName: counterpart("dashboard.adminVouchersPage.table.code"), width: 200 },
        { field: 'credit', headerName: counterpart("dashboard.adminVouchersPage.table.price"), width: 100, renderCell: (params) => <span>{`${params.row.credit === null ? params.row.credit : params.row.credit} ${priceUnit}`}</span> },
        { field: 'validity', headerName: counterpart("dashboard.adminVouchersPage.table.validity"), width: 100, renderCell: (params) => <span>{`${params.row.validity} Days`}</span> },
    ];

    useEffect(() => {
        setIsGlobal(true)
        axios.get(`/voucher`)
            .then(res => {
                setVouchers(res.data)
            }).catch(err => {
                navigate('/notfound')
            })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const registerVoucherHandler = (code) => {
        setLoading(true)
        axios.post('/voucher', { code: code })
            .then(res => {
                setLoading(false)
                setShowAddVoucherModal(false)
                toast.success("Voucher sucessfully added")
                setVouchers([...vouchers, { ...res.data, credit: res.data.price }])
            })
            .catch(err => {
                setLoading(false)
            })
    }

    return (
        <CardComponent
            containerStyles={props.containerStyles}
            title={counterpart('dashboard.adminVouchersPage.title')}
            subtitle={counterpart('dashboard.adminVouchersPage.description')}
            link={counterpart('dashboard.adminVouchersPage.learnMore')}>
            <AddVoucherModal isOpen={showAddVoucherModal} toggle={() => setShowAddVoucherModal(!showAddVoucherModal)} onSave={registerVoucherHandler} loading={loading} />
            <Row>
                <Col>
                    <div className={classes.instanceCreation}>
                        <h5 className={[classes.itemTitle].join(" ")} style={{color: colors.title[_mode]}}>
                            <Translate content="dashboard.adminVouchersPage.add" />
                        </h5>
                        <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} title={
                            <h5 className={classes.tootltipValue}>
                                <Translate content="dashboard.adminVouchersPage.add" />
                            </h5>}
                            placement="left">
                            <Fab color="primary" aria-label="add" onClick={() => setShowAddVoucherModal(true)} style={{ transform: 'scale(0.7)' }} >
                                <AddIcon className="whiteIcon" />
                            </Fab>
                        </Tooltip>
                    </div>
                </Col>
            </Row>
            <DataTable
                icon={'fa-solid fa-ticket'}
                columns={columns}
                rows={vouchers} />
        </CardComponent>
    );
}

export default Vouchers;
