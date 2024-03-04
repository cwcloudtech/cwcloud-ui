import * as React from "react";
import axios from "../../utils/axios";
import { useNavigate, useParams } from "react-router-dom";

function useClusterOverview(props) {
    const [loading, setLoading] = React.useState(true);
    const [cpu, setCPU] = React.useState({ usedText: "...", percentage: "..." });
    const [memory, setMemory] = React.useState({ usedText: "...", percentage: "..." });
    const [podsMetrics, setPodsMetrics] = React.useState({ usedText: "...", percentage: "..." });
    const [resourcesCount, setResourcesCount] = React.useState({ namespaces: "...", deployments: "...", nodes: "..." })
    const [pods, setPods] = React.useState([]);
    const [deployments, setDeployments] = React.useState([]);
    const navigate = useNavigate();
    const { clusterId } = useParams();

    React.useEffect(() => {
        initalizeValues(clusterId)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getCPUInfo = (response) => {
        const totalCPU = response.nodes.map(node => {
            if (node.t_cpu)
                return node.t_cpu;
            return null;
        }).filter(cpu => cpu !== null);
        const totalUsedCPU = response.nodes.reduce((acc, node) => {
            if (node.u_cpu)
                return acc + node.u_cpu;
            return acc;
        }, 0);
        if (totalCPU.length === 0) {
            setCPU({ usedText: 'No CPU information available', percentage: 0 });
            return;
        }
        const usedCpuInCores = parseFloat(totalUsedCPU) / 1000000000;
        const cpuUsagePercentage = (usedCpuInCores / totalCPU.length) * 100;
        setCPU({ usedText: `${usedCpuInCores.toFixed(2)} / ${totalCPU.length} Cores`, percentage: cpuUsagePercentage.toFixed(2) });
    }

    const getMemoryInfo = (response) => {
        const totalMemory = response.nodes.map(node => {
            if (node.t_memory)
                return node.t_memory
            return null;
        })
        let totalUsedMemory = 0;
        response.nodes.map(node => {
            if (node.u_memory)
                totalUsedMemory += node.u_memory
            return null;
        })
        const totalMemoryInGb = parseFloat(totalMemory) / (1024 * 1024);
        const usedMemoryInGB = parseFloat(totalUsedMemory) / (1024 * 1024);
        const memoryUsagePercentage = (usedMemoryInGB / totalMemoryInGb) * 100;
        setMemory({ usedText: `${usedMemoryInGB.toFixed(2)} / ${totalMemoryInGb.toFixed(2)} Gib`, percentage: memoryUsagePercentage.toFixed(2) })
    }

    const getPodsInfo = (response) => {
        const podsUsagePercentage = (response.pods.length / response.max_pods) * 100;
        setPodsMetrics({ usedText: `${response.pods.length} / ${response.max_pods} Pods`, percentage: podsUsagePercentage.toFixed(2) })
    }

    const initalizeValues = (clusterId) => {
        setLoading(true);
        axios.get(`/admin/kubernetes/cluster/${clusterId}/info`).then((res) => {
            setResourcesCount({ namespaces: res.data.total_namespaces ?? "N/A", deployments: res.data.deployments.length ?? "N/A", nodes: res.data.nodes.length ?? "N/A" })
            getCPUInfo(res.data);
            getMemoryInfo(res.data);
            getPodsInfo(res.data);
            setPods(res.data.pods);
            setDeployments(res.data.deployments);
            setLoading(false);
        }).catch((err) => {
            navigate("/notfound");
        });
    }

    return {
        loading,
        cpu,
        pods,
        memory,
        podsMetrics,
        resourcesCount,
        deployments
    };
}

export default useClusterOverview;
