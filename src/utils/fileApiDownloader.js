import { saveAs } from 'file-saver';

export const fileDownloadFromResponse = (response, mimeType) => {
    fileDownloadFromResponseWithName(response, res.data.file_name, mimeType);
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
