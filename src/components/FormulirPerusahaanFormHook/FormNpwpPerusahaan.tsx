import { IconButton, IDropdownOption, Label, PrimaryButton, Stack } from "@fluentui/react";
import { motion } from "framer-motion";
import { FC, useCallback, useEffect, useState } from "react";
import { UseFormHandleSubmit, UseFormSetError, useWatch } from "react-hook-form";
import { useGetPelakuUsahaByKategoriPelakuUsahaQuery } from "../../features/perusahaan/pelaku-usaha-api-slice";
import { useIsEksisPerusahaanQuery } from "../../features/perusahaan/perusahaan-api-slice";
import { IPerusahaan } from "../../features/perusahaan/perusahaan-slice";
import { ControlledFluentUiDropDown } from "../ControlledDropDown/ControlledFluentUiDropDown";
import { ControlledFluentUiMaskTextField } from "../ControlledTextField/ControlledFluentUiMaskTextField";
import { backIcon, contentStyles, duration, ISubFormPerusahaanProps, labelStyle, labelTitleBack, stackTokens, subLabelStyle, variantAnimPerusahaan } from "./InterfacesPerusahaan";

interface ISubFormNpwpPerusahaanProps extends ISubFormPerusahaanProps {
    handleSubmit: UseFormHandleSubmit<IPerusahaan>;
    setError: UseFormSetError<IPerusahaan>;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export const FormNpwpPerusahaan: FC<ISubFormNpwpPerusahaanProps> = ({control, setValue, setMotionKey, handleSubmit, setError, setIsLoading}) => {    
    //local state
    const [animNpwpPerusahaan, setAnimNpwpPerusahaan] = useState<string>('open');
    const [options, setOptions] = useState<IDropdownOption<any>[]>([]);
    const [npwp, setNpwp] = useState<string|null>(null);
    //hook variable from react form hook state variable
    const [id, pelakuUsaha] = useWatch({
        control: control, 
        name: ['id', 'pelakuUsaha']
    }); 
    //hook variable from rtk query
    const { data: dataPelakuUsaha = [], isFetching: isFetchingPelakuUsaha } = useGetPelakuUsahaByKategoriPelakuUsahaQuery(pelakuUsaha.kategoriPelakuUsaha.id, {skip: pelakuUsaha.kategoriPelakuUsaha == null ? true : false});
    
    const { data: isEksisPerusahaan, isFetching: isFetchingIsEksisPerusahaan, isError: isErrorEksisPerusahaan} = useIsEksisPerusahaanQuery(npwp, {skip: npwp == undefined ? true : false});
    
    //deteksi data options pelaku usaha sudah tersedia
    useEffect(
        () => {
            if(isFetchingPelakuUsaha == false) {
                let tmpOptions = dataPelakuUsaha.map((t) => { return {key: t.id as string, text: `${t.nama} (${t.singkatan})` as string}; });
                setOptions(tmpOptions);
                if(pelakuUsaha.kategoriPelakuUsaha.id ==  '0101' || pelakuUsaha.kategoriPelakuUsaha.id ==  '0201') {
                    let tmpFirstPelakuUsaha = dataPelakuUsaha[0];
                    setValue("pelakuUsaha", {...pelakuUsaha, id: tmpFirstPelakuUsaha!.id, nama: tmpFirstPelakuUsaha!.nama, singkatan: tmpFirstPelakuUsaha!.singkatan});
                }
            }
        },
        [isFetchingPelakuUsaha]
    );
    //deteksi apakah npwp sudah terdaftar disistem apa belum
    useEffect(
        () => {            
            setIsLoading(false);
            if(isEksisPerusahaan == true) {
                setError("id", {
                    type: "manual",
                    message: `Perusahaan dengnan npwp: ${npwp} sudah terdaftar dalam sistem`
                });
            }
            else if(isEksisPerusahaan == false) {
                setAnimNpwpPerusahaan('closed');
                let timer = setTimeout(
                    () => {
                        setMotionKey('identitasPerusahaan');
                    },
                    duration*1000
                );
                return () => clearTimeout(timer);
            }
        },
        [isFetchingIsEksisPerusahaan, isEksisPerusahaan]
    );
    //deteksi error koneksi remote API
    useEffect(
        () => {
            if(isErrorEksisPerusahaan == true) {
                setIsLoading(false);
                console.log(isErrorEksisPerusahaan);
            }            
        },
        [isErrorEksisPerusahaan]
    );

    const processBackToPreviousStep = useCallback(
        () => {
            setAnimNpwpPerusahaan('closed');            
            let timer = setTimeout(
                () => {
                    setMotionKey('pelakuUsaha');
                },
                duration*1000
            );
            return () => clearTimeout(timer);
        },
        []
    );

    const handleSetPelakuUsaha = useCallback(
        (itemSelected) => {
            let itemPelakuUsahaSelected = dataPelakuUsaha.find(
                (item) => { return item.id == itemSelected.key; } 
            );
            setValue("pelakuUsaha", {...pelakuUsaha, id: itemPelakuUsahaSelected!.id, nama: itemPelakuUsahaSelected!.nama, singkatan: itemPelakuUsahaSelected!.singkatan});
        },
        [dataPelakuUsaha, pelakuUsaha]
    );

    const save = useCallback(
        () => {
            setIsLoading(true);
            setNpwp(id);
        },
        [id]
    );

    return (
        <motion.div
            animate={animNpwpPerusahaan}
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
                <Label styles={labelTitleBack}>                    
                    {
                        pelakuUsaha.kategoriPelakuUsaha != null ? `Jenis pelaku usaha - ${pelakuUsaha.kategoriPelakuUsaha.nama}`:null
                    }
                </Label>
            </Stack>
            <Stack tokens={stackTokens} styles={{root: { width: 400, alignItems: 'left', marginBottom: 16}}}>
                <Label styles={labelStyle}>
                    {`NPWP ${(pelakuUsaha.kategoriPelakuUsaha.id ==  '0101' || pelakuUsaha.kategoriPelakuUsaha.id ==  '0201') ? 'Pribadi':'Badan'}`}
                </Label>
                <Label styles={subLabelStyle}>Isikan data npwp perusahaan sesuai dengan data OSS-RBA.</Label>
            </Stack>
            <Stack tokens={stackTokens}>                
                <Stack.Item>
                    <ControlledFluentUiDropDown
                        label={`Jenis ${pelakuUsaha.kategoriPelakuUsaha != null ? pelakuUsaha.kategoriPelakuUsaha.nama:null}`}
                        placeholder="Silahkan pilih "
                        options={options}
                        required
                        name="pelakuUsaha"
                        rules={{ required: "harus diisi" }} 
                        control={control}
                        onChangeItem={handleSetPelakuUsaha}
                        selectedKey={pelakuUsaha.id != null ? pelakuUsaha.id : undefined}
                        disabled={
                            (pelakuUsaha.kategoriPelakuUsaha.id ==  '0101' || pelakuUsaha.kategoriPelakuUsaha.id ==  '0201') ? true:false
                        }
                    /> 
                </Stack.Item>
                <Stack.Item>
                    <ControlledFluentUiMaskTextField 
                        name="id"
                        label={`NPWP ${(pelakuUsaha.kategoriPelakuUsaha.id ==  '0101' || pelakuUsaha.kategoriPelakuUsaha.id ==  '0201') ? 'Pribadi':'Badan'}`}
                        mask="99.999.999.9-999.999"
                        control={control}
                        disabled={
                            pelakuUsaha.id == '' ? true : false
                        }
                    />
                </Stack.Item>
            </Stack>
            <Stack horizontal tokens={stackTokens} styles={{root: { width: 400, justifyContent: 'right'}}}>
                <PrimaryButton 
                    text="Lanjut" 
                    style={{marginTop: 24, width: 100}}
                    onClick={handleSubmit(save)}
                    disabled={id == '' ? true: false}
                />
            </Stack>
        </motion.div>
    );
};