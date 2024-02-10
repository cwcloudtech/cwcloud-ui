import {useState, useContext} from 'react';
import classes from "./ActionComponent.module.css"
import axios from '../../../../../../utils/axios';
import { toast } from 'react-toastify';
import DeleteModal from '../../../../../../Components/DeleteModal/DeleteModal';
import Tooltip from '@mui/material/Tooltip';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import GlobalContext from '../../../../../../Context/GlobalContext';

function ActionComponent(props) {
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isOpenRegionDropdown, setIsOpenRegionDropdown] = useState(false)
    const { counterpart } = useContext(GlobalContext)

    const onPreDeleteHandler = () => {
        setShowConfirmDeleteModal(true)
    }

    const onDeleteHandler = (e) => {
        setLoading(true)
        axios.delete(`/admin/bucket/${props && props.item ? props.item.id : 'undef'}`).then(response => {
            props.deleteBucket(e)
            toast.success(counterpart('dashboard.bucketOverview.message.successDelete'))
            setShowConfirmDeleteModal(false)
            setLoading(false)
        }).catch(err => {
            setShowConfirmDeleteModal(false)
            setLoading(false)
        })

        return false;
    }

    return (
        <div>
            <DeleteModal resourceName={'bucket'} isOpen={showConfirmDeleteModal} toggle={() => setShowConfirmDeleteModal(!showConfirmDeleteModal)} onDelete={onDeleteHandler} name={props && props.item ? props.item.name : 'undef'} loading={loading} />
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Dropdown isOpen={isOpenRegionDropdown} toggle={() => setIsOpenRegionDropdown(!isOpenRegionDropdown)} >
                    <DropdownToggle onClick={props.onClick} nav style={{ padding: "0" }}>
                        <Tooltip title="Toggle Options" placement="top" >
                            <i className="fa-solid fa-ellipsis"></i>
                        </Tooltip>
                    </DropdownToggle>
                    <DropdownMenu style={{ position: "fixed" }}>
                        <DropdownItem onClick={onPreDeleteHandler}>
                            <div className={classes.regionItemStyles}>
                                <h5 className={classes.dropdownItemText} style={{ color: "red", margin: "10px" }}>Delete</h5 >
                            </div>
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>

        </div >
    )
}

export default ActionComponent
