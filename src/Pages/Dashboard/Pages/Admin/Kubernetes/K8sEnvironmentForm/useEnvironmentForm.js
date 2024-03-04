import { useEffect, useState, useContext } from 'react';
import { toast } from "react-toastify";
import axiosInstance from '../../../../../../utils/axios';
import GlobalContext from '../../../../../../Context/GlobalContext';
import { useParams, useNavigate } from "react-router-dom"


const useEnvironmentForm = () => {
    const { envId } = useParams()
    const context = useContext(GlobalContext);
    const { counterpart } = context;
    const navigate = useNavigate();

    const [env, setEnv] = useState({ name: "", description: "", is_private: true, logo_url: "", charts: [], external_charts: [] })
    const [allObjects, setAllObjects] = useState([]);
    const [selectedObjects, setSelectedObjects] = useState([]);
    const [unselectedObjects, setUnselectedObjects] = useState([]);
    const [isInvalid, setIsInvalid] = useState(false)
    const [loadingSubmit, setLoadingSubmit] = useState(false)
    const [loading, setLoading] = useState(false)
    const [externalRoles, setExternalRoles] = useState([]);

    useEffect(() => {
        setLoading(true);
        if (envId) {
            initializeEdit()
            return;
        }
        initializeCreate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const addEnv = () => {
        axiosInstance.post(`/admin/environment/kubernetes`, env).then((res) => {
            navigate(`/kubernetes/environments`);
            toast.success(counterpart("dashboard.k8sEnvironments.form.createSuccess"));
        }).catch((err) => {
            toast.error(counterpart("dashboard.k8sEnvironments.form.errors.couldntCreate"));
        }).finally(() => {
            setLoadingSubmit(false)
        })
    }

    const editEnv = () => {
        let newEnv = {
            name: env.name,
            description: env.description,
            is_private: env.is_private,
            logo_url: env.logo_url,
            charts: env.charts,
            external_charts: env.external_charts
        }
        axiosInstance.put(`/admin/environment/kubernetes/${envId}`, newEnv).then((res) => {
            navigate(`/kubernetes/environments`);
            toast.success(counterpart("dashboard.k8sEnvironments.form.updateSuccess"));
        }).catch((err) => {
            toast.error(counterpart("dashboard.k8sEnvironments.form.errors.couldntUpdate"));
        }).finally(() => {
            setLoadingSubmit(false)
        })
    }

    const addEnvHandler = () => {
        if (env.name === "") {
            setIsInvalid(true)
            return null;
        }
        if (selectedObjects.length === 0) {
            toast.error(counterpart("dashboard.k8sEnvironments.form.errors.mustSelectChart"));
            return null;
        }
        setLoadingSubmit(true)
        let charts = ""
        selectedObjects.map((chart) => {
            if (externalRoles.find(role => role.name === chart)) {
                return null;
            }
            charts += chart + ";"
            return null;
        })
        env.charts = charts.substring(0, charts.length - 1)
        env.external_charts = externalRoles.length > 0 ? externalRoles : null
        if (envId) {
            editEnv()
            return;
        }
        addEnv()
    }

    const initializeEdit = () => {
        Promise.all([
            axiosInstance.get(`/admin/environment/kubernetes/${envId}`),
            axiosInstance.get(`/admin/environment/kubernetes/charts`)
        ]).then(([envRes, chartsRes]) => {
            setEnv(envRes.data)
            // set all charts
            setAllObjects(chartsRes.data.map((chart) => chart.name))

            // // set selected charts
            let selectedCharts = envRes.data.roles.split(";")
            if (envRes.data.external_roles) {
                let externalCharts = JSON.parse(envRes.data.external_roles)
                let externalChartsNames = externalCharts.map((role) => role.name)
                selectedCharts.push(...externalChartsNames)
                setExternalRoles(externalCharts)
            }
            setSelectedObjects(selectedCharts)

            // set unselected charts
            const unselected = chartsRes.data.filter((chart) => !selectedCharts.includes(chart.name)).map((chart) => chart.name)
            setUnselectedObjects(unselected)
            setLoading(false);
        }).catch((err) => {
            navigate("/notfound");
        });
    }

    const initializeCreate = () => {
        axiosInstance.get(`/admin/environment/kubernetes/charts`).then((res) => {
            let chartsNames = [];
            res.data.map((chart) => chartsNames.push(chart.name))
            setAllObjects(chartsNames)
            setUnselectedObjects(chartsNames)
            setLoading(false);
        }).catch((err) => {
            navigate("/notfound");
        });
    }

    const handleExternalRoleAdd = (externalRole) => {
        if (externalRoles.find(role => role.name === externalRole.name) || allObjects.find(role => role.name === externalRole.name)) {
            toast.error(counterpart("dashboard.k8sEnvironments.form.externalChartAlreadyExist"));
            return;
        }
        setUnselectedObjects([...unselectedObjects, externalRole.name]);
        setExternalRoles([...externalRoles, externalRole]);
    }

    const handleExternalRoleDelete = (roleName) => {
        setExternalRoles(externalRoles.filter(role => role.name !== roleName));
        setUnselectedObjects(unselectedObjects.filter(role => role !== roleName));
        setSelectedObjects(selectedObjects.filter(role => role !== roleName));
    }

    return {
        env,
        setEnv,
        allObjects,
        selectedObjects,
        unselectedObjects,
        setSelectedObjects,
        setUnselectedObjects,
        loading,
        loadingSubmit,
        isInvalid,
        addEnvHandler,
        externalRoles,
        handleExternalRoleAdd,
        handleExternalRoleDelete
    }
};

export default useEnvironmentForm;
