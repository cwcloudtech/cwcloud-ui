import { useState, useContext, useEffect } from "react";
import CardComponent from "../../../../../Components/Cards/CardComponent/CardComponent";
import { Link, useNavigate } from "react-router-dom";
import { TextField } from "@mui/material";
import axios from "../../../../../utils/axios";
import { isBlank } from "../../../../../utils/common";
import GlobalContext from "../../../../../Context/GlobalContext";
import ActionComponent from "./ActionComponent/ActionComponent";
import DeleteModal from "../../../../../Components/DeleteModal/DeleteModal";
import formateDate from "../../../../../utils/FormateDate";
import filteredListWithoutRemovedElement from "../../../../../utils/filter";
import { toast } from 'react-toastify';
import DataTable from "../../../../../Components/DataTable/DataTable";
import { Col, Row } from "reactstrap";
import InputAdornment from '@mui/material/InputAdornment';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

function BucketsPage(props) {

    const context = useContext(GlobalContext);
    const [buckets, setBuckets] = useState([]);
    const [filtredBuckets, setFiltredBuckets] = useState([]);
    const { selectedProvider, region, counterpart, setIsGlobal, user } = useContext(GlobalContext)
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false)
    const [selectedDeletionItems, setSelectedDeletionItems] = useState([])
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const columns = [
        { field: 'id', headerName: counterpart("dashboard.adminBucketsPage.table.id"), width: 200, renderCell: (params) => (<Link to={`/bucket/${params.id}`}>{params.id}</Link>) },
        { field: 'name', headerName: counterpart("dashboard.adminBucketsPage.table.name"), width: 200 },
        { field: 'status', headerName: counterpart("dashboard.adminBucketsPage.table.status"), width: 100 },
        { field: 'created_at', headerName: counterpart("dashboard.adminBucketsPage.table.created"), width: 200, renderCell: (params) => (formateDate(params.row.created_at)) },
        {
            field: 'action', headerName: counterpart("dashboard.adminBucketsPage.table.actions"), width: 100, renderCell: (params) => {

                if (params.row.user_id !== user.id) {
                    return null
                }
                const onClick = (e) => {
                    e.stopPropagation();
                };
                const bucketIndex = buckets.findIndex(b => b.id === params.id)
                return (
                    <ActionComponent
                        item={buckets[bucketIndex]}
                        provider={selectedProvider.name}
                        region={region.name}
                        onClick={onClick}
                        deleteBucket={(e) => { onClick(e); deleteBucketHandler(params.row.id) }} />
                )
            }
        }
    ];

    useEffect(() => {
        setIsGlobal(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        axios.get(`/bucket/${selectedProvider.name}/${region.name}`)
            .then(res => {
                setBuckets(res.data)
                setFiltredBuckets(res.data)
            }).catch(err => {
                navigate('/notfound')
            })
    }, [region.name, navigate, selectedProvider.name, showConfirmDeleteModal])

    const deleteBucketHandler = (bucketId) => {
        setBuckets(filteredListWithoutRemovedElement(bucketId, buckets))
        setFiltredBuckets(filteredListWithoutRemovedElement(bucketId, filtredBuckets))
    }

    const preDeleteSelectionHandler = (selectedItems) => {
        setShowConfirmDeleteModal(true)
        const allowedBuckets = [...buckets.filter(b => b.user_id === user.id).map(b => b.id)]
        setSelectedDeletionItems(selectedItems.filter(bucketId => allowedBuckets.includes(bucketId)))
    }

    const deleteBucketsHandler = async () => {
        setLoading(true)
        new Promise((r, j) => {
            const deletedBuckets = []
            selectedDeletionItems.forEach((bucketId, index) => {
                axios.delete(`/bucket/${bucketId}`)
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
                multi={true}
                isOpen={showConfirmDeleteModal}
                toggle={() => setShowConfirmDeleteModal(!showConfirmDeleteModal)}
                onMultiDelete={deleteBucketsHandler}
                loading={loading} />
            <Row>
                <Col md="12">
                    <TextField
                        style={{ paddingBottom: "20px"  }} 
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
                </Col>
            </Row>
            <DataTable
                icon={'fa-solid fa-cube'}
                emptyMessage={counterpart('dashboard.adminBucketsPage.emptyMessage')}
                createMessage={counterpart('dashboard.adminBucketsPage.createMessage')}
                noCreate
                checkboxSelection
                columns={columns}
                rows={filtredBuckets}
                onDeleteSelection={preDeleteSelectionHandler} />
        </CardComponent>
    );
}

export default BucketsPage;
