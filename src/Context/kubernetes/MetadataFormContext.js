import React, { createContext, useState } from "react";
import useNamespaces from "../../Hooks/kubernetes/useNamespaces";

const MetadataFormContext = createContext();

export function MetadataFormProvider({ children, update, clusterId }) {
  const { loading: loadingNs, namespaces } = useNamespaces(clusterId);

  const [labels, setLabels] = useState([{ id: 1, key: "", value: "" }]);
  const [annotations, setAnnotations] = useState([
    { id: 1, key: "", value: "" },
  ]);
  const [metadata, setMetadata] = useState({
    name: "",
    namespace: "default",
    description: "",
  });

  const updateMetadata = (data) => {
    setMetadata(data);
    update(data, "metadata");
  };

  const updateLabels = (data) => {
    setLabels(data);
    update(data, "labels");
  };

  const updateAnnotations = (data) => {
    setAnnotations(data);
    update(data, "annotations");
  };

  const addLabel = () => {
    const newLabel = {
      id: labels.length + 1,
      key: "",
      value: "",
    };
    updateLabels([...labels, newLabel]);
  };

  const addAnnotation = () => {
    const newAnnotation = {
      id: annotations.length + 1,
      key: "",
      value: "",
    };
    updateAnnotations([...annotations, newAnnotation]);
  };

  const removeLabel = (id) => {
    const updatedlabels = labels.filter((label) => label.id !== id);
    updateLabels(updatedlabels);
  };

  const removeAnnotation = (id) => {
    const updatedAnnotations = annotations.filter(
      (annotation) => annotation.id !== id
    );
    updateAnnotations(updatedAnnotations);
  };

  const updateLabel = (id, data) => {
    const updatedLabel = labels[id - 1];
    updatedLabel.key = data.key;
    updatedLabel.value = data.value;
    updateLabels(labels.map((label) => label));
  };

  const updateAnnotation = (id, data) => {
    const updatedAnnotaions = annotations[id - 1];
    updatedAnnotaions.key = data.key;
    updatedAnnotaions.value = data.value;
    updateAnnotations(annotations.map((annotation) => annotation));
  };

  return (
    <MetadataFormContext.Provider
      value={{
        labels,
        addLabel,
        removeLabel,
        updateLabel,
        annotations,
        addAnnotation,
        removeAnnotation,
        updateAnnotation,
        metadata,
        updateMetadata,
        loadingNs,
        namespaces,
      }}
    >
      {children}
    </MetadataFormContext.Provider>
  );
}

export default MetadataFormContext;
