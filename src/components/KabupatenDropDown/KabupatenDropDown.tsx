import React from "react"
import { Dropdown, IDropdownOption, IDropdownStyles } from "@fluentui/react"
import { useGetKabupatenByPropinsiQuery } from "../../features/kabupaten/kabupaten-api-slice" 
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { setKabupaten } from "../../features/kabupaten/kabupaten-slice"

const dropdownStyles: Partial<IDropdownStyles> = { dropdown: { width: 300 } };

const kabupatenOptions = [
    { key: '3514', text: 'PASURUAN' },
    { key: '3515', text: 'SIDOARJO' },
    { key: '3516', text: 'MOJOKERTO' },
  ];

export const KabupatenDropDown: React.FunctionComponent = () => {
    const propinsi = useAppSelector(state => state.propinsi);
    const [selectedItem, setSelectedItem] = React.useState<IDropdownOption>();
    const { data = [], isFetching } = useGetKabupatenByPropinsiQuery(propinsi.id);
    const dispatch = useAppDispatch();

    const onChange = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
        setSelectedItem(item);
        dispatch(setKabupaten({id: item.key as string, nama: item.text}));
    };

    return (
        <Dropdown 
            label="Kabupaten"
            selectedKey={selectedItem ? selectedItem.key : undefined}
            onChange={onChange}
            placeholder="Pilih Kabupaten"
            options={kabupatenOptions}
            styles={dropdownStyles}
        />
    )
}