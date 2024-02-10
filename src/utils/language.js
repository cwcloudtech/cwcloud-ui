const getSelectedProgrammingLanguage = (selectedLanguage) => {
    if (selectedLanguage === "blockly") {
        return "python"
    } else {
        return selectedLanguage
    }
}

export default getSelectedProgrammingLanguage;