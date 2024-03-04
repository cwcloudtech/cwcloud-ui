import React, { createContext, useState } from "react";

const ServiceFormContext = createContext();

const servicePortIntitalValue = { name: "", protocol: "TCP", port: "", targetPort: "" }
const selectorIntitalValue = { key: "", value: "" }

export function ServiceProvider({ children, update }) {

    const [servicePorts, setServicePorts] = useState([{ id: 1, ...servicePortIntitalValue }]);
    const [ipAddresses, setIpAddresses] = useState({
        ipAddress: "",
        externalIps: [{ id: 1, exIp: "" }]
    });
    const [selectors, setSelectors] = useState([{ id: 1, key: "", value: "" }]);
    const [affinity, setAffinity] = useState({ state: 'None', timeout: 0 });

    // SERVICE PORTS

    const updateServicePorts = (data) => {
        setServicePorts(data);
        update(data, "servicePorts");
    };

    const updateServicePort = (spId, data) => {
        const toUpdate = servicePorts[spId - 1];
        toUpdate.name = data.name;
        toUpdate.port = data.port;
        toUpdate.targetPort = data.targetPort;
        toUpdate.protocol = data.protocol;
        updateServicePorts([...servicePorts]);
    }

    const addServicePort = () => {
        const newServicePort = { id: servicePorts.length + 1, ...servicePortIntitalValue };
        updateServicePorts([...servicePorts, newServicePort]);
    };

    const removeServicePort = (id) => {
        const updatedServicePorts = servicePorts.filter((v) => v.id !== id);
        updateServicePorts(updatedServicePorts);
    };

    // IP ADDRESSES

    const updateIpAddresses = (data) => {
        setIpAddresses(data);
        update(data, "ipAddresses");
    };

    const updateIpAddress = (data) => {
        ipAddresses.ipAddress = data;
        updateIpAddresses({ ...ipAddresses });
    }

    const updateExternalIp = (spId, data) => {
        const toUpdate = ipAddresses.externalIps[spId - 1];
        toUpdate.exIp = data.exIp
        updateIpAddresses({ ...ipAddresses });
    }

    const addExternalIp = () => {
        const updatedValue = { ...ipAddresses }
        const newExternalIp = { id: ipAddresses.externalIps.length + 1, exIp: "" }
        updatedValue.externalIps = [...ipAddresses.externalIps, newExternalIp]
        updateIpAddresses(updatedValue);
    };

    const removeExternalIp = (id) => {
        const updatedValue = { ...ipAddresses }
        updatedValue.externalIps = ipAddresses.externalIps.filter((v) => v.id !== id);
        updateIpAddresses(updatedValue);
    };


    // SELECTORS

    const updateSelectors = (data) => {
        setSelectors(data);
        update(data, "selectors");
    };

    const updateSelector = (id, data) => {
        const toUpdate = selectors[id - 1];
        toUpdate.key = data.key;
        toUpdate.value = data.value;
        updateSelectors([...selectors]);
    }

    const addSelector = () => {
        const newSelector = { id: selectors.length + 1, ...selectorIntitalValue };
        updateSelectors([...selectors, newSelector]);
    };

    const removeSelector = (id) => {
        const updatedSelectors = selectors.filter((v) => v.id !== id);
        updateSelectors(updatedSelectors);
    };

    // Affinity

    const updateAffinity = (data) => {
        setAffinity(data);
        update(data, "affinity");
    }

    return (
        <ServiceFormContext.Provider
            value={{
                servicePorts,
                addServicePort,
                updateServicePort,
                updateServicePorts,
                removeServicePort,
                ipAddresses,
                addExternalIp,
                updateIpAddress,
                updateExternalIp,
                updateIpAddresses,
                removeExternalIp,
                selectors,
                addSelector,
                updateSelector,
                updateSelectors,
                removeSelector,
                affinity,
                updateAffinity
            }}
        >
            {children}
        </ServiceFormContext.Provider>
    );
}

export default ServiceFormContext;
