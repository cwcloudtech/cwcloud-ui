import * as React from "react";
import yaml from "js-yaml";
import axiosInstance from "../../utils/axios";

function useServiceFormYaml(props) {
  const [yamlValue, setYamlValue] = React.useState("");

  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    axiosInstance
      .get("/admin/kubernetes/object/templates/values?kind=service")
      .then((response) => {
        setYamlValue(response.data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const updateValues = (data, type) => {
    if (!yamlValue || !data) return;
    const yamlObject = yaml.load(yamlValue);
    switch (type) {
      case "metadata":
        yamlObject.name = data.name;
        yamlObject.namespace = data.namespace;
        if (data.description !== '') {
          yamlObject.annotations['field.cattle.io/description'] = data.description;
        }
        if ('field.cattle.io/description' in yamlObject.annotations && data.description === '') {
          delete yamlObject.annotations['field.cattle.io/description'];
        }
        break;
      case "annotations":
        const description = yamlObject.annotations['field.cattle.io/description'];
        yamlObject.annotations = {};
        if (description) {
          yamlObject.annotations['field.cattle.io/description'] = description;
        }
        data.forEach(({ key, value }) => {
          yamlObject.annotations[key] = value;
        });
        break;
      case "labels":
        yamlObject.labels = {};
        data.forEach(({ key, value }) => {
          yamlObject.labels[key] = value;
        });
        break;
      case 'servicePorts':
        yamlObject.ports = []
        data.forEach(servicePort => {
          yamlObject.ports.push({
            port: servicePort.port,
            protocol: servicePort.protocol,
            targetPort: servicePort.targetPort,
            name: servicePort.name,
          });
        });
        break;
      case 'ipAddresses':
        yamlObject.externalIPs = []
        data.externalIps.forEach(item => {
          yamlObject.externalIPs.push(item.exIp);
        });
        yamlObject.clusterIP = data.ipAddress;
        break;
      case 'selectors':
        yamlObject.selector = {}
        data.forEach(({ key, value }) => {
          yamlObject.selector[key] = value;
        });
        break;
      case 'affinity':
        yamlObject.sessionAffinity = data.state
        if (data.state === 'None')
          break;
        yamlObject.sessionAffinity = data.state;
        yamlObject.affinityConfig_clientIP_timeout = data.timeout;
        break;
      default:
        break;
    }
    const newYamlContent = yaml.dump(yamlObject);

    setYamlValue(newYamlContent);
  };

  return {
    yamlValue,
    loading,
    setYamlValue,
    updateValues,
  };
}

export default useServiceFormYaml;
