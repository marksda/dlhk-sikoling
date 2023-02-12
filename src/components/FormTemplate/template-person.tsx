import { DefaultPalette, Dropdown, IDropdownOption, IStackItemStyles, Label, PrimaryButton, Stack, TextField } from "@fluentui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { Controller, useForm, FormProvider } from "react-hook-form";
import { array, object, TypeOf, z } from "zod";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useGetAllJenisKelaminQuery } from "../../features/jenis-kelamin/jenis-kelamin-api-slice";
import { IJenisKelamin } from "../../features/jenis-kelamin/jenis-kelamin-slice";
import { setNama, setNik, setPersonAlamat, setPersonJenisKelamin } from "../../features/person/person-slice";
import { FileUpload } from "../UploadFiles/FileUpload";
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

const dokumenUploadSchema = object({
    dokumen: z.instanceof(File),
    dokumens: array(z.instanceof(File))
});
type IDokumenUpload = TypeOf<typeof dokumenUploadSchema>;

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
    // const person = useAppSelector((state) => state.person);
    const alamat = useAppSelector((state) => state.alamat);
    const dispatch = useAppDispatch();

    const methods = useForm<IDokumenUpload>({
        resolver: zodResolver(dokumenUploadSchema),
    });

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
            <Stack horizontal tokens={stackHorTokens} styles={{root: {alignItems: 'left'}}}>
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
                                placeholder="Nik sesuai ktp"
                                errorMessage={error?.message}
                                onChange={(e, v) => {
                                    dispatch(setNik(v||""));
                                    onChange(v);
                                }}
                                value={value}
                                styles={{root:{width: 150}}}
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
                                styles={{root:{width: 150}}}
                            />
                        }
                    />
                </Stack.Item>                
            </Stack>
            <Stack.Item >
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
                <Label>Alamat</Label>
            </Stack.Item>
            <Stack.Item styles={stackItemStyles}>
                <TemplateAlamat />
            </Stack.Item>
            <Stack.Item>
                <Label>Bukti scan Ktp</Label>
            </Stack.Item>
            <Stack.Item>
                <FormProvider {...methods}>
                    <FileUpload 
                        limit={1} 
                        multiple={false} 
                        name='dokumen' 
                        mime='application/pdf' 
                        disabled={false}/>
                </FormProvider>  
            </Stack.Item>
        </>
    );
}