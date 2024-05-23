import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../../../utils/axios';
import counterpart from '../../../utils/counterpart';
import useRedirect from '../../../utils/redirect';

const DeviceConfirmation = (props) => {
    const { token } = useParams()

    useEffect(() => {
        axios.post(`/iot/device-confirmation/${token}`)
            .then((res) => {
                toast.success(counterpart('confirm.successConfirmDeviceMessage'))
            })
    }, [token]);

    useRedirect('/', 1000)

    return <div></div>;
};

export default DeviceConfirmation
