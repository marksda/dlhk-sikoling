import { IconButton, ILabelStyles, Label, PrimaryButton, Stack } from "@fluentui/react";
import { motion } from "framer-motion";
import { FC, useCallback, useState } from "react";
import { Control, SubmitHandler, UseFormHandleSubmit, useWatch } from "react-hook-form";
import { useAppSelector } from "../../app/hooks";
import { IPerson } from "../../features/person/person-slice";
import { useAddRegistrasiMutation } from "../../features/security/authorization-api-slice";
import { IUploadMode, UploadFilesFluentUi } from "../UploadFiles/UploadFilesFluentUI";
import { backIcon, durationAnimFormRegistrasi, ISubFormRegistrasiProps, variantUploadKTP } from "./InterfaceRegistrasiForm";

interface ISubFormPID3RegistrasiProps extends ISubFormRegistrasiProps {
    control?: Control<any>;
    handleSubmit: UseFormHandleSubmit<IPerson>;
};

const stackTokens = { childrenGap: 2 };
const labelUserNameStyle: ILabelStyles  = {
    root: {
       fontWeight: 400,
       fontSize: '1rem', 
    }
};
const labelStyle: ILabelStyles  = {
    root: {
       fontWeight: 600,
       color: '#1b1b1b',
       fontSize: '1.5rem', 
    }
};
const subLabelStyle: ILabelStyles  = {
    root: {
       fontWeight: 400,
       color: '#383838',
       fontSize: '1rem', 
    }
};

export const SubFormUploadRegistrasi: FC<ISubFormPID3RegistrasiProps> = ({setMotionKey, setIsLoading, changeHightContainer, setIsErrorConnection, setValue, control, handleSubmit}) => {
    //redux variable
    const credential = useAppSelector(state => state.credential);  

    //react-hook-form variable hook
    const [kontak] = useWatch({
        control: control, 
        name: ['kontak']
    });
    // local state
    const [animPid3, setAnimPid3] = useState<string>('open');
    const [isFileExist, setIsFileExist] = useState<boolean>(false);
    const [uploadMode, setUploadMode] = useState<IUploadMode>({
        controlled: true, 
        startUpload: false, 
        subUri: null,
        handlerMessageToParent: undefined,
    });
    const [nik, setNik] = useState<string>('');

    const handlerMessageToParent = useCallback(
        (data) => {
            if(data.status === true) {

            }
            else {

            }
        },
        []
    );

    //rtk mutation addRegistrasi variable
    const [addRegistrasi, { data: simpleResponseAddRegister, isLoading: isLoadingAddRegistrasi }] = useAddRegistrasiMutation(); 

    //this function is used to go back to FormPersonIdentityStepTwo
    const processBackToPreviousStep = useCallback(
        () => {
            setAnimPid3('closed');
            let timer = setTimeout(
                () => {
                    changeHightContainer(570);
                    setMotionKey('pid2');
                },
                durationAnimFormRegistrasi*1000
            );
            return () => clearTimeout(timer);
        },
        []
    );

    const save: SubmitHandler<IPerson> = useCallback(
        async(data) => {
            try {
                console.log(data);
                // setIsLoading(true);  
                // setNik(data.nik!);       
                await addRegistrasi({credential: credential, person: data}).unwrap();              
            } catch (error) {
                // setIsLoading(false);
                // setIsErrorConnection(true);
            }
    
            // handleSubmit(
            //     async (d) => {
            //         await addRegistrasi({
            //             auth: loginAuthentication,
            //             person: d
            //         });
            //     },            
            //     (err) => {                
            //       console.log(err);
            //     }
            // )();
    
            // var canvas: HTMLCanvasElement = document.createElement("canvas") as HTMLCanvasElement;        
            // var img: HTMLImageElement = document.createElement("img") as HTMLImageElement;
            // var reader = new FileReader();             
            // reader.onload = () => {             
            //     img.src = reader.result as string;
            //     // canvas.height = img.naturalHeight;
            //     // canvas.width = img.naturalWidth;
            // };        
            // reader.readAsDataURL(file!);
    
            
    
            // let canvas: HTMLCanvasElement = document.getElementById("canvasOutput") as HTMLCanvasElement;
            // let context: CanvasRenderingContext2D = canvas.getContext("2d") as CanvasRenderingContext2D;
            // let src = cv.imread("tesgbr");
            // let dst = new cv.Mat();
            // let low = new cv.Mat(src.rows, src.cols, src.type(), [0, 0, 0, 0]);
            // let high = new cv.Mat(src.rows, src.cols, src.type(), [150, 150, 150, 255]);
            // You can try more different parameters
            // cv.inRange(src, low, high, dst);
            // cv.imshow(canvas, dst);        
            // src.delete(); dst.delete(); low.delete(); high.delete();        
    
            // const worker = createWorker({
            //     logger: m => console.log(m)
            // });
                
            // (async () => {
            // await worker.load();
            // await worker.loadLanguage('eng');
            // await worker.initialize('eng');
            // const { data: { text } } = await worker.recognize(canvas);
            // console.log(text);
            // await worker.terminate();
            // })();
        },
        [credential]
    ); 

    return(
        <motion.div
            animate={animPid3}
            variants={variantUploadKTP}
        >
            <Stack horizontal tokens={stackTokens} styles={{root: { width: 400, alignItems: 'center'}}}>                    
                <IconButton 
                    iconProps={backIcon} 
                    title="Back" 
                    ariaLabel="Back"
                    onClick={processBackToPreviousStep} 
                    styles={{
                        root: {
                            borderStyle: 'none',
                            borderRadius: '50%',
                            padding: 0,
                            marginTop: 2,
                        }
                    }}/>
                <Label styles={labelUserNameStyle}>{kontak.email}</Label>
            </Stack>
            <Stack tokens={stackTokens} styles={{root: { width: 400, alignItems: 'left', marginBottom: 16}}}>
                <Label styles={labelStyle}>Upload KTP</Label>
                <Label styles={subLabelStyle}>Silahkan upload KTP anda.</Label>
            </Stack>
            <Stack tokens={stackTokens} styles={{root: { width: 400, alignItems: 'left'}}}>
                <Stack.Item align="center">
                    <UploadFilesFluentUi 
                        label='Upload File Hasil Scan KTP'
                        maxSize={350}
                        jenisFile='image'
                        showPreview={true}
                        showListFile={false}
                        luasArea={{panjang: 310, lebar: 193}}
                        showButtonUpload={false}
                        showProgressBar={false}
                        id="tesgbr"
                        setIsFileExist={setIsFileExist}
                        uploadMode={uploadMode}           
                    />
                </Stack.Item>
            </Stack>
            <Stack horizontal tokens={stackTokens} styles={{root: { width: 400, justifyContent: 'flex-end'}}}>
                <PrimaryButton 
                    text="Simpan" 
                    onClick={handleSubmit(save)}
                    style={{marginTop: 24, width: 100}}
                    disabled={!isFileExist}
                    />
            </Stack>
        </motion.div>
    );
}