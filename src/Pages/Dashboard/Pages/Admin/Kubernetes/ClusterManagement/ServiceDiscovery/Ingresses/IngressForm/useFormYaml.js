import * as React from "react";
import yaml from "js-yaml";
import axiosInstance from "../../../../../../../../../utils/axios";

function useFormYaml(props) {
  const [yamlValue, setYamlValue] = React.useState("");

  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    axiosInstance
      .get("/admin/kubernetes/object/templates/values?kind=" + props.kind)
      .then((response) => {
        setYamlValue(response.data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [props.kind]);

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
      case "rules":
        yamlObject.rules = [];
        data.forEach((rule) => {
          yamlObject.rules.push({
            host: rule.host,
            http_paths: [],
          });
          yamlObject.rules[rule.id - 1].host = rule.host;
          yamlObject.rules[rule.id - 1].http_paths = [];
          rule.paths.forEach((path) => {
            yamlObject.rules[rule.id - 1].http_paths.push({
              path: path.path,
              pathType: path.pathType,
              backend: {
                service: {
                  name: path.targetService,
                  port: {
                    number: path.port,
                  },
                },
              },
            });
          });
        });
        break;
      case "certificates":
        yamlObject.tls = [];
        data.forEach((cert) => {
          yamlObject.tls.push({
            hosts: cert.hosts.map((host) => host.host),
            secretName: cert.certSecret,
          });
        });
        break;
      case "ingressClass":
        yamlObject.ingressClassName = data;
        break;
      case "defaultBackend":
        yamlObject.defaultBackend = {};
        yamlObject.defaultBackend.service = {};
        yamlObject.defaultBackend.service.name = data.targetService;
        yamlObject.defaultBackend.service.port = {};
        yamlObject.defaultBackend.service.port.number = data.port;
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

export default useFormYaml;
