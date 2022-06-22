import React from "react"
import { Dropdown, IDropdownOption, IDropdownStyles } from "@fluentui/react"
import { useGetDesaByKecamatanQuery } from "../../features/desa/desa-api-slice"
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { setDesa } from "../../features/desa/desa-slice"

const dropdownStyles: Partial<IDropdownStyles> = { dropdown: { width: 300 } };

export const DesaDropDown: React.FunctionComponent = () => {
    const kecamatan = useAppSelector(state => state.kecamatan);
    const desa = useAppSelector(state => state.desa);
    const dispatch = useAppDispatch();
    const { data = [], isFetching } = useGetDesaByKecamatanQuery(kecamatan.id);    
    const dataDesaOptions = data.map((t) => { return {key: t.id, text: t.nama}; });
    
    const onChange = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
        dispatch(setDesa({id: item.key as string, nama: item.text}));
    };

    return (
        <Dropdown 
            label="Desa"
            selectedKey={!isFetching ? desa.id : undefined}
            onChange={onChange}
            placeholder="Pilih Desa"
            options={dataDesaOptions}
            styles={dropdownStyles}
        />
    )
}