import { PrimaryButton, Stack, TextField } from "@fluentui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { Controller, useForm, FormProvider } from "react-hook-form";
import { object, z } from "zod";


const personSchema = object({
    nik: z.string().regex(/^\d+$/, {message: 'harus diisi bilangan bukan abjad'}).length(17, {message: 'Nik harus 17 digit'}),
    nama: z.string().min(3, {message: 'nama diisi minimal 3 karakter'})
});

type FormData = z.infer<typeof personSchema>;

export const TemplatePerson = () => {
    const {handleSubmit, control} = useForm<FormData>({
        resolver: zodResolver(personSchema)
    });
    
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
                    name="nik"
                    control={control}
                    render={
                        ({
                            field: {name: fieldName, onChange, onBlur, value},
                            fieldState: {error}
                        }) => 
                        <TextField 
                            name={fieldName}
                            label="Nik"
                            placeholder="Nik harus sesuai dengan ktp"
                            errorMessage={error?.message}
                            onChange={onChange}
                            onBlur={onBlur}
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
                            onChange={onChange}
                            onBlur={onBlur}
                            value={value}
                        />
                    }
                />               
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