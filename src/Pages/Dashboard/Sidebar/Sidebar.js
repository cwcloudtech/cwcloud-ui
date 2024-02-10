import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LogoComponent from "./LogoComponent/Logo";
import MenuList from "./MenuList/MenuList"
import MenuItem from "./MenuItem/MenuItem";
import GlobalContext from "../../../Context/GlobalContext";
import colors from "../../../Context/Colors";
import "./Sidebar.module.css";

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
                <span style={{fontWeight: "300", fontSize: "12px", display:"inline-block", marginTop: "10px", color: colors.mainTitle[_mode] }}>{process.env.REACT_APP_CWCLOUD_UI_LABEL}</span><br/>
                <span style={{fontWeight: "700"}}>{process.env.REACT_APP_CWCLOUD_UI_URL}</span>
            </div>
            <div style={{ backgroundColor: colors.sideBackground[_mode], borderTopRightRadius: '15px', borderBottomRightRadius: '15px' }}>
            <MenuItem
                id="/dashboard"
                title={context.counterpart('sidebar.dashboard')}
                items={["/dashboard"]}
                icon={<i className="fa-solid fa-gauge" style={{ fontSize: "18px" }}></i>}
                onClick={() => onClick("/dashboard")}
            />
            <MenuItem
                id="/projects"
                title={context.counterpart('sidebar.projects')}
                items={["/projects", "/projects/create"]}
                icon={<i className="fa-solid fa-layer-group" style={{ fontSize: "18px" }}></i>}
                onClick={() => onClick("/projects")}
            />
            <MenuItem
                id="/buckets"
                items={["/buckets"]}
                title={context.counterpart('sidebar.buckets')}
                onClick={() => onClick("/buckets")}
                icon={<i className="fa-solid fa-cube" style={{ fontSize: "18px" }}></i>}
            />
            <MenuItem
                id="/registries"
                items={["/registries"]}
                title={context.counterpart('sidebar.registries')}
                onClick={() => onClick("/registries")}
                icon={<i className="fa-brands fa-docker" style={{ fontSize: "18px" }}></i>}
            />
            <MenuItem
                id="/instances"
                items={["/instances", "/instances/create"]}
                title={context.counterpart('sidebar.instances')}
                icon={<i className="fa-solid fa-microchip" style={{ fontSize: "18px" }}></i>}
                onClick={() => onClick("/instances")}
            />
            {context.user.enabled_features.faasapi && <MenuItem
                id="/function"
                items={["/function/overview", "/function/add", `/function/${id}`, "/invoke/overview", "/triggers/overview"]}
                title={context.counterpart('sidebar.functions.title')}
                icon={<i className="fa-solid fa-code" style={{ fontSize: "18px" }}></i>}
            >
                <MenuItem
                    id="/function/overview"
                    title={context.counterpart('sidebar.functions.overview')}
                    level={2}
                    onClick={() => onClick("/function/overview")}
                />
                <MenuItem
                    id="/function/add"
                    title={context.counterpart('sidebar.functions.add')}
                    level={2}
                    onClick={() => onClick("/function/add")}
                />
                <MenuItem
                    id="/invoke/overview"
                    title={context.counterpart('sidebar.invocations.overview')}
                    level={2}
                    onClick={() => onClick("/invoke/overview")}
                />
                <MenuItem
                    id="/triggers/overview"
                    title={context.counterpart('sidebar.triggers.overview')}
                    level={2}
                    onClick={() => onClick("/triggers/overview")}
                />
            </MenuItem>}
            {context.user.enabled_features.emailapi && <MenuItem
                id="/email"
                items={["/email"]}
                title={context.counterpart('sidebar.manageEmails.title')}
                icon={<i className="fa-solid fa-envelope" style={{ fontSize: "18px" }}></i>}
                onClick={() => onClick("/email")}
            />}
            {context.user.enabled_features.cwaiapi && <MenuItem
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
                    <MenuItem
                        id="/admin/support"
                        items={["/admin/support"]}
                        title={context.counterpart('sidebar.manageSupport.title')}
                        icon={<i className="fa-solid fa-comment-alt" style={{ fontSize: "18px" }}></i>}
                        onClick={() => onClick("/admin/support")}
                    />
                    <MenuItem
                        id="/users"
                        items={["/users/overview", "/users/add", `/user/${id}`]}
                        title={context.counterpart('sidebar.manageUsers.title')}
                        icon={<i className="fa-solid fa-user-group" style={{ fontSize: "18px" }}></i>}
                    >
                        <MenuItem
                            id="/users/overview"
                            title={context.counterpart('sidebar.manageUsers.overview')}
                            level={2}
                            onClick={() => onClick("/users/overview")}
                        />
                        <MenuItem
                            id="/users/add"
                            title={context.counterpart('sidebar.manageUsers.add')}
                            level={2}
                            onClick={() => onClick("/users/add")}
                        />
                    </MenuItem>
                    <MenuItem
                        id="/environment"
                        items={["/environment/overview", "/environment/add", `/environment/${id}`]}
                        title={context.counterpart('sidebar.manageEnvironments.title')}
                        icon={<i className="fa-solid fa-laptop-code" style={{ fontSize: "18px" }}></i>}
                    >
                        <MenuItem
                            id="/environment/overview"
                            title={context.counterpart('sidebar.manageEnvironments.overview')}
                            level={2}
                            onClick={() => onClick("/environment/overview")}
                        />
                        <MenuItem
                            id="/environment/add"
                            title={context.counterpart('sidebar.manageEnvironments.add')}
                            level={2}
                            onClick={() => onClick("/environment/add")}
                        />
                    </MenuItem>
                    <MenuItem
                        id="/admin/projects"
                        items={["/admin/projects", "/admin/projects/create"]}
                        title={context.counterpart('sidebar.manageProjects.title')}
                        icon={<i className="fa-solid fa-layer-group" style={{ fontSize: "18px" }}></i>}
                    >
                        <MenuItem
                            id="/admin/projects"
                            title={context.counterpart('sidebar.manageProjects.overview')}
                            level={2}
                            onClick={() => onClick("/admin/projects")}
                        />
                        <MenuItem
                            id="/admin/projects/create"
                            title={context.counterpart('sidebar.manageProjects.add')}
                            level={2}
                            onClick={() => onClick("/admin/projects/create")}
                        />
                    </MenuItem>
                    <MenuItem
                        id="/admin/buckets"
                        items={["/admin/buckets", "/admin/buckets/create"]}
                        title={context.counterpart('sidebar.manageBuckets.title')}
                        icon={<i className="fa-solid fa-cube" style={{ fontSize: "18px" }}></i>}
                    >
                        <MenuItem
                            id="/admin/buckets"
                            title={context.counterpart('sidebar.manageBuckets.overview')}
                            level={2}
                            onClick={() => onClick("/admin/buckets")}
                        />
                        <MenuItem
                            id="/admin/buckets/create"
                            title={context.counterpart('sidebar.manageBuckets.add')}
                            level={2}
                            onClick={() => onClick("/admin/buckets/create")}
                        />
                    </MenuItem>
                    <MenuItem
                        id="/admin/registries"
                        items={["/admin/registries", "/admin/registries/create"]}
                        title={context.counterpart('sidebar.manageRegistries.title')}
                        icon={<i className="fa-brands fa-docker" style={{ fontSize: "18px" }}></i>}
                    >
                        <MenuItem
                            id="/admin/registries"
                            title={context.counterpart('sidebar.manageRegistries.overview')}
                            level={2}
                            onClick={() => onClick("/admin/registries")}
                        />
                        <MenuItem
                            id="/admin/registries/create"
                            title={context.counterpart('sidebar.manageRegistries.add')}
                            level={2}
                            onClick={() => onClick("/admin/registries/create")}
                        />
                    </MenuItem>
                    <MenuItem
                        id="/admin/instances"
                        items={["/admin/instances", "/admin/instances/create"]}
                        title={context.counterpart('sidebar.manageInstances.title')}
                        icon={<i className="fa-solid fa-microchip" style={{ fontSize: "18px" }}></i>}
                    >
                        <MenuItem
                            id="/admin/instances"
                            title={context.counterpart('sidebar.manageInstances.overview')}
                            level={2}
                            onClick={() => onClick("/admin/instances")}
                        />
                        <MenuItem
                            id="/admin/instances/create"
                            title={context.counterpart('sidebar.manageInstances.add')}
                            level={2}
                            onClick={() => onClick("/admin/instances/create")}
                        />
                    </MenuItem>
                    <MenuItem
                        id="/admin/function"
                        items={["/admin/function", "/admin/triggers", "/admin/invoke"]}
                        title={context.counterpart('sidebar.manageFunctions.title')}
                        icon={<i className="fa-solid fa-code" style={{ fontSize: "18px" }}></i>}
                    >
                        <MenuItem
                            id="/admin/function"
                            title={context.counterpart('sidebar.functions.overview')}
                            level={2}
                            onClick={() => onClick("/admin/function")}
                        />
                        <MenuItem
                            id="/admin/invoke"
                            title={context.counterpart('sidebar.invocations.overview')}
                            level={2}
                            onClick={() => onClick("/admin/invoke")}
                        />
                        <MenuItem
                            id="/admin/triggers"
                            title={context.counterpart('sidebar.triggers.overview')}
                            level={2}
                            onClick={() => onClick("/admin/triggers")}
                        />
                    </MenuItem>
                    <MenuItem
                        id="/admin/email"
                        items={["/admin/email"]}
                        title={context.counterpart('sidebar.manageEmails.title')}
                        icon={<i className="fa-solid fa-envelope" style={{ fontSize: "18px" }}></i>}
                        onClick={() => onClick("/admin/email")}
                    />
                    {process.env.REACT_APP_DISABLE_PAYMENT_FEATURE.includes("false") && <MenuItem
                        id="/admin/vouchers"
                        items={["/admin/vouchers", "/admin/vouchers/create"]}
                        title={context.counterpart('sidebar.manageVouchers.title')}
                        icon={<i className="fa-solid fa-ticket" style={{ fontSize: "18px" }}></i>}
                    >
                        <MenuItem
                            id="/admin/vouchers"
                            title={context.counterpart('sidebar.manageVouchers.overview')}
                            level={2}
                            onClick={() => onClick("/admin/vouchers")}
                        />
                        <MenuItem
                            id="/admin/vouchers/create"
                            title={context.counterpart('sidebar.manageVouchers.add')}
                            level={2}
                            onClick={() => onClick("/admin/vouchers/create")}
                        />
                    </MenuItem>
                    }
                    {process.env.REACT_APP_DISABLE_PAYMENT_FEATURE.includes("false") && <MenuItem
                        id="/admin/invoice"
                        items={["/admin/invoice/generate", "/admin/invoice/overview"]}
                        title={context.counterpart('sidebar.manageInvoices.title')}
                        icon={<i className="fa-solid fa-file-invoice-dollar" style={{ fontSize: "20px" }}></i>}
                    >
                        <MenuItem
                            id="/admin/invoice/overview"
                            title={context.counterpart('sidebar.manageInvoices.overview')}
                            level={2}
                            onClick={() => onClick("/admin/invoice/overview")}
                        />
                        <MenuItem
                            id="/admin/invoice/generate"
                            title={context.counterpart('sidebar.manageInvoices.generate')}
                            level={2}
                            onClick={() => onClick("/admin/invoice/generate")}
                        />
                        <MenuItem
                            id="/admin/invoice/custom"
                            title={context.counterpart('sidebar.manageInvoices.custom')}
                            level={2}
                            onClick={() => onClick("/admin/invoice/custom")}
                        />
                        <MenuItem
                            id="/admin/invoice/edition"
                            title={context.counterpart('sidebar.manageInvoices.edition')}
                            level={2}
                            onClick={() => onClick("/admin/invoice/edition")}
                        />
                    </MenuItem>}
                </React.Fragment>
            }
            </div>
        </MenuList>
    );
}
export default Sidebar;
