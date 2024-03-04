import React, { useState, useContext, useEffect } from "react";
import { Row, Col } from "reactstrap";
import classes from "./AdminBucketsPage.module.css";
import { TextField } from "@mui/material";
import CardComponent from "../../../../../Components/Cards/CardComponent/CardComponent";
import { Link, useNavigate } from "react-router-dom";
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

function AdminBucketsPage(props) {
    const context = useContext(GlobalContext);
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
        { field: 'id', headerName: counterpart("dashboard.adminBucketsPage.table.id"), width: 200, renderCell: (params) => (<Link to={`/admin/bucket/${params.id}`}>{params.id}</Link>) },
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
        axios.get(`/admin/bucket/${selectedProvider.name}/${region.name}/all`)
            .then(res => {
                setBuckets(res.data)
                setFiltredBuckets(res.data)
            }).catch(err => {
                navigate('/notfound')
            })
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
        axios.delete(`/admin/bucket/${bucketId}`)
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
                axios.delete(`/admin/bucket/${bucketId}`)
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
                    <div style={{ paddingBottom: "20px"  }} className={classes.instanceCreation}>
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
                        <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} title={
                            <h5 className={classes.tootltipValue}>
                                <Translate content="dashboard.adminBucketsPage.addInstance" />
                            </h5>}
                            placement="bottom">
                            <Fab color="primary" aria-label="add" onClick={() => navigate("/admin/buckets/create")} style={{ transform: 'scale(0.7)' }} >
                                <AddIcon className="whiteIcon" />
                            </Fab>
                        </Tooltip>
                    </div>
                </Col>
            </Row>
            <DataTable
                icon={'fa-solid fa-cube'}
                createUrl='/admin/buckets/create'
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

export default AdminBucketsPage;
