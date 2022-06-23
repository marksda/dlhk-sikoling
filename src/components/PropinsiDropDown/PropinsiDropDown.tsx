import React from "react"
import { Dropdown, IDropdownOption, IDropdownStyles } from "@fluentui/react"
import { useGetAllPropinsiQuery } from "../../features/propinsi/propinsi-api-slice"
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { IPropinsi, setPropinsi } from "../../features/propinsi/propinsi-slice"
import { resetKabupaten } from "../../features/kabupaten/kabupaten-slice"
import { resetKecamatan } from "../../features/kecamatan/kecamatan-slice"
import { resetDesa } from "../../features/desa/desa-slice"


const dropdownStyles: Partial<IDropdownStyles> = { dropdown: { width: 300 } };

export const PropinsiDropDown: React.FunctionComponent = () => {
    const propinsi = useAppSelector(state => state.propinsi);
    const dispatch = useAppDispatch();
    const { data = [], isFetching } = useGetAllPropinsiQuery();
    const dataPropinsiOptions = data.map((t) => {
            return {key: t.id as string, text: t.nama as string}; 
        });

    const onChange = (event: React.FormEvent<HTMLDivElement>, item?: IDropdownOption<IPropinsi>, index?: number): void => {
        dispatch(resetDesa());
        dispatch(resetKecamatan());
        dispatch(resetKabupaten());
        dispatch(setPropinsi({id: item?.key as string, nama: item?.text}));
    };

    return (
        <Dropdown 
            label="Propinsi"
            selectedKey={!isFetching ? propinsi.id : undefined}
            onChange={onChange}
            placeholder="Pilih Propinsi"
            options={dataPropinsiOptions}
            styles={dropdownStyles}
        />
    )
}