import React, { createContext, useState } from "react";
import useServices from "../../Hooks/kubernetes/useServices";
import MetadataFormContext from "./MetadataFormContext";
import axiosInstance from "../../utils/axios";
import { toast } from "react-toastify";

const IngressFormContext = createContext();

export function IngressFormProvider({ children, update, clusterId }) {
  const [rules, setRules] = useState([
    {
      id: 1,
      host: "",
      paths: [
        {
          id: 1,
          pathType: "Prefix",
          path: "",
          targetService: "",
          port: null,
        },
      ],
    },
  ]);

  const [certificates, setCertificates] = useState([
    {
      id: 1,
      certSecret: "",
      hosts: [
        {
          id: 1,
          host: "",
        },
      ],
    },
  ]);

  const [defaultBackend, setDefaultBackend] = useState({
    targetService: "",
    port: null,
  });
  const [ingressClass, setIngressClass] = useState("");
  const [ingressClassOptions, setIngressClassOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { loading: loadingSr, services } = useServices(clusterId);

  const [servicesOptions, setServicesOptions] = useState([]);

  const { metadata ,loadingNs, namespaces } = React.useContext(MetadataFormContext);

  React.useEffect(() => {
    axiosInstance
    .get(`/admin/kubernetes/object/cluster/${clusterId}/general/ingressClasses`)
    .then((response) => {
      setIngressClassOptions(response.data);
    })
    .catch((error) => {
      toast.error(error.response.data.message);
    })
    .finally(() => {
      setLoading(false);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (!loadingNs && !loadingSr) {
      const servicesOptions = [];
      services.forEach((service) => {
        if (service.namespace === metadata.namespace) {
            servicesOptions.push({
              label: `${service.name}`,
              value: `${service.name}`,
            });
          }
        });
      setServicesOptions(servicesOptions);
    }
  }, [loadingNs, loadingSr, namespaces, services, metadata]);

  React.useEffect(() => {
    if(servicesOptions.length > 0)
      rules.forEach((rule) => {
        rule.paths.forEach((path) => {
          path.targetService = servicesOptions[0].value;
        });
      });
      setRules(rules.map((rule) => rule));

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [servicesOptions]);

  const updateRules = (data) => {
    setRules(data);
    update(data, "rules");
  };

  const addRule = () => {
    const newRule = {
      id: rules.length + 1,
      host: "",
      paths: [
        {
          id: 1,
          pathType: "Prefix",
          path: "",
          targetService: servicesOptions[0].value,
          port: null,
        },
      ],
    };
    updateRules([...rules, newRule]);
  };

  const removeRule = (id) => {
    const updatedRules = rules.filter((rule) => rule.id !== id);
    updateRules(updatedRules);
  };

  const addPath = (ruleId) => {
    const newPath = {
      id: rules[ruleId - 1].paths.length + 1,
      pathType: "Prefix",
      path: "",
      targetService: servicesOptions[0].value,
      port: "",
    };
    rules[ruleId - 1].paths.push(newPath);
    updateRules(rules.map((rule) => rule));
  };

  const removePath = (ruleId, pathId) => {
    const updatedPaths = rules[ruleId - 1].paths.filter(
      (path) => path.id !== pathId
    );
    const newRule = rules[ruleId - 1];
    newRule.paths = updatedPaths;
    updateRules(rules.map((rule) => rule));
  };

  const updateRule = (ruleId, data) => {
    const updatedRule = rules[ruleId - 1];
    updatedRule.host = data.host;
    updatedRule.paths = data.paths;
    updateRules(rules.map((rule) => rule));
  };

  const updatePath = (ruleId, pathId, data) => {
    const updatedPaths = rules[ruleId - 1].paths.map((path) => {
      if (path.id === pathId) {
        path = data;
      }
      return path;
    });
    const newRule = rules[ruleId - 1];
    newRule.paths = updatedPaths;
    updateRules(rules.map((rule) => rule));
  };

  const addCertificate = () => {
    const newRule = {
      id: certificates.length + 1,
      certSecret: "",
      hosts: [
        {
          id: 1,
          host: "",
        },
      ],
    };
    updateCertificates([...certificates, newRule]);
  };

  const removeCertificate = (id) => {
    const updatedCrts = certificates.filter((rule) => rule.id !== id);
    updateCertificates(updatedCrts);
  };

  const addHost = (crtId) => {
    const newHost = {
      id: certificates[crtId - 1].hosts.length + 1,
      path: "",
    };
    certificates[crtId - 1].hosts.push(newHost);
    updateCertificates(certificates.map((crt) => crt));
  };

  const removeHost = (crtId, pathId) => {
    const updatedHosts = certificates[crtId - 1].hosts.filter(
      (path) => path.id !== pathId
    );
    const newCrt = certificates[crtId - 1];
    newCrt.hosts = updatedHosts;
    updateCertificates(certificates.map((crt) => crt));
  };

  const updateHost = (crtId, hostId, data) => {
    const updatedHosts = certificates[crtId - 1].hosts.map((host) => {
      if (host.id === hostId) {
        host = data;
      }
      return host;
    });
    const newCrt = certificates[crtId - 1];
    newCrt.hosts = updatedHosts;
    updateCertificates(certificates.map((crt) => crt));
  };

  const updateCertificate = (crtId, data) => {
    const updatedCrt = certificates[crtId - 1];
    updatedCrt.certSecret = data.certSecret;
    updatedCrt.hosts = data.hosts;
    updateCertificates(certificates.map((crt) => crt));
  };

  const updateCertificates = (data) => {
    setCertificates(data);
    update(data, "certificates");
  };

  const updateDefaultBackend = (data) => {
    setDefaultBackend(data);
    update(data, "defaultBackend");
  };

  const updateIngressClass = (data) => {
    setIngressClass(data);
    update(data, "ingressClass");
  };

  return (
    <IngressFormContext.Provider
      value={{
        rules,
        addRule,
        removeRule,
        addPath,
        removePath,
        updateRule,
        updatePath,
        certificates,
        addCertificate,
        removeCertificate,
        addHost,
        removeHost,
        updateHost,
        updateCertificate,
        defaultBackend,
        updateDefaultBackend,
        ingressClass,
        ingressClassOptions,
        loading,
        updateIngressClass,
        servicesOptions,
      }}
    >
      {children}
    </IngressFormContext.Provider>
  );
}

export default IngressFormContext;
