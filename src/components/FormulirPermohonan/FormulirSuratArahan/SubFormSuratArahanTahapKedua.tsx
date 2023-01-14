import { DefaultButton, IconButton, IStackTokens, Label, PrimaryButton, Stack } from "@fluentui/react";
import { useBoolean } from "@fluentui/react-hooks";
import { motion } from "framer-motion";
import { FC, useCallback, useState } from "react";
import { UseFormSetError, useWatch } from "react-hook-form";
import { IRegisterPermohonanSuratArahan } from "../../../features/permohonan/register-permohonan-api-slice";
import { ControlledFluentUiDropDown } from "../../ControlledDropDown/ControlledFluentUiDropDown";
import { ControlledFluentUiTextField } from "../../ControlledTextField/ControlledFluentUiTextField";
import { backIcon } from "../../FormulirPerusahaanFormHook/InterfacesPerusahaan";
import { ModalFormulirAddDokumenNib } from "../../Modal/ModalFormulirAddDokumenNib";
import { contentStyles, durationAnimFormSuratArahan, ISubFormPermohonanSuratArahanProps, labelStyle, labelTitleBack, stackTokens, subLabelStyle, variantAnimSuratArahan } from "./interfacePermohonanSuratArahan";


interface ISubFormTahapKeduaSuratArahanProps extends ISubFormPermohonanSuratArahanProps {
    setError: UseFormSetError<IRegisterPermohonanSuratArahan>;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const sectionStackTokens: IStackTokens = { childrenGap: 2 };

export const SubFormSuratArahanTahapKedua: FC<ISubFormTahapKeduaSuratArahanProps> = ({setMotionKey, setIsLoading, setError, setValue, control}) => {
    //react-form hook variable
    const [registerPerusahaan, jenisPermohonanSuratArahan] = useWatch({
        control: control, 
        name: ['registerPerusahaan','jenisPermohonanSuratArahan']
    });
    // local state
    const [animTahapKedua, setAnimTahapKedua] = useState<string>('open');
    const [isModalAddDokumenNibOpen, { setTrue: showModalAddDokumenNib, setFalse: hideModalAddDokumenNib }] = useBoolean(false);
    
    const processBackToPreviousStep = useCallback(
        () => {
            setAnimTahapKedua('closed');            
            let timer = setTimeout(
                () => {
                    setMotionKey('tahapPertama');
                },
                durationAnimFormSuratArahan*1000
            );
            return () => clearTimeout(timer);
        },
        []
    );

    const getPermohonanSrtArahanBaru = useCallback(
        () => {
            return (
                <>
                    <Stack.Item>
                        <Stack horizontal tokens={sectionStackTokens}>
                            <Stack.Item grow align="center">
                                <ControlledFluentUiDropDown
                                    label="Dokumen nib oss rba"
                                    options={[]}
                                    placeholder="Pilih dokumen"
                                    required
                                    name="jenisPermohonan"
                                    rules={{ required: "harus diisi" }} 
                                    control={control}
                                />     
                            </Stack.Item>
                            <Stack.Item align="end">                            
                                <DefaultButton text="File" onClick={showModalAddDokumenNib}/>
                            </Stack.Item>
                        </Stack>
                    </Stack.Item>
                    <Stack.Item>
                        <Stack horizontal tokens={sectionStackTokens}>
                            <Stack.Item grow align="center">
                                <ControlledFluentUiDropDown
                                    label="Dokumen izin lokasi oss rba"
                                    options={[]}
                                    placeholder="Pilih dokumen"
                                    required
                                    name="jenisPermohonan"
                                    rules={{ required: "harus diisi" }} 
                                    control={control}
                                />     
                            </Stack.Item>
                            <Stack.Item align="end">                            
                                <DefaultButton text="File"/>
                            </Stack.Item>
                        </Stack>
                    </Stack.Item>
                    <Stack.Item>
                        <Stack horizontal tokens={sectionStackTokens}>
                            <Stack.Item grow align="center">
                                <ControlledFluentUiDropDown
                                    label="Dokumen imb atau pbg"
                                    options={[]}
                                    placeholder="Pilih dokumen"
                                    required
                                    name="jenisPermohonan"
                                    rules={{ required: "harus diisi" }} 
                                    control={control}
                                />     
                            </Stack.Item>
                            <Stack.Item align="end">                            
                                <DefaultButton text="File"/>
                            </Stack.Item>
                        </Stack>
                    </Stack.Item>
                    <Stack.Item>
                        <ControlledFluentUiTextField
                            label="File surat arahan"
                            placeholder="Isi detail alamat seperti: jalan, perumahan, blok, nomor rumah, rt,rw, gedung, lantai atau yang lainnya"
                            control={control}
                            name="alamat.keterangan"
                            rules={{ required: "harus diisi" }}  
                            required multiline autoAdjustHeight
                        /> 
                    </Stack.Item>
                </>
            );
        },
        []
    );

    return (
        <motion.div 
            animate={animTahapKedua}
            variants={variantAnimSuratArahan}
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
                    {registerPerusahaan.perusahaan.pelakuUsaha != null ?
                        `${registerPerusahaan.perusahaan.pelakuUsaha.singkatan}. ${registerPerusahaan.perusahaan.nama}` : registerPerusahaan.perusahaan.nama
                    }
                </Label>
            </Stack>
            <Stack tokens={stackTokens} styles={{root: { width: 400, alignItems: 'left', marginBottom: 16}}}>
                <Label styles={labelStyle}>
                    Permohonan - ({jenisPermohonanSuratArahan.keterangan})
                </Label>
                <Label styles={subLabelStyle}>Kami memerlukan dokumen persyaratan berformat pdf. Pilihan dokumen akan muncul jika sudah pernah upload, jika tidak muncul silakan tekan tombol File untuk menambahkan dokumen terlebih dahulu</Label>
            </Stack>
            <Stack tokens={stackTokens} styles={{root: { width: 400, alignItems: 'left'}}}>
                {jenisPermohonanSuratArahan.id == '1' ? getPermohonanSrtArahanBaru() : getPermohonanSrtArahanPerubahan()}
            </Stack>
            <ModalFormulirAddDokumenNib
                isModalOpen={isModalAddDokumenNibOpen}
                hideModal={hideModalAddDokumenNib}
                isDraggable={true}
            />  
        </motion.div>
    );
    
};



const getPermohonanSrtArahanPerubahan = () => {
    return 'perubahan';
}