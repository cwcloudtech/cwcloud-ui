import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { TextField, Tooltip, Fab } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import AddIcon from '@mui/icons-material/Add';
import Fade from '@mui/material/Fade';
import { Row, Col } from 'reactstrap';
import CardComponent from "../../../../../../Components/Cards/CardComponent/CardComponent";
import CustomDeleteIcon from '../../../../../../Components/CustomIcon/CustomDeleteIcon';
import CustomCopyIcon from "../../../../../../Components/CustomIcon/CustomCopyIcon";
import DeleteModal from '../../../../../../Components/Modal/DeleteModal';
import DataTable from '../../../../../../Components/Table/DataTable';
import GlobalContext from '../../../../../../Context/GlobalContext';
import { shortname } from "../../../../../../utils/hash";
import axios from "../../../../../../utils/axios";
import { isBlank } from "../../../../../../utils/common";

function ContactForms(props) {
    const location = useLocation();
    const currentPath = location.pathname;
    const is_admin = currentPath.includes("admin");
    const nextPath = is_admin ? "/admin/contactform/add" : "/contactform/add";
    const context = useContext(GlobalContext);
    const { counterpart } = context;
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [forms, setForms] = useState([]);
    const [filteredForms, setFilteredForms] = useState([]);
    const [selectedForm, setSelectedForm] = useState(null);
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
    const [multiSelection, setMultiSelection] = useState(false);
    const [selectedDeletionItems, setSelectedDeletionItems] = useState([]);
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const columns = [
        { 
            field: 'name', 
            headerName: counterpart("dashboard.contactForm.table.name"), 
            width: 180,
            renderCell: (params) => (
                <Link to={
                    is_admin
                    ?`/admin/contactform/${params.id}`
                    :`/contactform/${params.id}`
                }>
                    {shortname(params.row.name, params.row.hash)}
                </Link>
            )
        },
        {
            field: 'id',
            headerName: context.counterpart("dashboard.table.id"),
            width: 350,
            renderCell: (params) => (
                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {params.row.id}
                </div>
            )
        },
        { 
            field: 'mail_from',
            headerName: counterpart("dashboard.contactForm.table.mail_from"), 
            width: 280,
            renderCell: (params) => (
                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {params.row.mail_from}
                </div>
            )
        },
        { 
            field: 'mail_to',
            headerName: counterpart("dashboard.contactForm.table.mail_to"), 
            width: 280,
            renderCell: (params) => (
                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {params.row.mail_to}
                </div>
            )
        },
        {
            field: 'updated_at',
            headerName: counterpart("dashboard.contactForm.table.updatedAt"),
            width: 100,
            renderCell: (params) => {
                return params.row.updated_at
            }
        },
        ...(is_admin ? [{
            field: 'owned_by',
            headerName: counterpart("dashboard.contactForm.table.ownedBy"),
            width: 200,
            renderCell: (params) => {
                const owner = users.find(user => user.id === params.row.user_id);
                return owner ? owner.email : 'N/A';
            }
        }] : []),
        { 
            field: 'actions', 
            headerName: counterpart("dashboard.table.actions"), 
            width: 100, 
            renderCell: (params) => {
                const deleteForm = (e) => {
                    e.stopPropagation();
                    preDeleteContactFormHandler(params.id);
                };
                const copyFormId = (e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(params.id)
                    toast.success(context.counterpart("dashboard.contactForm.message.successCopyId"))
                };
                return (    
                    <React.Fragment>
                        <CustomCopyIcon onClick={copyFormId} title={counterpart("dashboard.contactForm.actions.copyFormId")} />
                        &nbsp;
                        <CustomDeleteIcon onClick={deleteForm}/>
                    </React.Fragment>
                );
            }
        },
    ];

    useEffect(() => {
        if (is_admin) {
            axios.get("/admin/user/all")
                .then(response => {
                    setUsers(response.data.result);
                })
                .catch(error => {
                    toast.error(error.response?.data?.message || context.counterpart("common.message.errorFetchingUsers"));
                });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_admin]);

    const fetchContactForms = () => {
        context.setIsGlobal(true);
        var api_url = is_admin ? "/admin/contactform/all" : "/contactform/all";
        return axios.get(api_url)
            .then(res => {
                setForms(res.data);
                setFilteredForms(res.data);
            })
            .catch(err => {
                toast.error(counterpart("dashboard.contactForm.message.errorFetchForms"));
                console.error("Error fetching contact forms:", err);
            });
    };

    useEffect(() => {
        fetchContactForms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showConfirmDeleteModal]);

    const filterForms = (e) => {
        const searchQuery = e.target.value.trim();
        if (isBlank(searchQuery)) {
            setFilteredForms(forms);
        } else {
            const filteredList = forms.filter((form) =>
                form.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredForms(filteredList);
        }
    };

    const preDeleteContactFormHandler = (formId) => {
        const formIndex = forms.findIndex(form => form.id === formId);
        setSelectedForm(forms[formIndex]);
        setShowConfirmDeleteModal(true);
    };

    const deleteContactFormHandler = () => {
        setLoadingDelete(true);
        var api_url = is_admin ? `/admin/contactform/${selectedForm.id}` : `/contactform/${selectedForm.id}`;
        axios.delete(api_url)
            .then(() => {
                toast.success(counterpart("dashboard.contactForm.message.deleted"));
                setLoadingDelete(false);
                setShowConfirmDeleteModal(false);
            })
            .catch(err => {
                toast.error(counterpart("dashboard.contactForm.message.errorDelete"));
                console.error("Error deleting contact form:", err);
                setShowConfirmDeleteModal(false);
                setLoadingDelete(false);
            });
    };

    const preDeleteSelectionHandler = (selectedItems) => {
        setMultiSelection(true);
        setShowConfirmDeleteModal(true);
        setSelectedDeletionItems(selectedItems);
    };

    const deleteSelectedContactFormHandler = async () => {
        setLoadingDelete(true);
        const deletedForms = [];
        
        new Promise((resolve, reject) => {
            selectedDeletionItems.forEach((formId, index) => {
                axios.delete(is_admin ? `/admin/contactform/${formId}` : `/contactform/${formId}`)
                    .then(() => {
                        deletedForms.push(formId);
                        if (index === selectedDeletionItems.length - 1) {
                            resolve(deletedForms);
                        }
                    })
                    .catch(() => {
                        if (index === selectedDeletionItems.length - 1) {
                            resolve(deletedForms);
                        }
                    });
            });
        })
        .then((deletedForms) => {
            setForms([...forms.filter(form => !deletedForms.includes(form.id))]);
            setFilteredForms([...filteredForms.filter(form => !deletedForms.includes(form.id))]);
            if (deletedForms.length > 0) {
                toast.success(counterpart("dashboard.contactForm.message.successDeleteMultiple"));
            }
            setLoadingDelete(false);
            setShowConfirmDeleteModal(false);
        });
    };

    return (
        <CardComponent
            containerStyles={props.containerStyles}
            title={counterpart('dashboard.contactForm.overview.mainTitle')}
        >
            <DeleteModal
                resourceName={counterpart('dashboard.contactForm.name').toLowerCase()}
                multi={multiSelection}
                isOpen={showConfirmDeleteModal}
                toggle={() => setShowConfirmDeleteModal(!showConfirmDeleteModal)}
                onMultiDelete={deleteSelectedContactFormHandler}
                onDelete={deleteContactFormHandler}
                name={selectedForm?.name}
                loading={loadingDelete}
            />
             <Row style={{ paddingBottom: "20px" }}>
                <Col md="11">
                    <TextField
                        onChange={(e) => filterForms(e)}
                        label="Search Contact Form"
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
                <Col md="1">
                    <Tooltip
                        TransitionComponent={Fade}
                        TransitionProps={{ timeout: 600 }}
                        placement="bottom"
                    >
                        <Fab
                            color="primary"
                            aria-label="add"
                            onClick={() => navigate(nextPath)}
                            style={{ transform: "scale(0.7)" }}
                        >
                            <AddIcon className="whiteIcon" />
                        </Fab>
                    </Tooltip>
                </Col>
            </Row>

            <DataTable
                icon={'fa-solid fa-chart-line'}
                createUrl={nextPath}
                emptyMessage={counterpart('dashboard.contactForm.message.emptyMessage')}
                createMessage={counterpart('dashboard.contactForm.message.createMessage')}
                checkboxSelection
                columns={columns}
                setMultiSelection={setMultiSelection}
                rows={filteredForms}
                onDeleteSelection={preDeleteSelectionHandler}
            />
        </CardComponent>
    );
}

export default ContactForms;
