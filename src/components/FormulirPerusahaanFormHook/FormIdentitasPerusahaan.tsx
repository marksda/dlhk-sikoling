import { IconButton, Label, PrimaryButton, Stack } from "@fluentui/react";
import { motion } from "framer-motion";
import { FC, useCallback, useState } from "react";
import { useWatch } from "react-hook-form";
import { ControlledFluentUiTextField } from "../ControlledTextField/ControlledFluentUiTextField";
import { backIcon, contentStyles, duration, ISubFormPerusahaanProps, labelStyle, labelTitleBack, stackTokens, subLabelStyle, tableIdentityPerusahaanStyles, variantAnimPerusahaan } from "./InterfacesPerusahaan";

export const FormIdentitasPerusahaan: FC<ISubFormPerusahaanProps> = ({control, setMotionKey}) => {
    //local state
    const [animIdentitasPerusahaan, setAnimIdentitasPerusahaan] = useState<string>('open'); 
    //hook variable from react form hook state variable   
    const [skalaUsaha, pelakuUsaha, id, nama] = useWatch({
        control: control, 
        name: ['skalaUsaha', 'pelakuUsaha', 'id', 'nama']
    });
    
    const processBackToPreviousStep = useCallback(
        () => {
            setAnimIdentitasPerusahaan('closed');            
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

    const processNextStep = useCallback(
        () => {
            setAnimIdentitasPerusahaan('closed');
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
            animate={animIdentitasPerusahaan}
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
                        skalaUsaha != null ? `Npwp - ${id}`:null
                    }
                </Label>
            </Stack>
            <Stack tokens={stackTokens} styles={{root: { width: 400, alignItems: 'left', marginBottom: 16}}}>
                <Label styles={labelStyle}>Identitas Perusahaan</Label>
                <Label styles={subLabelStyle}>Lengkapi identitas perusahaan sesuai dengan dokumen legalitas pendirian.</Label>
            </Stack>
            <Stack tokens={stackTokens} styles={{root: { width: 400, alignItems: 'left'}}}>
                <Stack.Item>
                    <table className={tableIdentityPerusahaanStyles.body} >
                        <tbody>
                            <tr>
                                <td>Skala usaha</td>
                                <td>:</td>
                                <td>{skalaUsaha.nama}</td>
                            </tr>
                            <tr>
                                <td>Pelaku usaha</td>
                                <td>:</td>
                                <td>{`${pelakuUsaha.kategoriPelakuUsaha.nama} - ${pelakuUsaha.singkatan}`}</td>
                            </tr>
                            <tr>
                                <td>{`NPWP ${(pelakuUsaha.kategoriPelakuUsaha.id ==  '0101' || pelakuUsaha.kategoriPelakuUsaha.id ==  '0201') ? 'Pribadi':'Badan'}`}</td>
                                <td>:</td>
                                <td>{id}</td>
                            </tr>
                        </tbody>
                    </table>
                </Stack.Item>
                <Stack.Item>
                    <ControlledFluentUiTextField
                        label="Nama perusahaan"
                        prefix={`${pelakuUsaha.singkatan}.`}
                        name="nama"
                        rules={{ required: "Nama perusahaan harus diisi" }} 
                        required
                        control={control}
                    />
                </Stack.Item>
            </Stack>
            <Stack horizontal tokens={stackTokens} styles={{root: { width: 400, justifyContent: 'flex-end'}}}>
                <PrimaryButton 
                    text="Lanjut" 
                    style={{marginTop: 24, width: 100}}
                    onClick={processNextStep}
                    disabled={nama.length == 0 ? true:false}
                />
            </Stack>   
        </motion.div>
    );
};