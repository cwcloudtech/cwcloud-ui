import React, { useEffect, useContext, lazy, Suspense } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar/Sidebar";
import IndexNavbar from "./IndexNavbar/IndexNavbar";
import { SidebarProvider } from "../../Context/SidebarContext";
import SecondarySidebarSlot from "../../Components/CollapsableSidebar/SecondarySidebar/SecondarySidebarSlot";
import classes from "./Dashboard.module.css";
import { toast } from "react-toastify";
import GlobalContext from "../../Context/GlobalContext";
import colors from "../../Context/Colors";
import { Box } from "@mui/material";

const AddInstance = lazy(() => import("./Pages/User/AddInstance/AddInstance"));
const AddProject = lazy(() => import("./Pages/User/AddProject/AddProject"));
const AttachInstance = lazy(() => import("./Pages/User/AttachInstance/AttachInstance"));
const BucketOverview = lazy(() => import("./Pages/User/BucketOverview/BucketOverview"));
const BucketsPage = lazy(() => import("./Pages/User/BucketsPage/BucketsPage"));
const InstanceOverview = lazy(() => import("./Pages/User/InstanceOverview/InstanceOverView"));
const InstancesPage = lazy(() => import("./Pages/User/InstancesPage/InstancesPage"));
const ProjectOverview = lazy(() => import("./Pages/User/ProjectOverview/ProjectOverview"));
const ProjectsPage = lazy(() => import("./Pages/User/ProjectsPage/ProjectsPage"));
const UserDashboard = lazy(() => import("./Pages/User/UserDashboard/UserDashboard"));
const AddEnvironment = lazy(() => import("./Pages/Admin/AddEnvironment/AddEnvironment"));
const AddUser = lazy(() => import("./Pages/Admin/AddUser/AddUser"));
const AdminAddBucket = lazy(() => import("./Pages/Admin/AdminAddBucket/AdminAddBucket"));
const EnvironmentOverview = lazy(() => import("./Pages/Admin/EnvironmentOverview/EnvironmentOverview"));
const EnvironmentsPage = lazy(() => import("./Pages/Admin/EnvironmentsPage/EnvironmentsPage"));
const UserOverview = lazy(() => import("./Pages/Admin/UserOverview/UserOverview"));
const UsersPage = lazy(() => import("./Pages/Admin/UsersPage/UsersPage"));
const Error = lazy(() => import("./Pages/Error/Error"));
const RegistriesPage = lazy(() => import("./Pages/User/RegistriesPage/RegistriesPage"));
const RegistryOverview = lazy(() => import("./Pages/User/RegistryOverview/RegistryOverview"));
const AdminAddRegistry = lazy(() => import("./Pages/Admin/AdminAddRegistry/AdminAddRegistry"));
const Credentials = lazy(() => import("./Pages/User/Credentials/Credentials"));
const Settings = lazy(() => import("./Pages/User/Settings/Settings"));
const Ticket = lazy(() => import("./Pages/User/Ticket/Ticket"));
const ManageSupport = lazy(() => import("./Pages/User/ManageSupport/ManageSupport"));
const SendEmail = lazy(() => import("./Pages/User/SendEmail/SendEmail"));
const ContactForms = lazy(() => import("./Pages/User/ContactForm/ContactForms/ContactForms"));
const AddContactForm = lazy(() => import("./Pages/User/ContactForm/AddContactForm/AddContactForm"));
const ContactFormOverview = lazy(() => import("./Pages/User/ContactForm/ContactFormOverview/ContactFormOverview"));
const FunctionsPage = lazy(() => import("./Pages/User/Faas/FunctionsPage/FunctionsPage"));
const AddFunction = lazy(() => import("./Pages/User/Faas/AddFunction/AddFunction"));
const FunctionOverview = lazy(() => import("./Pages/User/Faas/FunctionOverview/FunctionOverview"));
const TriggersPage = lazy(() => import("./Pages/User/Faas/TriggersPage/TriggersPage"));
const AddCronFunction = lazy(() => import("./Pages/User/Faas/AddCronFunction/AddCronFunction"));
const InvocationsPage = lazy(() => import("./Pages/User/Faas/InvocationsPage/InvocationsPage"));
const InvokeFunction = lazy(() => import("./Pages/User/Faas/InvokeFunction/InvokeFunction"));
const AdminFunctionsPage = lazy(() => import("./Pages/Admin/Faas/AdminFunctionsPage/AdminFunctionsPage"));
const AdminFunctionEdit = lazy(() => import("./Pages/Admin/Faas/AdminFunctionEdit/AdminFunctionEdit"));
const AdminInvocationsPage = lazy(() => import("./Pages/Admin/Faas/AdminInvocationsPage/AdminInvocationsPage"));
const AdminTriggersPage = lazy(() => import("./Pages/Admin/Faas/AdminTriggersPage/AdminTriggersPage"));
const ClusterOverview = lazy(() => import("./Pages/Admin/Kubernetes/ClusterManagement/Cluster/ClusterOverview"));
const ClusterManagementContainer = lazy(() => import("./Pages/Admin/Kubernetes/ClusterManagement/ClusterContainer/ClusterManagementContainer"));
const Services = lazy(() => import("./Pages/Admin/Kubernetes/ClusterManagement/ServiceDiscovery/Services/Services"));
const ServiceForm = lazy(() => import("./Pages/Admin/Kubernetes/ClusterManagement/ServiceDiscovery/Services/ServiceForm"));
const Ingress = lazy(() => import("./Pages/Admin/Kubernetes/ClusterManagement/ServiceDiscovery/Ingresses/Ingresses"));
const HorizontalPodAutoscaler = lazy(() => import("./Pages/Admin/Kubernetes/ClusterManagement/ServiceDiscovery/HorizontalPodAutoscaler"));
const Secrets = lazy(() => import("./Pages/Admin/Kubernetes/ClusterManagement/Storage/Secrets/Secrets"));
const IngressForm = lazy(() => import("./Pages/Admin/Kubernetes/ClusterManagement/ServiceDiscovery/Ingresses/IngressForm"));
const ConfigMapForm = lazy(() => import("./Pages/Admin/Kubernetes/ClusterManagement/Storage/ConfigMaps/ConfigMapForm"));
const ConfigMaps = lazy(() => import("./Pages/Admin/Kubernetes/ClusterManagement/Storage/ConfigMaps/ConfigMaps"));
const SecretsForm = lazy(() => import("./Pages/Admin/Kubernetes/ClusterManagement/Storage/Secrets/SecretsForm"));
const K8sAppsPage = lazy(() => import("./Pages/User/K8sApplications/Page/K8sAppsPage"));
const AddK8sApplication = lazy(() => import("./Pages/User/K8sApplications/Create/AddK8sApplication"));
const K8sEnvironements = lazy(() => import("./Pages/Admin/Kubernetes/Environments/K8sEnvironements"));
const K8sClusters = lazy(() => import("./Pages/Admin/Kubernetes/Clusters/K8sClusters"));
const K8sEnvironmentForm = lazy(() => import("./Pages/Admin/Kubernetes/K8sEnvironmentForm/K8sEnvironmentForm"));
const K8sAppOverview = lazy(() => import("./Pages/User/K8sApplications/Overview/K8sOverview"));
const AddObjectType = lazy(() => import("./Pages/User/iot/AddObjectType/AddObjectType"));
const IotOverviewPage = lazy(() => import("./Pages/User/iot/Overview/IotOverview"));
const ObjectType = lazy(() => import("./Pages/User/iot/ObjectType/ObjectType"));
const Device = lazy(() => import("./Pages/User/iot/Device/Device"));
const Devices = lazy(() => import("./Pages/User/iot/Devices/Devices"));
const AddData = lazy(() => import("./Pages/User/iot/AddData/AddData"));
const Environments = lazy(() => import("./Pages/User/UserDashboard/Environments"));
const AddDnsRecord = lazy(() => import("./Pages/Admin/AdminDnsRecords/Create/AddDnsRecord"));
const AdminDnsOverview = lazy(() => import("./Pages/Admin/AdminDnsRecords/Overview/AdminDnsOverview"));
const AddMonitor = lazy(() => import("./Pages/User/Observability/AddMonitor/AddMonitor"));
const Monitors = lazy(() => import("./Pages/User/Observability/Monitors/Monitors"));
const MonitorOverview = lazy(() => import("./Pages/User/Observability/MonitorOverview/MonitorOverview"));
const KVStorage = lazy(() => import("./Pages/User/KVStorage/Overview/KVStorage"));
const AddKV = lazy(() => import("./Pages/User/KVStorage/AddKV/AddKV"));
const EditKV = lazy(() => import("./Pages/User/KVStorage/EditKV/EditKV"));
const PodLogs = lazy(() => import("./Pages/Admin/Kubernetes/ClusterManagement/PodLogs/PodLogs"));
const PodTerminal = lazy(() => import("./Pages/Admin/Kubernetes/ClusterManagement/PodTerminal/PodTerminal"));
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
          <SecondarySidebarSlot />
          <Box component="main" sx={{ flexGrow: 1, minWidth: 0, p: 3 }}>
            <IndexNavbar />
            <div className={classes.contentBlock}>
              <Suspense fallback={null}>
              <Routes>
                {/* Admin Routes */}
                <Route exact path="/dashboard" element={<UserDashboard />} />
                <Route
                  exact
                  path="/admin/projects"
                  element={<ProjectsPage />}
                />
                <Route 
                path="/kubernetes/pod-logs/:podName/:namespace" 
                 element={<PodLogs />}
                exact 
                />
                <Route 
                  path="/kubernetes/pod-terminal/:podName/:namespace" 
                   element={<PodTerminal />}
                  exact 
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
                <Route exact path="/admin/kv" element={<KVStorage />} />
                <Route exact path="/admin/kv/edit/:key" element={<EditKV />} />
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
                <Route exact path="/admin/emails" element={<Navigate to="/admin/email" replace />} />
                <Route exact path="/admin/contactForms" element={<ContactForms />} />
                <Route exact path="/admin/contactForm/add" element={<AddContactForm />} />
                <Route exact path="/admin/contactForm/:id" element={<ContactFormOverview />} />
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
                <Route exact path="/kv" element={<KVStorage />} />
                <Route exact path="/kv/create" element={<AddKV />} />
                <Route exact path="/kv/edit/:key" element={<EditKV />} />
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
                <Route exact path="/contactForms" element={<ContactForms />} />
                <Route exact path="/contactForm/add" element={<AddContactForm />} />
                <Route exact path="/contactForm/:id" element={<ContactFormOverview />} />
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
                <Route path="*" element={<Error />} />
              </Routes>
              </Suspense>
            </div>
          </Box>
        </Box>
    </SidebarProvider>
  );
}

export default Dashboard;
