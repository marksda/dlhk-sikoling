import http from "./http-common"

const upload = (files: any, subPath: string, onUploadProgress: any) => {
    let formData = new FormData();
    let i: number = 1;

    for(let dataFile of files) {
        formData.append(`file-${i}`, dataFile);
        i++;
    }    
    
    return http.post(subPath, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        onUploadProgress,
    });
};

const getFile = (namaFile: string) => {
    return http.get(`/files/${namaFile}`)
};

export { upload, getFile}