import { DefaultPalette, Dropdown, IDropdownOption, IStackItemStyles, Label, Stack } from "@fluentui/react";
import { useCallback,  useMemo } from "react";
import { Controller, useFormContext } from "react-hook-form";
// import { useGetAllJabatanQuery } from "../../features/jabatan/jabatan-api-slice";
import { IJabatan } from "../../features/repository/ssot/jabatan-slice";
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
            <Stack.Item>
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
                                    styles={{root:{width: 400}}}
                                    required
                                />
                            }
                        />
                    </Stack.Item>                
                </Stack>
            </Stack.Item>
            <Stack.Item>
                <Label>Data pribadi</Label>
            </Stack.Item>
            <Stack.Item styles={stackItemStyles}>
                <TemplatePerson />
            </Stack.Item>
        </>
    );
}