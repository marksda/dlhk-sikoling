import React from "react"
import { Dropdown, IDropdownOption, IDropdownStyles } from "@fluentui/react"
import { useGetKabupatenByPropinsiQuery } from "../../features/kabupaten/kabupaten-api-slice" 
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { setKabupaten } from "../../features/kabupaten/kabupaten-slice"

const dropdownStyles: Partial<IDropdownStyles> = { dropdown: { width: 300 } };

export const KabupatenDropDown: React.FunctionComponent = () => {
    const propinsi = useAppSelector(state => state.propinsi);
    const kabupaten = useAppSelector(state => state.kabupaten);
    const dispatch = useAppDispatch();

    const { data = [], isFetching } = useGetKabupatenByPropinsiQuery(propinsi.id);
    const dataKabupatenOptions = data.map((t) => { return {key: t.id, text: t.nama}; });

    const onChange = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
        dispatch(setKabupaten({id: item.key as string, nama: item.text}));
    };

    return (
        <Dropdown 
            label="Kabupaten"
            selectedKey={!isFetching ? kabupaten.id : undefined}
            onChange={onChange}
            placeholder="Pilih Kabupaten"
            options={dataKabupatenOptions}
            styles={dropdownStyles}
        />
    )
}