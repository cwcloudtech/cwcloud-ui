import { useContext, useState, useEffect } from "react";
import { Row, Col } from "reactstrap";
// import classes from "./AdminVouchersPage.module.css";
import '../../../../../common.css';
import CardComponent from "../../../../../Components/Cards/CardComponent/CardComponent";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../../../../utils/axios";
import GlobalContext from "../../../../../Context/GlobalContext";
import Tooltip from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Translate from "react-translate-component";
import DeleteModal from "../../../../../Components/Modal/DeleteModal";
import { toast } from 'react-toastify';
import DataTable from "../../../../../Components/Table/DataTable";
import formateDate from "../../../../../utils/FormateDate";
import filteredListWithoutRemovedElement from "../../../../../utils/filter";
import CustomDeleteIcon from "../../../../../Components/CustomIcon/CustomDeleteIcon";
import colors from "../../../../../Context/Colors";

const AdminVouchersPage = (props) => {
    const context = useContext(GlobalContext);
    const _mode = context.mode;
    const [vouchers, setVouchers] = useState([]);
    const [oldVouchers, setOldVouchers] = useState([]);
    const [activeVouchers, setActiveVouchers] = useState([]);
    const { counterpart, setIsGlobal } = useContext(GlobalContext)
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false)
    const [selectedDeletionItems, setSelectedDeletionItems] = useState([])
    const [selectedVoucher, setSelectedVoucher] = useState(null)
    const [loading, setLoading] = useState(true)
    const [multiSelection, setMultiSelection] = useState(false)
    const [isActiveVoucher, setIsActiveVoucher] = useState(true)
    const priceUnit = process.env.REACT_APP_PRICE_UNIT === null ? "" : process.env.REACT_APP_PRICE_UNIT;

    const navigate = useNavigate()

    const columns = [
        { field: 'id', headerName: counterpart("dashboard.adminVouchersPage.table.id"), width: 200, renderCell: (params) => (<Link to={`/admin/voucher/${params.id}`}>{params.id}</Link>) },
        { field: 'created_at', headerName: counterpart("dashboard.adminVouchersPage.table.created"), width: 200, renderCell: (params) => (formateDate(params.row.created_at)) },
        { field: 'code', headerName: counterpart("dashboard.adminVouchersPage.table.code"), width: 200 },
        { field: 'user_id', headerName: counterpart("dashboard.adminVouchersPage.table.user"), width: 100 },
        { field: 'price', headerName: counterpart("dashboard.adminVouchersPage.table.price"), width: 100, renderCell: (params) => <span>{`${params.row.price === null ? "" : params.row.price } ${priceUnit}`}</span> },
        { field: 'credit', headerName: counterpart("dashboard.adminVouchersPage.table.credit"), width: 100, renderCell: (params) => <span>{`${params.row.user_id === 0 ? '-' : ` ${params.row.credit === null ? "" : params.row.credit } ${priceUnit}`}`}</span> },
        { field: 'validity', headerName: counterpart("dashboard.adminVouchersPage.table.validity"), width: 100, renderCell: (params) => <span>{`${params.row.validity} Days`}</span> },
        {
            field: 'action', headerName: counterpart("dashboard.adminVouchersPage.table.actions"), width: 100, renderCell: (params) => {
                const onClick = (e) => {
                    e.stopPropagation();
                    onPreDeleteHandler(params.id)
                };
                return <CustomDeleteIcon onClick={onClick} />
            }
        }
    ];

    useEffect(() => {
        setIsGlobal(true)
        axios.get(`/admin/voucher`)
            .then(res => {
                setActiveVouchers(res.data.activeVouchers)
                setOldVouchers(res.data.oldVouchers)
            }).catch(err => {
                navigate('/notfound')
            })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showConfirmDeleteModal])

    useEffect(() => {
        if (activeVouchers && oldVouchers) {
            if (isActiveVoucher)
                setVouchers(activeVouchers)
            else
                setVouchers(oldVouchers)
            setLoading(false)
        }
    }, [activeVouchers, oldVouchers, isActiveVoucher])



    const onPreDeleteHandler = (voucherId) => {
        setMultiSelection(false)

        const voucherIndex = vouchers.findIndex(p => p.id === voucherId)
        setSelectedVoucher(vouchers[voucherIndex])
        setShowConfirmDeleteModal(true)
    }

    const deleteVoucherHandler = () => {
        setLoading(true)
        axios.delete(`/admin/voucher/${selectedVoucher.id}`).then(response => {
            setVouchers(filteredListWithoutRemovedElement(selectedVoucher.id, vouchers))
            toast.success(counterpart('dashboard.adminVouchersPage.message.successDelete'))
            setShowConfirmDeleteModal(false)
            setLoading(false)
        }).catch(err => {
            console.log(err)
            setShowConfirmDeleteModal(false)
            setLoading(false)

        })
    }

    const preDeleteSelectionHandler = (selectedItems) => {
        setMultiSelection(true)
        setShowConfirmDeleteModal(true)
        setSelectedDeletionItems(selectedItems)

    }

    const deleteVouchersHandler = async () => {
        setLoading(true)
        new Promise((r, j) => {
            const deletedVouchers = []
            selectedDeletionItems.forEach((voucherId, index) => {
                axios.delete(`/admin/voucher/${voucherId}`)
                    .then(() => {
                        deletedVouchers.push(voucherId)
                        if (index === selectedDeletionItems.length - 1) {
                            r(deletedVouchers)
                        }
                    })
                    .catch(() => {
                        if (index === selectedDeletionItems.length - 1) {
                            r(deletedVouchers)
                        }
                    })
            })
        })
            .then((delete_vouchers) => {
                setVouchers([...vouchers.filter(p => !delete_vouchers.includes(p.id))])
                if (delete_vouchers.length > 0)
                    toast.success(counterpart('dashboard.instancesPage.message.successMultiDelete'))
                setLoading(false)
                setShowConfirmDeleteModal(false)
            })

    }


    return (
        <CardComponent
            containerStyles={props.containerStyles}
            title={counterpart('dashboard.adminVouchersPage.title')}
            subtitle={counterpart('dashboard.adminVouchersPage.description')}
            link={counterpart('dashboard.adminVouchersPage.learnMore')}>
            <DeleteModal resourceName={'voucher'}
                multi={multiSelection}
                isOpen={showConfirmDeleteModal}
                toggle={() => setShowConfirmDeleteModal(!showConfirmDeleteModal)}
                onMultiDelete={deleteVouchersHandler}
                onDelete={deleteVoucherHandler}
                loading={loading} />
            <Row>
                <Col>
                    <div className="instanceCreation">
                        <h5 className="itemTitle" style={{color: colors.title[_mode]}}>
                            <Translate content="dashboard.adminVouchersPage.create" />
                        </h5>
                        <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} title={
                            <h5 className="tootltipValue">
                                <Translate content="dashboard.adminVouchersPage.add" />
                            </h5>}
                            placement="left">
                            <Fab color="primary" aria-label="add" onClick={() => navigate("/admin/vouchers/create")} style={{ transform: 'scale(0.7)' }} >
                                <AddIcon className="whiteIcon" />
                            </Fab>
                        </Tooltip>
                    </div>
                </Col>
            </Row>
            <Row>
                <div style={{width: "fit-content"}}>
                    <div className="toggleContainer" style={{ backgroundColor: colors.secondBackground[_mode], border: "1px solid "+colors.border[_mode], color: colors.mainText[_mode] }}>
                        <div
                            className={isActiveVoucher ? "activeToggleItemContainer" : "toggleItemContainer"}
                            onClick={() => setIsActiveVoucher(true)}>
                            <h5 className="toggleItemText">
                                <Translate content="dashboard.adminVouchersPage.activeVouchers" />
                            </h5>
                        </div>
                        <div
                            className={!isActiveVoucher ? "activeToggleItemContainer" : "toggleItemContainer"}
                            onClick={() => setIsActiveVoucher(false)}>
                            <h5 className="toggleItemText">
                                <Translate content="dashboard.adminVouchersPage.OldVouchers" />
                            </h5>
                        </div>
                    </div>
                </div>
            </Row>
            <DataTable
                icon={'fa-solid fa-ticket'}
                createUrl='/admin/vouchers/create'
                emptyMessage={counterpart('dashboard.adminVouchersPage.emptyMessage')}
                createMessage={counterpart('dashboard.adminVouchersPage.createMessage')}
                checkboxSelection
                columns={columns}
                rows={vouchers}
                onDeleteSelection={preDeleteSelectionHandler} />
        </CardComponent>
    );
}

export default AdminVouchersPage;
