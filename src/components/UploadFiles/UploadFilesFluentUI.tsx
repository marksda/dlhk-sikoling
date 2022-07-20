import { CompoundButton, FontIcon, IButtonStyles, IImageProps, Image, ImageFit, Label, mergeStyles, PrimaryButton } from "@fluentui/react"
import { FC, FormEvent, MouseEventHandler, useState } from "react"
import uploadService from "../../features/upload-files/FileUploadService" 
import { FileViewerFluentUi } from "../FileViewer/FileViewerFluentUi";
import  CekTypeFile  from "../../features/file-utils/FileUtils";

export interface IContainerUploadStyle {
    width?: string|number;
    height?: string|number; 
    backgroundColor?: string;
}

const iconClass = mergeStyles({
    fontSize: 32,
    // width: 60,
    height: 36,
    color: '#DDDCDC',
    margin: '0 25px',
});

const containerClass = mergeStyles({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    border: '1px solid #DDDCDC',
    "&:hover": {
        background: "#F4F2F2",
        cursor: 'pointer',
        border: '1px solid #D7D7D7'
    },
})

interface IUploadFilePropsComponent {
    label?: string;
    showPreview?: boolean;
    showListFile: boolean;
    containerStyle?: IContainerUploadStyle;
}
export const UploadFilesFluentUi: FC<IUploadFilePropsComponent> = (props) => {
    const [selectedFiles, setSelectedFiles] = useState<any>(undefined);
    const [currentFile, setCurrentFile] = useState<File|undefined>(undefined);
    const [isImageFile, setIsImageFile] = useState<boolean>(false);
    const [isPDFFile, setIsPdfFile] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    const [message, setMessage] = useState<string>('');
    const [fileInfos, setFileInfos] = useState<any[]>([]);
    // const [imageProps, setImageProps] = useState<IImageProps|undefined>(undefined);
    const styleContainer: Record<string, any> = {};

    if(typeof props.containerStyle === 'undefined') {
        styleContainer.width = 300
        styleContainer.height = 100
        // styleContainer.backgroundColor = '#ECECEC'
    }
    else {
        styleContainer.width = typeof props.containerStyle.width !== 'undefined'?props.containerStyle.width:300
        styleContainer.height = typeof props.containerStyle.height !== 'undefined'?props.containerStyle.height:100
        // styleContainer.backgroundColor = typeof props.containerStyle.backgroundColor !== 'undefined'?props.containerStyle.backgroundColor:'#ECECEC'
    }

    const upload = () => {
        setProgress(0)
        uploadService.upload(currentFile, (event: ProgressEvent) => {
            setProgress(Math.round(100 * event.loaded)/event.total)
        })
        .then((response) => {
            setMessage(response.data.namaFile)
            return 'as test' //uploadService.getFiles(response.data.namaFile)
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

    // const bindClickEventInputFile = (event: FormEvent<HTMLDivElement>) => {
    const bindClickEventInputFile: MouseEventHandler<HTMLElement> = (event) => {
        event.stopPropagation()
        if(typeof currentFile == 'undefined')
            document.getElementById('fileUpload')!.click()
    }

    const handleFile= (event: FormEvent<HTMLInputElement>) => {
        setSelectedFiles(event.currentTarget.files);
        // @ts-ignore: Object is possibly 'null'.
        const file = event.currentTarget.files[0];
        setCurrentFile(file);
        switch (CekTypeFile(file.type)) {
            case 'image':
                setIsImageFile(true);
                break;
            case 'application/pdf':
                setIsPdfFile(true);
                break;
            default:
                break;
        }        
    }

    return(
        <>            
            <input type="file" id="fileUpload" style={{display: 'none'}} onChange={handleFile}/> 
            {
            props.showPreview && 
            <div style={styleContainer} className={containerClass} onClick={bindClickEventInputFile}>                    
                {!currentFile &&<FontIcon aria-label="Ktp" iconName="CircleAddition" className={iconClass} onClick={bindClickEventInputFile}/>}
                {!currentFile &&<Label disabled style={{cursor: 'pointer'}}>{props.label}</Label>}
                {props.showPreview && isImageFile && <FileViewerFluentUi file={currentFile} area={{panjang: 300, lebar: 100}}/>}
                {!props.showPreview && isImageFile && <FontIcon aria-label="image" iconName="FileImage" />}
                {currentFile && <FontIcon aria-label="Ktp" iconName="Delete" />}
            </div>
            }
            {
            !props.showPreview && !currentFile && 
            <CompoundButton
                secondaryText={props.label} 
                onClick={bindClickEventInputFile}
            >
                File
            </CompoundButton>
            }
            {
            !props.showPreview && currentFile && 
            <label>{currentFile.name}</label>
            }
            {currentFile && 
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
            }
            {currentFile &&
            <PrimaryButton
                text="Upload"
                disabled={!selectedFiles}
                onClick={upload}
            />
            }
            <div className="alert alert-light" role="alert">
                {message}
            </div>
            {props.showListFile &&
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
            }
        </>
    )
}