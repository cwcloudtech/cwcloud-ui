import { useContext } from "react";
import GlobalContext from "../Context/GlobalContext";
import { isTrue } from "../utils/common";

export function useSidebarItems() {
  const context = useContext(GlobalContext);

  const sidebarUserItems = [
    {
      id: "/dashboard",
      items: ["/dashboard"],
      titleKey: "sidebar.dashboard",
      iconClass: "fa-gauge",
      path: "/dashboard",
    },
    {
      id: "/projects",
      items: ["/projects", "/projects/create"],
      titleKey: "sidebar.projects",
      iconClass: "fa-layer-group",
      path: "/projects",
      condition:
        isTrue(context.user.enabled_features.k8sapi) ||
        isTrue(context.user.enabled_features.daasapi),
    },
    {
      id: "/buckets",
      items: ["/buckets"],
      titleKey: "sidebar.buckets",
      iconClass: "fa-cube",
      path: "/buckets",
    },
    {
      id: "/registries",
      items: ["/registries"],
      titleKey: "sidebar.registries",
      iconClass: "fa-brands fa-docker",
      path: "/registries",
    },
    {
      id: "/instances",
      items: ["/instances", "/instances/create"],
      titleKey: "sidebar.instances",
      iconClass: "fa-microchip",
      path: "/instances",
      condition: isTrue(context.user.enabled_features.daasapi),
    },
    {
      id: "/k8s-applications",
      items: ["/k8s-applications"],
      titleKey: "sidebar.k8sApplications",
      iconClass: "fa-dharmachakra",
      path: "/k8s-applications",
      condition: isTrue(context.user.enabled_features.k8sapi),
    },
    {
      id: "/function",
      items: [
        "/function/overview",
        "/function/add",
        "/invocations",
        "/triggers",
      ],
      titleKey: "sidebar.functions.title",
      iconClass: "fa-code",
      children: [
        {
          id: "/function/overview",
          titleKey: "sidebar.functions.overview",
          path: "/function/overview",
        },
        {
          id: "/function/add",
          titleKey: "sidebar.functions.add",
          path: "/function/add",
        },
        {
          id: "/invocations",
          titleKey: "sidebar.invocations.overview",
          path: "/invocations",
        },
        {
          id: "/triggers",
          titleKey: "sidebar.triggers.overview",
          path: "/triggers",
        },
      ],
      condition: isTrue(context.user.enabled_features.faasapi),
    },
    {
      id: "/iot",
      items: [
        "/iot/overview",
        "/iot/devices",
        "/iot/add/object-type",
        "/iot/add/device",
        "/iot/add/data",
      ],
      titleKey: "sidebar.iot.title",
      iconClass: "fa-wifi",
      children: [
        {
          id: "/iot/overview",
          titleKey: "sidebar.iot.overview",
          path: "/iot/overview",
        },
        {
          id: "/iot/devices",
          titleKey: "sidebar.iot.devices",
          path: "/iot/devices",
        },
        {
          id: "/iot/add/object-type",
          titleKey: "sidebar.iot.addObjectType",
          path: "/iot/add/object-type",
        },
        {
          id: "/iot/add/device",
          titleKey: "sidebar.iot.addDevice",
          path: "/iot/add/device",
        },
        {
          id: "/iot/add/data",
          titleKey: "sidebar.iot.addData",
          path: "/iot/add/data",
        },
      ],
      condition: isTrue(context.user.enabled_features.iotapi),
    },
    {
      id: "/monitors",
      items: [
        "/monitors",
        "/monitors/add"
      ],
      titleKey: "sidebar.observability.title",
      iconClass: "fa-eye",
      children: [
        {
          id: "/monitors",
          titleKey: "sidebar.observability.monitors",
          path: "/monitors",
        },
        {
          id: "/monitor/add",
          titleKey: "sidebar.observability.addMonitor",
          path: "/monitor/add",
        },
      ],
      condition: isTrue(context.user.enabled_features.monitorapi),
    },
    {
      id: "/email",
      items: ["/email"],
      titleKey: "sidebar.manageEmails.title",
      iconClass: "fa-envelope",
      path: "/email",
      condition: isTrue(context.user.enabled_features.emailapi),
    },
  ];

  const sidebarAdminItems = [
    {
      id: "/admin/support",
      items: ["/admin/support"],
      titleKey: "sidebar.manageSupport.title",
      iconClass: "fa-comment-alt",
      path: "/admin/support",
    },
    {
      id: "/users",
      items: ["/users/overview", "/users/add"],
      titleKey: "sidebar.manageUsers.title",
      iconClass: "fa-user-group",
      children: [
        {
          id: "/users/overview",
          titleKey: "sidebar.manageUsers.overview",
          path: "/users/overview",
        },
        {
          id: "/users/add",
          titleKey: "sidebar.manageUsers.add",
          path: "/users/add",
        },
      ],
    },
    {
      id: "/environment",
      items: ["/admin/environment/overview", "/admin/environment/add"],
      titleKey: "sidebar.manageEnvironments.title",
      iconClass: "fa-laptop-code",
      children: [
        {
          id: "/admin/environment/overview",
          titleKey: "sidebar.manageEnvironments.overview",
          path: "/admin/environment/overview",
        },
        {
          id: "/admin/environment/add",
          titleKey: "sidebar.manageEnvironments.add",
          path: "/admin/environment/add",
        },
      ],
    },
    {
      id: "/kubernetes",
      items: ["/kubernetes/clusters", "/kubernetes/environments"],
      titleKey: "sidebar.kubernetes.title",
      iconClass: "fa-dharmachakra",
      children: [
        {
          id: "/kubernetes/clusters",
          titleKey: "sidebar.kubernetes.clusters",
          path: "/kubernetes/clusters",
        },
        {
          id: "/kubernetes/environments",
          titleKey: "sidebar.kubernetes.environments",
          path: "kubernetes/environments",
        },
      ],
    },
    {
      id: "/admin/projects",
      items: ["/admin/projects", "/admin/projects/create"],
      titleKey: "sidebar.manageProjects.title",
      iconClass: "fa-layer-group",
      children: [
        {
          id: "/admin/projects",
          titleKey: "sidebar.manageProjects.overview",
          path: "/admin/projects",
        },
        {
          id: "/admin/projects/create",
          titleKey: "sidebar.manageProjects.add",
          path: "/admin/projects/create",
        },
      ],
    },
    {
      id: "/admin/buckets",
      items: ["/admin/buckets", "/admin/buckets/create"],
      titleKey: "sidebar.manageBuckets.title",
      iconClass: "fa-cube",
      children: [
        {
          id: "/admin/buckets",
          titleKey: "sidebar.manageBuckets.overview",
          path: "/admin/buckets",
        },
        {
          id: "/admin/buckets/create",
          titleKey: "sidebar.manageBuckets.add",
          path: "/admin/buckets/create",
        },
      ],
    },
    {
      id: "/admin/registries",
      items: ["/admin/registries", "/admin/registries/create"],
      titleKey: "sidebar.manageRegistries.title",
      iconClass: "fa-brands fa-docker",
      children: [
        {
          id: "/admin/registries",
          titleKey: "sidebar.manageRegistries.overview",
          path: "/admin/registries",
        },
        {
          id: "/admin/registries/create",
          titleKey: "sidebar.manageRegistries.add",
          path: "/admin/registries/create",
        },
      ],
    },
    {
      id: "/admin/instances",
      items: ["/admin/instances", "/admin/instances/create"],
      titleKey: "sidebar.manageInstances.title",
      iconClass: "fa-microchip",
      children: [
        {
          id: "/admin/instances",
          titleKey: "sidebar.manageInstances.overview",
          path: "/admin/instances",
        },
        {
          id: "/admin/instances/create",
          titleKey: "sidebar.manageInstances.add",
          path: "/admin/instances/create",
        },
      ],
    },
    {
      id: "/admin/dns-records",
      items: ["/admin/dns-records", "/admin/dns-records/create"],
      titleKey: "sidebar.manageDnsRecords.title",
      iconClass: "fa-server",
      children: [
        {
          id: "/admin/dns-records",
          titleKey: "sidebar.manageDnsRecords.overview",
          path: "/admin/dns-records/overview",
        },
        {
          id: "/admin/dns-records/create",
          titleKey: "sidebar.manageDnsRecords.add",
          path: "/admin/dns-records/add",
        },
      ],
    },
    {
      id: "/admin/function/overview",
      items: [
        "/admin/function/overview",
        "/admin/function/add",
        "/admin/triggers",
        "/admin/invocations",
      ],
      titleKey: "sidebar.manageFunctions.title",
      iconClass: "fa-code",
      children: [
        {
          id: "/admin/function/overview",
          titleKey: "sidebar.functions.overview",
          path: "/admin/function/overview",
        },
        {
          id: "/admin/function/add",
          titleKey: "sidebar.functions.add",
          path: "/admin/function/add",
        },
        {
          id: "/admin/invocations",
          titleKey: "sidebar.invocations.overview",
          path: "/admin/invocations",
        },
        {
          id: "/admin/triggers",
          titleKey: "sidebar.triggers.overview",
          path: "/admin/triggers",
        },
      ],
    },
    {
      id: "/admin/iot",
      items: [
        "/admin/iot/overview",
        "/admin/iot/devices",
        "/admin/iot/add/object-type",
        "/admin/iot/add/device",
        "/admin/iot/add/data",
      ],
      titleKey: "sidebar.iot.title",
      iconClass: "fa-wifi",
      children: [
        {
          id: "/admin/iot/overview",
          titleKey: "sidebar.iot.overview",
          path: "/admin/iot/overview",
        },
        {
          id: "/admin/iot/devices",
          titleKey: "sidebar.iot.devices",
          path: "/admin/iot/devices",
        },
        {
          id: "/admin/iot/add/object-type",
          titleKey: "sidebar.iot.addObjectType",
          path: "/admin/iot/add/object-type",
        },
        {
          id: "/admin/iot/add/device",
          titleKey: "sidebar.iot.addDevice",
          path: "/admin/iot/add/device",
        },
        {
          id: "/admin/iot/add/data",
          titleKey: "sidebar.iot.addData",
          path: "/admin/iot/add/data",
        },
      ],
    },
    {
      id: "/admin/monitors",
      items: [
        "/admin/monitors",
        "/admin/monitors/add"
      ],
      titleKey: "sidebar.observability.title",
      iconClass: "fa-eye",
      children: [
        {
          id: "/admin/monitors",
          titleKey: "sidebar.observability.monitors",
          path: "/admin/monitors",
        },
        {
          id: "/admin/monitor/add",
          titleKey: "sidebar.observability.addMonitor",
          path: "/admin/monitor/add",
        },
      ],
      condition: isTrue(context.user.enabled_features.monitorapi),
    },
    {
      id: "/admin/email",
      items: ["/admin/email"],
      titleKey: "sidebar.manageEmails.title",
      iconClass: "fa-envelope",
      path: "/admin/email",
    }
  ];

  return { sidebarUserItems, sidebarAdminItems };
}
