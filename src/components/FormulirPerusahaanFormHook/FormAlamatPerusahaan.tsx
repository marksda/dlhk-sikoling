import { IconButton, IDropdownOption, Label, PrimaryButton, Stack } from "@fluentui/react";
import { motion } from "framer-motion";
import { FC, useCallback, useEffect, useState } from "react";
import { useWatch } from "react-hook-form";
import { useGetDesaByKecamatanQuery } from "../../features/desa/desa-api-slice";
import { useGetKabupatenByPropinsiQuery } from "../../features/kabupaten/kabupaten-api-slice";
import { useGetKecamatanByKabupatenQuery } from "../../features/kecamatan/kecamatan-api-slice";
import { useGetAllPropinsiQuery } from "../../features/propinsi/propinsi-api-slice";
import { ControlledFluentUiDropDown } from "../ControlledDropDown/ControlledFluentUiDropDown";
import { ControlledFluentUiTextField } from "../ControlledTextField/ControlledFluentUiTextField";
import { backIcon, contentStyles, duration, ISubFormPerusahaanProps, labelStyle, labelTitleBack, stackTokens, subLabelStyle, variantAnimPerusahaan } from "./InterfacesPerusahaan";

export const FormAlamatPerusahaan: FC<ISubFormPerusahaanProps> = ({control, setValue, setMotionKey}) => {
    //hook variable from react form hook
    const [alamat] = useWatch({
        control: control, 
        name: ['alamat']
    });
    //local state
    const [animAlamatPerusahaan, setAnimAlamatPerusahaan] = useState<string>('open');
    const [propinsiOptions, setPropinsiOptions] = useState<IDropdownOption<any>[]>([]);
    const [kabupatenOptions, setKabupatenOptions] = useState<IDropdownOption<any>[]>([]); 
    const [kecamatanOptions, setKecamatanOptions] = useState<IDropdownOption<any>[]>([]);   
    const [desaOptions, setDesaOptions] = useState<IDropdownOption<any>[]>([]);
    //hook variable rtk query
    const { data: dataPropinsi = [], isFetching: isFetchingDataPropinsi, isError: isErrorPropinsi } = useGetAllPropinsiQuery();
    const { data: dataKabupaten = [], isFetching: isFetchingDataKabupaten, isError: isErrorKabupaten } = useGetKabupatenByPropinsiQuery(alamat.propinsi != null ? alamat.propinsi.id : null, {skip: alamat.propinsi == null ? true : false});
    const { data: dataKecamatan = [], isFetching: isFetchingDataKecamatan, isError: isErrorKecamatan } = useGetKecamatanByKabupatenQuery(alamat.kabupaten != null ? alamat.kabupaten.id : null, {skip: alamat.kabupaten == null ? true : false});
    const { data: dataDesa = [], isFetching: isFetchingDataDesa, isError: isErrorDesa } = useGetDesaByKecamatanQuery(alamat.kecamatan != null ? alamat.kecamatan.id : null, {skip: alamat.kecamatan == null ? true : false});

    //deteksi data options propinsi sudah tersedia
    useEffect(
        () => {
            if(isFetchingDataPropinsi == false) {
                let tmpOptions = dataPropinsi.map((t) => { return {key: t.id as string, text: t.nama as string}; });
                setPropinsiOptions(tmpOptions);
            }
        },
        [isFetchingDataPropinsi]
    );

    //deteksi data options kabupaten sudah tersedia
    useEffect(
        () => {
            if(isFetchingDataKabupaten == false) {
                let tmpOptions = dataKabupaten.map((t) => { return {key: t.id as string, text: t.nama as string}; });
                setKabupatenOptions(tmpOptions);
            }
        },
        [isFetchingDataKabupaten]
    );

    //deteksi data options kecamatan sudah tersedia
    useEffect(
        () => {
            if(isFetchingDataKecamatan == false) {
                let tmpOptions = dataKecamatan.map((t) => { return {key: t.id as string, text: t.nama as string}; });
                setKecamatanOptions(tmpOptions);
            }
        },
        [isFetchingDataKecamatan]
    );

    //deteksi data options desa sudah tersedia
    useEffect(
        () => {
            if(isFetchingDataDesa == false) {
                let tmpOptions = dataDesa.map((t) => { return {key: t.id as string, text: t.nama as string}; });
                setDesaOptions(tmpOptions);
            }
        },
        [isFetchingDataDesa]
    );

    const processBackToPreviousStep = useCallback(
        () => {
            setAnimAlamatPerusahaan('closed');            
            let timer = setTimeout(
                () => {
                    setMotionKey('identitasPerusahaan');
                },
                duration*1000
            );
            return () => clearTimeout(timer);
        },
        []
    );

    const handleChangePropinsi = useCallback(
        (itemSelected) => {
            let itemPropinsiSelected = dataPropinsi.find(
                (item) => { return item.id == itemSelected.key; } 
            );  
            setValue("alamat", {
                ...alamat, 
                propinsi: {id: itemPropinsiSelected!.id, nama: itemPropinsiSelected!.nama},
                kabupaten: null,
                kecamatan: null,
                desa: null,
            });
        },
        [dataPropinsi, alamat]
    );

    const handleChangeKabupaten = useCallback(
        (itemSelected) => {
            let itemKabupatenSelected = dataKabupaten.find(
                (item) => { return item.id == itemSelected.key; } 
            )
            setValue("alamat", {
                ...alamat, 
                kabupaten: {id: itemKabupatenSelected!.id, nama: itemKabupatenSelected!.nama},
                kecamatan: null,
                desa: null
            });
        },
        [dataKabupaten, alamat]
    );

    const handleChangeKecamatan = useCallback(
        (itemSelected) => {
            let itemKecamatanSelected = dataKecamatan.find(
                (item) => { return item.id == itemSelected.key; } 
            )
            setValue("alamat", {
                ...alamat, 
                kecamatan: {id: itemKecamatanSelected!.id, nama: itemKecamatanSelected!.nama},
                desa: null
            });
        },
        [dataKecamatan, alamat]
    );

    const handleChangeDesa = useCallback(
        (itemSelected) => {
            let itemDesaSelected = dataDesa.find(
                (item) => { return item.id == itemSelected.key; } 
            )
            setValue("alamat", {
                ...alamat, 
                desa: {id: itemDesaSelected!.id, nama: itemDesaSelected!.nama}
            });
        },
        [dataDesa, alamat]
    );

    const processNextStep = useCallback(
        () => {
            setAnimAlamatPerusahaan('closed');
            let timer = setTimeout(
                () => {
                    setMotionKey('alamatPerusahaan');
                },
                duration*1000
            );
            return () => clearTimeout(timer);
        },
        []
    );

    return (
        <motion.div
            animate={animAlamatPerusahaan}
            variants={variantAnimPerusahaan}
            className={contentStyles.body} 
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
                <Label styles={labelTitleBack}>Identitas perusahaan</Label>
            </Stack>
            <Stack tokens={stackTokens} styles={{root: { width: 400, alignItems: 'left', marginBottom: 16}}}>
                <Label styles={labelStyle}>Alamat Perusahaan</Label>
                <Label styles={subLabelStyle}>Lengkapi alamat perusahaan sesuai dengan dokumen legalitas pendirian.</Label>
            </Stack>
            <Stack tokens={stackTokens} styles={{root: { width: 400, alignItems: 'left'}}}>
                <Stack.Item>
                    <ControlledFluentUiDropDown
                        label="Propinsi"
                        placeholder="Pilih propinsi"
                        options={propinsiOptions}
                        required
                        name="alamat.propinsi"
                        rules={{ required: "harus diisi" }} 
                        onChangeItem={handleChangePropinsi}
                        control={control}
                        selectedKey={alamat.propinsi != null ? alamat.propinsi.id : null}
                    /> 
                </Stack.Item>
                <Stack.Item>
                    <ControlledFluentUiDropDown
                        label="Kabupaten"
                        placeholder="Pilih kabupaten"
                        options={kabupatenOptions}
                        required
                        name="alamat.kabupaten"
                        rules={{ required: "kabupaten harus diisi" }} 
                        onChangeItem={handleChangeKabupaten}
                        control={control}
                        selectedKey={alamat.kabupaten != null ? alamat.kabupaten.id : null}
                        disabled={alamat.propinsi == null ? true : false}
                    /> 
                </Stack.Item>
                <Stack.Item>
                    <ControlledFluentUiDropDown
                        label="Kecamatan"
                        placeholder="Pilih kecamatan"
                        options={kecamatanOptions}
                        required
                        name="alamat.kecamatan"
                        rules={{ required: "kecamatan harus diisi" }} 
                        onChangeItem={handleChangeKecamatan}
                        control={control}
                        selectedKey={alamat.kecamatan != null ? alamat.kecamatan.id : null}
                        disabled={alamat.kabupaten == null ? true : false}
                    /> 
                </Stack.Item>
                <Stack.Item>
                    <ControlledFluentUiDropDown
                        label="Desa"
                        placeholder="Pilih desa"
                        options={desaOptions}
                        required
                        name="alamat.desa"
                        rules={{ required: "desa harus diisi" }} 
                        onChangeItem={handleChangeDesa}
                        control={control}
                        selectedKey={alamat.desa != null ? alamat.desa.id : null}
                        disabled={alamat.kecamatan == null ? true : false}
                    /> 
                </Stack.Item>
                <Stack.Item>
                    <ControlledFluentUiTextField
                        label="Detail Alamat"
                        placeholder="Isi detail alamat seperti: jalan, perumahan, blok, nomor rumah, rt,rw, gedung, lantai atau yang lainnya"
                        control={control}
                        name="alamat.keterangan"
                        rules={{ required: "harus diisi" }}  
                        disabled={alamat.desa == null ? true : false}  
                        required multiline autoAdjustHeight
                    /> 
                </Stack.Item>
            </Stack>
            <Stack horizontal tokens={stackTokens} styles={{root: { width: 400, justifyContent: 'flex-end'}}}>
                <PrimaryButton 
                    text="Lanjut" 
                    style={{marginTop: 24, width: 100}}
                    onClick={processNextStep}
                    disabled={ alamat.desa == null || alamat.keterangan == '' ? true : false }
                />
            </Stack>  
        </motion.div>
    );
};