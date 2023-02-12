import { Dropdown, IDropdownOption, Stack } from "@fluentui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useCallback, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { object, z } from "zod";
import { useGetAllPropinsiQuery } from "../../features/propinsi/propinsi-api-slice";
import { IPropinsi } from "../../features/propinsi/propinsi-slice";


const alamatSchema = object({
    propinsi: object({
        id: z.string(),
        nama: z.string(),
    }),
});

type FormData = z.infer<typeof alamatSchema>;

export const TemplateAlamat = React.forwardRef(
    (props, ref) => {
        const { data: daftarPropinsi, isFetching: isFetchingDataPropinsi, isError: isErrorPropinsi } = useGetAllPropinsiQuery();

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
        
        const {handleSubmit, control} = useForm<FormData>({
            resolver: zodResolver(alamatSchema)
        });

        const handleChangePropinsi = useCallback(
            (item): IPropinsi => {
                return {
                    id: item.key,
                    nama: item.text
                };
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
                            />
                        }
                    />               
                </Stack.Item>
            </>
        );
    } 
)  