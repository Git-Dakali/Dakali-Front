export const DownloadFile = (base64: string, type: string, fileName:string) => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);

    // Crear Blob Excel
    const blob = new Blob([byteArray], {type: type});

    // Crear URL temporal
    const url = URL.createObjectURL(blob);

    // Descargar
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();

    URL.revokeObjectURL(url);
};