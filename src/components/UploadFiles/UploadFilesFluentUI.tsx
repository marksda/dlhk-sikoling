import { FC, FormEvent, useEffect, useState } from "react"
import uploadService from "../../features/upload-files/FileUploadService" 


export const UploadFilesFluentUi: FC = () => {
    const [selectedFiles, setSelectedFiles] = useState<any>(undefined)
    const [currentFile, setCurrentFile] = useState<File|undefined>(undefined)
    const [progress, setProgress] = useState<number>(0)
    const [message, setMessage] = useState<string>('')
    const [fileInfos, setFileInfos] = useState<any[]>([])

    const selectFile = (event: FormEvent<HTMLInputElement>) => {
        setSelectedFiles(event.currentTarget.files)
    }

    const upload = () => {
        // let currentFile = selectedFiles[0]
        setProgress(0)
        // setCurrentFile(currentFile)
        uploadService.upload(currentFile, (event: ProgressEvent) => {
            setProgress(Math.round(100 * event.loaded)/event.total)
        })
        .then((response) => {
            setMessage(response.data.namaFile)
            return uploadService.getFiles(response.data.namaFile)
        })
        .then((files) => {
            console.log(files)
            // setFileInfos(files.data)
        })
        .catch(() => {
            setProgress(0)
            setMessage("Could not upload the file!")
            setCurrentFile(undefined)
        })
        setSelectedFiles(undefined)
    }

    // useEffect(() => {
    //     uploadService.getFiles().then((response) => {
    //         setFileInfos(response.data)
    //     })
    // }, [])

    const bindClickEventInputFile = (event: FormEvent<HTMLDivElement>) => {
        let inputElmt: HTMLInputElement = event.currentTarget.firstElementChild as HTMLInputElement
        inputElmt?.click()
    }

    const handleFile= (event: FormEvent<HTMLInputElement>) => {
        setSelectedFiles(event.currentTarget.files)
        const parentElement: HTMLElement = event.currentTarget.parentElement as HTMLElement
        // @ts-ignore: Object is possibly 'null'.
        const file = event.currentTarget.files[0]
        
        setCurrentFile(file)

        const img: HTMLImageElement = new Image()

        const reader = new FileReader()
        reader.onload = () => {
            img.src = reader.result as string
        }
        reader.readAsDataURL(file)
        
        parentElement.appendChild(img);
    }

    return(
        <>            
            <div style={{width: 200, height: 100, border: '1px solid black'}} onClick={bindClickEventInputFile}>
                <input type="file" style={{display: 'none'}} accept="image/*" onChange={handleFile}/>
            </div>
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