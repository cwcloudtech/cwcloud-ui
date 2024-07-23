import { useParams } from "react-router-dom";

export function useK8sSideBar() {
  const { clusterId } = useParams();
  const k8sPrefix = `/kubernetes/cluster/${clusterId}`;

  const sidebarKubernetesItems = [
    {
      id: "/kubernetes/clusters",
      items: ["/kubernetes/clusters"],
      titleKey: "common.button.goBack",
      iconClass: "fa-reply",
      path: "/kubernetes/clusters",
    },
    {
      id: k8sPrefix,
      items: [k8sPrefix],
      titleKey:
        "dashboard.kubernetesDashboardPages.sidebar.clusterOverview.title",
      iconClass: "fa-tower-observation",
      path: k8sPrefix,
    },
    {
      id: "serviceDiscovery",
      items: [
        `${k8sPrefix}/serviceDiscovery/services/explore`,
        `${k8sPrefix}/serviceDiscovery/ingresses/explore`,
      ],
      titleKey:
        "dashboard.kubernetesDashboardPages.sidebar.serviceDiscovery.title",
      iconClass: "fa-brands fa-servicestack",
      children: [
        {
          id: `${k8sPrefix}/serviceDiscovery/services/explore`,
          titleKey:
            "dashboard.kubernetesDashboardPages.sidebar.serviceDiscovery.services",
          path: "serviceDiscovery/services/explore",
        },
        {
          id: `${k8sPrefix}/serviceDiscovery/ingresses/explore`,
          titleKey:
            "dashboard.kubernetesDashboardPages.sidebar.serviceDiscovery.ingress",
          path: "serviceDiscovery/ingresses/explore",
        },
      ],
    },
    {
      id: "storage",
      items: [
        `${k8sPrefix}/storage/configMaps/explore`,
        `${k8sPrefix}/storage/secrets/explore`,
      ],
      titleKey: "dashboard.kubernetesDashboardPages.sidebar.storage.title",
      iconClass: "fa-boxes-stacked",
      children: [
        {
          id: `${k8sPrefix}/storage/configMaps/explore`,
          titleKey:
            "dashboard.kubernetesDashboardPages.sidebar.storage.configMap",
          path: "storage/configMaps/explore",
        },
        {
          id: `${k8sPrefix}/storage/secrets/explore`,
          titleKey:
            "dashboard.kubernetesDashboardPages.sidebar.storage.secrets",
          path: "storage/secrets/explore",
        },
      ],
    },
  ];

  return { sidebarKubernetesItems };
}
