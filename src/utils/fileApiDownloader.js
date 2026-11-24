export const saveAs = (blob, fileName) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export const fileDownloadFromResponse = (response, mimeType) => {
    fileDownloadFromResponseWithName(response, response.data.file_name, mimeType);
}

export const fileDownloadFromResponseWithName = (response, fileName, mimeType) => {
    const byteCharacters = atob(response.data.blob.toString("base64"));
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });
    saveAs(blob, fileName);
}
