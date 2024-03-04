import { useState, useContext } from 'react';
import axios from '../../../../../../utils/axios';
import { toast } from 'react-toastify';
import DeleteModal from '../../../../../../Components/Modal/DeleteModal';
import PowerHandler from "../../../../../../Components/Modal/PowerModal";
import RebootModal from "../../../../../../Components/Modal/RebootModal";
import { Dropdown} from 'reactstrap';
import GlobalContext from '../../../../../../Context/GlobalContext';
import CustomDeleteIcon from '../../../../../../Components/CustomIcon/CustomDeleteIcon';
import CustomRerunIcon from '../../../../../../Components/CustomIcon/CustomRerunIcon';
import CustomPowerIcon from '../../../../../../Components/CustomIcon/CustomPowerIcon';

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
                <CustomPowerIcon onClick={onPrePowerHandler} title={props && props.item && props.item.status === "active" ? "Power Off" : "Power On"} />
                <span style={{ width: '10px' }}></span>
                <CustomRerunIcon onClick={onPreRebootHandler} title={counterpart("common.button.reboot")} />
                <span style={{ width: '10px' }}></span>
                <CustomDeleteIcon onClick={onPreDeleteHandler} />
            </Dropdown>
        </div >
    )
}

export default ActionComponent