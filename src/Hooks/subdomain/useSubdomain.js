import { useState } from "react";

function useTableArgs(args, setArgs) {
  const [showArgsModalForm, setShowArgsModalForm] = useState(false);
  const [selectedArg, setSelectedArg] = useState(null);

  const handleChangeArgs = (index, value) => {
    const updatedArgs = [...args];
    updatedArgs[index] = value;
    setArgs(updatedArgs);
  };

  const handleAddNewArgs = () => {
    setSelectedArg(null);
    setArgs([...args, ""]);
    setShowArgsModalForm(true);
  };

  const handleEditArgs = (index) => {
    var selectedArg = args[index];
    setSelectedArg({ index: index, value: selectedArg });
    setShowArgsModalForm(true);
  };

  const handleDeleteArgs = (index) => {
    const updatedArgs = [...args];
    updatedArgs.splice(index, 1);
    setArgs(updatedArgs);
  };

  return {
    showArgsModalForm,
    setShowArgsModalForm,
    selectedArg,
    setSelectedArg,
    handleChangeArgs,
    handleAddNewArgs,
    handleEditArgs,
    handleDeleteArgs,
  };
}

export default useTableArgs;
