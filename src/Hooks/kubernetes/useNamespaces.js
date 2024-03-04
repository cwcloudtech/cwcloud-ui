import React from "react";
import axiosInstance from "../../utils/axios";
import {toast} from "react-toastify";

export default function useNamespaces(clusterId) {
  const [namespaces, setNamespaces] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if(!clusterId) return;
    axiosInstance
      .get(`/admin/kubernetes/object/cluster/${clusterId}/general/namespaces`)
      .then((response) => {
        setNamespaces(response.data);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [clusterId]);

  return {
    namespaces,
    loading,
  };
}
