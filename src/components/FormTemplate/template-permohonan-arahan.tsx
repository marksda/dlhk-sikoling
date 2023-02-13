import { Dropdown, IDropdownOption, Stack } from "@fluentui/react";
import find from "lodash.find";
import { useCallback, useMemo } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { useAppSelector } from "../../app/hooks";
import { IJenisPermohonanSuratArahan, useGetAllJenisPermohonanSuratArahanQuery } from "../../features/permohonan/jenis-permohonan-surat-arahan-api-slice";
import { useGetRegisterPerusahaanTanpaRegisterDokumenByIdLinkKepemilikanQuery } from "../../features/perusahaan/register-perusahaan-api-slice";
import { IRegisterPerusahaan } from "../../features/perusahaan/register-perusahaan-slice";

export const TemplatePermohonanArahan = () => {
    //redux hook 
    const token = useAppSelector(state => state.token);
    //react-form hook
    const {control} = useFormContext();
    const [registerPerusahaan, jenisPermohonanSuratArahan] = useWatch({
        control: control, 
        name: ['registerPerusahaan', 'jenisPermohonanSuratArahan']
    });

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

    return (
        <>
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
        </>
    );
};