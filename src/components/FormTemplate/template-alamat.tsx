import { Dropdown, IDropdownOption, Stack, TextField } from "@fluentui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useCallback, useMemo } from "react";
import { Controller, useForm, useFormContext, useWatch } from "react-hook-form";
import { object, z } from "zod";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
// import { setAlamatDesa, setAlamatKabupaten, setAlamatKecamatan, setAlamatKeterangan, setAlamatPropinsi } from "../../features/repository/ssot/alamat-slice";
// import { useGetDesaByKecamatanQuery } from "../../features/repository/service/desa-api-slice";
// import { useGetKabupatenByPropinsiQuery } from "../../features/repository/service/kabupaten-api-slice";
// import { useGetKecamatanByKabupatenQuery } from "../../features/repository/service/kecamatan-api-slice";
// import { useGetAllPropinsiQuery } from "../../features/repository/service/propinsi-api-slice";
// import { IPropinsi } from "../../features/repository/ssot/propinsi-slice";


const alamatSchema = object({
    propinsi: object({
        id: z.string(),
        nama: z.string(),
    }),
    kabupaten: object({
        id: z.string(),
        nama: z.string(),
    }),
    kecamatan: object({
        id: z.string(),
        nama: z.string(),
    }),
    desa: object({
        id: z.string(),
        nama: z.string(),
    }),
    keterangan: z.string()
});
type FormData = z.infer<typeof alamatSchema>;
const stackHorTokens = { childrenGap: 4 };

export const TemplateAlamat = () => {
    //redux state variable
    const alamat = useAppSelector((state) => state.alamat);
    const dispatch = useAppDispatch();
    //react form hook context
    const {
        control
    } = useFormContext();
    
    //rtk query hook state
    const { data: daftarPropinsi, isFetching: isFetchingDataPropinsi, isError: isErrorPropinsi } = useGetAllPropinsiQuery();
    const { data: daftarKabupaten, isFetching: isFetchingDataKabupaten, isError: isErrorKabupaten } = useGetKabupatenByPropinsiQuery(alamat.propinsi != null ? alamat.propinsi.id : null, {skip: alamat.propinsi == null ? true : false});
    const { data: daftarKecamatan, isFetching: isFetchingDataKecamatan, isError: isErrorKecamatan } = useGetKecamatanByKabupatenQuery(alamat.kabupaten != null ? alamat.kabupaten.id : null, {skip: alamat.kabupaten == null ? true : false});
    const { data: daftarDesa, isFetching: isFetchingDataDesa, isError: isErrorDesa } = useGetDesaByKecamatanQuery(alamat.kecamatan != null ? alamat.kecamatan.id : null, {skip: alamat.kecamatan == null ? true : false});


    const propinsiOptions: IDropdownOption<any>[] = useMemo(
        () => {
            if(daftarPropinsi != undefined) {
                return [
                    ...daftarPropinsi.map(
                        (t) => ({
                            key: t.id!,
                            text: t.nama!
                        })
                    )
                ];
            }
            else {
                return [];
            }
        },
        [daftarPropinsi]
    );

    const kabupatenOptions: IDropdownOption<any>[] = useMemo(
        () => {
            if(daftarKabupaten != undefined) {
                return [
                    ...daftarKabupaten.map(
                        (t) => ({
                            key: t.id!,
                            text: t.nama!
                        })
                    )
                ];
            }
            else {
                return [];
            }
        },
        [daftarKabupaten]
    );

    const kecamatanOptions: IDropdownOption<any>[] = useMemo(
        () => {
            if(daftarKecamatan != undefined) {
                return [
                    ...daftarKecamatan.map(
                        (t) => ({
                            key: t.id!,
                            text: t.nama!
                        })
                    )
                ];
            }
            else {
                return [];
            }
        },
        [daftarKecamatan]
    );
    
    const desaOptions: IDropdownOption<any>[] = useMemo(
        () => {
            if(daftarDesa != undefined) {
                return [
                    ...daftarDesa.map(
                        (t) => ({
                            key: t.id!,
                            text: t.nama!
                        })
                    )
                ];
            }
            else {
                return [];
            }
        },
        [daftarDesa]
    );

    const handleChangePropinsi = useCallback(
        (item): IPropinsi => {
            var propinsi = {
                id: item.key,
                nama: item.text
            };

            dispatch(setAlamatPropinsi(propinsi));
            dispatch(setAlamatKabupaten(null));
            dispatch(setAlamatKecamatan(null));
            dispatch(setAlamatDesa(null));
            return propinsi;
        },
        []
    );

    const handleChangeKabupaten = useCallback(
        (item) => {
            var kabupaten = {
                id: item.key,
                nama: item.text
            };

            dispatch(setAlamatKabupaten(kabupaten));
            dispatch(setAlamatKecamatan(null));
            dispatch(setAlamatDesa(null));
            return kabupaten;
        },
        []
    );

    const handleChangeKecamatan = useCallback(
        (item) => {
            var kecamatan = {
                id: item.key,
                nama: item.text
            };

            dispatch(setAlamatKecamatan(kecamatan));
            dispatch(setAlamatDesa(null));
            return kecamatan;
        },
        []
    );
    
    const handleChangeDesa = useCallback(
        (item) => {
            var desa = {
                id: item.key,
                nama: item.text
            };

            dispatch(setAlamatDesa(desa));
            return desa;
        },
        []
    );
            
    return (
        <>
            <Stack horizontal tokens={stackHorTokens} styles={{root: {alignItems: 'left'}}}>
                <Stack.Item>
                    <Controller
                        name="propinsi"
                        control={control}
                        render={
                            ({
                                field: {onChange},
                                fieldState: {error}
                            }) => 
                            <Dropdown 
                                label="Propinsi"
                                placeholder="Pilih propinsi"
                                required
                                options={propinsiOptions}
                                errorMessage={error?.message == 'Required'?'Harus diisi':error?.message}
                                onChange={(e, selectedItem) => {
                                    onChange(handleChangePropinsi(selectedItem));
                                }}
                                styles={{root:{width: 250}}}
                                selectedKey={alamat.propinsi != null ? alamat.propinsi.id : null}
                            />
                        }
                    />               
                </Stack.Item>
                <Stack.Item>
                    <Controller
                        name="kabupaten"
                        control={control}
                        render={
                            ({
                                field: {onChange},
                                fieldState: {error}
                            }) => 
                            <Dropdown 
                                label="Kabupaten"
                                placeholder="Pilih kabupaten"
                                required
                                options={kabupatenOptions}
                                errorMessage={error?.message == 'Required'?'Harus diisi':error?.message}
                                onChange={(e, selectedItem) => {
                                    onChange(handleChangeKabupaten(selectedItem));
                                }}
                                selectedKey={alamat.kabupaten != null ? alamat.kabupaten.id : null}
                                disabled={alamat.propinsi == null ? true : false}
                                styles={{root:{width: 250}}}
                            />
                        }
                    />               
                </Stack.Item>   
                <Stack.Item>
                    <Controller
                        name="kecamatan"
                        control={control}
                        render={
                            ({
                                field: {onChange},
                                fieldState: {error}
                            }) => 
                            <Dropdown 
                                label="Kecamatan"
                                placeholder="Pilih kecamatan"
                                required
                                options={kecamatanOptions}
                                errorMessage={error?.message == 'Required'?'Harus diisi':error?.message}
                                onChange={(e, selectedItem) => {
                                    onChange(handleChangeKecamatan(selectedItem));
                                }}
                                selectedKey={alamat.kecamatan != null ? alamat.kecamatan.id : null}
                                disabled={alamat.kabupaten == null ? true : false}
                                styles={{root:{width: 250}}}
                            />
                        }
                    />               
                </Stack.Item>
                <Stack.Item>
                    <Controller
                        name="desa"
                        control={control}
                        render={
                            ({
                                field: {onChange},
                                fieldState: {error}
                            }) => 
                            <Dropdown 
                                label="Desa"
                                placeholder="Pilih desa"
                                required
                                options={desaOptions}
                                errorMessage={error?.message == 'Required'?'Harus diisi':error?.message}
                                onChange={(e, selectedItem) => {
                                    onChange(handleChangeDesa(selectedItem));
                                }}
                                selectedKey={alamat.desa != null ? alamat.desa.id : null}
                                disabled={alamat.kecamatan == null ? true : false}
                                styles={{root:{width: 250}}}
                            />
                        }
                    />               
                </Stack.Item>
            </Stack>
            <Stack.Item>
                <Controller
                    name="keterangan"
                    control={control}
                    render={
                        ({
                            field: {name: fieldName, onChange, value},
                            fieldState: {error}
                        }) => 
                        <TextField 
                            name={fieldName}
                            label='Detail alamat'
                            placeholder="Isi detail alamat seperti: jalan, perumahan, blok, nomor rumah, rt,rw, gedung, lantai atau yang lainnya"
                            required multiline autoAdjustHeight
                            errorMessage={error?.message == 'Required'?'Harus diisi':error?.message}
                            onChange={(e, v) => {
                                dispatch(setAlamatKeterangan(v||null));
                                onChange(v);
                            }}
                            value={value}
                            disabled={alamat.desa == null ? true : false}
                        />
                    }
                />          
            </Stack.Item>
        </>
    );
};