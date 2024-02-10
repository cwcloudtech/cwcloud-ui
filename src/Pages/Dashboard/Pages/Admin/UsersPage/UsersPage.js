import { useContext, useState, useEffect } from 'react';
import CardComponent from "../../../../../Components/Cards/CardComponent/CardComponent";
import { Row, Col } from "reactstrap";
import classes from "./UsersPage.module.css";
import { Link, useNavigate } from "react-router-dom";
import { TextField } from "@mui/material";
import axios from "../../../../../utils/axios";
import { isBlank } from "../../../../../utils/common";
import Tooltip from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Translate from 'react-translate-component';
import GlobalContext from '../../../../../Context/GlobalContext';
import ActionUser from './ActionUser/ActionUser';
import formateDate from '../../../../../utils/FormateDate';
import filteredListWithoutRemovedElement from "../../../../../utils/filter";
import updateList from "../../../../../utils/update";
import DataTable from '../../../../../Components/DataTable/DataTable';
import InputAdornment from '@mui/material/InputAdornment';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

function UsersPage(props) {
    const context = useContext(GlobalContext);
    const [users, setUsers] = useState([])
    const [filtredUsers, setFiltredUsers] = useState([]);
    const navigate = useNavigate()
    const columns = [
        { field: 'id', headerName: context.counterpart("dashboard.usersPage.table.id"), width: 100, renderCell: (params) => (<Link to={`/user/${params.id}`}>{params.id}</Link>) },
        { field: 'email', headerName: context.counterpart("dashboard.usersPage.table.email"), width: 200 },
        { field: 'is_admin', headerName: context.counterpart("dashboard.usersPage.table.adminAccess"), width: 200, renderCell: (params) => (params.row.is_admin ? <i className={["fa-solid fa-check", classes.iconStyle].join(' ')}></i> : <i className={["fa-solid fa-xmark", classes.iconStyle].join(' ')}></i>) },
        { field: 'confirmed', headerName: context.counterpart("dashboard.usersPage.table.confirmation"), width: 200, renderCell: (params) => (params.row.confirmed ? <i className={["fa-solid fa-check", classes.iconStyle].join(' ')}></i> : <i className={["fa-solid fa-xmark", classes.iconStyle].join(' ')} ></i>) },
        { field: 'created_at', headerName: context.counterpart("dashboard.usersPage.table.created"), width: 200, renderCell: (params) => (formateDate(params.row.created_at)) },
        {
            field: 'actions', headerName: context.counterpart("dashboard.usersPage.table.actions"), width: 200, renderCell: (params) => {
                const userIndex = users.findIndex(u => u.id === params.id)
                return (<ActionUser
                    user={users[userIndex]}
                    deleteUser={(user_id) => deleteUserHandler(user_id)}
                    updateUser={(updatedUser) => updateUserHandler(updatedUser)} />)
            }
        }
    ];

    useEffect(() => {
        context.setIsGlobal(true)
        axios.get("/admin/user/all")
            .then(res => {
                setUsers(res.data.result)
                setFiltredUsers(res.data.result)
            })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const updateUserHandler = (updatedUser) => {
        setUsers(updateList(users, updatedUser))
        setFiltredUsers(updateList(filtredUsers, updatedUser))
    }

    const deleteUserHandler = (userId) => {
        setUsers(filteredListWithoutRemovedElement(userId, users))
        setFiltredUsers(filteredListWithoutRemovedElement(userId, filtredUsers))
    }

    const filterUsers = (e) => {
        const searchQuery = e.target.value.trim() 
        if (isBlank(searchQuery)) {
            setFiltredUsers(users)
        } else {
            var filtredUsers = users.filter(user => user.email.includes(searchQuery))
            setFiltredUsers(filtredUsers)
        }
    }

    return (
        <CardComponent
            containerStyles={props.containerStyles}
            title={context.counterpart('dashboard.usersPage.title')}
        >
            <Row>
                <Col>
                    <div style={{ paddingBottom: "20px"  }} className={classes.envCreation}>
                        <TextField
                            onChange={(e) => filterUsers(e) }
                            label={context.counterpart('dashboard.addProject.inputs.email.title')}
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
                        <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} title={<h5 className={classes.tootltipValue}>
                            <Translate content="dashboard.usersPage.addUser" />
                        </h5>} placement="bottom">
                            <Fab color="primary" aria-label="add" onClick={() => navigate("/users/add")} style={{ transform: 'scale(0.7)' }} >
                                <AddIcon className="whiteIcon" />
                            </Fab>
                        </Tooltip>
                    </div>
                </Col>
            </Row>
            <DataTable
                columns={columns}
                rows={filtredUsers} />
        </CardComponent>
    )
}

export default UsersPage