import React from "react";
import axiosInstance from "../../utils/axios";

export default function useUpdateYaml(clusterId, endpoint, onSuccess, withFlux) {
  const [yamlValue, setYamlValue] = React.useState("");

  const [loading, setLoading] = React.useState(false);
  const [updateLoading, setupdateLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [selectedObject, setSelectedObject] = React.useState(undefined);

  React.useEffect(() => {
    if (selectedObject) getYaml();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedObject]);

  const getYaml = (data) => {
    setLoading(true);
    const object = data ? data : selectedObject;

    axiosInstance
      .get(
        `/admin/kubernetes/object/cluster/${clusterId}/yaml?kind=${object.kind}&name=${object.name}&namespace=${object.namespace}`
      )
      .then((response) => {
        setYamlValue(response.data);
        if (data) {
          const a = document.createElement("a");
          a.href = URL.createObjectURL(
            new Blob([response.data], { type: "text/plain" })
          );
          a.setAttribute("download", `${object.name}.yaml`);
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }

      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const updateYaml = () => {
    setupdateLoading(true);
    const fd = new FormData();

    fd.append(
      "yaml_file",
      new Blob([yamlValue], { type: "application/x-yaml" })
    );

    if (withFlux) {
      fd.append("object", JSON.stringify({ "app_id": withFlux.app_id, "kind": selectedObject.kind }));
    } else {
      fd.append("object", JSON.stringify(selectedObject));
    }

    axiosInstance
      .put(endpoint, fd)
      .then((response) => {
        onSuccess();
      })
      .catch((error) => {
        setError(error.response.data.error);
      })
      .finally(() => {
        setupdateLoading(false);
      });
  };

  return {
    setSelectedObject,
    getYaml,
    updateYaml,
    setYamlValue,
    selectedObject,
    loading,
    updateLoading,
    yamlValue,
    error
  };
}
