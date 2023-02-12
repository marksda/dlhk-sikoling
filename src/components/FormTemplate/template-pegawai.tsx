import { DefaultPalette, Dropdown, IDropdownOption, IStackItemStyles, Label, PrimaryButton, Stack, TextField } from "@fluentui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { Controller, useForm, FormProvider } from "react-hook-form";
import { array, object, TypeOf, z } from "zod";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useGetAllJabatanQuery } from "../../features/jabatan/jabatan-api-slice";
import { IJabatan, setJabatan } from "../../features/jabatan/jabatan-slice";
import { useGetAllJenisKelaminQuery } from "../../features/jenis-kelamin/jenis-kelamin-api-slice";
import { IJenisKelamin } from "../../features/jenis-kelamin/jenis-kelamin-slice";
import { setJabatanPegawai, setPersonPegawai, setPerusahaanPegawai } from "../../features/pegawai/pegawai-slice";
import { setNama, setNik, setPersonAlamat, setPersonJenisKelamin } from "../../features/person/person-slice";
import { FileUpload } from "../UploadFiles/FileUpload";
import { TemplateAlamat } from "./template-alamat";


const pegawaiSchema = object({
    jabatan: object({
        id: z.string(),
        nama: z.string()
    }),
});
type FormData = z.infer<typeof pegawaiSchema>;

const stackItemStyles: IStackItemStyles = {
    root: {
        margintop: 0,
        border: `1px solid ${DefaultPalette.orangeLighter}`,
        padding: 8,
    },
};
const stackHorTokens = { childrenGap: 4 };

export const TemplatePerson = () => {
    //redux state variable
    // const pegawai = useAppSelector((state) => state.pegawai);
    const perusahaan = useAppSelector((state) => state.registerPerusahaan);
    const person = useAppSelector((state) => state.person);
    const jabatan = useAppSelector((state) => state.jabatan);
    const dispatch = useAppDispatch();

    //rtk query hook vatiable
    const { data: daftarJabatan, isFetching: isFetchingDataJabatan, isError: isErrorJabatan } = useGetAllJabatanQuery();

    useEffect(
        () => {
            dispatch(setPerusahaanPegawai(perusahaan));
        },
        [perusahaan]
    );

    useEffect(
        () => {
            dispatch(setPersonPegawai(person));
        },
        [person]
    );

    useEffect(
        () => {
            dispatch(setJabatanPegawai(jabatan));
        },
        [jabatan]
    );

    const jabatanOptions: IDropdownOption<any>[] = useMemo(
        () => {
            if(daftarJabatan != undefined) {
                return [
                    ...daftarJabatan.map(
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
        [daftarJabatan]
    );

    const handleChangeJabatan = useCallback(
        (item): IJabatan => {
            var jabatan: IJabatan = {
                id: item.key,
                nama: item.text
            };
            dispatch(setJabatan(jabatan));
            return jabatan;
        },
        []
    );

    //react form hook state
    const {handleSubmit, control} = useForm<FormData>({
        resolver: zodResolver(pegawaiSchema)
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
            <Stack horizontal tokens={stackHorTokens} styles={{root: {alignItems: 'left'}}}>
                <Stack.Item>
                    <Controller
                        name="jabatan"
                        control={control}
                        render={
                            ({
                                field: {onChange},
                                fieldState: {error}
                            }) => 
                            <Dropdown 
                                label="Jabatan"
                                placeholder="Pilih jabatan"
                                options={jabatanOptions}
                                errorMessage={error?.message}
                                onChange={(e, selectedItem) => {
                                    onChange(handleChangeJabatan(selectedItem));
                                }}
                                styles={{root:{width: 150}}}
                            />
                        }
                    />
                </Stack.Item>                
            </Stack>
            <Stack.Item>
                <Label>Data pribadi</Label>
            </Stack.Item>
            <Stack.Item styles={stackItemStyles}>
                <TemplatePerson />
            </Stack.Item>
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