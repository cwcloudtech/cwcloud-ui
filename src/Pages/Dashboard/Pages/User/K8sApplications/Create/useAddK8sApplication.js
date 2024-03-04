import React from 'react';
import axiosInstance from '../../../../../../utils/axios';
import { useNavigate } from 'react-router-dom';

const useAddK8sApplication = () => {
    const [projects, setProjects] = React.useState([])
    const [clusters, setClusters] = React.useState([])
    const [environments, setEnvironments] = React.useState([])
    const [loading, setLoading] = React.useState(true)
    const navigate = useNavigate()

    React.useEffect(() => {
        setLoading(true)
        Promise.all([
            axiosInstance.get('/project?type=k8s'),
            axiosInstance.get('/kubernetes/cluster'),
            axiosInstance.get('/environment/all?type=k8s')
        ])
            .then(([projects_res, clusters_res, environments_res]) => {
                setProjects(projects_res.data)
                setClusters(clusters_res.data)
                setEnvironments(environments_res.data)
                setLoading(false)
            })
            .catch(error => {
                navigate('/notfound')
            });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const deployApp = (data, onSuccess) => {
        return axiosInstance.post('kubernetes/deployment', data)
            .then(res => {
                onSuccess()
            })
            .catch(error => {
                navigate('/notfound');
            });
    }

    return { projects, clusters, environments, loading, deployApp };
};

export default useAddK8sApplication;
