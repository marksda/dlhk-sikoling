import { Dropdown, IDropdownOption, Stack, TextField } from "@fluentui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useCallback, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { object, z } from "zod";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setAlamatDesa, setAlamatKabupaten, setAlamatKecamatan, setAlamatKeterangan, setAlamatPropinsi } from "../../features/alamat/alamat-slice";
import { useGetDesaByKecamatanQuery } from "../../features/desa/desa-api-slice";
import { useGetKabupatenByPropinsiQuery } from "../../features/kabupaten/kabupaten-api-slice";
import { useGetKecamatanByKabupatenQuery } from "../../features/kecamatan/kecamatan-api-slice";
import { useGetAllPropinsiQuery } from "../../features/propinsi/propinsi-api-slice";
import { IPropinsi } from "../../features/propinsi/propinsi-slice";


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

export const TemplateAlamat = () => {
    //redux state variable
    const alamat = useAppSelector((state) => state.alamat);
    const dispatch = useAppDispatch();
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

    const {handleSubmit, control} = useForm<FormData>({
        resolver: zodResolver(alamatSchema)
    });

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

    const save = useCallback(
        handleSubmit(
            async (data) => {                
                console.log(data);       
            }
        ),
        []
    );
            
    return (
        <>
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
                            options={propinsiOptions}
                            errorMessage={error?.message}
                            onChange={(e, selectedItem) => {
                                onChange(handleChangePropinsi(selectedItem));
                            }}
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
                            options={kabupatenOptions}
                            errorMessage={error?.message}
                            onChange={(e, selectedItem) => {
                                onChange(handleChangeKabupaten(selectedItem));
                            }}
                            selectedKey={alamat.kabupaten != null ? alamat.kabupaten.id : null}
                            disabled={alamat.propinsi == null ? true : false}
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
                            options={kecamatanOptions}
                            errorMessage={error?.message}
                            onChange={(e, selectedItem) => {
                                onChange(handleChangeKecamatan(selectedItem));
                            }}
                            selectedKey={alamat.kecamatan != null ? alamat.kecamatan.id : null}
                            disabled={alamat.kabupaten == null ? true : false}
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
                            options={desaOptions}
                            errorMessage={error?.message}
                            onChange={(e, selectedItem) => {
                                onChange(handleChangeDesa(selectedItem));
                            }}
                            selectedKey={alamat.desa != null ? alamat.desa.id : null}
                            disabled={alamat.kecamatan == null ? true : false}
                        />
                    }
                />               
            </Stack.Item>
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
                            errorMessage={error?.message}
                            onChange={(e, v) => {
                                dispatch(setAlamatKeterangan||"");
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