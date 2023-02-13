import { DefaultPalette, Dropdown, IDropdownOption, IStackItemStyles, Label, Stack, TextField } from "@fluentui/react";
import { useCallback, useEffect, useMemo } from "react";
import { Controller, useForm, useFormContext } from "react-hook-form";
import { object, z } from "zod";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useGetAllJabatanQuery } from "../../features/jabatan/jabatan-api-slice";
import { IJabatan, setJabatan } from "../../features/jabatan/jabatan-slice";
import { setJabatanPegawai, setPersonPegawai, setPerusahaanPegawai } from "../../features/pegawai/pegawai-slice";
import { TemplatePerson } from "./template-person";

const stackItemStyles: IStackItemStyles = {
    root: {
        margintop: 0,
        border: `1px solid ${DefaultPalette.orangeLighter}`,
        padding: 8,
    },
};
const stackHorTokens = { childrenGap: 4 };

export const TemplatePegawai = () => {
    const {
        control
    } = useFormContext();
    //rtk query hook vatiable
    const { data: daftarJabatan, isFetching: isFetchingDataJabatan, isError: isErrorJabatan } = useGetAllJabatanQuery();

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
            return jabatan;
        },
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
                                errorMessage={error?.message == 'Required'?'Harus diisi':error?.message}
                                onChange={(e, selectedItem) => {
                                    onChange(handleChangeJabatan(selectedItem));
                                }}
                                styles={{root:{width: 250}}}
                                required
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
        </>
    );
}