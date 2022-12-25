import { 
    DefaultEffects, DefaultPalette, ILabelStyles, 
    Image, IProgressIndicatorStyles, IStackItemStyles, IStackTokens, Label, MessageBar,
    MessageBarButton, MessageBarType, ProgressIndicator, Stack,  
} from "@fluentui/react";
import { FC, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import logo from '../../sidoarjo.svg';
import { IPerson } from "../../features/person/person-slice";
import { useAppSelector } from "../../app/hooks";
import {  HookMessageBarProps } from "../../app/HookFormProps";
import { ISlideSubFormRegistrasiParam } from "./InterfaceRegistrasiForm";
import { SubFormEmailRegistrasi } from "./SubFormEmailRegistrasi";
import { SubFormPasswordRegistrasi } from "./SubFormPasswordRegistrasi";
import { SubFormPersonIdentityStepOneRegistrasi } from "./SubFormPersonIdentityStepOneRegistrasi";
import { SubFormPersonIdentityStepTwoRegistrasi } from "./SubFormPersonIdentityStepTwoRegistrasi";
import { SubFormUploadRegistrasi } from "./SubFormUploadKtpRegistrasi";
// import {createWorker}  from "tesseract.js";
// import cv from "@techstark/opencv-js";

interface IStateRegistrasiAnimationFramer {
    animUserName: string;
    animPassword: string;
    animPID: string;
    animPID2: string;
    animUploadKTP: string;
    flipDisplayUser: boolean;
    flipDisplayPassword: boolean;
    flipDisplayPID: boolean;
    flipDisplayPID2: boolean;
    flipDisplayUploadKTP: boolean;
};
const containerStyles: React.CSSProperties = {
    boxShadow: DefaultEffects.elevation4,
    borderTop: '2px solid orange', 
    // borderRadius: 3, 
    padding: 32,
    minWidth:400,
    maxWidth: 400,
    minHeight: 300,
    marginLeft: 'auto',
    marginRight: 'auto',
    background: 'white',
};
const containerInformationStyles: React.CSSProperties = {
    boxShadow: DefaultEffects.elevation4,
    padding: '16px 32px',
    minWidth:300,
    maxWidth: 400,
    minHeight: 45,
    marginTop: 16,
    marginLeft: 'auto',
    marginRight: 'auto',
    background: 'white',
    marginBottom: 16
};
const containerMessageStyles: React.CSSProperties = {
    minWidth:364,
    maxWidth: 464,
    marginLeft: 'auto',
    marginRight: 'auto',
    background: 'inherit',
    marginBottom: 4
};
const containerStackTokens: IStackTokens = { childrenGap: 5};
const labelSikolingStyles: IStackItemStyles = {
    root: {
      color: DefaultPalette.blackTranslucent40,
      fontSize: '1.2em',
      fontWeight: 600
    },
};
const labelWarningStyle: ILabelStyles  = {
    root: {
    //    fontWeight: 400,
       color: '#dd4132',
    //    fontSize: '0.95rem', 
    }
};

const progressStyle: IProgressIndicatorStyles ={
    root: {
        width: 464,
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
const SuccessMessage = () => (
    <MessageBar
      actions={
        <div>
          <MessageBarButton>Ya</MessageBarButton>
          <MessageBarButton>Tidak</MessageBarButton>
        </div>
      }
      messageBarType={MessageBarType.success}
      isMultiline={false}
    >
      Registrasi berhasil, silahkan cek email anda untuk pengaktifan akun.
    </MessageBar>
);
const ErrorMessage: FC<HookMessageBarProps> = (props) => (
    <MessageBar
      messageBarType={MessageBarType.error}
      isMultiline={false}
      onDismiss={props.resetChoice}
      dismissButtonAriaLabel="Close"
    >
        {props.message}
    </MessageBar>
);

export const FormulirRegistrasi: FC = () => {  
    //* local state *   
    const [motionKey, setMotionKey] = useState<string>('email');
    //- digunakan untuk merubah animasi transisi setiap terjadi pergantian Form - 
    const [variant, setVariant] = useState<IStateRegistrasiAnimationFramer>({
        animUserName: 'open',
        animPassword: 'closed',
        animPID: 'closed',
        animPID2: 'closed',
        animUploadKTP: 'closed',
        flipDisplayUser: true,
        flipDisplayPassword: false,
        flipDisplayPID: false,
        flipDisplayPID2: false,
        flipDisplayUploadKTP: false,
    });
    //- digunakan untuk merubah tinggi container setiap terjadi pergantian Form -
    const [heighArea, setHeightArea] = useState<number>(300);   
    //- digunakan untuk tracking status loading koneksi pemrosesan di back end
    const [isLoading, setIsLoading] = useState<boolean>(false); 
    //-digunakan untuk tracking status error koneksi ke back end
    const [isErrorConnection, setIsErrorConnection] = useState<boolean>(false);
    //-digunakan untuk mendeteksi state condition FormEmail apa kondisi awal atau balik
    // const [stateConditionFormEmail, setStateConditionFormEmail] = useState<string>('awal');
    //redux global state
    // const authentication = useAppSelector(state => state.authentication);      
    
    //react-hook-form
    const { control, handleSubmit, setValue } = useForm<IPerson>({
        mode: 'onSubmit',
        defaultValues: {
            nik: '',
            nama: '',
            jenisKelamin: null,
            alamat: {
                propinsi: {id: '', nama: ''},
                kabupaten: {id: '', nama: ''},
                kecamatan: {id: '', nama: ''},
                desa: {id: '', nama: ''},
                keterangan: '',
            },
            kontak: {
                telepone: '', 
                email: '',
            },
            scanKTP: '',
        }
    });    
    //this function is used to close ErrorMessage component
    const closeErrorMessage = useCallback(
        () => {
            setIsErrorConnection(false);
        },
        [isErrorConnection]
    ); 
    //rendered function
    return(
        <>
        {
            isErrorConnection && 
            (
                <div style={containerMessageStyles}>
                    <ErrorMessage message="gagal melakukan sambungan ke server" resetChoice={closeErrorMessage}/>
                </div>
            )
        }
        {
            isLoading && (
            <Stack>
                <ProgressIndicator styles={progressStyle}/>
            </Stack>)
        }         
        <div style={{...containerStyles, height: heighArea}}>
            <Stack horizontal tokens={containerStackTokens}>
                <Stack.Item>
                    <Image alt='logo' width={42} height={42} src={logo} />
                </Stack.Item>
                <Stack.Item align="center" styles={labelSikolingStyles}>
                    SIKOLING   
                </Stack.Item> 
            </Stack>
            <div style={{height: 8}}></div>
            {
                getSlideSubFormRegistrasi({
                    motionKey, 
                    setMotionKey,
                    setIsLoading,
                    changeHightContainer: setHeightArea,
                    setIsErrorConnection,
                    setValue,
                    control,
                    handleSubmit
                })
            }
        </div>
        {
            !(motionKey == 'pid3') &&
            (
                <div style={containerInformationStyles}>
                    <Stack tokens={containerStackTokens}>
                        <Stack.Item align="start">
                            <Label  styles={labelWarningStyle}>Perhatiaan!!</Label> 
                            <Label  styles={labelWarningStyle} style={{color: 'black'}}>
                                Anda harus menyiapkan file hasil scan KTP berformat jpg, file ini wajib diupload pada tahap berikutnya</Label>
                        </Stack.Item>
                    </Stack>
                </div>
            )
        }        
        </>
    )
};

const getSlideSubFormRegistrasi = (
    {motionKey, setMotionKey, setIsLoading, changeHightContainer, setIsErrorConnection, setValue, control, handleSubmit}: ISlideSubFormRegistrasiParam) => {
    let konten = null;
    switch (motionKey) {
        case 'email':
            konten = 
            <SubFormEmailRegistrasi
                setMotionKey={setMotionKey}
                setIsLoading={setIsLoading}
                changeHightContainer={changeHightContainer}
                setIsErrorConnection={setIsErrorConnection}
                setValue={setValue}
                control={control}
            />;
            break; 
        case 'password':
            konten = 
                <SubFormPasswordRegistrasi
                    setMotionKey={setMotionKey}
                    setIsLoading={setIsLoading}
                    changeHightContainer={changeHightContainer}
                    setIsErrorConnection={setIsErrorConnection}
                    setValue={setValue}
                    control={control}
                />;   
            break;
        case 'pid':
            konten = 
                <SubFormPersonIdentityStepOneRegistrasi
                    setMotionKey={setMotionKey}
                    setIsLoading={setIsLoading}
                    changeHightContainer={changeHightContainer}
                    setIsErrorConnection={setIsErrorConnection}
                    setValue={setValue}
                    control={control}
                />;   
            break;
        case 'pid2':
            konten = 
                <SubFormPersonIdentityStepTwoRegistrasi
                    setMotionKey={setMotionKey}
                    setIsLoading={setIsLoading}
                    changeHightContainer={changeHightContainer}
                    setIsErrorConnection={setIsErrorConnection}
                    setValue={setValue}
                    control={control}
                />;   
            break;
        case 'pid3':
            konten = 
                <SubFormUploadRegistrasi
                    setMotionKey={setMotionKey}
                    setIsLoading={setIsLoading}
                    changeHightContainer={changeHightContainer}
                    setIsErrorConnection={setIsErrorConnection}
                    setValue={setValue}
                    control={control}
                    handleSubmit={handleSubmit}
                />;   
            break;
        default:
            konten = null;
            break;
    }
    return konten;
};