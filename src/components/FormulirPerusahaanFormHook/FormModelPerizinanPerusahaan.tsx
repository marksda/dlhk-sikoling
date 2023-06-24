import { IDropdownOption, Label, PrimaryButton, Stack } from "@fluentui/react";
import { motion } from "framer-motion";
import { FC, useCallback, useMemo, useState } from "react";
import { useWatch } from "react-hook-form";
import { useGetAllModelPerizinanQuery } from "../../features/repository/service/model-perizinan-api-slice";
import { ControlledFluentUiDropDown } from "../ControlledDropDown/ControlledFluentUiDropDown";
import { contentStyles, duration, ISubFormPerusahaanProps, labelStyle, stackTokens, subLabelStyle, variantAnimPerusahaan } from "./InterfacesPerusahaan";

type daftarOptionModelPerizinan = IDropdownOption<any>[];
export const FormModelPerizinanPerusahaan: FC<ISubFormPerusahaanProps> = ({control, setValue, setMotionKey}) => {  
    //react-form-hook variable
    const [modelPerizinan] = useWatch({
        control: control, 
        name: ['modelPerizinan']
    });
    // local state
    const [animModelPerizinan, setAnimModelPerizinan] = useState<string>('open');    
    //rtk query modelperizinan variable hook
    const { data: daftarModelPerizinan, isFetching: isFetchingModelPerizinan } = useGetAllModelPerizinanQuery();    
    
    const options: daftarOptionModelPerizinan = useMemo(
        () => {
            if(daftarModelPerizinan != undefined) {
                return [
                    ...daftarModelPerizinan.map(
                        (t) => ({
                            key: t.id,
                            text: `${t.nama} (${t.singkatan})`
                        })
                    )
                ];
            }
            else {
                return [];
            }
        },
        [daftarModelPerizinan]
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
        (item) => {
            let myArrayText = item.text.split(" (", 2);
            let itemSelected = {
                id: item.key,
                nama: myArrayText[0],
                singkatan: myArrayText[1].slice(0, myArrayText[1].length-1)
            };
            
            setValue("modelPerizinan", itemSelected);
        },
        []
    )

    return (
        <motion.div 
            animate={animModelPerizinan}
            variants={variantAnimPerusahaan}
            className={contentStyles.body} 
        >
            <Stack tokens={stackTokens} styles={{root: { width: 400, alignItems: 'left', marginBottom: 16}}}>
                <Label styles={labelStyle}>Status OSS usaha</Label>
                <Label styles={subLabelStyle}>Kami ingin mengetahui apakah usaha anda sudah terdaftar dalam OSS atau belum terdaftar dalam OSS.</Label>
            </Stack>
            <Stack tokens={stackTokens} styles={{root: { width: 400, alignItems: 'left'}}}>
                <Stack.Item>
                    <ControlledFluentUiDropDown
                        label="Status OSS"
                        placeholder="Pilih status OSS"
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