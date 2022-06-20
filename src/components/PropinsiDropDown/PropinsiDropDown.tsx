import React from "react";
import { Dropdown, IDropdownOption, IDropdownStyles } from "@fluentui/react";
import { useGetAllQuery } from "../../features/propinsi/propinsi-api-slice";

const dropdownStyles: Partial<IDropdownStyles> = { dropdown: { width: 300 } };

const dropdownControlledExampleOptions = [
    { key: 'apple', text: 'Apple' },
    { key: 'banana', text: 'Banana' },
    { key: 'orange', text: 'Orange', disabled: true },
    { key: 'grape', text: 'Grape' },
    { key: 'broccoli', text: 'Broccoli' },
    { key: 'carrot', text: 'Carrot' },
    { key: 'lettuce', text: 'Lettuce' },
  ];

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
            options={dropdownControlledExampleOptions}
            styles={dropdownStyles}
        />
    )
}