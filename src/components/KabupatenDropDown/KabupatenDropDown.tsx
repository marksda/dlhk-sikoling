import React from "react"
import { Dropdown, IDropdownOption, IDropdownStyles } from "@fluentui/react"
import { useGetKabupatenByPropinsiQuery } from "../../features/kabupaten/kabupaten-api-slice" 
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { IKabupaten, setKabupaten } from "../../features/kabupaten/kabupaten-slice"
import { resetDesa } from "../../features/desa/desa-slice"
import { resetKecamatan } from "../../features/kecamatan/kecamatan-slice"

const dropdownStyles: Partial<IDropdownStyles> = { dropdown: { width: 300 } };

export const KabupatenDropDown: React.FunctionComponent = () => {
    const propinsi = useAppSelector(state => state.propinsi);
    const kabupaten = useAppSelector(state => state.kabupaten);
    const dispatch = useAppDispatch();

    const { data = [], isFetching } = useGetKabupatenByPropinsiQuery(propinsi.id);
    const dataKabupatenOptions = data.map((t) => { return {key: t.id as string, text: t.nama as string}; });

    const onChange = (event: React.FormEvent<HTMLDivElement>, item?: IDropdownOption<IKabupaten>, index?: number): void => {
        dispatch(resetDesa());
        dispatch(resetKecamatan());
        dispatch(setKabupaten({id: item?.key as string, nama: item?.text}));
    };

    return (
        <Dropdown 
            label="Kabupaten / Kota"
            selectedKey={!isFetching ? kabupaten.id : undefined}
            onChange={onChange}
            placeholder="Pilih Kabupaten"
            options={dataKabupatenOptions}
            styles={dropdownStyles}
        />
    )
}