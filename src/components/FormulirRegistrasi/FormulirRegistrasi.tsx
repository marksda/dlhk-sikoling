import { DefaultEffects, DefaultPalette, IconButton, IIconProps, ILabelStyles, Image, IProgressIndicatorStyles, IStackItemStyles, IStackTokens, Label, PrimaryButton, ProgressIndicator, Stack, TextField } from "@fluentui/react";
import { motion } from "framer-motion";
import { FC, useCallback, useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { defaultDesa, defaultJenisKelamin, defaultKabupaten, defaultKecamatan, defaultPropinsi } from "../../features/config/config";
import { useGetDesaByKecamatanQuery } from "../../features/desa/desa-api-slice";
import { IDesa, resetDesa } from "../../features/desa/desa-slice";
import { useGetAllJenisKelaminQuery } from "../../features/jenis-kelamin/jenis-kelamin-api-slice";
import { useGetKabupatenByPropinsiQuery } from "../../features/kabupaten/kabupaten-api-slice";
import { IKabupaten } from "../../features/kabupaten/kabupaten-slice";
import { useGetKecamatanByKabupatenQuery } from "../../features/kecamatan/kecamatan-api-slice";
import { IKecamatan } from "../../features/kecamatan/kecamatan-slice";
import { useGetAllPropinsiQuery } from "../../features/propinsi/propinsi-api-slice";
import { IPropinsi } from "../../features/propinsi/propinsi-slice";
import { useCekUserNameMutation } from "../../features/security/authorization-api-slice";
import { IAuthentication } from "../../features/security/authorization-slice";
import logo from '../../sidoarjo.svg';
import { ControlledFluentUiDropDown } from "../ControlledDropDown/ControlledFluentUiDropDown";
import { ControlledFluentUiTextField } from "../ControlledTextField/ControlledFluentUiTextField";
import { IPerson } from "../../features/person/person-slice"
import { IContainerUploadStyle, UploadFilesFluentUi } from "../UploadFiles/UploadFilesFluentUI";
import {createWorker}  from "tesseract.js";
import cv from "@techstark/opencv-js";


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
}

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
const variantsUserName = {
    open: { 
        opacity: 1, 
        x: 0,      
        transition: {
            duration
        },   
    },
    closed: { 
        opacity: 0, 
        x: '-10%', 
        transition: {
            duration
        },
    },
};
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
const containerStyle: IContainerUploadStyle = {
    width: 400, 
    height: 100, 
    backgroundColor: '#ECECEC',
};

export const FormulirRegistrasi: FC = () => {    
    // importScript("../../opencv.js");

    const [loginAuthentication, setLoginAuthentication] = useState<IAuthentication>({
        userName: '',
        password: '',
    });

    // const [fileKTP, setFileKTP] = useState<File|null>(null);

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
                email: loginAuthentication.userName,
            },
            scanKTP: '',
        }
    });

    const [nik, nama, jenisKelamin, kontak, alamat] = useWatch({
        control, 
        name: ['nik', 'nama', 'jenisKelamin', 'kontak', 'alamat']
    });

    const [heighArea, setHeightArea] = useState<number>(300);
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
    const [errorEmailName, setErrorEmailName] = useState<string>('');
    const [errorPassword, setErrorPassword] = useState<string>('');
    const [cekUserName, { isLoading: isLoadingCekUserName }] = useCekUserNameMutation();
    const regexpEmail = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    const regexpPassword = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");

    const { data: dataJenisKelamin = [], isFetching } = useGetAllJenisKelaminQuery();  
    const dataJenisKelaminOptions = dataJenisKelamin.map((t) => { return {key: t.id as string, text: t.nama as string}; });

    const [propinsi, setPropinsi] = useState<IPropinsi>(defaultPropinsi); 
    const { data: dataPropinsi = [], isFetching: isFetchingDataPropinsi } = useGetAllPropinsiQuery();
    const dataPropinsiOptions = dataPropinsi.map((t) => {
        return {key: t.id as string, text: t.nama as string}; 
    });

    const [kabupaten, setKabupaten] = useState<IKabupaten>(defaultKabupaten);
    const { data: dataKabupaten = [], isFetching: isFetchingDataKabupaten } = useGetKabupatenByPropinsiQuery(propinsi.id!);
    const dataKabupatenOptions = dataKabupaten.map((t) => {
        return {key: t.id as string, text: t.nama as string}; 
    });

    const [kecamatan, setKecamatan] = useState<IKecamatan>(defaultKecamatan);
    const { data: dataKecamatan = [], isFetching: isFetchingDataKecamatan } = useGetKecamatanByKabupatenQuery(kabupaten.id!);
    const dataKecamatanOptions = dataKecamatan.map((t) => {
        return {key: t.id as string, text: t.nama as string}; 
    });

    const [desa, setDesa] = useState<IDesa>(defaultDesa);
    const { data: dataDesa = [], isFetching: isFetchingDataDesa } = useGetDesaByKecamatanQuery(kecamatan.id!);
    const dataDesaOptions = dataDesa.map((t) => {
        return {key: t.id as string, text: t.nama as string}; 
    });

    const resetPropinsi = (item: IPropinsi) => {          
        setDesa({id: '', nama: ''});
        setKecamatan({id: '', nama: ''});
        setKabupaten({id: '', nama: ''});
        setPropinsi(item);
        setValue("alamat.kabupaten", null);
        setValue("alamat.kecamatan", null);
        setValue("alamat.desa", null);
    }

    const resetKabupaten = (item: IKabupaten) => {               
        setKabupaten(item); 
        setKecamatan({id: '', nama: ''});
        setValue("alamat.kecamatan", null);
        setValue("alamat.desa", null)
    }

    const resetKecamatan = (item: IKabupaten) => {               
        setKecamatan(item); 
        setDesa({id: '', nama: ''});
        setValue("alamat.desa", null);
    }

    const onChangeEmailNameValue = useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            if(newValue!.length === 0 && errorEmailName.length != 0) {                
                setErrorEmailName('');
            }

            setLoginAuthentication(
                (prev) => (
                    {...prev, userName: newValue||''}
                )
            );
            setValue("kontak.email", newValue||'');
        },
        [errorEmailName, setLoginAuthentication],
    );

    const onChangeUserPasswordValue = useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            if(newValue!.length === 0 && errorEmailName.length != 0) {                
                setErrorPassword('');
            }

            setLoginAuthentication(
                (prev) => (
                    {...prev, password: newValue!}
                )
            );
        },
        [],
    );

    const onButtonLanjutClick = async () => { 
        let test = regexpEmail.test(loginAuthentication.userName);
        if(test == true) {
            try {
                const hasil = await cekUserName(loginAuthentication.userName).unwrap();
                if(hasil == false) {
                    setHeightArea(350);
                    setErrorEmailName('');
                    setErrorPassword('');
                    setVariant((prev) =>({...prev, animUserName: 'closed'}));     
                    setTimeout(
                        () => {
                            setVariant((prev) =>({...prev, flipDisplayUser: false, flipDisplayPassword: true, animPassword: 'open'}));
                        },
                        duration*1000
                    );
                }
                else {
                    setErrorEmailName(`Email ${loginAuthentication.userName} sudah terdaftar, silahkan gunakan email yang belum terdaftar.`)
                }
            }   
            catch (err) {
                console.log(err);
            }  
        }
        else {
            setErrorEmailName('Format email tidak sesuai');
        }        
    };

    const onButtonUserNameBackClick = () => {         
        setVariant((prev) =>({...prev, animPassword: 'closed'}));
        setTimeout(
            () => {
                // setLoginAuthentication(
                //     (prev) => (
                //         {...prev, password: ''}
                //     )
                // );
                setHeightArea(300);
                setVariant((prev) =>({...prev, flipDisplayPassword: false, flipDisplayUser: true, animUserName: 'open'}));
            },
            duration*1000
        );
    };

    const onButtonLanjutPasswordClick = () => {
        // let test = regexpPassword.test(loginAuthentication.password);
        let test = loginAuthentication.password.length > 7 ? true:false;
        if(test == true) {
            setErrorPassword('');
            setVariant((prev) =>({...prev, animPassword: 'closed'}));
            setTimeout(
                () => {
                    // setLoginAuthentication(
                    //     (prev) => (
                    //         {...prev, password: ''}
                    //     )
                    // );
                    setHeightArea(570);
                    setVariant((prev) =>({...prev, flipDisplayPassword: false, flipDisplayPID: true, animPID: 'open'}));
                },
                duration*1000
            );
        }
        else {
            setErrorPassword("panjang sandi minimal 8 karakter");
            // setErrorPassword("Sandi harus mengandung huruf besar, kecil, numerik, spesial karakter seperti ~!@#$%^&* dan panjang minimal 8 karakter");
        }        
    };

    const onButtonUserNameBackToPasswordClick = () => {         
        setVariant((prev) =>({...prev, animPID: 'closed'}));
        setTimeout(
            () => {
                // setLoginAuthentication(
                //     (prev) => (
                //         {...prev, password: ''}
                //     )
                // );
                setHeightArea(350);
                setVariant((prev) =>({...prev, flipDisplayUser: false, flipDisplayPassword: true, animPassword: 'open'}));
            },
            duration*1000
        );
    };

    const onButtonLanjutPIDClick = () => {
        setVariant((prev) =>({...prev, animPID: 'closed'}));
        setTimeout(
            () => {
                setLoginAuthentication(
                    (prev) => (
                        {...prev, password: ''}
                    )
                );
                setHeightArea(570);
                setVariant((prev) =>({...prev, flipDisplayPID: false, flipDisplayPID2: true, animPID2: 'open'}));
            },
            duration*1000
        );
    };

    const onButtonUserNameBackToPIDClick = () => {
        setVariant((prev) =>({...prev, animPID2: 'closed'}));
        setTimeout(
            () => {
                // setLoginAuthentication(
                //     (prev) => (
                //         {...prev, password: ''}
                //     )
                // );
                setHeightArea(570);
                setVariant((prev) =>({...prev, flipDisplayPID2: false, flipDisplayPID: true, animPID: 'open'}));
            },
            duration*1000
        );
    };

    const onButtonLanjutPID2Click = () => {
        setVariant((prev) =>({...prev, animPID2: 'closed'}));
        setTimeout(
            () => {
                // setLoginAuthentication(
                //     (prev) => (
                //         {...prev, password: ''}
                //     )
                // );
                setHeightArea(430);
                setVariant((prev) =>({...prev, flipDisplayPID2: false, flipDisplayUploadKTP: true, animUploadKTP: 'open'}));
            },
            duration*1000
        );
    };

    const onButtonUserNameBackToPID2Click = () => {
        setVariant((prev) =>({...prev, animUploadKTP: 'closed'}));
        setTimeout(
            () => {
                // setLoginAuthentication(
                //     (prev) => (
                //         {...prev, password: ''}
                //     )
                // );
                setHeightArea(570);
                setVariant((prev) =>({...prev, flipDisplayUploadKTP: false, flipDisplayPID2: true, animPID2: 'open'}));
            },
            duration*1000
        );
    };

    const onButtonSimpanClick = () => {
        // handleSubmit(
        //     (data) => {
        //       console.log(data);
        //     //   addPerson(data);
        //     },
        //     (err) => {                
        //       console.log(err);
        //     }
        //   )();

        // let imgElement: HTMLImageElement = document.createElement("img");
        // imgElement.src = URL.createObjectURL(fileKTP!);    
        // imgElement.id = "tesgbr";
        // console.log(imgElement);  
        // cv.imshow('canvasOutput', mat);
        // mat.delete();
        let src = cv.imread("tesgbr");
        let dst = new cv.Mat();
        cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
        cv.imshow('canvasOutput', dst);
        src.delete();
        dst.delete();

        

        // const worker = createWorker({
        //     logger: m => console.log(m)
        // });
          
        // (async () => {
        // await worker.load();
        // await worker.loadLanguage('eng');
        // await worker.initialize('eng');
        // const { data: { text } } = await worker.recognize(fileKTP!);
        // console.log(text);
        // await worker.terminate();
        // })();
    };    
    
    return(
        <>
        {
            isLoadingCekUserName &&
            (<Stack>
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
            <motion.div
                animate={variant.animUserName}
                variants={variantsUserName}
                style={variant.flipDisplayUser?{display:'block'}:{display:'none'}}
            >   
                <Stack horizontal tokens={stackTokens} styles={{root: { width: 300, alignItems: 'center', marginBottom: 16}}}>
                    <Label styles={labelStyle}>Buat akun</Label>                    
                </Stack>
                <TextField 
                    placeholder="Gunakan email yang masih aktif" 
                    value={loginAuthentication.userName}
                    onChange={onChangeEmailNameValue}
                    onKeyUp={
                        (event) => {
                            if(event.key == 'Enter') {
                                onButtonLanjutClick();
                            }
                        }
                    }
                    iconProps={contactIcon} 
                    disabled={isLoadingCekUserName}
                    underlined 
                    autoFocus
                    errorMessage={errorEmailName}
                    styles={{root: {marginBottom: 8}}}/>
                <Stack horizontal tokens={stackTokens} styles={{root: { width: 400, justifyContent: 'flex-end'}}}>
                    <PrimaryButton 
                        text="Berikutnya" 
                        onClick={onButtonLanjutClick} 
                        style={{marginTop: 24, width: 100}}
                        disabled={isLoadingCekUserName}
                        />
                </Stack>
            </motion.div>
            <motion.div
                animate={variant.animPassword}
                variants={variantsPassword}
                style={variant.flipDisplayPassword?{display:'block'}:{display:'none'}}
            >
                <Stack horizontal tokens={stackTokens} styles={{root: { width: 400, alignItems: 'center'}}}>                    
                    <IconButton 
                        iconProps={backIcon} 
                        title="Back" 
                        ariaLabel="Back"
                        onClick={onButtonUserNameBackClick} 
                        styles={{
                            root: {
                                borderStyle: 'none',
                                borderRadius: '50%',
                                padding: 0,
                                marginTop: 2,
                            }
                        }}/>
                    <Label styles={labelUserNameStyle}>{loginAuthentication.userName}</Label>
                </Stack>                
                <Stack tokens={stackTokens} styles={{root: { width: 400, alignItems: 'left', marginBottom: 16}}}>
                    <Label styles={labelStyle}>Buat kata sandi</Label>
                    <Label styles={labelSandiStyle}>Masukkan kata sandi yang ingin digunakan dengan akun Anda.</Label>
                </Stack>                
                <TextField 
                    placeholder="kata sandi"
                    value={loginAuthentication.password}
                    onChange={onChangeUserPasswordValue}
                    onKeyUp={
                        (event) => {
                            if(event.key == 'Enter') {
                                onButtonLanjutClick();
                            }
                        }
                    }
                    underlined 
                    type="password"
                    disabled={false}
                    errorMessage={errorPassword}                    
                    styles={{root: {marginBottom: 8}}}/>
                <Stack horizontal tokens={stackTokens} styles={{root: { width: 400, justifyContent: 'flex-end'}}}>
                    <PrimaryButton 
                        text="Lanjut" 
                        onClick={onButtonLanjutPasswordClick} 
                        style={{marginTop: 24, width: 100}}
                        disabled={false}
                        />
                </Stack>
            </motion.div>
            <motion.div
                animate={variant.animPID}
                variants={variantsPID}
                style={variant.flipDisplayPID?{display:'block'}:{display:'none'}}
            >
                <Stack horizontal tokens={stackTokens} styles={{root: { width: 400, alignItems: 'center'}}}>                    
                    <IconButton 
                        iconProps={backIcon} 
                        title="Back" 
                        ariaLabel="Back"
                        onClick={onButtonUserNameBackToPasswordClick} 
                        styles={{
                            root: {
                                borderStyle: 'none',
                                borderRadius: '50%',
                                padding: 0,
                                marginTop: 2,
                            }
                        }}/>
                    <Label styles={labelUserNameStyle}>{loginAuthentication.userName}</Label>
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
                            control={control}
                        />
                    </Stack.Item>
                    <Stack.Item>
                        <ControlledFluentUiTextField
                            required
                            label="Nama"
                            name="nama"
                            rules={{ required: "harus diisi sesuai dengan ktp" }}   
                            control={control}
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
                            control={control}         
                            disabled={nama!.length>0?false:true}    
                        /> 
                    </Stack.Item>
                    <Stack.Item>
                        <ControlledFluentUiTextField
                            required
                            label="Telepone"
                            name="kontak.telepone"
                            rules={{ required: "minimal harus diisi satu nomor telepone yang aktif" }}    
                            control={control}
                            disabled={jenisKelamin == null?true:false}
                        /> 
                    </Stack.Item>
                    <Stack.Item>
                        <ControlledFluentUiTextField
                            required
                            label="Email"
                            name="kontak.email"
                            rules={{ required: "Alamat email harus diisi" }}  
                            control={control} 
                            value={loginAuthentication.userName}
                            disabled={true}
                        />
                    </Stack.Item>
                </Stack>
                <Stack horizontal tokens={stackTokens} styles={{root: { width: 400, justifyContent: 'flex-end'}}}>
                    <PrimaryButton 
                        text="Lanjut" 
                        onClick={onButtonLanjutPIDClick} 
                        style={{marginTop: 24, width: 100}}
                        disabled={kontak?.telepone?.length == 0 ? true:false}
                        />
                </Stack>     
            </motion.div>
            <motion.div
                animate={variant.animPID2}
                variants={variantsPID2}
                style={variant.flipDisplayPID2?{display:'block'}:{display:'none'}}
            >
                <Stack horizontal tokens={stackTokens} styles={{root: { width: 400, alignItems: 'center'}}}>                    
                    <IconButton 
                        iconProps={backIcon} 
                        title="Back" 
                        ariaLabel="Back"
                        onClick={onButtonUserNameBackToPIDClick} 
                        styles={{
                            root: {
                                borderStyle: 'none',
                                borderRadius: '50%',
                                padding: 0,
                                marginTop: 2,
                            }
                        }}/>
                    <Label styles={labelUserNameStyle}>{loginAuthentication.userName}</Label>
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
                            control={control}
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
                            control={control}               
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
                            control={control}           
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
                            control={control}                
                        />
                    </Stack.Item>
                    <Stack.Item>
                        <ControlledFluentUiTextField
                            label="Detail Alamat"
                            placeholder="Isi detail alamat seperti nama jalan, perumahan, blok, nomor rumah, rt,rw, gedung, lantai atau yang lainnya"
                            name={`alamat.keterangan`}
                            rules={{ required: "harus diisi sesuai dengan ktp" }} 
                            control={control}
                            required multiline autoAdjustHeight
                        /> 
                    </Stack.Item>
                </Stack>
                <Stack horizontal tokens={stackTokens} styles={{root: { width: 400, justifyContent: 'flex-end'}}}>
                    <PrimaryButton 
                        text="Lanjut" 
                        onClick={onButtonLanjutPID2Click} 
                        style={{marginTop: 24, width: 100}}
                        disabled={alamat!.keterangan!.length > 0 ? false:true}
                        />
                </Stack>
            </motion.div>
            <motion.div
                animate={variant.animUploadKTP}
                variants={variantsUploadKTP}
                style={variant.flipDisplayUploadKTP?{display:'block'}:{display:'none'}}
            >
                <Stack horizontal tokens={stackTokens} styles={{root: { width: 400, alignItems: 'center'}}}>                    
                    <IconButton 
                        iconProps={backIcon} 
                        title="Back" 
                        ariaLabel="Back"
                        onClick={onButtonUserNameBackToPID2Click} 
                        styles={{
                            root: {
                                borderStyle: 'none',
                                borderRadius: '50%',
                                padding: 0,
                                marginTop: 2,
                            }
                        }}/>
                    <Label styles={labelUserNameStyle}>{loginAuthentication.userName}</Label>
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
                        />
                    </Stack.Item>
                    <Stack.Item>
                        <canvas id="canvasOutput"></canvas>
                    </Stack.Item>
                </Stack>
                <Stack horizontal tokens={stackTokens} styles={{root: { width: 400, justifyContent: 'flex-end'}}}>
                    <PrimaryButton 
                        text="Simpan" 
                        onClick={onButtonSimpanClick}
                        style={{marginTop: 24, width: 100}}
                        disabled={false}
                        />
                </Stack>
            </motion.div>
        </div>
        <div style={containerInformationStyles}>
            <Stack tokens={containerStackTokens}>
                <Stack.Item align="start">
                    <Label  styles={labelWarningStyle}>Perhatiaan!!</Label> 
                    <Label  styles={labelWarningStyle} style={{color: 'black'}}>
                        Anda harus meyiapkan file hasil scan/foto KTP berformat jpg, file ini wajib diupload pada tahap berikutnya</Label>
                </Stack.Item>
            </Stack>
        </div>
        </>
    )
}