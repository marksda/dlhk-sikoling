import { IDropdownOption, Label, PrimaryButton, Stack } from "@fluentui/react";
import { motion } from "framer-motion";
import { FC, useCallback, useEffect, useState } from "react";
import { useWatch } from "react-hook-form";
import { useGetAllModelPerizinanQuery } from "../../features/perusahaan/model-perizinan-api-slice";
import { ControlledFluentUiDropDown } from "../ControlledDropDown/ControlledFluentUiDropDown";
import { contentStyles, duration, ISubFormPerusahaanProps, labelStyle, stackTokens, subLabelStyle, variantAnimPerusahaan } from "./InterfacesPerusahaan";

export const FormModelPerizinanPerusahaan: FC<ISubFormPerusahaanProps> = ({control, setValue, setMotionKey}) => {  
    const [animModelPerizinan, setAnimModelPerizinan] = useState<string>('open');
    const [options, setOptions] = useState<IDropdownOption<any>[]>([]);
    //hook variable from react form hook state variable
    const [modelPerizinan] = useWatch({
        control: control, 
        name: ['modelPerizinan']
    });
    //rtk query modelperizinan variable hook
    const { data: dataModelPerizinan = [], isFetching: isFetchingModelPerizinan } = useGetAllModelPerizinanQuery();    
    
    useEffect(
        () => {
            if(isFetchingModelPerizinan == false) {
                let tmpOptions = dataModelPerizinan.map((t) => { return {key: t.id as string, text: `${t.nama} (${t.singkatan})` as string}; });
                setOptions(tmpOptions);
            }
        },
        [isFetchingModelPerizinan, dataModelPerizinan]
    );

    const processNextStep = useCallback(
        () => {
            setAnimModelPerizinan('closed');
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

    const handleSetModelPerizinan = useCallback(
        (itemSelected) => {
            
            let itemModelPerizinanSelected = dataModelPerizinan.find(
                (item) => { return item.id == itemSelected.key; } 
            );
            setValue("modelPerizinan", itemModelPerizinanSelected!);
        },
        [dataModelPerizinan]
    )

    return (
        <motion.div 
            animate={animModelPerizinan}
            variants={variantAnimPerusahaan}
            className={contentStyles.body} 
        >
            <Stack tokens={stackTokens} styles={{root: { width: 400, alignItems: 'left', marginBottom: 16}}}>
                <Label styles={labelStyle}>Status OSS-RBA?</Label>
                <Label styles={subLabelStyle}>Status OSS-RBA perusahaan menentukan isian tahab berikutnya.</Label>
            </Stack>
            <Stack tokens={stackTokens} styles={{root: { width: 400, alignItems: 'left'}}}>
                <Stack.Item>
                    <ControlledFluentUiDropDown
                        label="Status OSS-RBA"
                        placeholder="Pilih status OSS-RBA"
                        options={options}
                        required
                        name="modelPerizinan"
                        rules={{ required: "harus diisi" }} 
                        control={control}
                        onChangeItem={handleSetModelPerizinan}
                        selectedKey={modelPerizinan.id != '' ? modelPerizinan.id : undefined}
                    /> 
                </Stack.Item>
            </Stack>
            <Stack horizontal tokens={stackTokens} styles={{root: { width: 400, justifyContent: 'flex-end'}}}>
                <PrimaryButton 
                    text="Lanjut" 
                    onClick={processNextStep} 
                    style={{marginTop: 24, width: 100}}       
                    disabled={modelPerizinan.id == ''? true:false} 
                />
            </Stack>   
        </motion.div>
    );
};