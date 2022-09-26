import http from "./http-common"

const upload = (files: any, onUploadProgress: any) => {
    let formData = new FormData();
<<<<<<< HEAD
    let i: number = 1;
    for(let dataFile of files) {
        formData.append(`file${i}`, dataFile);
        i++;
    }    
    return http.post("/files", formData, {
=======
    formData.append("file", file);
    return http.post("/files/nosc", formData, {
>>>>>>> 64e25b0ecb25fd1074d29b40aaa0cd67721e06e6
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