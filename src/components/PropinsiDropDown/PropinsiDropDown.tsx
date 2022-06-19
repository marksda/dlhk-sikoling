import React from "react";
import { Dropdown, IDropdownOption, IDropdownStyles } from "@fluentui/react";
import { useGetAllQuery } from "../../features/propinsi/propinsi-api-slice";

const dropdownStyles: Partial<IDropdownStyles> = { dropdown: { width: 300 } };


export const PropinsiDropDown: React.FunctionComponent = () => {
    const [selectedItem, setSelectedItem] = React.useState<IDropdownOption>();
    const { data = [], isFetching } = useGetAllQuery();

    const onChange = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
        setSelectedItem(item);
    };

    return (
        <Dropdown 
            label="Propinsi"
            selectedKey={selectedItem ? selectedItem.key : undefined}
            onChange={onChange}
            placeholder="Pilih Propinsi"
            options={data}
            styles={dropdownStyles}
        />
    )
}