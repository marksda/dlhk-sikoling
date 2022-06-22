import React from "react"
import { Dropdown, IDropdownOption, IDropdownStyles } from "@fluentui/react"
import { useGetAllPropinsiQuery } from "../../features/propinsi/propinsi-api-slice"
import { useAppDispatch } from '../../app/hooks'
import { IPropinsi, setPropinsi } from "../../features/propinsi/propinsi-slice"
import { defaultPropinsi } from "../../features/config/config"

const dropdownStyles: Partial<IDropdownStyles> = { dropdown: { width: 300 } };

const propinsiOptions = [
    { key: '11', text: 'ACEH' },
    { key: '12', text: 'SUMATERA BARAT' },
    { key: '35', text: 'JAWA TIMUR' },
  ];

export const PropinsiDropDown: React.FunctionComponent = () => {
    const [selectedItem, setSelectedItem] = React.useState<IPropinsi>(defaultPropinsi);
    const { data = [], isFetching } = useGetAllPropinsiQuery();
    const dispatch = useAppDispatch();

    const onChange = (event: React.FormEvent<HTMLDivElement>, item: IPropinsi): void => {
        setSelectedItem(item);
        dispatch(setPropinsi({id: item.id, nama: item.nama}));
    };

    return (
        <Dropdown 
            label="Propinsi"
            selectedKey={data.length > 0 ? selectedItem.id : undefined}
            onChange={onChange}
            placeholder="Pilih Propinsi"
            options={propinsiOptions}
            styles={dropdownStyles}
        />
    )
}