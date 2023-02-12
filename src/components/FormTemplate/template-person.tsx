import { Dropdown, IDropdownOption, PrimaryButton, Stack, TextField } from "@fluentui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { Controller, useForm, FormProvider } from "react-hook-form";
import { object, z } from "zod";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useGetAllJenisKelaminQuery } from "../../features/jenis-kelamin/jenis-kelamin-api-slice";
import { IJenisKelamin } from "../../features/jenis-kelamin/jenis-kelamin-slice";
import { setNama, setNik, setPersonAlamat, setPersonJenisKelamin } from "../../features/person/person-slice";
import { TemplateAlamat } from "./template-alamat";


const personSchema = object({
    nik: z.string().regex(/^\d+$/, {message: 'harus diisi bilangan bukan abjad'}).length(17, {message: 'Nik harus 17 digit'}),
    nama: z.string().min(3, {message: 'nama diisi minimal 3 karakter'}),
    jenisKelamin: object({
        id: z.string(),
        nama: z.string()
    }),
});

type FormData = z.infer<typeof personSchema>;

export const TemplatePerson = () => {
    //redux state variable
    const person = useAppSelector((state) => state.person);
    const alamat = useAppSelector((state) => state.alamat);
    const dispatch = useAppDispatch();

    //rtk query hook vatiable
    const { data: daftarSex, isFetching: isFetchingDataSex, isError: isErrorSex } = useGetAllJenisKelaminQuery();

    useEffect(
        () => {
            dispatch(setPersonAlamat(alamat));
        },
        [alamat]
    );

    const sexOptions: IDropdownOption<any>[] = useMemo(
        () => {
            if(daftarSex != undefined) {
                return [
                    ...daftarSex.map(
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
        [daftarSex]
    );

    const handleChangeSex = useCallback(
        (item): IJenisKelamin => {
            var sex = {
                id: item.key,
                nama: item.text
            };
            dispatch(setPersonJenisKelamin(sex));
            return sex;
        },
        []
    );

    //react form hook state
    const {handleSubmit, control} = useForm<FormData>({
        resolver: zodResolver(personSchema)
    });
    
    const save = useCallback(
        handleSubmit(
            (data) => {        
                console.log(data);       
            }
        ),
        []
    );

    return (
        <>
            <Stack.Item>
                <Controller
                    name="nik"
                    control={control}
                    render={
                        ({
                            field: {name: fieldName, onChange, value},
                            fieldState: {error}
                        }) => 
                        <TextField 
                            name={fieldName}
                            label="Nik"
                            placeholder="Nik harus sesuai dengan ktp"
                            errorMessage={error?.message}
                            onChange={(e, v) => {
                                dispatch(setNik(v||""));
                                onChange(v);
                            }}
                            value={value}
                        />
                    }
                />               
            </Stack.Item>
            <Stack.Item>
                <Controller
                    name="nama"
                    control={control}
                    render={
                        ({
                            field: {name: fieldName, onChange, onBlur, value},
                            fieldState: {error}
                        }) => 
                        <TextField 
                            name={fieldName}
                            label='Nama'
                            placeholder="Nama harus sesuai dengan ktp"
                            errorMessage={error?.message}
                            onChange={(e, v) => {
                                dispatch(setNama(v||""));
                                onChange(v);
                            }}
                            value={value}
                        />
                    }
                />               
            </Stack.Item>
            <Stack.Item>
                <Controller
                    name="jenisKelamin"
                    control={control}
                    render={
                        ({
                            field: {onChange},
                            fieldState: {error}
                        }) => 
                        <Dropdown 
                            label="Jenis kelamin"
                            placeholder="Pilih jenis kelamin"
                            options={sexOptions}
                            errorMessage={error?.message}
                            onChange={(e, selectedItem) => {
                                onChange(handleChangeSex(selectedItem));
                            }}
                        />
                    }
                />
            </Stack.Item>
            <TemplateAlamat />
            <Stack.Item align="end">
                <PrimaryButton 
                    style={{width: 100, marginTop: 8}}
                    text={'Lanjut'}
                    onClick={save}
                />
            </Stack.Item>
        </>
    );
}