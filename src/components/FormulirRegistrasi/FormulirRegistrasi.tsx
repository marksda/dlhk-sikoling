import { 
    DefaultEffects, DefaultPalette, IconButton, IIconProps, ILabelStyles, 
    Image, IProgressIndicatorStyles, IStackItemStyles, IStackTokens, Label, MessageBar,
    MessageBarButton, MessageBarType, PrimaryButton, ProgressIndicator, Stack, TextField 
} from "@fluentui/react";
import { motion } from "framer-motion";
import { FC, useCallback, useEffect, useState } from "react";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { defaultDesa, defaultKabupaten, defaultKecamatan, defaultPropinsi, regexpEmail } from "../../features/config/config";
import { useGetDesaByKecamatanQuery } from "../../features/desa/desa-api-slice";
import { IDesa, resetDesa } from "../../features/desa/desa-slice";
import { useGetAllJenisKelaminQuery } from "../../features/jenis-kelamin/jenis-kelamin-api-slice";
import { useGetKabupatenByPropinsiQuery } from "../../features/kabupaten/kabupaten-api-slice";
import { IKabupaten } from "../../features/kabupaten/kabupaten-slice";
import { useGetKecamatanByKabupatenQuery } from "../../features/kecamatan/kecamatan-api-slice";
import { IKecamatan } from "../../features/kecamatan/kecamatan-slice";
import { useGetAllPropinsiQuery } from "../../features/propinsi/propinsi-api-slice";
import { IPropinsi } from "../../features/propinsi/propinsi-slice";
import { useAddRegistrasiMutation } from "../../features/security/authorization-api-slice";
import logo from '../../sidoarjo.svg';
import { ControlledFluentUiDropDown } from "../ControlledDropDown/ControlledFluentUiDropDown";
import { ControlledFluentUiTextField } from "../ControlledTextField/ControlledFluentUiTextField";
import { IPerson } from "../../features/person/person-slice"
import { IUploadMode, UploadFilesFluentUi } from "../UploadFiles/UploadFilesFluentUI";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setUserNameAuthentication, setPasswordAuthentication} from "../../features/security/authentication-slice";
import { 
    HookFormEmailProps, HookFormPasswordProps, HookFormPersonIdentityStepOneProps, 
    HookFormPersonIdentityStepTwoProps, HookFormUploadKTP, HookMessageBarProps } from "../../app/HookFormProps";
import { useCekUserNameQuery } from "../../features/security/authentication-api-slice";
import { useNavigate } from "react-router-dom";
import { ISlideSubFormRegistrasiParam } from "./InterfaceRegistrasiForm";
import { SubFormEmailRegistrasi } from "./SubFormEmailRegistrasi";
import { SubFormPasswordRegistrasi } from "./SubFormPasswordRegistrasi";
import { SubFormPersonIdentityStepOneRegistrasi } from "./SubFormPersonIdentityStepOneRegistrasi";
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
const labelStyle: ILabelStyles  = {
    root: {
       fontWeight: 600,
       color: '#1b1b1b',
       fontSize: '1.5rem', 
    }
};
const labelWarningStyle: ILabelStyles  = {
    root: {
    //    fontWeight: 400,
       color: '#dd4132',
    //    fontSize: '0.95rem', 
    }
};
const labelUserNameStyle: ILabelStyles  = {
    root: {
       fontWeight: 400,
       fontSize: '1rem', 
    }
};
const labelSandiStyle: ILabelStyles  = {
    root: {
       fontWeight: 400,
       color: '#383838',
       fontSize: '1rem', 
    }
};
const stackTokens = { childrenGap: 2 };
const duration: number = 0.5;

const variantsPassword = {
    open: {       
        opacity: 1, 
        x: 0,
        transition: {
            duration
        },
    },
    closed: { 
        opacity: 0, 
        x: "10%", 
        transition: {
            duration
        },
    },
};
const variantsPID = {
    open: {       
        opacity: 1, 
        x: 0,
        transition: {
            duration
        },
    },
    closed: { 
        opacity: 0, 
        x: "-10%", 
        transition: {
            duration
        },
    },
};
const variantsPID2 = {
    open: {       
        opacity: 1, 
        x: 0,
        transition: {
            duration
        },
    },
    closed: { 
        opacity: 0, 
        x: "10%", 
        transition: {
            duration
        },
    },
};
const variantsUploadKTP = {
    open: {       
        opacity: 1, 
        x: 0,
        transition: {
            duration
        },
    },
    closed: { 
        opacity: 0, 
        x: "-10%", 
        transition: {
            duration
        },
    },
};
const contactIcon: IIconProps = { iconName: 'Contact' };
const backIcon: IIconProps = { 
    iconName: 'Back',
    style: {
        color: 'grey',
        fontSize: '0.8rem',
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

const FormPersonIdentityStepOne: FC<HookFormPersonIdentityStepOneProps> = (props) => {
    //react-hook-form variable hook
    const [nik, nama, jenisKelamin, kontak] = useWatch({
        control: props.control, 
        name: ['nik', 'nama', 'jenisKelamin', 'kontak', 'alamat']
    });
    //rtk query jenisKelamin variable hook
    const { data: dataJenisKelamin = [], isFetching: isFetchingJenisKelamin } = useGetAllJenisKelaminQuery();  
    const dataJenisKelaminOptions = dataJenisKelamin.map((t) => { return {key: t.id as string, text: t.nama as string}; });
    //this function is used to go back to FormPassword
    const processBackToPreviousStep = useCallback(
        () => {
            props.setVariant(
                (prev: IStateRegistrasiAnimationFramer) => ({...prev, animPID: 'closed'})
            );

            let timer = setTimeout(
                () => {
                    props.changeHightContainer(350);
                    props.setVariant(
                        (prev: IStateRegistrasiAnimationFramer) => (
                            {
                                ...prev, 
                                flipDisplayUser: false, 
                                flipDisplayPassword: true, 
                                animPassword: 'open'
                            }
                        )
                    );
                },
                duration*1000
            );

            return () => clearTimeout(timer);
        },
        []
    );
    //this function is used to process next step (FormPersonIdentityStepTwo) with dependen on userName changes only
    const processNextStep = useCallback(
        () => {
            props.setVariant((prev: IStateRegistrasiAnimationFramer) =>({...prev, animPID: 'closed'}));
            let timer = setTimeout(
                () => {
                    props.changeHightContainer(570);
                    props.setVariant(
                        (prev: IStateRegistrasiAnimationFramer) => (
                            {...prev, flipDisplayPID: false, flipDisplayPID2: true, animPID2: 'open'}
                        )
                    );
                },
                duration*1000
            );

            return () => clearTimeout(timer);
        },
        []
    );
    //rendered function
    return(
        <motion.div
            animate={props.variant.animPID}
            variants={variantsPID}
            style={props.variant.flipDisplayPID?{display:'block'}:{display:'none'}}
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
                <Label styles={labelUserNameStyle}>{props.userName}</Label>
            </Stack>                
            <Stack tokens={stackTokens} styles={{root: { width: 400, alignItems: 'left', marginBottom: 16}}}>
                <Label styles={labelStyle}>Siapa anda?</Label>
                <Label styles={labelSandiStyle}>Kami perlu data personal berdasar KTP untuk mengatur akun Anda.</Label>
            </Stack>
            <Stack tokens={stackTokens} styles={{root: { width: 400, alignItems: 'left'}}}>
                <Stack.Item>
                    <ControlledFluentUiTextField
                        required
                        label="NIK"
                        name="nik"
                        rules={{ required: "harus diisi sesuai dengan ktp" }}     
                        control={props.control}
                    />
                </Stack.Item>
                <Stack.Item>
                    <ControlledFluentUiTextField
                        required
                        label="Nama"
                        name="nama"
                        rules={{ required: "harus diisi sesuai dengan ktp" }}   
                        control={props.control}
                        disabled={nik!.length>0?false:true}
                    />
                </Stack.Item>
                <Stack.Item>
                    <ControlledFluentUiDropDown
                        label="Jenis Kelamin"
                        placeholder="Pilih Jenis Kelamin"
                        options={dataJenisKelaminOptions}
                        required
                        name="jenisKelamin"
                        rules={{ required: "harus diisi sesuai dengan ktp" }} 
                        control={props.control}         
                        disabled={(nama!.length>0?false:true)||isFetchingJenisKelamin}    
                    /> 
                </Stack.Item>
                <Stack.Item>
                    <ControlledFluentUiTextField
                        required
                        label="Telepone"
                        name="kontak.telepone"
                        rules={{ required: "minimal harus diisi satu nomor telepone yang aktif" }}    
                        control={props.control}
                        disabled={jenisKelamin == null?true:false}
                    /> 
                </Stack.Item>
                <Stack.Item>
                    <ControlledFluentUiTextField
                        required
                        label="Email"
                        name="kontak.email"
                        rules={{ required: "Alamat email harus diisi" }}  
                        control={props.control} 
                        value={props.userName}
                        disabled={true}
                    />
                </Stack.Item>
            </Stack>
            <Stack horizontal tokens={stackTokens} styles={{root: { width: 400, justifyContent: 'flex-end'}}}>
                <PrimaryButton 
                    text="Lanjut" 
                    onClick={processNextStep} 
                    style={{marginTop: 24, width: 100}}
                    disabled={kontak?.telepone?.length == 0 ? true:false}
                    />
            </Stack>     
        </motion.div>
    );
};
const FormPersonIdentityStepTwo: FC<HookFormPersonIdentityStepTwoProps> = (props) => {
    //react-hook-form variable hook
    const [alamat] = useWatch({
        control: props.control, 
        name: ['alamat']
    });
    //rtk query propinsi variable hook
    const [propinsi, setPropinsi] = useState<IPropinsi>(defaultPropinsi); 
    const { data: dataPropinsi = [], isFetching: isFetchingDataPropinsi } = useGetAllPropinsiQuery();
    const dataPropinsiOptions = dataPropinsi.map((t) => {
        return {key: t.id as string, text: t.nama as string}; 
    });
    //rtk query kabupaten variable hook
    const [kabupaten, setKabupaten] = useState<IKabupaten>(defaultKabupaten);
    const { data: dataKabupaten = [], isFetching: isFetchingDataKabupaten } = useGetKabupatenByPropinsiQuery(propinsi.id!);
    const dataKabupatenOptions = dataKabupaten.map((t) => {
        return {key: t.id as string, text: t.nama as string}; 
    });
    //rtk query kecamatan variable hook
    const [kecamatan, setKecamatan] = useState<IKecamatan>(defaultKecamatan);
    const { data: dataKecamatan = [], isFetching: isFetchingDataKecamatan } = useGetKecamatanByKabupatenQuery(kabupaten.id!);
    const dataKecamatanOptions = dataKecamatan.map((t) => {
        return {key: t.id as string, text: t.nama as string}; 
    });
    //rtk query desa variable hook
    const [desa, setDesa] = useState<IDesa>(defaultDesa);
    const { data: dataDesa = [], isFetching: isFetchingDataDesa } = useGetDesaByKecamatanQuery(kecamatan.id!);
    const dataDesaOptions = dataDesa.map((t) => {
        return {key: t.id as string, text: t.nama as string}; 
    });    
    //this function is used reset propinsi
    const resetPropinsi = useCallback(
        (item: IPropinsi) => {          
            setDesa({id: '', nama: ''});
            setKecamatan({id: '', nama: ''});
            setKabupaten({id: '', nama: ''});
            setPropinsi(item);
            props.setValue("alamat.kabupaten", null);
            props.setValue("alamat.kecamatan", null);
            props.setValue("alamat.desa", null);
        },
        [propinsi]
    );
    //this function is used reset kabupaten
    const resetKabupaten = (item: IKabupaten) => {               
        setKabupaten(item); 
        setKecamatan({id: '', nama: ''});
        props.setValue("alamat.kecamatan", null);
        props.setValue("alamat.desa", null)
    }
    //this function is used reset kecamatan
    const resetKecamatan = useCallback(
        (item: IKabupaten) => {               
            setKecamatan(item); 
            setDesa({id: '', nama: ''});
            props.setValue("alamat.desa", null);
        },
        [kecamatan]
    );
    //this function is used to go back to FormPersonIdentityStepOne
    const processBackToPreviousStep = useCallback(
        () => {
            props.setVariant(
                (prev: IStateRegistrasiAnimationFramer) =>({...prev, animPID2: 'closed'})
            );

            let timer = setTimeout(
                () => {
                    props.changeHightContainer(570);
                    props.setVariant(
                        (prev: IStateRegistrasiAnimationFramer) =>({...prev, flipDisplayPID2: false, flipDisplayPID: true, animPID: 'open'})
                    );
                },
                duration*1000
            );

            return () => clearTimeout(timer);
        },
        []
    );
    //this function is used to process next step (FormUploadKTP) with depend on userName changes only
    const processNextStep = useCallback(
        () => {
            props.setVariant((prev: IStateRegistrasiAnimationFramer) =>({...prev, animPID2: 'closed'}));

            let timer = setTimeout(
                () => {
                    props.changeHightContainer(430);
                    props.setVariant(
                        (prev: IStateRegistrasiAnimationFramer) => ({...prev, flipDisplayPID2: false, flipDisplayUploadKTP: true, animUploadKTP: 'open'})
                    );
                },
                duration*1000
            );

            return () => clearTimeout(timer);
        },
        []
    );
    //rendered function
    return(
        <motion.div
            animate={props.variant.animPID2}
            variants={variantsPID2}
            style={props.variant.flipDisplayPID2?{display:'block'}:{display:'none'}}
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
                <Label styles={labelUserNameStyle}>{props.userName}</Label>
            </Stack>
            <Stack tokens={stackTokens} styles={{root: { width: 400, alignItems: 'left', marginBottom: 16}}}>
                <Label styles={labelStyle}>Alamat tinggal anda?</Label>
                <Label styles={labelSandiStyle}>Kami perlu data alamat tinggal anda berdasar KTP.</Label>
            </Stack>
            <Stack tokens={stackTokens} styles={{root: { width: 400, alignItems: 'left'}}}>
                <Stack.Item>
                    <ControlledFluentUiDropDown
                        label="Propinsi"
                        placeholder="Pilih Propinsi sesuai dengan ktp"
                        name={"alamat.propinsi"}
                        isFetching={isFetchingDataPropinsi}
                        options={dataPropinsiOptions}
                        onChangeItem={resetPropinsi}
                        required={true}
                        rules={{ required: "harus diisi sesuai dengan ktp" }}
                        defaultItemSelected={defaultPropinsi}
                        control={props.control}
                    />   
                </Stack.Item>
                <Stack.Item>
                    <ControlledFluentUiDropDown
                        label="Kabupaten / Kota"
                        placeholder="Pilih Kabupaten sesuai dengan ktp"
                        isFetching={isFetchingDataKabupaten||isFetchingDataPropinsi}
                        options={dataKabupatenOptions}
                        onChangeItem={resetKabupaten}
                        required={true}
                        name={`alamat.kabupaten`}
                        rules={{ required: "harus diisi sesuai dengan ktp" }} 
                        defaultItemSelected={defaultKabupaten}   
                        control={props.control}               
                    />
                </Stack.Item>
                <Stack.Item>
                    <ControlledFluentUiDropDown
                        label="Kecamatan"
                        placeholder="Pilih Kecamatan sesuai dengan ktp"
                        isFetching={isFetchingDataKecamatan||isFetchingDataKabupaten||isFetchingDataPropinsi}
                        options={dataKecamatanOptions}
                        onChangeItem={resetKecamatan}
                        required={true}
                        name={`alamat.kecamatan`}
                        rules={{ required: "harus diisi sesuai dengan ktp" }} 
                        defaultItemSelected={defaultKecamatan}     
                        control={props.control}           
                    />  
                </Stack.Item>
                <Stack.Item>
                    <ControlledFluentUiDropDown
                        label="Desa"
                        placeholder="Pilih Desa sesuai dengan ktp"
                        isFetching={isFetchingDataDesa||isFetchingDataKecamatan||isFetchingDataKabupaten||isFetchingDataPropinsi}
                        options={dataDesaOptions}
                        onChangeItem={resetDesa}
                        required={true}
                        name={`alamat.desa`}
                        rules={{ required: "harus diisi sesuai dengan ktp" }} 
                        defaultItemSelected={defaultDesa}  
                        control={props.control}                
                    />
                </Stack.Item>
                <Stack.Item>
                    <ControlledFluentUiTextField
                        label="Detail Alamat"
                        placeholder="Isi detail alamat seperti nama jalan, perumahan, blok, nomor rumah, rt,rw, gedung, lantai atau yang lainnya"
                        name={`alamat.keterangan`}
                        rules={{ required: "harus diisi sesuai dengan ktp" }} 
                        control={props.control}
                        required 
                        multiline 
                        resizable={false} /> 
                </Stack.Item>
            </Stack>
            <Stack horizontal tokens={stackTokens} styles={{root: { width: 400, justifyContent: 'flex-end'}}}>
                <PrimaryButton 
                    text="Lanjut" 
                    onClick={processNextStep} 
                    style={{marginTop: 24, width: 100}}
                    disabled={alamat!.keterangan!.length > 0 ? false:true}
                    />
            </Stack>
        </motion.div>
    );
};
const FormUploadKTP: FC<HookFormUploadKTP> = (props) => {
    const handlerMessageToParent = useCallback(
        (data) => {
            if(data.status === true) {

            }
            else {

            }
        },
        []
    );
    //local state
    const [uploadMode, setUploadMode] = useState<IUploadMode>({
        controlled: true, 
        startUpload: false, 
        subUri: null,
        handlerMessageToParent: handlerMessageToParent,
    });
    const [nik, setNik] = useState<string>('');
    // const [startUpload, setStartUpload] = useState<boolean>(false);
    const [isFileExist, setIsFileExist] = useState<boolean>(false);
    //rtk mutation addRegistrasi variable
    const [addRegistrasi, { data: simpleResponseAddRegister, isLoading: isLoadingAddRegistrasi }] = useAddRegistrasiMutation(); 
    // console.log(`simpleResponseAddRegister`);
    // console.log(simpleResponseAddRegister);
    //react router
    const navigate = useNavigate();
    //this is used to monitoring sukses or not when saving data personal identification to backend server
    useEffect(
        () => {
            if(simpleResponseAddRegister) {
                if(simpleResponseAddRegister.status === "sukses") {
                    setUploadMode((p) => ({...p, startUpload: true, subUri: `/files/nosec/personal_identification/${nik}`}));
                }
                else {
                    props.setIsLoading(false);
                    props.setIsErrorConnection(true);
                }                
            }
        },
        [simpleResponseAddRegister, nik]
    );        
    //this is used as feedback information to parent that if upload file has finished then start upload file personal identification
    useEffect(
        () => {
            if(uploadMode.startUpload === false && uploadMode.subUri === '') {
                props.setIsLoading(false);
                // props.setValue();
                navigate("/notif_registrasi");
            }
            else if(uploadMode.startUpload === false && uploadMode.subUri === 'gagal') {
                props.setIsLoading(false);
                props.setIsErrorConnection(true);
            }
        }        
        ,
        [uploadMode]
    );
    //this function is used to go back to FormPersonIdentityStepTwo
    const processBackToPreviousStep = useCallback(
        () => {
            props.setVariant((prev: IStateRegistrasiAnimationFramer) =>({...prev, animUploadKTP: 'closed'}));
            let timer = setTimeout(
                () => {
                    props.changeHightContainer(570);
                    props.setVariant(
                        (prev: IStateRegistrasiAnimationFramer) => (
                            {...prev, flipDisplayUploadKTP: false, flipDisplayPID2: true, animPID2: 'open'}
                        )
                    );
                },
                duration*1000
            );
            return () => clearTimeout(timer);
        },
        []
    );
    //this function is used to save data to backend server
    const save: SubmitHandler<IPerson> = useCallback(
        async(data) => {
            try {
                props.setIsLoading(true);  
                setNik(data.nik!);       
                await addRegistrasi({auth: props.authentication, person: data}).unwrap();
                // setUploadStatus(true);
                // props.setIsLoading(false);                
            } catch (error) {
                props.setIsLoading(false);
                props.setIsErrorConnection(true);
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
        [props.authentication]
    );    
    //rendered function
    return(
        <motion.div
            animate={props.variant.animUploadKTP}
            variants={variantsUploadKTP}
            style={props.variant.flipDisplayUploadKTP?{display:'block'}:{display:'none'}}
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
                <Label styles={labelUserNameStyle}>{props.userName}</Label>
            </Stack>
            <Stack tokens={stackTokens} styles={{root: { width: 400, alignItems: 'left', marginBottom: 16}}}>
                <Label styles={labelStyle}>Upload KTP</Label>
                <Label styles={labelSandiStyle}>Silahkan upload KTP anda.</Label>
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
                    onClick={props.handleSubmit(save)}
                    style={{marginTop: 24, width: 100}}
                    disabled={!isFileExist}
                    />
            </Stack>
        </motion.div>
    );
};
//main form
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
    const authentication = useAppSelector(state => state.authentication);        
    //redux action creator
    const dispatch = useAppDispatch();
    //react-hook-form
    const { control, handleSubmit, setValue } = useForm<IPerson>({
        mode: 'onSubmit',
        defaultValues: {
            nik: '',
            nama: '',
            jenisKelamin: null,
            alamat: {
                propinsi: defaultPropinsi,
                kabupaten: defaultKabupaten,
                kecamatan: defaultKecamatan,
                desa: defaultDesa,
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
                    control
                })
            }
            <FormPersonIdentityStepOne
                userName={authentication.userName}
                variant={variant} 
                setVariant={setVariant}
                changeHightContainer={setHeightArea}
                control={control}
            />
            <FormPersonIdentityStepTwo
                userName={authentication.userName}
                variant={variant} 
                setVariant={setVariant}
                setValue={setValue}
                changeHightContainer={setHeightArea}
                control={control}
            />
            <FormUploadKTP 
                userName={authentication.userName}
                variant={variant} 
                setVariant={setVariant}
                setValue={setValue}
                handleSubmit={handleSubmit}
                authentication={authentication}
                setIsLoading={setIsLoading}
                changeHightContainer={setHeightArea}
                setIsErrorConnection={setIsErrorConnection}
            />
        </div>
        {
            !variant.flipDisplayUploadKTP &&
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
    {motionKey, setMotionKey, setIsLoading, changeHightContainer, setIsErrorConnection, setValue, control}: ISlideSubFormRegistrasiParam) => {
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
                />;   
            break;
        default:
            konten = null;
            break;
    }
    return konten;
};