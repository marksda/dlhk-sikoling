import { FC, FormEvent, useEffect, useState } from "react"
import uploadService from "../../features/upload-files/FileUploadService" 


export const UploadFilesFluentUi: FC = () => {
    const [selectedFiles, setSelectedFiles] = useState<any>(undefined)
    const [currentFile, setCurrentFile] = useState(undefined)
    const [progress, setProgress] = useState<number>(0)
    const [message, setMessage] = useState<string>('')
    const [fileInfos, setFileInfos] = useState<any[]>([])

    const selectFile = (event: FormEvent<HTMLInputElement>) => {
        setSelectedFiles(event.currentTarget.files)
    }

    const upload = () => {
        let currentFile = selectedFiles[0]
        setProgress(0)
        setCurrentFile(currentFile)
        uploadService.upload(currentFile, (event: ProgressEvent) => {
            setProgress(Math.round(100 * event.loaded)/event.total)
        })
        .then((response) =>{
            setMessage(response.data.message)
            return uploadService.getFiles()
        })
        .then((files) => {
            setFileInfos(files.data)
        })
        .catch(() => {
            setProgress(0)
            setMessage("Could not upload the file!")
            setCurrentFile(undefined)
        })
        setSelectedFiles(undefined)
    }

    useEffect(() => {
        uploadService.getFiles().then((response) => {
            setFileInfos(response.data)
        })
    }, [])

    return(
        <>
            {currentFile && (
                <div className="progress">
                    <div
                        className="progress-bar progress-bar-info progress-bar-striped"
                        role="progressbar"
                        aria-valuenow={progress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        style={{ width: progress + "%" }}
                    >
                        {progress}%
                    </div>
                </div>
            )}
            <label className="btn btn-default">
                <input type="file" onChange={selectFile} />
            </label>
            <button
                className="btn btn-success"
                disabled={!selectedFiles}
                onClick={upload}
            >
                Upload
            </button>
            <div className="alert alert-light" role="alert">
                {message}
            </div>
            <div className="card">
                <div className="card-header">List of Files</div>
                <ul className="list-group list-group-flush">
                {fileInfos &&
                    fileInfos.map((file, index) => (
                    <li className="list-group-item" key={index}>
                        <a href={file.url}>{file.name}</a>
                    </li>
                    ))}
                </ul>
            </div>
        </>
    )
}