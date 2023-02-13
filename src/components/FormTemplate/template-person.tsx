import { DefaultPalette, Dropdown, IDropdownOption, IStackItemStyles, Label, Stack, TextField } from "@fluentui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useMemo, useState } from "react";
import { Controller, useForm, FormProvider, useFormContext } from "react-hook-form";
import { array, object, TypeOf, z } from "zod";
import { useGetAllJenisKelaminQuery } from "../../features/jenis-kelamin/jenis-kelamin-api-slice";
import { IJenisKelamin } from "../../features/jenis-kelamin/jenis-kelamin-slice";
import { setNama, setNik,  setPersonJenisKelamin } from "../../features/person/person-slice";
import { FileUpload } from "../UploadFiles/FileUpload";
import { TemplateAlamat } from "./template-alamat";
import { TemplateKontak } from "./template-kontak";


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
    const {
        control
    } = useFormContext();
    
    const methods = useForm<IDokumenUpload>({
        resolver: zodResolver(dokumenUploadSchema),
    });
    //local state
    const [skipCekNik, setSkipCekNik] = useState<boolean>(true);


    //rtk query hook vatiable
    const { data: daftarSex, isFetching: isFetchingDataSex, isError: isErrorSex } = useGetAllJenisKelaminQuery();
    // const { data: dataPerson, isFetching: isFetchingDataPerson, isError: isErrorPerson } = useGetPersonByNikQuery(
    //     person.nik != null ? person.nik: '', {skip: skipCekNik});

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
            return sex;
        },
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
                                errorMessage={error?.message == 'Required'?'Harus diisi':error?.message}
                                onChange={(e, v) => {
                                    dispatch(setNik(v||""));
                                    onChange(v);
                                    if(v?.length == 16) {
                                        setSkipCekNik(false);
                                    }                                    
                                }}
                                defaultValue={value}
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
                                errorMessage={error?.message == 'Required'?'Harus diisi':error?.message}
                                onChange={(e, selectedItem) => {
                                    onChange(handleChangeSex(selectedItem));
                                }}
                                styles={{root:{width: 150}}}
                            />
                        }
                    />
                </Stack.Item> 
                <Stack.Item grow>
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
                                errorMessage={error?.message == 'Required'?'Harus diisi':error?.message}
                                onChange={(e, v) => {
                                    dispatch(setNama(v||""));
                                    onChange(v);
                                }}
                                defaultValue={value}
                            />
                        }
                    />               
                </Stack.Item>               
            </Stack>            
            <Stack.Item>
                <Label>Alamat</Label>
            </Stack.Item>
            <Stack.Item styles={stackItemStyles}>
                <TemplateAlamat />
            </Stack.Item>
            <Stack.Item>
                <Label>Kontak person</Label>
            </Stack.Item>
            <Stack.Item styles={stackItemStyles}>
                <TemplateKontak />
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