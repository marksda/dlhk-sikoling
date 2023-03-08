import { 
    DefaultEffects, DefaultPalette,   
    Image, IProgressIndicatorStyles, IStackItemStyles, IStackTokens, ProgressIndicator, Stack 
} from "@fluentui/react";
import { FC, useState } from "react";
import logo from '../../sidoarjo.svg';
import { ISlideSubFormLoginParam } from "./InterfaceLoginForm";
import { FormEmail } from "./FormEmail";
import { FormPassword } from "./FormPassword";


const rootContainerStyle: React.CSSProperties = {
    display: 'table-cell',
    verticalAlign: 'middle',
};
const progressStyle: IProgressIndicatorStyles ={
    root: {
        width: 396,
        marginLeft: 'auto',
        marginRight: 'auto',
        height: 8,
    },
    itemName: null,
    itemDescription: null,
    itemProgress: null,
    progressBar:null,
    progressTrack: null
};
const containerStyles: React.CSSProperties = {    
    display: "inline-block", 
    boxShadow: DefaultEffects.elevation4, 
    // borderTop: '2px solid orange', 
    borderTop: '2px solid #0078D7', 
    // borderRadius: 3, 
    padding: 48,
    width: 400,
    background: 'white',
};
const containerLoginStackTokens: IStackTokens = { childrenGap: 5};

const labelSikolingStyles: IStackItemStyles = {
    root: {
      color: DefaultPalette.blackTranslucent40,
      fontSize: '1.2em',
      fontWeight: 600
    },
};


export const FormulirLogin: FC = () => {
    //* local state *   
    //* local state *   
    const [motionKey, setMotionKey] = useState<string>('email');
    //- digunakan untuk tracking status koneksi pemrosesan di back end
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    return(
        <div style={rootContainerStyle}>
            {
                isLoading && 
                (
                    <Stack>
                        <ProgressIndicator styles={progressStyle}/>
                    </Stack>
                )
            }
            <div style={containerStyles}>            
                <Stack horizontal tokens={containerLoginStackTokens}>
                    <Stack.Item>
                        <Image alt='logo' width={42} height={42} src={logo} />
                    </Stack.Item>
                    <Stack.Item align="center" styles={labelSikolingStyles}>
                        SIKOLING   
                    </Stack.Item>  
                </Stack>            
                <div style={{height: 8}}></div>
                {                
                    getSlideSubFormLogin({
                        motionKey, 
                        setMotionKey,
                        setIsLoading
                    })
                }             
            </div>
        </div>        
    );
};

const getSlideSubFormLogin = (
    {motionKey, setMotionKey, setIsLoading}: ISlideSubFormLoginParam) => {
    let konten = null;
    switch (motionKey) {
        case 'email':
            konten = 
            <FormEmail
                setMotionKey={setMotionKey}
                setIsLoading={setIsLoading}
            />;
            break; 
        case 'password':
            konten = 
                <FormPassword
                    setMotionKey={setMotionKey}
                    setIsLoading={setIsLoading}
                />;   
            break;
        default:
            konten = null;
            break;
    }
    return konten;
};