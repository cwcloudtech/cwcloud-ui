import { useState, useContext } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import UpdateUser from './UpdateUser/UpdateUser';
import axios from "../../../../../../utils/axios"
import { toast } from "react-toastify";
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import DeleteModal from '../../../../../../Components/DeleteModal/DeleteModal';
import GlobalContext from '../../../../../../Context/GlobalContext';

function ActionUser(props) {
    const [openEdit, setOpenEdit] = useState(false);
    const [loadingEmail, setLoadingEmail] = useState(false)
    const [loadingPassword, setLoadingPassword] = useState(false)
    const [loadingConfirm, setLoadingConfirm] = useState(false)
    const [loadingRole, setLoadingRole] = useState(false)
    const [userInfo, setUserInfo] = useState({ ...props.user, password: "" })
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false)
    const [loadingDeletion, setLoadingDeletion] = useState(false)
    const { counterpart } = useContext(GlobalContext)

    const onPreEditHandler = () => {
        setOpenEdit(true)
    }

    const onConfirmHandler = () => {
        setLoadingConfirm(true)
        axios.patch(`/admin/user/confirm/${props && props.user ? props.user.id : 'undefined'}`).then(response => {
            const updatedUser = { ...userInfo, confirmed: true }
            setUserInfo(updatedUser)
            props.updateUser(updatedUser)
            toast.success(counterpart('dashboard.userOverview.message.successUpdate'))
            setLoadingConfirm(false)
        }).catch(err => {
            setLoadingConfirm(false)
        })
    }

    const onUpdateUserInfoHandler = () => {
        setLoadingEmail(true)
        axios.put(`/admin/user/${props && props.user ? props.user.id : 'undefined'}`, userInfo).then(response => {
            if (props) {
                props.updateUser(userInfo)
            }
            toast.success(counterpart('dashboard.userOverview.message.successUpdate'))
            setLoadingEmail(false)
        }).catch(err => {
            setLoadingEmail(false)
        })
    }

    const onUpdateUserPasswordInfoHandler = () => {
        setLoadingPassword(true)
        axios.patch(`/admin/user/reset-password`, userInfo).then(response => {
            if (props) {
                props.updateUser(userInfo)
            }
            toast.success(counterpart('dashboard.userOverview.message.successUpdate'))
            setLoadingPassword(false)
        }).catch(err => {
            setLoadingPassword(false)
        })
    }

    const onUpdateRoleHandler = () => {
        setLoadingRole(true)
        axios.put(`/admin/user/${props && props.user ? props.user.id : 'undefined'}`, userInfo).then(response => {
            const updatedUser = { ...userInfo, confirmed: true }
            setUserInfo(updatedUser)
            props.updateUser(updatedUser)
            toast.success(counterpart('dashboard.userOverview.message.successUpdate'))
            setLoadingRole(false)
        }).catch(err => {
            setLoadingRole(false)
        })
    }
    const onPreDeleteHandler = () => {
        setShowConfirmDeleteModal(true)
    }
    const onDeleteHandler = () => {
        setLoadingDeletion(true)
        axios.delete(`/admin/user/${props && props.user ? props.user.id : 'undefined'}`).then(response => {
            props.deleteUser(props.user.id)
            toast.success(counterpart('dashboard.userOverview.message.successDelete'))
            setShowConfirmDeleteModal(false)
            setLoadingDeletion(false)
        }).catch(err => {
            setShowConfirmDeleteModal(false)
            setLoadingDeletion(false)
        })
    }

    return (
        <div>
            <DeleteModal resourceName={'user'} isOpen={showConfirmDeleteModal} toggle={() => setShowConfirmDeleteModal(!showConfirmDeleteModal)} onDelete={onDeleteHandler} name={props && props.user ? props.user.email : 'undefined'} loading={loadingDeletion} />
            <DeleteModal resourceName={'user'} isOpen={showConfirmDeleteModal} toggle={() => setShowConfirmDeleteModal(!showConfirmDeleteModal)} onDelete={onDeleteHandler} name={props && props.user ? props.user.email : 'undefined'} loading={loadingDeletion} />
            <UpdateUser
                isOpen={openEdit}
                toggle={() => setOpenEdit(!openEdit)}
                user={userInfo} setUser={setUserInfo}
                onEditInfo={onUpdateUserInfoHandler}
                onEditPassword={onUpdateUserPasswordInfoHandler}
                onConfirm={onConfirmHandler}
                onUpdateRole={onUpdateRoleHandler}
                loadingEmail={loadingEmail}
                loadingPassword={loadingPassword}
                loadingConfirm={loadingConfirm}
                loadingRole={loadingRole}
            />
            <EditIcon style={{ marginRight: "20px" }} onClick={onPreEditHandler} 
            />
            <DeleteIcon className="deleteBtn" onClick={onPreDeleteHandler} 
            />
        </div>
    )
}

export default ActionUser
