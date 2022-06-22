import React from "react"
import { Dropdown, IDropdownOption, IDropdownStyles } from "@fluentui/react"
import { useGetKecamatanByKecamatanQuery } from "../../features/kecamatan/kecamatan-api-slice" 
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { setKecamatan } from "../../features/kecamatan/kecamatan-slice"

const dropdownStyles: Partial<IDropdownStyles> = { dropdown: { width: 300 } };

const kecamatanOptions = [
    { key: '3515110', text: 'SIDOARJO' },
    { key: '3515120', text: 'BUDURAN' },
    { key: '3515130', text: 'SEDATI' },
  ];

export const KecamatanDropDown: React.FunctionComponent = () => {
    const kecamatan = useAppSelector(state => state.kecamatan);
    const [selectedItem, setSelectedItem] = React.useState<IDropdownOption>();
    const { data = [], isFetching } = useGetKecamatanByKecamatanQuery(kecamatan.id);
    const dispatch = useAppDispatch();

    const onChange = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
        setSelectedItem(item);
        dispatch(setKecamatan({id: item.key as string, nama: item.text}));
    };

    return (
        <Dropdown 
            label="Kecamatan"
            selectedKey={selectedItem ? selectedItem.key : undefined}
            onChange={onChange}
            placeholder="Pilih Kecamatan"
            options={kecamatanOptions}
            styles={dropdownStyles}
        />
    )
}