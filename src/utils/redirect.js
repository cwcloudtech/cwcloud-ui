import { useNavigate } from 'react-router-dom'

const useRedirect = (target, waitTime) => {
    const navigate = useNavigate()
    setTimeout(() => {
        navigate(target)
    }, waitTime)
}

export default useRedirect;
