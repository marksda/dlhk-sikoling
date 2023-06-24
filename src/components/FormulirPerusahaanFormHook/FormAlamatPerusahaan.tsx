import { IconButton, IDropdownOption, Label, PrimaryButton, Stack } from "@fluentui/react";
import { motion } from "framer-motion";
import { FC, useCallback, useMemo, useState } from "react";
import { useWatch } from "react-hook-form";
import { useGetDesaByKecamatanQuery } from "../../features/repository/service/desa-api-slice";
import { useGetKabupatenByPropinsiQuery } from "../../features/kabupaten/kabupaten-api-slice";
import { useGetKecamatanByKabupatenQuery } from "../../features/kecamatan/kecamatan-api-slice";
import { useGetAllPropinsiQuery } from "../../features/repository/service/propinsi-api-slice";
import { ControlledFluentUiDropDown } from "../ControlledDropDown/ControlledFluentUiDropDown";
import { ControlledFluentUiTextField } from "../ControlledTextField/ControlledFluentUiTextField";
import { backIcon, contentStyles, duration, ISubFormPerusahaanProps, labelStyle, labelTitleBack, stackTokens, subLabelStyle, variantAnimPerusahaan } from "./InterfacesPerusahaan";


type daftarOptions = IDropdownOption<any>[];

export const FormAlamatPerusahaan: FC<ISubFormPerusahaanProps> = ({control, setValue, setMotionKey}) => {
    //react-form hook variable
    const [alamat] = useWatch({
        control: control, 
        name: ['alamat']
    });
    //local state
    const [animAlamatPerusahaan, setAnimAlamatPerusahaan] = useState<string>('open');
    //hook variable rtk query
    const { data: daftarPropinsi, isFetching: isFetchingDataPropinsi, isError: isErrorPropinsi } = useGetAllPropinsiQuery();
    const { data: daftarKabupaten, isFetching: isFetchingDataKabupaten, isError: isErrorKabupaten } = useGetKabupatenByPropinsiQuery(alamat.propinsi != null ? alamat.propinsi.id : null, {skip: alamat.propinsi == null ? true : false});
    const { data: daftarKecamatan, isFetching: isFetchingDataKecamatan, isError: isErrorKecamatan } = useGetKecamatanByKabupatenQuery(alamat.kabupaten != null ? alamat.kabupaten.id : null, {skip: alamat.kabupaten == null ? true : false});
    const { data: daftarDesa, isFetching: isFetchingDataDesa, isError: isErrorDesa } = useGetDesaByKecamatanQuery(alamat.kecamatan != null ? alamat.kecamatan.id : null, {skip: alamat.kecamatan == null ? true : false});

    
    const propinsiOptions: daftarOptions = useMemo(
        () => {
            if(daftarPropinsi != undefined) {
                return [
                    ...daftarPropinsi.map(
                        (t) => ({
                            key: t.id!,
                            text: t.nama!
                        })
                    )
                ];
            }
            else {
                return [];
            }
        },
        [daftarPropinsi]
    );
    
    const kabupatenOptions: daftarOptions = useMemo(
        () => {
            if(daftarKabupaten != undefined) {
                return [
                    ...daftarKabupaten.map(
                        (t) => ({
                            key: t.id!,
                            text: t.nama!
                        })
                    )
                ];
            }
            else {
                return [];
            }
        },
        [daftarKabupaten]
    );
    
    const kecamatanOptions: daftarOptions = useMemo(
        () => {
            if(daftarKecamatan != undefined) {
                return [
                    ...daftarKecamatan.map(
                        (t) => ({
                            key: t.id!,
                            text: t.nama!
                        })
                    )
                ];
            }
            else {
                return [];
            }
        },
        [daftarKecamatan]
    );
    
    const desaOptions: daftarOptions = useMemo(
        () => {
            if(daftarDesa != undefined) {
                return [
                    ...daftarDesa.map(
                        (t) => ({
                            key: t.id!,
                            text: t.nama!
                        })
                    )
                ];
            }
            else {
                return [];
            }
        },
        [daftarDesa]
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
        (item) => {
            let itemSelected = {
                id: item.key,
                nama: item.text
            };

            setValue("alamat", {
                ...alamat, 
                propinsi: itemSelected,
                kabupaten: null,
                kecamatan: null,
                desa: null,
            });
        },
        [alamat]
    );

    const handleChangeKabupaten = useCallback(
        (item) => {
            let itemSelected = {
                id: item.key,
                nama: item.text
            };

            setValue("alamat", {
                ...alamat, 
                kabupaten: itemSelected,
                kecamatan: null,
                desa: null
            });
        },
        [alamat]
    );

    const handleChangeKecamatan = useCallback(
        (item) => {
            let itemSelected = {
                id: item.key,
                nama: item.text
            };

            setValue("alamat", {
                ...alamat, 
                kecamatan: itemSelected,
                desa: null
            });
        },
        [alamat]
    );

    const handleChangeDesa = useCallback(
        (item) => {
            let itemSelected = {
                id: item.key,
                nama: item.text
            };
            
            setValue("alamat", {
                ...alamat, 
                desa: itemSelected
            });
        },
        [alamat]
    );

    const processNextStep = useCallback(
        () => {
            setAnimAlamatPerusahaan('closed');
            let timer = setTimeout(
                () => {
                    setMotionKey('kontakPerusahaan');
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