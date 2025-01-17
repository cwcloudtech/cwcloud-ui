import React, { useEffect, useContext } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar/Sidebar";
import IndexNavbar from "./IndexNavbar/IndexNavbar";
import { SidebarProvider } from "../../Context/SidebarContext";
import classes from "./Dashboard.module.css";
import { toast } from "react-toastify";
import { isFalse } from "../../utils/common";
import AddInstance from "./Pages/User/AddInstance/AddInstance";
import AddProject from "./Pages/User/AddProject/AddProject";
import AttachInstance from "./Pages/User/AttachInstance/AttachInstance";
import Billing from "./Pages/User/Billing/Billing";
import BucketOverview from "./Pages/User/BucketOverview/BucketOverview";
import BucketsPage from "./Pages/User/BucketsPage/BucketsPage";
import InstanceOverview from "./Pages/User/InstanceOverview/InstanceOverView";
import InstancesPage from "./Pages/User/InstancesPage/InstancesPage";
import ProjectOverview from "./Pages/User/ProjectOverview/ProjectOverview";
import ProjectsPage from "./Pages/User/ProjectsPage/ProjectsPage";
import UserDashboard from "./Pages/User/UserDashboard/UserDashboard";
import AddEnvironment from "./Pages/Admin/AddEnvironment/AddEnvironment";
import AddUser from "./Pages/Admin/AddUser/AddUser";
import AdminAddBucket from "./Pages/Admin/AdminAddBucket/AdminAddBucket";
import AdminGenerateInvoice from "./Pages/Admin/AdminGenerateInvoice/AdminGenerateInvoice";
import AdminInvoicesOverview from "./Pages/Admin/AdminInvoicesOverview/AdminInvoicesOverview";
import EnvironmentOverview from "./Pages/Admin/EnvironmentOverview/EnvironmentOverview";
import EnvironmentsPage from "./Pages/Admin/EnvironmentsPage/EnvironmentsPage";
import UserOverview from "./Pages/Admin/UserOverview/UserOverview";
import UsersPage from "./Pages/Admin/UsersPage/UsersPage";
import Error from "./Pages/Error/Error";
import RegistriesPage from "./Pages/User/RegistriesPage/RegistriesPage";
import RegistryOverview from "./Pages/User/RegistryOverview/RegistryOverview";
import AdminAddRegistry from "./Pages/Admin/AdminAddRegistry/AdminAddRegistry";
import Credentials from "./Pages/User/Credentials/Credentials";
import Settings from "./Pages/User/Settings/Settings";
import AdminAddVoucher from "./Pages/Admin/AdminAddVoucher/AdminAddVoucher";
import AdminVouchersPage from "./Pages/Admin/AdminVouchersPage/AdminVouchersPage";
import Vouchers from "./Pages/User/Vouchers/Vouchers";
import Ticket from "./Pages/User/Ticket/Ticket";
import ManageSupport from "./Pages/User/ManageSupport/ManageSupport";
import SendEmail from "./Pages/User/SendEmail/SendEmail";
import AdminVoucherPage from "./Pages/Admin/AdminVoucherPage/AdminVoucherPage";
import GlobalContext from "../../Context/GlobalContext";
import colors from "../../Context/Colors";
import FunctionsPage from "./Pages/User/Faas/FunctionsPage/FunctionsPage";
import AddFunction from "./Pages/User/Faas/AddFunction/AddFunction";
import FunctionOverview from "./Pages/User/Faas/FunctionOverview/FunctionOverview";
import TriggersPage from "./Pages/User/Faas/TriggersPage/TriggersPage";
import AddCronFunction from "./Pages/User/Faas/AddCronFunction/AddCronFunction";
import InvocationsPage from "./Pages/User/Faas/InvocationsPage/InvocationsPage";
import InvokeFunction from "./Pages/User/Faas/InvokeFunction/InvokeFunction";
import AdminFunctionsPage from "./Pages/Admin/Faas/AdminFunctionsPage/AdminFunctionsPage";
import AdminFunctionEdit from "./Pages/Admin/Faas/AdminFunctionEdit/AdminFunctionEdit";
import AdminInvocationsPage from "./Pages/Admin/Faas/AdminInvocationsPage/AdminInvocationsPage";
import AdminTriggersPage from "./Pages/Admin/Faas/AdminTriggersPage/AdminTriggersPage";
import AdminCustomInvoice from "./Pages/Admin/AdminCustomInvoice/AdminCustomInvoice";
import AdminEditionInvoice from "./Pages/Admin/AdminEditionInvoice/AdminEditionInvoice";
import ClusterOverview from "./Pages/Admin/Kubernetes/ClusterManagement/Cluster/ClusterOverview";
import ClusterManagementContainer from "./Pages/Admin/Kubernetes/ClusterManagement/ClusterContainer/ClusterManagementContainer";
import Services from "./Pages/Admin/Kubernetes/ClusterManagement/ServiceDiscovery/Services/Services";
import ServiceForm from "./Pages/Admin/Kubernetes/ClusterManagement/ServiceDiscovery/Services/ServiceForm";
import Ingress from "./Pages/Admin/Kubernetes/ClusterManagement/ServiceDiscovery/Ingresses/Ingresses";
import HorizontalPodAutoscaler from "./Pages/Admin/Kubernetes/ClusterManagement/ServiceDiscovery/HorizontalPodAutoscaler";
import Secrets from "./Pages/Admin/Kubernetes/ClusterManagement/Storage/Secrets/Secrets";
import IngressForm from "./Pages/Admin/Kubernetes/ClusterManagement/ServiceDiscovery/Ingresses/IngressForm";
import ConfigMapForm from "./Pages/Admin/Kubernetes/ClusterManagement/Storage/ConfigMaps/ConfigMapForm";
import ConfigMaps from "./Pages/Admin/Kubernetes/ClusterManagement/Storage/ConfigMaps/ConfigMaps";
import SecretsForm from "./Pages/Admin/Kubernetes/ClusterManagement/Storage/Secrets/SecretsForm";
import K8sAppsPage from "./Pages/User/K8sApplications/Page/K8sAppsPage";
import AddK8sApplication from "./Pages/User/K8sApplications/Create/AddK8sApplication";
import K8sEnvironements from "./Pages/Admin/Kubernetes/Environments/K8sEnvironements";
import K8sClusters from "./Pages/Admin/Kubernetes/Clusters/K8sClusters";
import K8sEnvironmentForm from "./Pages/Admin/Kubernetes/K8sEnvironmentForm/K8sEnvironmentForm";
import K8sAppOverview from "./Pages/User/K8sApplications/Overview/K8sOverview";
import AddObjectType from "./Pages/User/iot/AddObjectType/AddObjectType";
import IotOverviewPage from "./Pages/User/iot/Overview/IotOverview";
import ObjectType from "./Pages/User/iot/ObjectType/ObjectType";
import Device from "./Pages/User/iot/Device/Device";
import Devices from "./Pages/User/iot/Devices/Devices";
import AddData from "./Pages/User/iot/AddData/AddData";
import Environments from "./Pages/User/UserDashboard/Environments";
import AddDnsRecord from "./Pages/Admin/AdminDnsRecords/Create/AddDnsRecord";
import AdminDnsOverview from "./Pages/Admin/AdminDnsRecords/Overview/AdminDnsOverview";
import { Box } from "@mui/material";
import AddMonitor from "./Pages/User/Observability/AddMonitor/AddMonitor";
import Monitors from "./Pages/User/Observability/Monitors/Monitors";
import MonitorOverview from "./Pages/User/Observability/MonitorOverview/MonitorOverview";

function Dashboard() {
  const _mode = useContext(GlobalContext).mode;
  const { pathname } = useLocation();
  const state = useLocation();
  useEffect(() => {
    state && toast.success(state.state);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <SidebarProvider>
        <Box
          sx={{ display: "flex" }}
          className={classes.container}
          style={{ background: colors.mainBackground[_mode] }}
        >
          <Sidebar />
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <IndexNavbar />
            <div className={classes.contentBlock}>
              <Routes>
                {/* Admin Routes */}
                <Route exact path="/dashboard" element={<UserDashboard />} />
                <Route
                  exact
                  path="/admin/projects"
                  element={<ProjectsPage />}
                />
                <Route
                  exact
                  path="/admin/projects/create"
                  element={<AddProject />}
                />
                <Route
                  exact
                  path="/admin/project/:projectId"
                  element={<ProjectOverview />}
                />
                <Route
                  exact
                  path="/admin/instances"
                  element={<InstancesPage />}
                />
                <Route
                  exact
                  path="/admin/instances/attach/:projectId"
                  element={<AttachInstance />}
                />
                <Route
                  exact
                  path="/admin/instances/create"
                  element={<AddInstance />}
                />
                <Route
                  exact
                  path="/admin/instance/:instanceId"
                  element={<InstanceOverview />}
                />
                <Route exact path="/admin/buckets" element={<BucketsPage />} />
                <Route
                  exact
                  path="/admin/buckets/create"
                  element={<AdminAddBucket />}
                />
                <Route
                  exact
                  path="/admin/bucket/:bucketId"
                  element={<BucketOverview />}
                />
                <Route
                  exact
                  path="/admin/registries"
                  element={<RegistriesPage />}
                />
                <Route
                  exact
                  path="/admin/registries/create"
                  element={<AdminAddRegistry />}
                />
                <Route
                  exact
                  path="/admin/registry/:registryId"
                  element={<RegistryOverview />}
                />
                <Route
                  exact
                  path="/admin/vouchers"
                  element={<AdminVouchersPage />}
                />
                <Route
                  exact
                  path="/admin/vouchers/create"
                  element={<AdminAddVoucher />}
                />
                <Route
                  exact
                  path="/admin/voucher/:voucherId"
                  element={<AdminVoucherPage />}
                />
                <Route
                  exact
                  path="/admin/support"
                  element={<ManageSupport />}
                />
                <Route
                  exact
                  path="/admin/support/:ticketId"
                  element={<Ticket />}
                />
                <Route
                  exact
                  path="/admin/function/overview"
                  element={<AdminFunctionsPage />}
                />
                <Route
                  exact
                  path="/admin/function/add"
                  element={<AddFunction />}
                />
                <Route
                  exact
                  path="/admin/function/:id"
                  element={<AdminFunctionEdit />}
                />
                <Route
                  exact
                  path="/admin/invocations"
                  element={<AdminInvocationsPage />}
                />
                <Route
                  exact
                  path="/admin/invoke/:id"
                  element={<InvokeFunction />}
                />
                <Route
                  exact
                  path="/admin/triggers"
                  element={<AdminTriggersPage />}
                />
                <Route
                  exact
                  path="/admin/schedule/:id"
                  element={<AddCronFunction />}
                />
                <Route
                  exact
                  path="/admin/iot/overview"
                  element={<IotOverviewPage />}
                />
                <Route exact path="/admin/iot/devices" element={<Devices />} />
                <Route
                  exact
                  path="/admin/iot/add/object-type"
                  element={<AddObjectType />}
                />
                <Route
                  exact
                  path="/admin/iot/object-type/:id"
                  element={<ObjectType />}
                />
                <Route
                  exact
                  path="/admin/iot/add/device"
                  element={<Device />}
                />
                <Route exact path="/admin/iot/add/data" element={<AddData />} />
                <Route exact path="/admin/monitors" element={<Monitors />} />
                <Route exact path="/admin/monitor/add" element={<AddMonitor />} />
                <Route exact path="/admin/monitor/:id" element={<MonitorOverview />} />
                <Route
                  exact
                  path="/admin/environment/overview"
                  element={<EnvironmentsPage />}
                />
                <Route
                  exact
                  path="/admin/environment/add"
                  element={<AddEnvironment />}
                />
                <Route
                  exact
                  path="/admin/environment/:id"
                  element={<EnvironmentOverview />}
                />
                <Route exact path="/admin/email" element={<SendEmail />} />
                <Route
                  exact
                  path="/admin/dns-records/overview"
                  element={<AdminDnsOverview />}
                />
                <Route
                  exact
                  path="/admin/dns-records/add"
                  element={<AddDnsRecord />}
                />
                <Route exact path="/users/overview" element={<UsersPage />} />
                <Route exact path="/users/add" element={<AddUser />} />
                <Route exact path="/user/:userId" element={<UserOverview />} />
                {/* User routes */}
                <Route
                  exact
                  path="/dashboard/environments"
                  element={<Environments />}
                />
                <Route exact path="/credentials" element={<Credentials />} />
                <Route exact path="/settings" element={<Settings />} />
                <Route exact path="/projects" element={<ProjectsPage />} />
                <Route exact path="/projects/create" element={<AddProject />} />
                <Route
                  exact
                  path="/project/:projectId"
                  element={<ProjectOverview />}
                />
                <Route exact path="/instances" element={<InstancesPage />} />
                <Route
                  exact
                  path="/instances/attach/:projectId"
                  element={<AttachInstance />}
                />
                <Route
                  exact
                  path="/instances/create"
                  element={<AddInstance />}
                />
                <Route
                  exact
                  path="/instance/:instanceId"
                  element={<InstanceOverview />}
                />
                <Route exact path="/buckets" element={<BucketsPage />} />
                <Route
                  exact
                  path="/bucket/:bucketId"
                  element={<BucketOverview />}
                />
                <Route exact path="/registries" element={<RegistriesPage />} />
                <Route
                  exact
                  path="/registry/:registryId"
                  element={<RegistryOverview />}
                />
                <Route exact path="/vouchers" element={<Vouchers />} />
                <Route exact path="/support" element={<ManageSupport />} />
                <Route exact path="/support/:ticketId" element={<Ticket />} />
                <Route
                  exact
                  path="/function/overview"
                  element={<FunctionsPage />}
                />
                <Route exact path="/function/add" element={<AddFunction />} />
                <Route
                  exact
                  path="/function/:id"
                  element={<FunctionOverview />}
                />
                <Route
                  exact
                  path="/invocations"
                  element={<InvocationsPage />}
                />
                <Route exact path="/invoke/:id" element={<InvokeFunction />} />
                <Route exact path="/triggers" element={<TriggersPage />} />
                <Route
                  exact
                  path="/schedule/:id"
                  element={<AddCronFunction />}
                />
                <Route
                  exact
                  path="/iot/overview"
                  element={<IotOverviewPage />}
                />
                <Route exact path="/iot/devices" element={<Devices />} />
                <Route
                  exact
                  path="/iot/add/object-type"
                  element={<AddObjectType />}
                />
                <Route
                  exact
                  path="/iot/object-type/:id"
                  element={<ObjectType />}
                />
                <Route exact path="/iot/add/device" element={<Device />} />
                <Route exact path="/iot/add/data" element={<AddData />} />
                <Route exact path="/monitors" element={<Monitors />} />
                <Route exact path="/monitor/add" element={<AddMonitor />} />
                <Route exact path="/monitor/:id" element={<MonitorOverview />} />
                <Route exact path="/email" element={<SendEmail />} />
                <Route exact path="/k8s-applications">
                  <Route exact path="" element={<K8sAppsPage />} />
                  <Route exact path="app/:appId" element={<K8sAppOverview />} />
                  <Route exact path="create" element={<AddK8sApplication />} />
                </Route>
                <Route
                  exact
                  path="/kubernetes/environments"
                  element={<K8sEnvironements />}
                />
                <Route
                  exact
                  path="/kubernetes/environment/create"
                  element={<K8sEnvironmentForm />}
                />
                <Route
                  exact
                  path="/kubernetes/environment/:envId/edit"
                  element={<K8sEnvironmentForm />}
                />
                <Route
                  exact
                  path="/kubernetes/clusters"
                  element={<K8sClusters />}
                />
                <Route
                  exact
                  path="/kubernetes/cluster/:clusterId"
                  element={<ClusterManagementContainer />}
                >
                  <Route exact path="" element={<ClusterOverview />} />
                  <Route exact path="serviceDiscovery">
                    <Route exact path="services">
                      <Route exact path="explore" element={<Services />} />
                      <Route exact path="create" element={<ServiceForm />} />
                    </Route>
                    <Route exact path="ingresses">
                      <Route exact path="explore" element={<Ingress />} />
                      <Route exact path="create" element={<IngressForm />} />
                    </Route>
                    <Route
                      exact
                      path="horizontalPodAutoscaler"
                      element={<HorizontalPodAutoscaler />}
                    />
                  </Route>
                  <Route exact path="storage">
                    <Route exact path="configMaps">
                      <Route exact path="explore" element={<ConfigMaps />} />
                      <Route exact path="create" element={<ConfigMapForm />} />
                    </Route>
                    <Route exact path="secrets">
                      <Route exact path="explore" element={<Secrets />} />
                      <Route exact path="create" element={<SecretsForm />} />
                    </Route>
                  </Route>
                </Route>
                {isFalse(process.env.REACT_APP_DISABLE_PAYMENT_FEATURE) && (
                  <React.Fragment>
                    <Route exact path="/billing" element={<Billing />} />
                    <Route
                      exact
                      path="/admin/invoice/generate"
                      element={<AdminGenerateInvoice />}
                    />
                    <Route
                      exact
                      path="/admin/invoice/overview"
                      element={<AdminInvoicesOverview />}
                    />
                    <Route
                      exact
                      path="/admin/invoice/custom"
                      element={<AdminCustomInvoice />}
                    />
                    <Route
                      exact
                      path="/admin/invoice/edition"
                      element={<AdminEditionInvoice />}
                    />
                  </React.Fragment>
                )}
                <Route path="*" element={<Error />} />
              </Routes>
            </div>
          </Box>
        </Box>
    </SidebarProvider>
  );
}

export default Dashboard;
