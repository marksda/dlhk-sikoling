import { Image, IImageProps, ImageFit } from "@fluentui/react";
import { FC, useState } from "react";


interface IFileViewerPropsComponent {
    src?: string;
    file?: File;
    area?: {panjang:number, lebar: number};

}
export const FileViewerFluentUi: FC<IFileViewerPropsComponent> = (props) => {
    const [imageProps, setImageProps] = useState<IImageProps|undefined>(undefined);
    
        

    switch (props.file?.type.toLowerCase()) {
        case 'image/bmp':
        case 'image/svg+xml':
        case 'image/jpeg':
        case 'image/tiff':
        case 'image/gif':
        case 'image/png':
            let imageProps: IImageProps = {
                imageFit: ImageFit.center,
                width: props.area?.panjang,
                height: props.area?.lebar,
                styles: props => ({ root: { border: '1px solid ' + props.theme.palette.neutralSecondary } }),
            };

            if(typeof props.src == 'undefined') {
                let reader = new FileReader();
                reader.onload = () => {
                    imageProps.src = reader.result as string;
                    setImageProps(imageProps);
                }
                reader.readAsDataURL(props.file);
            }  
            else {
                imageProps.src = props.src;
                setImageProps(imageProps);
            }            
            break;    
        default:
            break;
    }

    return(
        <>
            { imageProps && <Image {...imageProps}/> }
        </>
    )
}