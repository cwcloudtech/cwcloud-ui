import React from "react";
import axios from "../../utils/axios";
import { toast } from "react-toastify";
import yaml from "js-yaml";
import GlobalContext from "../../Context/GlobalContext";

export default function useCreateK8sObject() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const { counterpart } = React.useContext(GlobalContext);
  const createObject = (data, yamlValue, onSuccess, setToInvalid) => {
    setError(null);
    const yamlObject = yaml.load(yamlValue);
    if (!yamlObject.name || yamlObject.name === '' || !yamlObject.namespace || yamlObject.namespace === '') {
      toast.error(
        counterpart(
          "dashboard.kubernetesDashboardPages.common.invalidForm"
        )
      );
      setToInvalid();
      return;
    }
    setLoading(true);
    const fd = new FormData();
    fd.append(
      "object_file",
      new Blob([yamlValue], { type: "application/x-yaml" })
    );
    fd.append("object", JSON.stringify(data));
    axios
      .post("/admin/kubernetes/object", fd)
      .then((response) => {
        onSuccess();
      })
      .catch((err) => {
        console.log(err.response.data.error);
        setError(err.response.data.error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return {
    loading,
    createObject,
    error
  };
}
