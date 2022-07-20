import { Image, IImageProps, ImageFit } from "@fluentui/react";
import { FC, useState } from "react";
import CekTypeFile from "../../features/file-utils/FileUtils";


interface IFileViewerPropsComponent {
    src?: string;
    file?: File;
    area?: {
        height: number, 
        width: number
    };

}

export const FileImageViewerFluentUi: FC<IFileViewerPropsComponent> = (props) => {

    const [imageProps, setImageProps] = useState<IImageProps|undefined>(
        {
            imageFit: ImageFit.center,
            width: props.area!.width,
            height: props.area!.height,
            styles: props => ({ root: { border: '1px solid ' + props.theme.palette.neutralSecondary } }),
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
            { imageProps && <Image {...imageProps}/> }
        </>
    )
}