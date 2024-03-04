import React, { createContext, useState } from "react";

const ConfigMapFormContext = createContext();

const dataIntitalValue = { key: "", value: "" }

export function ConfigMapProvider({ children, update }) {

    const [cmData, setCmData] = useState([{ id: 1, ...dataIntitalValue }]);
    const [binaryData, setBinaryData] = useState([{ id: 1, ...dataIntitalValue }]);

    // DATA

    const updateCmData = (data) => {
        setCmData(data);
        update(data, "data");
    };

    const updateSingleCmData = (id, data) => {
        const toUpdate = cmData[id - 1];
        toUpdate.key = data.key;
        toUpdate.value = data.value;
        updateCmData([...cmData]);
    }

    const addSingleCmData = () => {
        const newSingleCmData = { id: cmData.length + 1, ...dataIntitalValue };
        updateCmData([...cmData, newSingleCmData]);
    };

    const removeSingleCmData = (id) => {
        const updatedCmData = cmData.filter((v) => v.id !== id);
        updateCmData(updatedCmData);
    };

    // BINARY DATA

    const updateBinaryData = (data) => {
        setBinaryData(data);
        update(data, "binaryData");
    };

    const updateSingleBinaryData = (id, data) => {
        const toUpdate = binaryData[id - 1];
        toUpdate.key = data.key;
        toUpdate.value = data.value;
        updateBinaryData([...binaryData]);
    }

    const addSingleBinaryData = () => {
        const newSingleBinaryData = { id: binaryData.length + 1, ...dataIntitalValue };
        updateBinaryData([...binaryData, newSingleBinaryData]);
    };

    const removeSingleBinaryData = (id) => {
        const updatedBinaryData = binaryData.filter((v) => v.id !== id);
        updateBinaryData(updatedBinaryData);
    };

    return (
        <ConfigMapFormContext.Provider
            value={{
                cmData,
                addSingleCmData,
                updateSingleCmData,
                updateCmData,
                removeSingleCmData,
                binaryData,
                addSingleBinaryData,
                updateSingleBinaryData,
                updateBinaryData,
                removeSingleBinaryData
            }}
        >
            {children}
        </ConfigMapFormContext.Provider>
    );
}

export default ConfigMapFormContext;
