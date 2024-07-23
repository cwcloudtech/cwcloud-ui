import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import GlobalContext from "../../../../../../Context/GlobalContext";
import axiosInstance from "../../../../../../utils/axios";

const useDnsZones = () => {
  const [dns_zones, setDnsZones] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const context = useContext(GlobalContext);
  const navigate = useNavigate();

  React.useEffect(() => {
    setLoading(true);
    axiosInstance
      .get(`/admin/dns/${context.selectedProvider.name}/dns_zones`)
      .then((res) => {
        setDnsZones(res.data.dns_zones.map((zone,i) => ({
            name: zone,
            id: i+1
        })));
        setLoading(false);
      })
      .catch((error) => {
        navigate("/notfound");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.selectedProvider]);

  return { dns_zones, loading };
};

export default useDnsZones;
