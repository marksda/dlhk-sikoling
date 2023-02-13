import { DefaultPalette, Dropdown, IDropdownOption, IStackItemStyles, Label, PrimaryButton, Stack, TextField } from "@fluentui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm, FormProvider } from "react-hook-form";
import { array, object, TypeOf, z } from "zod";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useGetAllJenisKelaminQuery } from "../../features/jenis-kelamin/jenis-kelamin-api-slice";
import { IJenisKelamin } from "../../features/jenis-kelamin/jenis-kelamin-slice";
import { useGetPersonByNikQuery } from "../../features/person/person-api-slice";
import { setNama, setNik, setPerson, setPersonAlamat, setPersonJenisKelamin } from "../../features/person/person-slice";
import { FileUpload } from "../UploadFiles/FileUpload";
import { TemplateAlamat } from "./template-alamat";


const kontakSchema = object({
    telepone: z.string(),
    fax: z.string(),
    email: z.string(),
});
type FormData = z.infer<typeof kontakSchema>;

const stackItemStyles: IStackItemStyles = {
    root: {
        margintop: 0,
        border: `1px solid ${DefaultPalette.orangeLighter}`,
        padding: 8,
    },
};
const stackHorTokens = { childrenGap: 4 };

export const TemplateKontak = () => {
    //redux state variable
    const person = useAppSelector((state) => state.person);
    const alamat = useAppSelector((state) => state.alamat);
    const dispatch = useAppDispatch();
    //react form hook state
    const {handleSubmit, control} = useForm<FormData>({
        resolver: zodResolver(kontakSchema)
    });
   
    return (
        <Stack horizontal tokens={stackHorTokens} styles={{root: {alignItems: 'left'}}}>
            <Stack.Item grow>
                <Controller
                    name="email"
                    control={control}
                    render={
                        ({
                            field: {name: fieldName, onChange, value},
                            fieldState: {error}
                        }) => 
                        <TextField 
                            name={fieldName}
                            label="Email"
                            placeholder="isi dengan email yang masih aktif"
                            errorMessage={error?.message}
                            onChange={onChange}
                            defaultValue={value}
                        />
                    }
                />               
            </Stack.Item>
            <Stack.Item>
                <Controller
                    name="telepone"
                    control={control}
                    render={
                        ({
                            field: {name: fieldName, onChange, value},
                            fieldState: {error}
                        }) => 
                        <TextField 
                            name={fieldName}
                            label="Telp."
                            placeholder="Nik sesuai ktp"
                            errorMessage={error?.message}
                            onChange={onChange}
                            defaultValue={value}
                            styles={{root:{width: 250}}}
                        />
                    }
                />               
            </Stack.Item>
            <Stack.Item>
                <Controller
                    name="fax"
                    control={control}
                    render={
                        ({
                            field: {name: fieldName, onChange, value},
                            fieldState: {error}
                        }) => 
                        <TextField 
                            name={fieldName}
                            label="Fax."
                            placeholder="Nik sesuai ktp"
                            errorMessage={error?.message}
                            onChange={onChange}
                            defaultValue={value}
                            styles={{root:{width: 250}}}
                        />
                    }
                />               
            </Stack.Item>
        </Stack>
    );
}