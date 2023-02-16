import { DefaultButton, Dropdown, IconButton, IDropdownOption, IStackTokens, Label, PrimaryButton, Stack } from "@fluentui/react";
import { useBoolean } from "@fluentui/react-hooks";
import { motion } from "framer-motion";
import find from "lodash.find";
import { FC, useCallback, useMemo, useState } from "react";
import { UseFormHandleSubmit, UseFormSetError, useWatch } from "react-hook-form";
import { useGetRegisterDokumenByIdPerusahaanQuery } from "../../../features/dokumen/register-dokumen-api-slice";
import { IRegisterDokumen } from "../../../features/dokumen/register-dokumen-slice";
import { IRegisterPermohonanArahan, useAddRegisterPermohonanMutation } from "../../../features/permohonan/register-permohonan-api-slice";
import { ControlledFluentUiDropDown } from "../../ControlledDropDown/ControlledFluentUiDropDown";
import { backIcon } from "../../FormulirPerusahaanFormHook/InterfacesPerusahaan";
import { ModalFormulirAddDokumenNib } from "../../Modal/ModalFormulirAddDokumenNib";
import { 
    contentStyles, durationAnimFormSuratArahan, ISubFormPermohonanSuratArahanProps, 
    labelStyle, labelTitleBack, stackTokens, subLabelStyle, variantAnimSuratArahan 
} from "./interfacePermohonanSuratArahan";


interface ISubFormTahapKetigaSuratArahanProps extends ISubFormPermohonanSuratArahanProps {
    setError: UseFormSetError<IRegisterPermohonanArahan>;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    handleSubmit: UseFormHandleSubmit<IRegisterPermohonanArahan>;
};

const sectionStackTokens: IStackTokens = { childrenGap: 2 };

export const SubFormSuratArahanTahapKetiga: FC<ISubFormTahapKetigaSuratArahanProps> = ({setMotionKey, setIsLoading, setError, setValue, control, handleSubmit}) => {
    //react-form hook variable
    const [registerPerusahaan, jenisPermohonanSuratArahan, daftarDokumenSyarat] = useWatch({
        control: control, 
        name: ['registerPerusahaan','jenisPermohonanSuratArahan', 'daftarDokumenSyarat']
    });

    // local state
    const [animTahapKetiga, setAnimTahapKetiga] = useState<string>('open');
    const [isModalAddDokumenNibOpen, { setTrue: showModalAddDokumenNib, setFalse: hideModalAddDokumenNib }] = useBoolean(false);
    const [isModalAddDokumenImbOpen, { setTrue: showModalAddDokumenImb, setFalse: hideModalAddDokumenImb }] = useBoolean(false);
    //rtk query perusahaan variable hook
    const { data: daftarDok, error: errorFetchDataDok,  isFetching: isFetchingDaftarDok, isError } = useGetRegisterDokumenByIdPerusahaanQuery(registerPerusahaan.id as string);
    const [addPermohonan ] = useAddRegisterPermohonanMutation();
    
    const dokNibOptions: IDropdownOption<any>[] = useMemo(
        () => {
            var dt:IDropdownOption<any>[] = []
            if(daftarDok != undefined) {                      
                    daftarDok.map(
                        (t) => {
                            // if(t.dokumen?.id == '010301'){
                                dt.push({
                                    key: t.id as string,
                                    text: `(${t.dokumen?.nama}) - tanggal : ${t.dokumen?.tanggal != undefined ? t.dokumen.tanggal : '-'}`
                                });
                            // }                            
                        }
                    );   
            }
            
            return dt;
        },
        [daftarDok]
    );

    const handleSetRegisterDokNib = useCallback(
        (_e, item) => {
            // console.log(item);
            // console.log(daftarDokumenSyarat);
            var itemSelected = find(daftarDok, (i) => i.id == item.key) as IRegisterDokumen;
            var tmpData = [...daftarDokumenSyarat];
            tmpData.push(itemSelected);
            // dispatch(setRegisterPerusahaan(itemSelected));            
            setValue("daftarDokumenSyarat", tmpData);
        },
        [daftarDok, daftarDokumenSyarat]
    );
    
    const processBackToPreviousStep = useCallback(
        () => {
            setAnimTahapKetiga('closed');            
            let timer = setTimeout(
                () => {
                    setMotionKey('tahapKedua');
                },
                durationAnimFormSuratArahan*1000
            );
            return () => clearTimeout(timer);
        },
        []
    );

    const simpanPermohonanSrtArahan = useCallback(
        handleSubmit(
            async (data) => {
                console.log(data);
                await addPermohonan(data);
            }
        ),
        []
    );

    const getPermohonanSrtArahanBaru = useCallback(
        () => {
            return (
                <>
                    <Stack.Item>
                        <Stack horizontal tokens={sectionStackTokens}>
                            <Stack.Item grow align="center">
                                <Dropdown
                                    label="Dokumen nib oss rba"
                                    options={dokNibOptions}
                                    placeholder="Pilih dokumen"
                                    onChange={handleSetRegisterDokNib}
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
                                    name="jenisPermohonan"
                                    rules={{ required: false }}
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
                                    label="Dokumen KKPR/PKKPR/P2R"
                                    options={[]}
                                    placeholder="Pilih dokumen"
                                    name="jenisPermohonan"
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
                                    label="Dokumen imb/pbg"
                                    options={[]}
                                    placeholder="Pilih dokumen"
                                    name="jenisPermohonan"
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
                                    label="Dokumen Izin Usaha/Izin Operasional"
                                    options={[]}
                                    placeholder="Pilih dokumen"
                                    name="jenisPermohonan"
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
                                    label="Dokumen Surat Arahan"
                                    options={[]}
                                    placeholder="Pilih dokumen"
                                    name="jenisPermohonan"
                                    control={control}
                                />     
                            </Stack.Item>
                            <Stack.Item align="end">                            
                                <DefaultButton text="File"/>
                            </Stack.Item>
                        </Stack>
                    </Stack.Item>
                    <Stack.Item align="end">
                        <PrimaryButton 
                            style={{marginTop: 16, width: 100}}
                            text="Simpan" 
                            onClick={simpanPermohonanSrtArahan}
                        />
                    </Stack.Item>  
                </>
            );
        },
        [dokNibOptions]
    );

    return (
        <motion.div 
            animate={animTahapKetiga}
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
                <Label styles={subLabelStyle}>Kami memerlukan dokumen persyaratan berformat pdf. Pilihan dokumen akan muncul apabila dokumen pernah diupload, jika tidak muncul silahkan tekan tombol File untuk menambahkan dokumen terlebih dahulu.</Label>
            </Stack>
            <Stack tokens={stackTokens} styles={{root: { width: 400, alignItems: 'left'}}}>
                {jenisPermohonanSuratArahan.id == '1' ? getPermohonanSrtArahanBaru() : getPermohonanSrtArahanPerubahan()}
            </Stack>
            {
                isModalAddDokumenNibOpen == true ? 
                <ModalFormulirAddDokumenNib
                    isModalOpen={isModalAddDokumenNibOpen}
                    hideModal={hideModalAddDokumenNib}
                    isDraggable={true}
                /> : null  
            } 
            {
                isModalAddDokumenImbOpen == true ? 
                <ModalFormulirAddDokumenNib
                    isModalOpen={isModalAddDokumenImbOpen}
                    hideModal={hideModalAddDokumenImb}
                    isDraggable={true}
                /> : null  
            }              
        </motion.div>
    );
    
};

const getPermohonanSrtArahanPerubahan = () => {
    return 'perubahan';
}