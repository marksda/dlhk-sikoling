import { Dropdown, IDropdownOption, Label, PrimaryButton, Stack } from "@fluentui/react";
import { motion } from "framer-motion";
import find from "lodash.find";
import { FC, useCallback, useMemo, useState } from "react";
import { useFormContext, UseFormSetError, useWatch } from "react-hook-form";
import { Controller } from "react-hook-form/dist/controller";
import { useAppSelector } from "../../../app/hooks";
import { IJenisPermohonanSuratArahan, useGetAllJenisPermohonanSuratArahanQuery } from "../../../features/permohonan/jenis-permohonan-surat-arahan-api-slice";
import { useGetRegisterPerusahaanTanpaRegisterDokumenByIdLinkKepemilikanQuery } from "../../../features/perusahaan/register-perusahaan-api-slice";
import { IRegisterPerusahaan } from "../../../features/perusahaan/register-perusahaan-slice";
import { contentStyles, durationAnimFormSuratArahan, labelStyle, stackTokens, subLabelStyle, variantAnimSuratArahan } from "./interfacePermohonanSuratArahan";


interface ISubFormTahapPertamaSuratArahanProps {
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export const SubFormSuratArahanTahapPertama: FC<ISubFormTahapPertamaSuratArahanProps> = ({setMotionKey, setIsLoading}) => {
    //redux hook 
    const token = useAppSelector(state => state.token);
    // const dispatch = useAppDispatch();
    //react-form hook
    const {control} = useFormContext();
    const [registerPerusahaan, jenisPermohonanSuratArahan] = useWatch({
        control: control, 
        name: ['registerPerusahaan', 'jenisPermohonanSuratArahan']
    });
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

    const handleChangeRegisterPerusahaan = useCallback(
        (item): IRegisterPerusahaan => {
            let itemSelected = find(daftarRegisterPerusahaan, (i) => i.id == item.key) as IRegisterPerusahaan;
            // dispatch(setRegisterPerusahaan(registerPerusahaan));
            return itemSelected;
        },
        [daftarRegisterPerusahaan]
    );

    const handleChangeStatusPermohonan = useCallback(
        (item) => {
            let itemSelected = find(daftarJenisPermohonanSuratarahan, (i) => i.id == item.key) as IJenisPermohonanSuratArahan;
            return itemSelected;
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
                <Label styles={labelStyle}>Status permohonan</Label>
                <Label styles={subLabelStyle}>Pilih baru untuk pengajuan baru atau perubahan untuk perubahan</Label>
            </Stack>
            <Stack tokens={stackTokens} styles={{root: { width: 400, alignItems: 'left'}}}>
                <Stack.Item>
                    <Controller 
                        name="registerPerusahaan"
                        control={control}
                        render={
                            ({
                                field: {onChange},
                                fieldState: {error}
                            }) => 
                            <Dropdown 
                                label="Pemrakarsa"
                                placeholder="Pilih pemrakarsa"
                                options={perusahaanOptions}
                                errorMessage={error?.message == 'Required'?'Harus diisi':error?.message}
                                onChange={(e, selectedItem) => {
                                    onChange(handleChangeRegisterPerusahaan(selectedItem));
                                }}
                                styles={{root:{width: 250}}}
                                required
                                selectedKey={registerPerusahaan != null ? registerPerusahaan.id : undefined}
                            />
                        }
                    />
                </Stack.Item>
                <Stack.Item>
                    <Controller 
                        name="jenisPermohonanSuratArahan"
                        control={control}
                        render={
                            ({
                                field: {onChange},
                                fieldState: {error}
                            }) => 
                            <Dropdown 
                                label="Status permohonan"
                                placeholder="Pilih status permohonan"
                                options={jenisPermohonanSuratArahanOptions}
                                errorMessage={error?.message == 'Required'?'Harus diisi':error?.message}
                                onChange={(e, selectedItem) => {
                                    onChange(handleChangeStatusPermohonan(selectedItem));
                                }}
                                styles={{root:{width: 250}}}
                                required
                                disabled={registerPerusahaan == null ? true : false}
                                selectedKey={jenisPermohonanSuratArahan != null ? jenisPermohonanSuratArahan.id : undefined}
                            />
                        }
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