import { Image, IImageProps, ImageFit } from "@fluentui/react";
import { FC, MouseEventHandler, useState } from "react";
import CekTypeFile from "../../features/file-utils/FileUtils";


interface IFileViewerPropsComponent {
    src?: string;
    file?: File;
    area?: {
        height: number, 
        width: number
    };
    onClick?:  MouseEventHandler<HTMLElement>;
}

export const FileImageViewerFluentUi: FC<IFileViewerPropsComponent> = (props) => {

    const [imageProps, setImageProps] = useState<IImageProps|undefined>(
        {
            imageFit: ImageFit.cover,
            width: props.area!.width,
            height: props.area!.height,
        }
    ); 

    if(typeof props.file !== 'undefined') {                      
        let reader = new FileReader();                    
        reader.readAsDataURL(props.file);
        let imgProperti = {...imageProps};
        reader.onload = () => {
            imgProperti.src = reader.result as string;
            setImageProps(imgProperti);
        };
    }
    else {
        let imgProperti = {...imageProps};
        imgProperti.src = props.src;
        setImageProps(imgProperti);
    }

    return(
        <>
            { imageProps && <Image {...imageProps} onClick={props.onClick}/> }
        </>
    )
}