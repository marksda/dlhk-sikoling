import { IconButton, ILabelStyles, Label, PrimaryButton, Stack } from "@fluentui/react";
import { motion } from "framer-motion";
import { FC, useCallback, useMemo, useState } from "react";
import { Control, useWatch } from "react-hook-form";
import { useGetDesaByKecamatanQuery } from "../../features/desa/desa-api-slice";
import { useGetKabupatenByPropinsiQuery } from "../../features/kabupaten/kabupaten-api-slice";
import { useGetKecamatanByKabupatenQuery } from "../../features/kecamatan/kecamatan-api-slice";
import { useGetAllPropinsiQuery } from "../../features/propinsi/propinsi-api-slice";
import { ControlledFluentUiDropDown } from "../ControlledDropDown/ControlledFluentUiDropDown";
import { ControlledFluentUiTextField } from "../ControlledTextField/ControlledFluentUiTextField";
import { backIcon, durationAnimFormRegistrasi, ISubFormRegistrasiProps, variantPID2 } from "./InterfaceRegistrasiForm";

interface ISubFormPID2RegistrasiProps extends ISubFormRegistrasiProps {
    control?: Control<any>;
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

export const SubFormPersonIdentityStepTwoRegistrasi: FC<ISubFormPID2RegistrasiProps> = ({setMotionKey, setIsLoading, changeHightContainer, setIsErrorConnection, setValue, control}) => {
    //react-hook-form variable hook
    const [kontak, alamat] = useWatch({
        control: control, 
        name: ['kontak', 'alamat']
    });

    // local state
    const [animPid2, setAnimPid2] = useState<string>('open');    

    //rtk query propinsi variable hook
    const { data: dataPropinsi = [], isFetching: isFetchingDataPropinsi } = useGetAllPropinsiQuery();    
    const { data: dataKabupaten = [], isFetching: isFetchingDataKabupaten } = useGetKabupatenByPropinsiQuery(alamat.propinsi.id);
    const { data: dataKecamatan = [], isFetching: isFetchingDataKecamatan } = useGetKecamatanByKabupatenQuery(alamat.kabupaten.id);    
    const { data: dataDesa = [], isFetching: isFetchingDataDesa } = useGetDesaByKecamatanQuery(alamat.kecamatan.id);

    
    const dataPropinsiOptions = useMemo(
        () => dataPropinsi.map((t) => {
            return {key: t.id as string, text: t.nama as string}; 
        }),
        [dataPropinsi]
    );

    const dataKabupatenOptions = useMemo(
        () => dataKabupaten.map((t) => {
            return {key: t.id as string, text: t.nama as string}; 
        }),
        [dataKabupaten]
    );
    
    const dataKecamatanOptions = useMemo(
        () => dataKecamatan.map((t) => {
            return {key: t.id as string, text: t.nama as string}; 
        }),
        [dataKecamatan]
    );

    const dataDesaOptions = useMemo(
        () => dataDesa.map((t) => {
            return {key: t.id as string, text: t.nama as string}; 
        }),
        [dataDesa]
    );

    const handleChangePropinsi = useCallback(
        (item) => {
            setValue("alamat.propinsi", {id: item.key, nama: item.text});
            setValue("alamat.kabupaten", {id: '', nama: ''});
            setValue("alamat.kecamatan", {id: '', nama: ''});
            setValue("alamat.desa", {id: '', nama: ''});
        },
        []
    );

    const handleChangeKabupaten = useCallback(
        (item) => {
            setValue("alamat.kabupaten", {id: item.key, nama: item.text});
            setValue("alamat.kecamatan", {id: '', nama: ''});
            setValue("alamat.desa", {id: '', nama: ''})
        },
        []
    );

    const handleChangeKecamatan = useCallback(
        (item) => {               
            setValue("alamat.kecamatan", {id: item.key, nama: item.text});
            setValue("alamat.desa", {id: '', nama: ''});
        },
        []
    );

    const handleChangeDesa = useCallback(
        (item) => {               
            setValue("alamat.desa", {id: item.key, nama: item.text});
        },
        []
    );

    //this function is used to go back to FormPersonIdentityStepOne
    const processBackToPreviousStep = useCallback(
        () => {
            setAnimPid2('closed');

            let timer = setTimeout(
                () => {
                    changeHightContainer(570);
                    setMotionKey('pid');
                },
                durationAnimFormRegistrasi*1000
            );

            return () => clearTimeout(timer);
        },
        []
    );

    //this function is used to process next step (FormUploadKTP) with depend on userName changes only
    const processNextStep = useCallback(
        () => {
            setAnimPid2('closed');

            let timer = setTimeout(
                () => {
                    changeHightContainer(430);
                    setMotionKey('pid3');
                },
                durationAnimFormRegistrasi*1000
            );

            return () => clearTimeout(timer);
        },
        []
    );

    return(
        <motion.div
            animate={animPid2}
            variants={variantPID2}
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
                <Label styles={labelStyle}>Alamat tinggal anda?</Label>
                <Label styles={subLabelStyle}>Kami perlu data alamat tinggal anda berdasar KTP.</Label>
            </Stack>
            <Stack tokens={stackTokens} styles={{root: { width: 400, alignItems: 'left'}}}>
                <Stack.Item>
                    <ControlledFluentUiDropDown
                        label="Propinsi"
                        placeholder="Pilih Propinsi sesuai dengan ktp"
                        name={"alamat.propinsi"}
                        isFetching={isFetchingDataPropinsi}
                        options={dataPropinsiOptions}
                        onChangeItem={handleChangePropinsi}
                        required={true}
                        rules={{ required: "harus diisi sesuai dengan ktp" }}
                        defaultItemSelected={alamat.propinsi.id}
                        control={control}
                    />   
                </Stack.Item>
                <Stack.Item>
                    <ControlledFluentUiDropDown
                        label="Kabupaten / Kota"
                        placeholder="Pilih Kabupaten sesuai dengan ktp"
                        isFetching={isFetchingDataKabupaten||isFetchingDataPropinsi}
                        options={dataKabupatenOptions}
                        onChangeItem={handleChangeKabupaten}
                        required={true}
                        name={"alamat.kabupaten"}
                        rules={{ required: "harus diisi sesuai dengan ktp" }} 
                        defaultItemSelected={alamat.kabupaten.id}   
                        control={control}    
                        disabled={alamat.propinsi.id == '' ? true : false}      
                    />
                </Stack.Item>
                <Stack.Item>
                    <ControlledFluentUiDropDown
                        label="Kecamatan"
                        placeholder="Pilih Kecamatan sesuai dengan ktp"
                        isFetching={isFetchingDataKecamatan||isFetchingDataKabupaten||isFetchingDataPropinsi}
                        options={dataKecamatanOptions}
                        onChangeItem={handleChangeKecamatan}
                        required={true}
                        name={"alamat.kecamatan"}
                        rules={{ required: "harus diisi sesuai dengan ktp" }} 
                        defaultItemSelected={alamat.kecamatan.id}     
                        control={control}                           
                        disabled={alamat.kabupaten.id == '' ? true : false}             
                    />  
                </Stack.Item>
                <Stack.Item>
                    <ControlledFluentUiDropDown
                        label="Desa"
                        placeholder="Pilih Desa sesuai dengan ktp"
                        isFetching={isFetchingDataDesa||isFetchingDataKecamatan||isFetchingDataKabupaten||isFetchingDataPropinsi}
                        options={dataDesaOptions}
                        onChangeItem={handleChangeDesa}
                        required={true}
                        name={"alamat.desa"}
                        rules={{ required: "harus diisi sesuai dengan ktp" }} 
                        defaultItemSelected={alamat.desa.id}  
                        control={control}      
                        disabled={alamat.kecamatan.id == '' ? true : false}           
                    />
                </Stack.Item>
                <Stack.Item>
                    <ControlledFluentUiTextField
                        label="Detail Alamat"
                        placeholder="Isi detail alamat seperti nama jalan, perumahan, blok, nomor rumah, rt,rw, gedung, lantai atau yang lainnya"
                        name={`alamat.keterangan`}
                        rules={{ required: "harus diisi sesuai dengan ktp" }} 
                        control={control}
                        required 
                        multiline 
                        resizable={false} 
                        disabled={alamat.desa.id == '' ? true : false}
                    /> 
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