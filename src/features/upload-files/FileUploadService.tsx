import http from "./http-common"

const upload = (file: any, onUploadProgress: any) => {
    let formData = new FormData();
    formData.append("file", file);
    return http.post("/files", formData, {
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