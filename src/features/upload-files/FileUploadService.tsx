import http from "./http-common"

const upload = (files: any, onUploadProgress: any) => {
    let formData = new FormData();
    let i: number = 1;
    
    for(let dataFile of files) {
        formData.append(`file${i}`, dataFile);
        i++;
    }    
    
    return http.post("/files/nosc", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        onUploadProgress,
    });
};

const getFiles = (namaFile: string) => {
    return http.get(`/files/${namaFile}`)
};

export default { upload, getFiles }