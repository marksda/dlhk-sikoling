import React from "react"
import { Dropdown, IDropdownOption, IDropdownStyles } from "@fluentui/react"
import { useGetAllQuery } from "../../features/propinsi/propinsi-api-slice"
import { useAppDispatch } from '../../app/hooks'
import { setPropinsi } from "../../features/propinsi/propinsi-slice"

const dropdownStyles: Partial<IDropdownStyles> = { dropdown: { width: 300 } };

const kabupatenOptions = [
    { key: '11', text: 'ACEH' },
    { key: '12', text: 'SUMATERA BARAT' },
    { key: '35', text: 'JAWA TIMUR' },
  ];

export const PropinsiDropDown: React.FunctionComponent = () => {
    const [selectedItem, setSelectedItem] = React.useState<IDropdownOption>();
    const { data = [], isFetching } = useGetAllQuery();
    const dispatch = useAppDispatch();

    const onChange = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
        setSelectedItem(item);
        dispatch(setPropinsi({id: item.key as string, nama: item.text}));
    };

    return (
        <Dropdown 
            label="Propinsi"
            selectedKey={selectedItem ? selectedItem.key : undefined}
            onChange={onChange}
            placeholder="Pilih Propinsi"
            options={propinsiOptions}
            styles={dropdownStyles}
        />
    )
}