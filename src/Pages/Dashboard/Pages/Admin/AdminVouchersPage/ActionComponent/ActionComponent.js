import { useState, useContext } from 'react';
import classes from "./ActionComponent.module.css"
import axios from '../../../../../../utils/axios';
import { toast } from 'react-toastify';
import DeleteModal from '../../../../../../Components/Modal/DeleteModal';
import PowerHandler from "../../../../../../Components/Modal/ActionModals/PowerModal"
import RebootModal from "../../../../../../Components/Modal/ActionModals/RebootModal"
import Tooltip from '@mui/material/Tooltip';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import GlobalContext from '../../../../../../Context/GlobalContext';
import Translate from 'react-translate-component';

function ActionComponent(props) {
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false)
    const [showConfirmRebootModal, setshowConfirmRebootModal] = useState(false)
    const [showConfirmPowerModal, setshowConfirmPowerModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isOpenRegionDropdown, setIsOpenRegionDropdown] = useState(false)
    const { counterpart } = useContext(GlobalContext)

    const onPreDeleteHandler = (e) => {
        props.onClick(e)
        setShowConfirmDeleteModal(true)
    }

    const onPreRebootHandler = (e) => {
        props.onClick(e)
        props.item.status === "active" ? setshowConfirmRebootModal(true) : toast.error("you can't reboot your instance")
    }

    const onPrePowerHandler = (e) => {
        props.onClick(e)
        setshowConfirmPowerModal(true)
    }

    const onDeleteHandler = () => {
        setLoading(true)
        axios.delete(`/admin/instance/${props && props.item ? props.item.id : 'undef'}`).then(response => {
            props.deleteInstance()
            props.deleteInstance()
            toast.success(counterpart('dashboard.instanceOverview.message.successDelete'))
            setShowConfirmDeleteModal(false)
            setLoading(false)
        }).catch(err => {
            setShowConfirmDeleteModal(false)
            setLoading(false)
        })
    }

    const onRebootHandler = () => {
        const payload = {
            status: "reboot",
        }
        setLoading(true)
        axios.patch(`/admin/instance/${props && props.item ? props.item.id : 'undef'}`, payload).then(response => {
            toast.success(counterpart('dashboard.instanceOverview.message.successUpdate'))
            setshowConfirmRebootModal(false)
            setLoading(false)
        }).catch(err => {
            setshowConfirmRebootModal(false)
            setLoading(false)
        })
    }

    const onPowerHandler = () => {
        const updatedStatus = props.item.status === 'active' ? 'poweroff' : 'poweron'
        setLoading(true)
        axios.patch(`/admin/instance/${props && props.item ? props.item.id : 'undef'}`, { status: updatedStatus, type: props.item.type })
            .then(response => {
                toast.success(counterpart('dashboard.instanceOverview.message.successUpdate'))
                const newInstanceStatus = updatedStatus === 'poweroff' ? 'poweredoff' : 'active'
                props.updateInstanceStatus(newInstanceStatus)
                setshowConfirmPowerModal(false)
                setLoading(false)
            }).catch(err => {
                setshowConfirmPowerModal(false)
                setLoading(false)
            })
    }

    return (
        <div>
            <RebootModal isOpen={showConfirmRebootModal} toggle={() => setshowConfirmRebootModal(!showConfirmRebootModal)} onReboot={onRebootHandler} name={props && props.item ? props.item.name : 'undef'} loading={loading} type={props && props.item ? props.item.type : 'undef'} />
            <DeleteModal resourceName={'instance'} isOpen={showConfirmDeleteModal} toggle={() => setShowConfirmDeleteModal(!showConfirmDeleteModal)} onDelete={onDeleteHandler} name={props && props.item ? props.item.name : 'undef'} loading={loading} />
            <PowerHandler isOpen={showConfirmPowerModal} toggle={() => setshowConfirmPowerModal(!showConfirmPowerModal)} onPower={onPowerHandler} name={props && props.item ? props.item.name : 'undef'} loading={loading} status={props && props.item ? props.item.status : 'undef'} />
            <Dropdown isOpen={isOpenRegionDropdown} toggle={() => setIsOpenRegionDropdown(!isOpenRegionDropdown)} >
                <DropdownToggle onClick={props.onClick} nav style={{ padding: "0" }}>
                    <Tooltip title="Toggle Options" placement="top" >
                        <i className="fa-solid fa-ellipsis"></i>
                    </Tooltip>
                </DropdownToggle>
                <DropdownMenu >
                    <DropdownItem onClick={onPrePowerHandler}>
                        <div className={classes.regionItemStyles}>
                            <h5 className={classes.dropdownItemText} style={{ margin: "10px" }}>{props && props.item && props.item.status === "active" ? "Power Off" : "Power On"}</h5 >
                        </div>
                    </DropdownItem>
                    <DropdownItem onClick={onPreRebootHandler}>
                        <div className={classes.regionItemStyles}>
                            <h5 className={classes.dropdownItemText} style={{ margin: "10px" }}>
                                <Translate content="common.button.reboot" />
                            </h5 >
                        </div>
                    </DropdownItem>
                    <DropdownItem onClick={onPreDeleteHandler}>
                        <div className={classes.regionItemStyles}>
                            <h5 className={classes.dropdownItemText} style={{ color: "red", margin: "10px" }}>
                                <Translate content="common.button.delete" />
                            </h5 >
                        </div>
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div >
    )
}

export default ActionComponent
