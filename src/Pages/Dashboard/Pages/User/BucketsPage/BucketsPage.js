import React, { useState, useContext, useEffect } from "react";
import { Row, Col } from "reactstrap";
// import classes from "./BucketsPage.module.css";
import '../../../../../common.css';
import { TextField } from "@mui/material";
import CardComponent from "../../../../../Components/Cards/CardComponent/CardComponent";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "../../../../../utils/axios";
import { isBlank } from "../../../../../utils/common";
import GlobalContext from "../../../../../Context/GlobalContext";
import Tooltip from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Translate from 'react-translate-component';
import DeleteModal from "../../../../../Components/Modal/DeleteModal";
import formateDate from "../../../../../utils/FormateDate";
import filteredListWithoutRemovedElement from "../../../../../utils/filter";
import { toast } from 'react-toastify';
import DataTable from "../../../../../Components/Table/DataTable";
import InputAdornment from '@mui/material/InputAdornment';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import CustomDeleteIcon from "../../../../../Components/CustomIcon/CustomDeleteIcon";

function BucketsPage(props) {
    const context = useContext(GlobalContext);
    const location = useLocation()
    const currentPath = location.pathname
    const is_admin = currentPath.includes('admin')
    const createLink = is_admin ? '/admin/buckets/create' : '/buckets/create'
    const [buckets, setBuckets] = useState([]);
    const [filtredBuckets, setFiltredBuckets] = useState([]);
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false)
    const [selectedDeletionItems, setSelectedDeletionItems] = useState([])
    const [selectedBucket, setSelectedBucket] = useState(null)
    const [multiSelection, setMultiSelection] = useState(false)
    const [loading, setLoading] = useState(false)
    const { selectedProvider, region, counterpart, setIsGlobal } = useContext(GlobalContext)
    const navigate = useNavigate()

    const columns = [
        { field: 'id', headerName: counterpart("dashboard.adminBucketsPage.table.id"), width: 200, renderCell: (params) => (<Link to={is_admin ? `/admin/bucket/${params.id}`:`/bucket/${params.id}`}>{params.id}</Link>) },
        { field: 'name', headerName: counterpart("dashboard.adminBucketsPage.table.name"), width: 200 },
        { field: 'status', headerName: counterpart("dashboard.adminBucketsPage.table.status"), width: 100 },
        { field: 'created_at', headerName: counterpart("dashboard.adminBucketsPage.table.created"), width: 200, renderCell: (params) => (formateDate(params.row.created_at)) },
        {
            field: 'action', headerName: counterpart("dashboard.adminBucketsPage.table.actions"), width: 100, renderCell: (params) => {
                const onClick = (e) => {
                    e.stopPropagation();
                    preDeleteHandler(params.id)
                };
                return <CustomDeleteIcon onClick={onClick} />
            }
        }
    ];

    useEffect(() => {
        setIsGlobal(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        var api_url = is_admin
            ? `/admin/bucket/${selectedProvider.name}/${region.name}/all`
            : `/bucket/${selectedProvider.name}/${region.name}`
        axios.get(api_url)
            .then(res => {
                setBuckets(res.data)
                setFiltredBuckets(res.data)
            }).catch(err => {
                navigate('/notfound')
            })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [region.name, navigate, selectedProvider.name, showConfirmDeleteModal])

    const preDeleteHandler = (bucketId) => {
        setMultiSelection(false)
        const bucketIndex = buckets.findIndex(b => b.id === bucketId)
        setSelectedBucket(buckets[bucketIndex])
        setShowConfirmDeleteModal(true)
    }

    const deleteBucketHandler = () => {
        setLoading(true)
        var bucketId = selectedBucket.id
        var api_url = is_admin
            ? `/admin/bucket/${bucketId}`
            : `/bucket/${selectedProvider.name}/${region.name}/${bucketId}`
        axios.delete(api_url)
            .then(res => {
                setBuckets(filteredListWithoutRemovedElement(bucketId, buckets))
                setFiltredBuckets(filteredListWithoutRemovedElement(bucketId, filtredBuckets))
                toast.success(counterpart('dashboard.bucketOverview.message.successDelete'))
                setShowConfirmDeleteModal(false)
                setLoading(false)
            }).catch(err => {
                setShowConfirmDeleteModal(false)
                setLoading(false)
            })
    }

    const preDeleteSelectionHandler = (selectedItems) => {
        setMultiSelection(true)
        setShowConfirmDeleteModal(true)
        setSelectedDeletionItems(selectedItems)
    }

    const deletebucketsHandler = async () => {
        setLoading(true)
        new Promise((r, j) => {
            const deletedBuckets = []
            selectedDeletionItems.forEach((bucketId, index) => {
                var api_url = is_admin
                    ? `/admin/bucket/${bucketId}`
                    : `/bucket/${selectedProvider.name}/${region.name}/${bucketId}`
                axios.delete(api_url)
                    .then(() => {
                        deletedBuckets.push(bucketId)
                        if (index === selectedDeletionItems.length - 1) {
                            r(deletedBuckets)
                        }
                    })
                    .catch(() => {
                        if (index === selectedDeletionItems.length - 1) {
                            r(deletedBuckets)
                        }
                    })
            })
        })
            .then((delete_buckets) => {
                setBuckets([...buckets.filter(p => !delete_buckets.includes(p.id))])
                toast.success(counterpart('dashboard.adminBucketsPage.message.successMultiDelete'))
                setLoading(false)
                setShowConfirmDeleteModal(false)
            })

    }

    const filtreBuckets = (e) => {
        const searchQuery = e.target.value.trim() 
        if (isBlank(searchQuery)) {
            setFiltredBuckets(buckets)
        } else {
            var filtredBuckets = buckets.filter(bucket => bucket.name.includes(searchQuery))
            setFiltredBuckets(filtredBuckets)
        }
    }

    return (
        <CardComponent
            containerStyles={props.containerStyles}
            title={counterpart('dashboard.adminBucketsPage.title')}
            subtitle={counterpart('dashboard.adminBucketsPage.description')}
            link={counterpart('dashboard.adminBucketsPage.learnMore')}>
            <DeleteModal resourceName={'bucket'}
                multi={multiSelection}
                isOpen={showConfirmDeleteModal}
                toggle={() => setShowConfirmDeleteModal(!showConfirmDeleteModal)}
                onMultiDelete={deletebucketsHandler}
                onDelete={deleteBucketHandler}
                name={selectedBucket?.name}
                loading={loading} />
            <Row>
                <Col>
                    <div style={{ paddingBottom: "20px"  }} className="instanceCreation">
                        <TextField
                            onChange={(e) => filtreBuckets(e) }
                            label={context.counterpart('dashboard.addBucket.inputs.name.placeholder')}
                            InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <SearchOutlinedIcon />
                                  </InputAdornment>
                                ),
                              }}
                            size="small"
                            fullWidth 
                        />
                        {
                            is_admin &&
                            <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} title={
                                <h5 className="tootltipValue">
                                    <Translate content="dashboard.adminBucketsPage.addInstance" />
                                </h5>}
                                placement="bottom">
                                <Fab color="primary" aria-label="add" onClick={() => navigate("/admin/buckets/create")} style={{ transform: 'scale(0.7)' }} >
                                    <AddIcon className="whiteIcon" />
                                </Fab>
                            </Tooltip>
                        }
                    </div>
                </Col>
            </Row>
            <DataTable
                noCreate={!is_admin}
                icon={'fa-solid fa-cube'}
                createUrl={createLink}
                emptyMessage={counterpart('dashboard.adminBucketsPage.emptyMessage')}
                createMessage={counterpart('dashboard.adminBucketsPage.createMessage')}
                checkboxSelection
                columns={columns}
                setMultiSelection={setMultiSelection}
                rows={filtredBuckets}
                onDeleteSelection={preDeleteSelectionHandler} />
        </CardComponent>
    );
}

export default BucketsPage;
