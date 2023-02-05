import { IconButton, IDropdownOption, Label, Stack } from "@fluentui/react";
import { motion } from "framer-motion";
import { FC, useCallback, useMemo, useState } from "react";
import { UseFormHandleSubmit, UseFormSetError, useWatch } from "react-hook-form";
import { IRegisterPermohonanSuratArahan } from "../../../features/permohonan/register-permohonan-api-slice";
import { ControlledFluentUiDropDown } from "../../ControlledDropDown/ControlledFluentUiDropDown";
import { backIcon } from "../../FormulirPerusahaanFormHook/InterfacesPerusahaan";
import { contentStyles, durationAnimFormSuratArahan, ISlideSubFormPermohomanSuratArahanParam, ISubFormPermohonanSuratArahanProps, labelStyle, labelTitleBack, stackTokens, subLabelStyle, variantAnimSuratArahan } from "./interfacePermohonanSuratArahan";

interface ISubFormTahapKeduaSuratArahanProps extends ISubFormPermohonanSuratArahanProps {
    setError: UseFormSetError<IRegisterPermohonanSuratArahan>;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export const SubFormSuratArahanTahapKedua: FC<ISubFormTahapKeduaSuratArahanProps> = ({setMotionKey, setIsLoading, setError, setValue, control}) => {
    // local state
    const [animTahapKedua, setAnimTahapKedua] = useState<string>('open');
    //react-form hook variable
    const [registerPerusahaan, jenisPermohonanSuratArahan, daftarDokumenSyarat] = useWatch({
        control: control, 
        name: ['registerPerusahaan','jenisPermohonanSuratArahan', 'daftarDokumenSyarat']
    });
    //rtk query perusahaan variable hook
    const { data: daftarStatusWali, error: errorFetchDataJenisPermohonanSuratArahan,  isFetching: isFetchingDaftarJenisPermohonanSuratarahan, isError: isErrorJenisPermohonanSuratarahan } = useGetAllJenisPermohonanSuratArahanQuery();

    const statusWaliOptions: IDropdownOption<any>[] = useMemo(
        () => {
            if(daftarStatusWali != undefined) {
                return [
                    ...daftarStatusWali.map(
                        (t) => ({
                            key: t.id!,
                            text: t.perusahaan?.pelakuUsaha != undefined ?
                             `${t.perusahaan?.pelakuUsaha?.singkatan}. ${t.perusahaan?.nama}` : 
                             `${t.perusahaan?.nama}`
                        })
                    )
                ];
            }
            else {
                return [];
            }
        },
        [daftarStatusWali]
    );

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
                <Label styles={labelStyle}>Status pengurus permohonan</Label>
                <Label styles={subLabelStyle}>Jika pengurus permohonan adalah selain pemilik/direktur harus disertai dengan surat kuasa perusahaan</Label>
            </Stack>
            <Stack tokens={stackTokens} styles={{root: { width: 400, alignItems: 'left'}}}>
                <Stack.Item>
                    <ControlledFluentUiDropDown
                        label="Stataus pengurus permohonan"
                        placeholder="Pilih status pengurus permohonan"
                        options={statusWaliOptions}
                        required
                        name="perusahaan"
                        rules={{ required: "harus diisi" }} 
                        control={control}
                        onChangeItem={handleSetRegisterPerusahaan}
                        selectedKey={registerPerusahaan != null ? registerPerusahaan.id : undefined}
                    />     
                </Stack.Item>
            </Stack>
        </motion.div>
    );
    
}