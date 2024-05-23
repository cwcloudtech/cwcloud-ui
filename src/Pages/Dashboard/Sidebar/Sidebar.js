import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GlobalContext from "../../../Context/GlobalContext";
import colors from "../../../Context/Colors";
import "./Sidebar.module.css";
import LogoComponent from "./LogoComponent/Logo";
import MenuList from "./MenuList/MenuList"
import SidebarMenuItem from "../../../Components/SidebarMenuItem/SidebarMenuItem";

function Sidebar() {
    const navigate = useNavigate();
    const context = useContext(GlobalContext);
    const _mode = context.mode;
    const isMobile = window.innerWidth <= 1080;
    function convertSlugToUrl(slug, parameters) {
        let url = slug;
        Object.entries(parameters).forEach(([key, value]) => {
            url = url.replace(`:${key}`, value);
        });
        return url;
    }
    function onClick(slug, parameters = {}) {
        navigate(convertSlugToUrl(slug, parameters));
    }
    const { pathname } = useLocation()
    const id = pathname.split("/")[2]
    return (
        <MenuList isMobile={isMobile}>
            <div style={{ paddingTop: 5, paddingBottom: 8, textAlign: "center", fontSize: "9px", color: colors.secondText[_mode] }}>
                <LogoComponent />
                <span style={{ fontWeight: "300", fontSize: "12px", display: "inline-block", marginTop: "10px", color: colors.mainTitle[_mode] }}>{process.env.REACT_APP_CWCLOUD_UI_LABEL}</span><br />
                <span style={{ fontWeight: "700" }}>{process.env.REACT_APP_CWCLOUD_UI_URL}</span>
            </div>
            <div style={{ backgroundColor: colors.sideBackground[_mode], borderTopRightRadius: '15px', borderBottomRightRadius: '15px' }}>
                <SidebarMenuItem
                    id="/dashboard"
                    title={context.counterpart('sidebar.dashboard')}
                    items={["/dashboard"]}
                    icon={<i className="fa-solid fa-gauge" style={{ fontSize: "18px" }}></i>}
                    onClick={() => onClick("/dashboard")}
                />
                <SidebarMenuItem
                    id="/projects"
                    title={context.counterpart('sidebar.projects')}
                    items={["/projects", "/projects/create"]}
                    icon={<i className="fa-solid fa-layer-group" style={{ fontSize: "18px" }}></i>}
                    onClick={() => onClick("/projects")}
                />
                <SidebarMenuItem
                    id="/buckets"
                    items={["/buckets"]}
                    title={context.counterpart('sidebar.buckets')}
                    onClick={() => onClick("/buckets")}
                    icon={<i className="fa-solid fa-cube" style={{ fontSize: "18px" }}></i>}
                />
                <SidebarMenuItem
                    id="/registries"
                    items={["/registries"]}
                    title={context.counterpart('sidebar.registries')}
                    onClick={() => onClick("/registries")}
                    icon={<i className="fa-brands fa-docker" style={{ fontSize: "18px" }}></i>}
                />
                <SidebarMenuItem
                    id="/instances"
                    items={["/instances", "/instances/create"]}
                    title={context.counterpart('sidebar.instances')}
                    icon={<i className="fa-solid fa-microchip" style={{ fontSize: "18px" }}></i>}
                    onClick={() => onClick("/instances")}
                />
                {context.user.enabled_features.k8sapi &&
                    <SidebarMenuItem
                        id="/k8s-applications"
                        items={["/k8s-applications"]}
                        title={context.counterpart('sidebar.k8sApplications')}
                        icon={<i className="fa-solid fa-dharmachakra" style={{ fontSize: "18px" }}></i>}
                        onClick={() => onClick("/k8s-applications")}
                    />
                }
                {context.user.enabled_features.faasapi && <SidebarMenuItem
                    id="/function"
                    items={["/function/overview", "/function/add", `/function/${id}`, "/invocations", "/triggers"]}
                    title={context.counterpart('sidebar.functions.title')}
                    icon={<i className="fa-solid fa-code" style={{ fontSize: "18px" }}></i>}
                >
                    <SidebarMenuItem
                        id="/function/overview"
                        title={context.counterpart('sidebar.functions.overview')}
                        level={2}
                        onClick={() => onClick("/function/overview")}
                    />
                    <SidebarMenuItem
                        id="/function/add"
                        title={context.counterpart('sidebar.functions.add')}
                        level={2}
                        onClick={() => onClick("/function/add")}
                    />
                    <SidebarMenuItem
                        id="/invocations"
                        title={context.counterpart('sidebar.invocations.overview')}
                        level={2}
                        onClick={() => onClick("/invocations")}
                    />
                    <SidebarMenuItem
                        id="/triggers"
                        title={context.counterpart('sidebar.triggers.overview')}
                        level={2}
                        onClick={() => onClick("/triggers")}
                    />
                </SidebarMenuItem>}
                {context.user.enabled_features.iotapi && <SidebarMenuItem
                    id="/iot"
                    items={[
                        "/iot/overview",
                        "/iot/devices",
                        `/iot/object-type/${id}`,
                        "/iot/add/object-type",
                        "/iot/add/device",
                        "/iot/add/data"
                    ]}
                    title={context.counterpart('sidebar.iot.title')}
                    icon={<i className="fa-solid fa-wifi" style={{ fontSize: "18px" }}></i>}
                >
                    <SidebarMenuItem
                        id="/iot/overview"
                        title={context.counterpart('sidebar.iot.overview')}
                        level={2}
                        onClick={() => onClick("/iot/overview")}
                    />
                    <SidebarMenuItem
                        id="/iot/devices"
                        title={context.counterpart('sidebar.iot.devices')}
                        level={2}
                        onClick={() => onClick("/iot/devices")}
                    />
                    <SidebarMenuItem
                        id="/iot/add/object-type"
                        title={context.counterpart('sidebar.iot.addObjectType')}
                        level={2}
                        onClick={() => onClick("/iot/add/object-type")}
                    />
                    <SidebarMenuItem
                        id="/iot/add/device"
                        title={context.counterpart('sidebar.iot.addDevice')}
                        level={2}
                        onClick={() => onClick("/iot/add/device")}
                    />
                    <SidebarMenuItem
                        id="/iot/add/data"
                        title={context.counterpart('sidebar.iot.addData')}
                        level={2}
                        onClick={() => onClick("/iot/add/data")}
                    />
                </SidebarMenuItem>}
                {context.user.enabled_features.emailapi && <SidebarMenuItem
                    id="/email"
                    items={["/email"]}
                    title={context.counterpart('sidebar.manageEmails.title')}
                    icon={<i className="fa-solid fa-envelope" style={{ fontSize: "18px" }}></i>}
                    onClick={() => onClick("/email")}
                />}
                {context.user.enabled_features.cwaiapi && <SidebarMenuItem
                    id="/cwai"
                    items={["/cwai"]}
                    title={context.counterpart('sidebar.cwai')}
                    icon={<i className="fa-solid fa-robot" style={{ fontSize: "18px" }}></i>}
                    onClick={() => onClick("/cwai")}
                />}
            </div>
            <div style={{ backgroundColor: colors.sideBackground[_mode], borderTopRightRadius: '15px', borderBottomRightRadius: '15px', marginTop: '15px' }}>
                {context.user.is_admin &&
                    <React.Fragment>
                        <SidebarMenuItem
                            id="/admin/support"
                            items={["/admin/support"]}
                            title={context.counterpart('sidebar.manageSupport.title')}
                            icon={<i className="fa-solid fa-comment-alt" style={{ fontSize: "18px" }}></i>}
                            onClick={() => onClick("/admin/support")}
                        />
                        <SidebarMenuItem
                            id="/users"
                            items={["/users/overview", "/users/add", `/user/${id}`]}
                            title={context.counterpart('sidebar.manageUsers.title')}
                            icon={<i className="fa-solid fa-user-group" style={{ fontSize: "18px" }}></i>}
                        >
                            <SidebarMenuItem
                                id="/users/overview"
                                title={context.counterpart('sidebar.manageUsers.overview')}
                                level={2}
                                onClick={() => onClick("/users/overview")}
                            />
                            <SidebarMenuItem
                                id="/users/add"
                                title={context.counterpart('sidebar.manageUsers.add')}
                                level={2}
                                onClick={() => onClick("/users/add")}
                            />
                        </SidebarMenuItem>
                        <SidebarMenuItem
                            id="/environment"
                            items={["/environment/overview", "/environment/add", `/environment/${id}`]}
                            title={context.counterpart('sidebar.manageEnvironments.title')}
                            icon={<i className="fa-solid fa-laptop-code" style={{ fontSize: "18px" }}></i>}
                        >
                            <SidebarMenuItem
                                id="/environment/overview"
                                title={context.counterpart('sidebar.manageEnvironments.overview')}
                                level={2}
                                onClick={() => onClick("/environment/overview")}
                            />
                            <SidebarMenuItem
                                id="/environment/add"
                                title={context.counterpart('sidebar.manageEnvironments.add')}
                                level={2}
                                onClick={() => onClick("/environment/add")}
                            />
                        </SidebarMenuItem>
                        <SidebarMenuItem
                            id="/kubernetes"
                            items={["/kubernetes/clusters", "/kubernetes/environments"]}
                            title={context.counterpart('sidebar.kubernetes.title')}
                            icon={<i className="fa-solid fa-dharmachakra" style={{ fontSize: "18px" }}></i>}
                        >
                            <SidebarMenuItem
                                id="/kubernetes/clusters"
                                title={context.counterpart('sidebar.kubernetes.clusters')}
                                level={2}
                                onClick={() => onClick("/kubernetes/clusters")}
                            />
                            <SidebarMenuItem
                                id="/kubernetes/environments"
                                title={context.counterpart('sidebar.kubernetes.environments')}
                                level={2}
                                onClick={() => onClick("kubernetes/environments")}
                            />
                        </SidebarMenuItem>
                        <SidebarMenuItem
                            id="/admin/projects"
                            items={["/admin/projects", "/admin/projects/create"]}
                            title={context.counterpart('sidebar.manageProjects.title')}
                            icon={<i className="fa-solid fa-layer-group" style={{ fontSize: "18px" }}></i>}
                        >
                            <SidebarMenuItem
                                id="/admin/projects"
                                title={context.counterpart('sidebar.manageProjects.overview')}
                                level={2}
                                onClick={() => onClick("/admin/projects")}
                            />
                            <SidebarMenuItem
                                id="/admin/projects/create"
                                title={context.counterpart('sidebar.manageProjects.add')}
                                level={2}
                                onClick={() => onClick("/admin/projects/create")}
                            />
                        </SidebarMenuItem>
                        <SidebarMenuItem
                            id="/admin/buckets"
                            items={["/admin/buckets", "/admin/buckets/create"]}
                            title={context.counterpart('sidebar.manageBuckets.title')}
                            icon={<i className="fa-solid fa-cube" style={{ fontSize: "18px" }}></i>}
                        >
                            <SidebarMenuItem
                                id="/admin/buckets"
                                title={context.counterpart('sidebar.manageBuckets.overview')}
                                level={2}
                                onClick={() => onClick("/admin/buckets")}
                            />
                            <SidebarMenuItem
                                id="/admin/buckets/create"
                                title={context.counterpart('sidebar.manageBuckets.add')}
                                level={2}
                                onClick={() => onClick("/admin/buckets/create")}
                            />
                        </SidebarMenuItem>
                        <SidebarMenuItem
                            id="/admin/registries"
                            items={["/admin/registries", "/admin/registries/create"]}
                            title={context.counterpart('sidebar.manageRegistries.title')}
                            icon={<i className="fa-brands fa-docker" style={{ fontSize: "18px" }}></i>}
                        >
                            <SidebarMenuItem
                                id="/admin/registries"
                                title={context.counterpart('sidebar.manageRegistries.overview')}
                                level={2}
                                onClick={() => onClick("/admin/registries")}
                            />
                            <SidebarMenuItem
                                id="/admin/registries/create"
                                title={context.counterpart('sidebar.manageRegistries.add')}
                                level={2}
                                onClick={() => onClick("/admin/registries/create")}
                            />
                        </SidebarMenuItem>
                        <SidebarMenuItem
                            id="/admin/instances"
                            items={["/admin/instances", "/admin/instances/create"]}
                            title={context.counterpart('sidebar.manageInstances.title')}
                            icon={<i className="fa-solid fa-microchip" style={{ fontSize: "18px" }}></i>}
                        >
                            <SidebarMenuItem
                                id="/admin/instances"
                                title={context.counterpart('sidebar.manageInstances.overview')}
                                level={2}
                                onClick={() => onClick("/admin/instances")}
                            />
                            <SidebarMenuItem
                                id="/admin/instances/create"
                                title={context.counterpart('sidebar.manageInstances.add')}
                                level={2}
                                onClick={() => onClick("/admin/instances/create")}
                            />
                        </SidebarMenuItem>
                        <SidebarMenuItem
                            id="/admin/function/overview"
                            items={["/admin/function/overview", "/admin/function/add", "/admin/triggers", "/admin/invocations"]}
                            title={context.counterpart('sidebar.manageFunctions.title')}
                            icon={<i className="fa-solid fa-code" style={{ fontSize: "18px" }}></i>}
                        >
                            <SidebarMenuItem
                                id="/admin/function/overview"
                                title={context.counterpart('sidebar.functions.overview')}
                                level={2}
                                onClick={() => onClick("/admin/function/overview")}
                            />
                            <SidebarMenuItem
                                id="/admin/function/add"
                                title={context.counterpart('sidebar.functions.add')}
                                level={2}
                                onClick={() => onClick("/admin/function/add")}
                            />
                            <SidebarMenuItem
                                id="/admin/invocations"
                                title={context.counterpart('sidebar.invocations.overview')}
                                level={2}
                                onClick={() => onClick("/admin/invocations")}
                            />
                            <SidebarMenuItem
                                id="/admin/triggers"
                                title={context.counterpart('sidebar.triggers.overview')}
                                level={2}
                                onClick={() => onClick("/admin/triggers")}
                            />
                        </SidebarMenuItem>
                        <SidebarMenuItem
                            id="/admin/iot"
                            items={[
                                "/admin/iot/overview",
                                "/admin/iot/devices",
                                "/admin/iot/add/object-type",
                                "/admin/iot/add/device",
                                "/admin/iot/add/data",
                                `/admin/iot/object-type/${id}`
                            ]}
                            title={context.counterpart('sidebar.iot.title')}
                            icon={<i className="fa-solid fa-wifi" style={{ fontSize: "18px" }}></i>}
                        >
                            <SidebarMenuItem
                                id="/admin/iot/overview"
                                title={context.counterpart('sidebar.iot.overview')}
                                level={2}
                                onClick={() => onClick("/admin/iot/overview")}
                            />
                            <SidebarMenuItem
                                id="/admin/iot/devices"
                                title={context.counterpart('sidebar.iot.devices')}
                                level={2}
                                onClick={() => onClick("/admin/iot/devices")}
                            />
                            <SidebarMenuItem
                                id="/admin/iot/add/object-type"
                                title={context.counterpart('sidebar.iot.addObjectType')}
                                level={2}
                                onClick={() => onClick("/admin/iot/add/object-type")}
                            />
                            <SidebarMenuItem
                                id="/admin/iot/add/device"
                                title={context.counterpart('sidebar.iot.addDevice')}
                                level={2}
                                onClick={() => onClick("/admin/iot/add/device")}
                            />
                            <SidebarMenuItem
                                id="/admin/iot/add/data"
                                title={context.counterpart('sidebar.iot.addData')}
                                level={2}
                                onClick={() => onClick("/admin/iot/add/data")}
                            />
                        </SidebarMenuItem>
                        <SidebarMenuItem
                            id="/admin/email"
                            items={["/admin/email"]}
                            title={context.counterpart('sidebar.manageEmails.title')}
                            icon={<i className="fa-solid fa-envelope" style={{ fontSize: "18px" }}></i>}
                            onClick={() => onClick("/admin/email")}
                        />
                        {process.env.REACT_APP_DISABLE_PAYMENT_FEATURE.includes("false") && <SidebarMenuItem
                            id="/admin/vouchers"
                            items={["/admin/vouchers", "/admin/vouchers/create"]}
                            title={context.counterpart('sidebar.manageVouchers.title')}
                            icon={<i className="fa-solid fa-ticket" style={{ fontSize: "18px" }}></i>}
                        >
                            <SidebarMenuItem
                                id="/admin/vouchers"
                                title={context.counterpart('sidebar.manageVouchers.overview')}
                                level={2}
                                onClick={() => onClick("/admin/vouchers")}
                            />
                            <SidebarMenuItem
                                id="/admin/vouchers/create"
                                title={context.counterpart('sidebar.manageVouchers.add')}
                                level={2}
                                onClick={() => onClick("/admin/vouchers/create")}
                            />
                        </SidebarMenuItem>
                        }
                        {process.env.REACT_APP_DISABLE_PAYMENT_FEATURE.includes("false") && <SidebarMenuItem
                            id="/admin/invoice"
                            items={["/admin/invoice/generate", "/admin/invoice/overview"]}
                            title={context.counterpart('sidebar.manageInvoices.title')}
                            icon={<i className="fa-solid fa-file-invoice-dollar" style={{ fontSize: "20px" }}></i>}
                        >
                            <SidebarMenuItem
                                id="/admin/invoice/overview"
                                title={context.counterpart('sidebar.manageInvoices.overview')}
                                level={2}
                                onClick={() => onClick("/admin/invoice/overview")}
                            />
                            <SidebarMenuItem
                                id="/admin/invoice/generate"
                                title={context.counterpart('sidebar.manageInvoices.generate')}
                                level={2}
                                onClick={() => onClick("/admin/invoice/generate")}
                            />
                            <SidebarMenuItem
                                id="/admin/invoice/custom"
                                title={context.counterpart('sidebar.manageInvoices.custom')}
                                level={2}
                                onClick={() => onClick("/admin/invoice/custom")}
                            />
                            <SidebarMenuItem
                                id="/admin/invoice/edition"
                                title={context.counterpart('sidebar.manageInvoices.edition')}
                                level={2}
                                onClick={() => onClick("/admin/invoice/edition")}
                            />
                        </SidebarMenuItem>}
                    </React.Fragment>
                }
            </div>
        </MenuList>
    );
}
export default Sidebar;