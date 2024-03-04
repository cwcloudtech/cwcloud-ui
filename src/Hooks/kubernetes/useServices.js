import React from "react";
import axiosInstance from "../../utils/axios";
import {toast} from "react-toastify";

export default function useServices(clusterId) {
  const [services, setServices] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    axiosInstance
      .get(`/admin/kubernetes/object/cluster/${clusterId}/general/services`)
      .then((response) => {
        setServices(response.data);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [clusterId]);

  return {
    services,
    loading,
  };
}
