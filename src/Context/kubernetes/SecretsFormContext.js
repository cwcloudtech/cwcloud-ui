import React, { createContext, useState } from "react";

const SecretsFormContext = createContext();
const secretData = {
  key: "",
  value: "",
};
export function SecretsFormProvider({ children, update }) {
  const [secrets, setSecrets] = useState([{ id: 1, ...secretData }]);

  const updateSecrets = (data) => {
    setSecrets(data);
    update(data,"data");
  };

  const addSecretData = () => {
    updateSecrets([...secrets, { id: secrets.length + 1, ...secretData }]);
  };

  const removeSecretData = (id) => {
    const newSecrets = secrets.filter((secret) => secret.id !== id);
    updateSecrets(newSecrets);
  };

  const updateSecretData = (id, data) => {
    const newSecrets = secrets.map((secret) => {
      if (secret.id === id) {
        return { ...secret, ...data };
      }
      return secret;
    });
    updateSecrets(newSecrets);
  };

  return (
    <SecretsFormContext.Provider
      value={{
        secrets,
        updateSecretData,
        addSecretData,
        removeSecretData,
      }}
    >
      {children}
    </SecretsFormContext.Provider>
  );
}

export default SecretsFormContext;
