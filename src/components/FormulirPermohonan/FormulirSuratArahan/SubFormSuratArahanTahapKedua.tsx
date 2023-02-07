import { IconButton, IDropdownOption, Label, PrimaryButton, Stack } from "@fluentui/react";
import { motion } from "framer-motion";
import find from "lodash.find";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { UseFormHandleSubmit, UseFormSetError, useWatch } from "react-hook-form";
import { IRegisterPermohonanSuratArahan } from "../../../features/permohonan/register-permohonan-api-slice";
import { IStatusWali, useGetAllStatusWaliPermohonanQuery } from "../../../features/permohonan/status-wali-api-slice";
import { useGetPersonByNikQuery } from "../../../features/person/person-api-slice";
import { ControlledFluentUiDropDown } from "../../ControlledDropDown/ControlledFluentUiDropDown";
import { ControlledFluentUiTextField } from "../../ControlledTextField/ControlledFluentUiTextField";
import { backIcon } from "../../FormulirPerusahaanFormHook/InterfacesPerusahaan";
import { contentStyles, durationAnimFormSuratArahan, ISlideSubFormPermohomanSuratArahanParam, ISubFormPermohonanSuratArahanProps, labelStyle, labelTitleBack, stackTokens, subLabelStyle, variantAnimSuratArahan } from "./interfacePermohonanSuratArahan";

interface ISubFormTahapKeduaSuratArahanProps extends ISubFormPermohonanSuratArahanProps {
    setError: UseFormSetError<IRegisterPermohonanSuratArahan>;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export const SubFormSuratArahanTahapKedua: FC<ISubFormTahapKeduaSuratArahanProps> = ({setMotionKey, setIsLoading, setError, setValue, control}) => {
    // local state
    const [animTahapKedua, setAnimTahapKedua] = useState<string>('open');
    // const [nik, setNik] = useState<string>('');
    // const [skip, setSkip] = useState<boolean>(true);
    //react-form hook variable
    const [registerPerusahaan, statusWali, penanggungJawabPermohonan] = useWatch({
        control: control, 
        name: ['registerPerusahaan','statusWali', 'penanggungJawabPermohonan']
    });
    //rtk query perusahaan variable hook
    const { data: daftarStatusWali, error: errorFetchDataStatusWali,  isFetching: isFetchingDaftarStatusWali, isError: isErrorDataStatusWali } = useGetAllStatusWaliPermohonanQuery();
    // const {data: pJ, error: ErrorFetchPj} = useGetPersonByNikQuery(nik, {skip});
    
    const statusWaliOptions: IDropdownOption<any>[] = useMemo(
        () => {
            if(daftarStatusWali != undefined) {
                return [
                    ...daftarStatusWali.map(
                        (t) => ({
                            key: t.id as string,
                            text: t.nama as string
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

    const handleSetStatusWali = useCallback(
        (item) => {
            let itemSelected = find(daftarStatusWali, (i) => i.id == item.key) as IStatusWali;
            // dispatch(setRegisterPerusahaan(itemSelected));            
            setValue("statusWali", itemSelected);
        },
        [daftarStatusWali]
    );

    const processNextStep = useCallback(
        () => {
            setAnimTahapKedua('closed');
            let timer = setTimeout(
                () => {
                    setMotionKey('tahapKetiga');
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
                <Label styles={labelStyle}>Penanggung jawab permohonan</Label>
                <Label styles={subLabelStyle}>Penanggung jawab permohonan selain pemilik/direktur wajib menyertakan surat kuasa perusahaan. Nik wajib diinputkan, jika disistem tidak menemukan inputan nik tekan tombol tambah.</Label>
            </Stack>
            <Stack tokens={stackTokens} styles={{root: { width: 400, alignItems: 'left'}}}>
                <Stack.Item>
                    <ControlledFluentUiDropDown
                        label="Status penanggung jawab permohonan"
                        placeholder="Pilih status penanggung jawab permohonan"
                        dropdownWidth="auto"
                        options={statusWaliOptions}
                        required
                        name="statusWali"
                        rules={{ required: "harus diisi" }} 
                        control={control}
                        onChangeItem={handleSetStatusWali}
                        selectedKey={statusWali != null ? statusWali.id : undefined}
                    />     
                </Stack.Item>
                <Stack.Item>
                    <ControlledFluentUiTextField
                        label="Nik"
                        name="penanggungJawabPermohonan.nik"         
                        control={control}  
                        rules={{ required: "harus diisi sesuai dengan akta perusahaan" }}  
                        required
                        disabled={statusWali == null ? true : false}
                    />
                </Stack.Item>
                <Stack.Item>
                    <ControlledFluentUiTextField
                        label="Nama"
                        name="penanggungJawabPermohonan.nama"         
                        control={control} 
                        disabled={true}
                    />
                </Stack.Item>
                <Stack.Item align="end">
                    <PrimaryButton 
                        style={{marginTop: 16, width: 100}}
                        text="cek" 
                        onClick={processNextStep}
                    />
                </Stack.Item>
            </Stack>
        </motion.div>
    );
    
}