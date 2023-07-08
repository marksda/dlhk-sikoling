import { IconButton, ILabelStyles, Label, PrimaryButton, Stack } from "@fluentui/react";
import { motion } from "framer-motion";
import { FC, useCallback, useMemo, useState } from "react";
import { Control, useWatch } from "react-hook-form";
// import { useGetAllJenisKelaminQuery } from "../../features/repository/service/jenis-kelamin-api-slice";
import { ControlledFluentUiDropDown } from "../ControlledDropDown/ControlledFluentUiDropDown";
import { ControlledFluentUiTextField } from "../ControlledTextField/ControlledFluentUiTextField";
import { backIcon, durationAnimFormRegistrasi, ISubFormRegistrasiProps, variantPID } from "./InterfaceRegistrasiForm";

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

interface ISubFormPIDRegistrasiProps extends ISubFormRegistrasiProps {
    control?: Control<any>;
};

export const SubFormPersonIdentityStepOneRegistrasi: FC<ISubFormPIDRegistrasiProps> = ({setMotionKey, changeHightContainer, setValue, control}) => {
    //react-hook-form variable hook
    const [nik, nama, jenisKelamin, kontak] = useWatch({
        control: control, 
        name: ['nik', 'nama', 'jenisKelamin', 'kontak', 'alamat']
    });

    // local state
    const [animPid, setAnimPid] = useState<string>('open');

    //rtk query jenisKelamin variable hook
    const { data: dataJenisKelamin = [], isFetching: isFetchingJenisKelamin } = useGetAllJenisKelaminQuery();  

    const dataJenisKelaminOptions = useMemo(
        () => dataJenisKelamin.map((t) => { 
            return {key: t.id as string, text: t.nama as string}; 
        }),
        [dataJenisKelamin]
    );

    const handleChangeItem = useCallback(
        (item) => {
            setValue("jenisKelamin", {id: item.key, nama: item.text});
        },
        []
    );

    //this function is used to go back to FormPassword
    const processBackToPreviousStep = useCallback(
        () => {
            setAnimPid('closed');

            let timer = setTimeout(
                () => {
                    changeHightContainer(350);
                    setMotionKey('password');
                },
                durationAnimFormRegistrasi*1000
            );

            return () => clearTimeout(timer);
        },
        []
    );

    //this function is used to process next step (FormPersonIdentityStepTwo) with dependen on userName changes only
    const processNextStep = useCallback(
        () => {
            setAnimPid('closed');
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

    return(
        <motion.div
            animate={animPid}
            variants={variantPID}
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
                <Label styles={labelStyle}>Siapa anda?</Label>
                <Label styles={subLabelStyle}>Kami perlu data personal berdasar KTP untuk mengatur akun Anda.</Label>
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
                        disabled={nik.length>0?false:true}
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
                        onChangeItem={handleChangeItem}
                        defaultItemSelected={jenisKelamin != null ? jenisKelamin.id:''}
                        disabled={(nama!.length>0?false:true)||isFetchingJenisKelamin}    
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
                        value={kontak.email}
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