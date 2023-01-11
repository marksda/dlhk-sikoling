import { IDropdownOption, Label, PrimaryButton, Stack } from "@fluentui/react";
import { motion } from "framer-motion";
import find from "lodash.find";
import { FC, useCallback, useMemo, useState } from "react";
import { UseFormSetError, useWatch } from "react-hook-form";
import { useAppSelector } from "../../../app/hooks";
import { IJenisPermohonanSuratArahan, useGetAllJenisPermohonanSuratArahanQuery } from "../../../features/permohonan/jenis-permohonan-surat-arahan-api-slice";
import { IRegisterPermohonanSuratArahan } from "../../../features/permohonan/register-permohonan-api-slice";
import { useGetRegisterPerusahaanTanpaRegisterDokumenByIdLinkKepemilikanQuery } from "../../../features/perusahaan/register-perusahaan-api-slice";
import { IRegisterPerusahaan } from "../../../features/perusahaan/register-perusahaan-slice";
import { ControlledFluentUiDropDown } from "../../ControlledDropDown/ControlledFluentUiDropDown";
import { contentStyles, durationAnimFormSuratArahan, ISubFormPermohonanSuratArahanProps, labelStyle, stackTokens, subLabelStyle, variantAnimSuratArahan } from "./interfacePermohonanSuratArahan";


interface ISubFormTahapPertamaSuratArahanProps extends ISubFormPermohonanSuratArahanProps {
    setError: UseFormSetError<IRegisterPermohonanSuratArahan>;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export const SubFormSuratArahanTahapPertama: FC<ISubFormTahapPertamaSuratArahanProps> = ({setMotionKey, setIsLoading, setError, setValue, control}) => {
    //react-form hook variable
    const [registerPerusahaan, jenisPermohonanSuratArahan] = useWatch({
        control: control, 
        name: ['registerPerusahaan', 'jenisPermohonanSuratArahan']
    });
    //redux variable state
    const token = useAppSelector(state => state.token);
    // local state
    const [animTahapPertama, setAnimTahapPertama] = useState<string>('open');
    //rtk query perusahaan variable hook
    const { data: daftarRegisterPerusahaan, error: errorFetchDataPerusahaan,  isFetching: isFetchingDaftarRegisterPerusahaan, isError } = useGetRegisterPerusahaanTanpaRegisterDokumenByIdLinkKepemilikanQuery(token.userId as string);
    const { data: daftarJenisPermohonanSuratarahan, error: errorFetchDataJenisPermohonanSuratArahan,  isFetching: isFetchingDaftarJenisPermohonanSuratarahan, isError: isErrorJenisPermohonanSuratarahan } = useGetAllJenisPermohonanSuratArahanQuery();

    const perusahaanOptions: IDropdownOption<any>[] = useMemo(
        () => {
            if(daftarRegisterPerusahaan != undefined) {
                return [
                    ...daftarRegisterPerusahaan.map(
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
        [daftarRegisterPerusahaan]
    );

    const jenisPermohonanSuratArahanOptions: IDropdownOption<any>[] = useMemo(
        () => {
            if(daftarJenisPermohonanSuratarahan != undefined) {
                return [
                    ...daftarJenisPermohonanSuratarahan.map(
                        (t) => ({
                            key: t.id!,
                            text: `${t.keterangan}`
                        })
                    )
                ];
            }
            else {
                return [];
            }
        },
        [daftarJenisPermohonanSuratarahan]
    );

    const handleSetRegisterPerusahaan = useCallback(
        (item) => {
            let itemSelected = find(daftarRegisterPerusahaan, (i) => i.id == item.key) as IRegisterPerusahaan;
            setValue("registerPerusahaan", itemSelected);
        },
        [daftarRegisterPerusahaan]
    );

    const handleSetJenisPermohonanSuratArahan = useCallback(
        (item) => {
            let itemSelected = find(daftarJenisPermohonanSuratarahan, (i) => i.id == item.key) as IJenisPermohonanSuratArahan;
            setValue("jenisPermohonanSuratArahan", itemSelected);
        },
        [daftarJenisPermohonanSuratarahan]
    );

    const processNextStep = useCallback(
        () => {
            setAnimTahapPertama('closed');
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

    return (
        <motion.div 
            animate={animTahapPertama}
            variants={variantAnimSuratArahan}
            className={contentStyles.body} 
        >
            <Stack tokens={stackTokens} styles={{root: { width: 400, alignItems: 'left', marginBottom: 16}}}>
                <Label styles={labelStyle}>Jenis permohonan</Label>
                <Label styles={subLabelStyle}>Pilih baru untuk pengajuan dokumen lingkungan baru, atau pilih perubahan untuk pengajuan perubahan dokumen lingkungan</Label>
            </Stack>
            <Stack tokens={stackTokens} styles={{root: { width: 400, alignItems: 'left'}}}>
                <Stack.Item>
                    <ControlledFluentUiDropDown
                        label="Pemrakarsa"
                        placeholder="Pilih pemrakarsa"
                        options={perusahaanOptions}
                        required
                        name="perusahaan"
                        rules={{ required: "harus diisi" }} 
                        control={control}
                        onChangeItem={handleSetRegisterPerusahaan}
                        selectedKey={registerPerusahaan != null ? registerPerusahaan.id : undefined}
                    />     
                </Stack.Item>
                <Stack.Item>
                    <ControlledFluentUiDropDown
                        label="Jenis permohonan"
                        placeholder="Pilih jenis"
                        options={jenisPermohonanSuratArahanOptions}
                        required
                        name="jenisPermohonan"
                        rules={{ required: "harus diisi" }} 
                        control={control}
                        onChangeItem={handleSetJenisPermohonanSuratArahan}
                        disabled={registerPerusahaan == null ? true : false}
                        selectedKey={jenisPermohonanSuratArahan != null ? jenisPermohonanSuratArahan.id : undefined}
                    />     
                </Stack.Item>
            </Stack>
            <Stack horizontal tokens={stackTokens} styles={{root: { width: 400, justifyContent: 'flex-end'}}}>
                <PrimaryButton 
                    style={{marginTop: 24, width: 100}}
                    text="Lanjut" 
                    onClick={processNextStep} 
                    disabled={jenisPermohonanSuratArahan == null ? true : false}
                />
            </Stack> 
        </motion.div>
    );
};