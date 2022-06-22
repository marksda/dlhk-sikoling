import React from "react"
import { Dropdown, IDropdownOption, IDropdownStyles } from "@fluentui/react"
import { useGetAllPropinsiQuery } from "../../features/propinsi/propinsi-api-slice"
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { setPropinsi } from "../../features/propinsi/propinsi-slice"


const dropdownStyles: Partial<IDropdownStyles> = { dropdown: { width: 300 } };

export const PropinsiDropDown: React.FunctionComponent = () => {
    const propinsi = useAppSelector(state => state.propinsi);
    const dispatch = useAppDispatch();
    const { data = [], isFetching } = useGetAllPropinsiQuery();
    const dataPropinsiOptions = data.map((t) => { return {key: t.id, text: t.nama}; });

    const onChange = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
        dispatch(setPropinsi({id: item.key as string, nama: item.text}));
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