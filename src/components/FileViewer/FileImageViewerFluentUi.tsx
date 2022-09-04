import { Image, IImageProps, ImageFit } from "@fluentui/react";
import { FC, MouseEventHandler, useState } from "react";
// import CekTypeFile from "../../features/file-utils/FileUtils";


interface IFileViewerPropsComponent {
    src?: string;
    id?: string;
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
            id: props.id,
        }
    ); 

    if(typeof props.file !== 'undefined') {                      
        let reader = new FileReader();        
        // reader.onload = function() { // file is loaded
        //     var img: HTMLImageElement = document.createElement("img");    
        //     img.onload = function() {
        //         console.log(img.width); // image is loaded; sizes are available
        //     };
        
        //     img.src = reader.result as string; // is the data URL because called with readAsDataURL
        // };
                    
        reader.readAsDataURL(props.file);

        let imgProperti = {...imageProps};
        reader.onload = () => {
            var img: HTMLImageElement = document.createElement("img");
            console.log(img);

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