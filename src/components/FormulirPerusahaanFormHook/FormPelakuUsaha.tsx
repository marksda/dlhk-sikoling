import { IconButton, IDropdownOption, Label, PrimaryButton, Stack } from "@fluentui/react";
import { motion } from "framer-motion";
import { FC, useCallback, useEffect, useState } from "react";
import { useWatch } from "react-hook-form";
import { useGetAllKategoriPelakuUsahaBySkalaUsahaQuery } from "../../features/perusahaan/pelaku-usaha-api-slice";
import { ControlledFluentUiDropDown } from "../ControlledDropDown/ControlledFluentUiDropDown";
import { backIcon, contentStyles, duration, ISubFormPerusahaanProps, labelStyle, labelTitleBack, stackTokens, subLabelStyle, variantAnimPerusahaan } from "./InterfacesPerusahaan";

export const FormPelakuUsaha: FC<ISubFormPerusahaanProps> = ({control, setValue, setMotionKey}) => {
    //local state
    const [animKategoriPelakuUsaha, setAnimKategoriPelakuUsaha] = useState<string>('open'); 
    const [options, setOptions] = useState<IDropdownOption<any>[]>([]);
    //hook variable from react form hook state variable   
    const [skalaUsaha, pelakuUsaha] = useWatch({
        control: control, 
        name: ['skalaUsaha', 'pelakuUsaha']
    });
    const { data: dataKategoriPelakuUsaha = [], isFetching: isFetchingKategoriPelakuUsaha } = useGetAllKategoriPelakuUsahaBySkalaUsahaQuery(skalaUsaha);

    useEffect(
        () => {
            if(isFetchingKategoriPelakuUsaha == false) {
                let tmpOptions = dataKategoriPelakuUsaha.map((t) => { return {key: t.id as string, text: t.nama as string}; });
                setOptions(tmpOptions);
            }
        },
        [isFetchingKategoriPelakuUsaha, dataKategoriPelakuUsaha]
    );

    const processBackToPreviousStep = useCallback(
        () => {
            setAnimKategoriPelakuUsaha('closed');            
            let timer = setTimeout(
                () => {
                    setMotionKey('skalaUsaha');
                },
                duration*1000
            );
            return () => clearTimeout(timer);
        },
        []
    );

    const handleSetJenisPelakuUsaha = useCallback(
        (itemSelected) => {
            let itemKategoriPelakuUsahaSelected = dataKategoriPelakuUsaha.find(
                (item) => { return item.id == itemSelected.key; } 
            )
            setValue("pelakuUsaha", {id: '', nama: '', singkatan: '', kategoriPelakuUsaha: itemKategoriPelakuUsahaSelected!});
            setValue("id", '');
        },
        [dataKategoriPelakuUsaha, pelakuUsaha]
    );

    const processNextStep = useCallback(
        () => {
            setAnimKategoriPelakuUsaha('closed');
            let timer = setTimeout(
                () => {
                    setMotionKey('npwpPerusahaan');
                },
                duration*1000
            );
            return () => clearTimeout(timer);
        },
        []
    );

    return (
        <motion.div
            animate={animKategoriPelakuUsaha}
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
                        skalaUsaha != null ? `Skala usaha - ${skalaUsaha!.singkatan}`:null
                    }
                </Label>
            </Stack>
            <Stack tokens={stackTokens} styles={{root: { width: 400, alignItems: 'left', marginBottom: 16}}}>
                <Label styles={labelStyle}>Jenis Pelaku Usaha</Label>
                <Label styles={subLabelStyle}>Jenis pelaku usaha harus sesuai dengan data pada OSS-RBA.</Label>
            </Stack>
            <Stack tokens={stackTokens} styles={{root: { width: 400, alignItems: 'left'}}}>
                <Stack.Item>
                    <ControlledFluentUiDropDown
                        label="Jenis pelaku usaha"
                        placeholder="Pilih jenis pelaku usaha"
                        options={options}
                        required
                        name="pelakuUsaha"
                        rules={{ required: "harus diisi" }} 
                        onChangeItem={handleSetJenisPelakuUsaha}
                        control={control}
                        selectedKey={pelakuUsaha.kategoriPelakuUsaha != null ? pelakuUsaha.kategoriPelakuUsaha.id : undefined}
                    /> 
                </Stack.Item>
            </Stack>
            <Stack horizontal tokens={stackTokens} styles={{root: { width: 400, justifyContent: 'flex-end'}}}>
                <PrimaryButton 
                    text="Lanjut" 
                    style={{marginTop: 24, width: 100}}
                    onClick={processNextStep}
                    disabled={pelakuUsaha.kategoriPelakuUsaha == null? true:false}
                />
            </Stack>   
        </motion.div>
    );
};