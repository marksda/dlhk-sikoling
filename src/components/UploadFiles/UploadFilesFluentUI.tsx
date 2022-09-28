import { 
    CompoundButton, DirectionalHint, FontIcon, IButtonStyles, 
    Label, mergeStyles, PrimaryButton, TeachingBubble } from "@fluentui/react";
import { FC, FormEvent, MouseEventHandler, useCallback, useEffect, useState } from "react";
import uploadService from "../../features/upload-files/FileUploadService"; 
import { FileImageViewerFluentUi } from "../FileViewer/FileImageViewerFluentUi";
import  CekTypeFile  from "../../features/file-utils/FileUtils";
import {useBoolean, useId} from "@fluentui/react-hooks";

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

export interface IUploadMode {
    controlled: boolean;
    startUpload?: boolean;
    subUri: string;
};

interface IUploadFilePropsComponent {
    label?: string;
    id?: string;
    showPreview?: boolean;
    showListFile: boolean;
    containerStyle?: IContainerUploadStyle;
    teachingBubbleVisible?: boolean;
    teachingBubbleText?: string;
    jenisFile?: string;
    maxSize?: number;
    luasArea?: {panjang: number; lebar: number;};
    showButtonUpload?: boolean;
    showProgressBar?: boolean;
    setFile?: (File: File) => void;
    uploadStatus?: boolean;
    setIsFileExist?: (data: boolean) => void;
    setUploadStatus?: (data: boolean) => void;    
    uploadMode: IUploadMode;
    setUploadMode: any;
}

const buttonStyles: Partial<IButtonStyles> = { root: { maxWidth: 300 } };

export const UploadFilesFluentUi: FC<IUploadFilePropsComponent> = (props) => {
    //local state
    // const [uploadStatus, setUploadStatus] = useState<boolean>(false);
    const [selectedFiles, setSelectedFiles] = useState<any>(undefined);
    const [currentFile, setCurrentFile] = useState<File|undefined>(undefined);
    const [isImageFile, setIsImageFile] = useState<boolean>(false);
    // const [isPDFFile, setIsPdfFile] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    const [message, setMessage] = useState<string>('');
    const [fileInfos, setFileInfos] = useState<any[]>([]);
    // const [imageProps, setImageProps] = useState<IImageProps|undefined>(undefined);
    const [styleContainer, setStyleContainer] = useState<Record<string, any>>({
        'width': 300,
        'height': 100,
        'padding': 2,
    });
    const [teachingBubbleVisible, {toggle: toggleTeachingBubbleVisible}] = useBoolean(props.teachingBubbleVisible!);   
    console.log(props.uploadMode); 
    //jika props.luasArea dipakai maka setting styleContainer
    useEffect(
        () => {
            if(typeof props.luasArea !== 'undefined') {
                setStyleContainer({
                    'width': props.luasArea?.panjang,
                    'height': props.luasArea?.lebar,
                    'padding': 2,
                });
                // styleContainer.width = props.luasArea?.panjang;
                // styleContainer.height = props.luasArea?.lebar;
                // styleContainer.padding = 2;
                // styleContainer.backgroundColor = typeof props.containerStyle.backgroundColor !== 'undefined'?props.containerStyle.backgroundColor:'#ECECEC'
            }
        },
        [props.luasArea]
    );    
    //this is used as monitoring to trigger upload function
    // useEffect(
    //     () => {
    //         if(typeof props.uploadStatus !== 'undefined') {
    //             if(props.uploadStatus === true) {
    //                 setUploadStatus(props.uploadStatus);
    //             }                
    //         }            
    //     },
    //     [props.uploadStatus]
    // );
    //proses upload dilakukan jika local state uploadStatus = true
    useEffect(
        () => {
            if(props.uploadMode?.controlled === true && props.uploadMode.startUpload == true) {
                upload();
            }
        },
        [props.uploadMode] 
    );
    //this function is used to save file to server back end
    const upload = useCallback(
        () => {
            // console.log('sedang upload');
            // setProgress(0)           

            uploadService.upload(selectedFiles, props.uploadMode.subUri, (event: ProgressEvent) => {
                setProgress(Math.round(100 * event.loaded)/event.total)
            })
            .then((response) => {
                console.log(response);
                return 'tes file';
                // setMessage(response.data.namaFile)
                // props.setUploadStatus(false);
                // return 'as test' //uploadService.getFiles(response.data.namaFile)
            })
            .then((files) => {
                console.log(files);
                props.setUploadMode((p: IUploadMode) => ({...p, startUpload: false, subUri: ''}));
                // setFileInfos(files.data)
            })
            .catch(() => {
                // setProgress(0)
                // setMessage("Could not upload the file!")
                // setCurrentFile(undefined)
            })
            // setSelectedFiles(undefined)
        },
        [selectedFiles, props.uploadMode]
    );
    //this function is used to binding button's mouse click event to listener event of input file type Html element
    const bindClickEventInputFile = useCallback(
        (e) => {            
            // event.stopPropagation();
            e.stopPropagation();
            // if(typeof currentFile == 'undefined')
            document.getElementById('fileUpload')!.click();
        },
        []
    );
    //this function is used to handle responsibility of event File change that occur on input type file HTML Element 
    const handleFile = useCallback(
        (event: FormEvent<HTMLInputElement>) => {            
            if(event.currentTarget.files!.length > 0) {
                setSelectedFiles(event.currentTarget.files);
                let file = event.currentTarget.files![0];
                // props.setFile(file);
                // setCurrentFile(file);
                switch (CekTypeFile(file.type)) {
                    case 'image':
                        setIsImageFile(true);
                        break;
                    case 'pdf':
                        // setIsPdfFile(true);
                        break;
                    default:
                        break;
                }    
                // console.log('this is responsibility of file event change');
                if(typeof props.setIsFileExist !== 'undefined') {
                    props.setIsFileExist(true);
                }            
            }
            else {
                //tidak ada file
            }
           
        },
        []
    );
    //set id 
    const compoundButtonId = useId('targetCompoundButton');
    //rendered function
    return(
        <>            
            <input type="file" id="fileUpload" style={{display: 'none'}} onChange={handleFile}/> 
            {
                props.showPreview && 
                (
                    <div style={styleContainer} className={containerClass} onClick={bindClickEventInputFile}>                    
                        {
                            !selectedFiles && 
                            (<FontIcon aria-label="Ktp" iconName="OpenFile" className={iconClass}/>)
                        }
                        {
                            !selectedFiles && 
                            (<Label disabled style={{cursor: 'pointer'}}>{`${props.label} (maksimal ${props.maxSize} KB)`}</Label>)
                        }
                        {
                            props.showPreview && isImageFile && 
                            (
                            <FileImageViewerFluentUi 
                                file={selectedFiles![0]} 
                                area={
                                    {width: props.luasArea!.panjang, height: props.luasArea!.lebar}
                                }  
                                onClick={bindClickEventInputFile}        
                                id={props.id}         
                            />
                            )
                        }
                        {!props.showPreview && isImageFile && <FontIcon aria-label="image" iconName="FileImage" />}
                        {currentFile && false && <FontIcon aria-label="Ktp" iconName="Delete" />}
                    </div>
                )
            }
            {
            !props.showPreview && !currentFile && 
            <CompoundButton
                id={compoundButtonId}
                secondaryText={props.label} 
                onClick={bindClickEventInputFile}
                styles={{
                    root: {
                        maxWidth: props.containerStyle!.width,
                        width: props.containerStyle!.width
                    }
                }}
            >
                File
            </CompoundButton>    
            }
            {
            !props.showPreview && teachingBubbleVisible && (
            <TeachingBubble
                calloutProps={{ directionalHint: DirectionalHint.rightCenter }}
                target={`#${compoundButtonId}`}
                isWide={true}
                hasCloseButton={true}
                closeButtonAriaLabel="Close"
                onDismiss={toggleTeachingBubbleVisible}
                headline={props.label}
            >
                {props.teachingBubbleText} 
            </TeachingBubble>
            )
            }
            {
            !props.showPreview && currentFile && 
            <label>{currentFile.name}</label>
            }
            {currentFile && props.showProgressBar &&
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
            {currentFile && props.showButtonUpload &&
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