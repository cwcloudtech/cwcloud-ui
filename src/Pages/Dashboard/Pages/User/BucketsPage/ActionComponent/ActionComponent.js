import { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { Dropdown } from 'reactstrap';
import CustomDeleteIcon from '../../../../../../Components/CustomDeleteIcon/CustomDeleteIcon';
import DeleteModal from '../../../../../../Components/DeleteModal/DeleteModal';
import GlobalContext from '../../../../../../Context/GlobalContext';
import axios from '../../../../../../utils/axios';

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
        axios.delete(`/bucket/${props ? props.provider : 'undef'}/${props ? props.region : 'undef'}/${props && props.item && props.item.id ? props.item.id : 'undef'}`).then(response => {
            toast.success(counterpart('dashboard.bucketOverview.message.successDelete'))
            props.deleteBucket(e)
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
                    <CustomDeleteIcon onClick={onPreDeleteHandler} />
                </Dropdown>
            </div>
        </div >
    )
}

export default ActionComponent
