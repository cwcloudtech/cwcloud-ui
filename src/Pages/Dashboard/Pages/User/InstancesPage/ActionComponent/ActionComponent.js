import { useContext, useState } from 'react';
import axios from '../../../../../../utils/axios';
import { toast } from 'react-toastify';
import DeleteModal from '../../../../../../Components/Modal/DeleteModal';
import { Dropdown} from 'reactstrap';
import RebootModal from '../../../../../../Components/Modal/RebootModal';
import PowerModal from '../../../../../../Components/Modal/PowerModal';
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
    const { selectedProvider, counterpart } = useContext(GlobalContext)

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
        var api_url = props.is_admin 
        ? `/admin/instance/${props && props.item ? props.item.id : 'undef'}`
        : `/instance/${selectedProvider.name}/${props && props.item ? props.item.region : 'undef'}/${props && props.item ? props.item.id : 'undef'}`
        axios.delete(api_url)
        .then(response => {
            props.deleteInstance()
            toast.success(counterpart('dashboard.instanceOverview.message.successDelete'))
            setShowConfirmDeleteModal(false)
            setLoading(false)
        }).catch(err => {
            setShowConfirmDeleteModal(false)
            setLoading(false)
            console.log(err)
        })
    }

    const onRebootHandler = () => {
        const payload = {
            status: "reboot",
        }
        var api_url = props.is_admin
        ? `/admin/instance/${props && props.item ? props.item.id : 'undef'}`
        : `/instance/${selectedProvider.name}/${props && props.item ? props.item.region : 'undef'}/${props && props.item ? props.item.id : 'undef'}`
        setLoading(true)
        axios.patch(api_url, payload).then(response => {
            toast.success(counterpart('dashboard.instanceOverview.message.successUpdate'))
            setshowConfirmRebootModal(false)
            setLoading(false)
        }).catch(err => {
            setshowConfirmRebootModal(false)
            setLoading(false)
            console.log(err)
        })
    }

    const onPowerHandler = () => {
        const updatedStatus = props.item.status === 'active' ? 'poweroff' : 'poweron'
        setLoading(true)
        var api_url = props.is_admin
        ? `/admin/instance/${props && props.item ? props.item.id : 'undef'}`
        : `/instance/${selectedProvider.name}/${props && props.item ? props.item.region : 'undef'}/${props && props.item ? props.item.id : 'undef'}`
        axios.patch(api_url, { status: updatedStatus, type: props.item.type })
            .then(response => {
                toast.success(counterpart('dashboard.instanceOverview.message.successUpdate'))
                const newInstanceStatus = updatedStatus === 'poweroff' ? 'poweredoff' : 'active'
                props.updateInstanceStatus(newInstanceStatus)
                setshowConfirmPowerModal(false)
                setLoading(false)
            }).catch(err => {
                setshowConfirmPowerModal(false)
                setLoading(false)
                console.log(api_url)
            })
    }

    return (
        <div>
            <RebootModal isOpen={showConfirmRebootModal} toggle={() => setshowConfirmRebootModal(!showConfirmRebootModal)} onReboot={onRebootHandler} name={props && props.item ? props.item.name : 'undef'} loading={loading} type={props && props.item ? props.item.type : 'undef'} />
            <DeleteModal resourceName={'instance'} isOpen={showConfirmDeleteModal} toggle={() => setShowConfirmDeleteModal(!showConfirmDeleteModal)} onDelete={onDeleteHandler} name={props && props.item ? props.item.name : 'undef'} loading={loading} />
            <PowerModal isOpen={showConfirmPowerModal} toggle={() => setshowConfirmPowerModal(!showConfirmPowerModal)} onPower={onPowerHandler} name={props && props.item ? props.item.name : 'undef'} loading={loading} status={props && props.item ? props.item.status : 'undef'} />
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
