import { IconButton, IDropdownOption, Label, PrimaryButton, Stack } from "@fluentui/react";
import { motion } from "framer-motion";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useWatch } from "react-hook-form";
import { useGetAllSkalaUsahaQuery } from "../../features/repository/service/skala-usaha-api-slice";
import { ControlledFluentUiDropDown } from "../ControlledDropDown/ControlledFluentUiDropDown";
import { backIcon, contentStyles, duration, ISubFormPerusahaanProps, labelStyle, labelTitleBack, stackTokens, subLabelStyle, variantAnimPerusahaan } from "./InterfacesPerusahaan";

type daftarOptionSkalaUsaha = IDropdownOption<any>[];

export const FormSkalaUsaha: FC<ISubFormPerusahaanProps> = ({control, setValue, setMotionKey}) => {
    //react-form-hook variable 
    const [modelPerizinan, skalaUsaha] = useWatch({
        control: control, 
        name: ['modelPerizinan', 'skalaUsaha']
    });
    //local state
    const [animSkalaUsaha, setAnimSkalaUsaha] = useState<string>('open');
    // const [options, setOptions] = useState<IDropdownOption<any>[]>([]);
    //rtk query modelperizinan variable hook
    const { data: daftarSkalaUsaha, isFetching: isFetchingSkalaUsaha } = useGetAllSkalaUsahaQuery();

    const options: daftarOptionSkalaUsaha = useMemo(
        () => {
            if(daftarSkalaUsaha != undefined) {
                return [
                    ...daftarSkalaUsaha.map(
                        (t) => ({
                            key: t.id,
                            text: `${t.nama} (${t.singkatan})`
                        })
                    )
                ]
            }
            else {
                return [];
            }
        },
        [daftarSkalaUsaha]
    ); 

    const processBackToPreviousStep = useCallback(
        () => {
            setAnimSkalaUsaha('closed');            
            let timer = setTimeout(
                () => {
                    setMotionKey('modelPerizinan');
                },
                duration*1000
            );
            return () => clearTimeout(timer);
        },
        []
    );

    const handleSetSkalaUsaha = useCallback(
        (item) => {
            let myArrayText = item.text.split(" (", 2);
            let itemSelected = {
                id: item.key,
                nama: myArrayText[0],
                singkatan: myArrayText[1].slice(0, myArrayText[1].length-1)

            }
            setValue("skalaUsaha", itemSelected);
        },
        []
    );

    const processNextStep = useCallback(
        () => {
            setAnimSkalaUsaha('closed');
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

    return (
        <motion.div 
            animate={animSkalaUsaha}
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
                        modelPerizinan != null ? `Status OSS-RBA : ${modelPerizinan!.singkatan}`:null
                    }
                </Label>
            </Stack>
            <Stack tokens={stackTokens} styles={{root: { width: 400, alignItems: 'left', marginBottom: 16}}}>
                <Label styles={labelStyle}>Skala Usaha</Label>
                <Label styles={subLabelStyle}>Skala usaha harus sesuai dengan skala usaha pada OSS-RBA.</Label>
            </Stack>
            <Stack tokens={stackTokens} styles={{root: { width: 400, alignItems: 'left'}}}>
                <Stack.Item>
                    <ControlledFluentUiDropDown
                        label="Skala Usaha"
                        placeholder="Pilih skala usaha"
                        options={options}
                        required
                        name="skalaUsaha"
                        rules={{ required: "harus diisi" }} 
                        onChangeItem={handleSetSkalaUsaha}
                        control={control}
                        selectedKey={skalaUsaha.id != '' ? skalaUsaha.id : undefined}
                    /> 
                </Stack.Item>
            </Stack>
            <Stack horizontal tokens={stackTokens} styles={{root: { width: 400, justifyContent: 'flex-end'}}}>
                <PrimaryButton 
                    text="Lanjut" 
                    style={{marginTop: 24, width: 100}}
                    onClick={processNextStep}
                    disabled={skalaUsaha.id == ''? true:false}
                />
            </Stack>   
        </motion.div >
    );
};