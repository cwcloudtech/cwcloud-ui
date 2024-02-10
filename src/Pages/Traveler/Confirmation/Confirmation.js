import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../../../utils/axios';
import counterpart from '../../../utils/counterpart';
import useRedirect from '../../../utils/redirect';

const Confirmation = (props) => {
    const { token } = useParams()

    useEffect(() => {
        axios.post(`/user/confirm/${token}`)
            .then((res) => {
                toast.success(counterpart('confirm.successMessage'))
            })
    }, [token]);

    useRedirect('/', 1000)

    return <div></div>;
};

export default Confirmation
