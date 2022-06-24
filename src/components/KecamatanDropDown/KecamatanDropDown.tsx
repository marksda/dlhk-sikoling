import React from "react"
import { Dropdown, IDropdownOption, IDropdownStyles } from "@fluentui/react"
import { useGetKecamatanByKabupatenQuery } from "../../features/kecamatan/kecamatan-api-slice"
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { IKecamatan, setKecamatan } from "../../features/kecamatan/kecamatan-slice"
import { resetDesa } from "../../features/desa/desa-slice"

const dropdownStyles: Partial<IDropdownStyles> = { dropdown: { width: 300 } };

export const KecamatanDropDown: React.FunctionComponent = () => {
    const kabupaten = useAppSelector(state => state.kabupaten);
    const kecamatan = useAppSelector(state => state.kecamatan);
    const dispatch = useAppDispatch();
    const { data = [], isFetching } = useGetKecamatanByKabupatenQuery(kabupaten.id);    
    const dataKecamatanOptions = data.map((t) => { return {key: t.id as string, text: t.nama as string}; });    

    const onChange = (event: React.FormEvent<HTMLDivElement>, item?: IDropdownOption<IKecamatan>, index?: number): void => {
        dispatch(resetDesa());
        dispatch(setKecamatan({id: item?.key as string, nama: item?.text}));
    };

    return (
        <Dropdown 
            label="Kecamatan"
            selectedKey={!isFetching ? kecamatan.id : undefined}
            onChange={onChange}
            placeholder="Pilih Kecamatan sesuai dengan ktp"
            options={dataKecamatanOptions}
            styles={dropdownStyles}
        />
    )
}