import React from "react"
import { Dropdown, IDropdownOption, IDropdownStyles } from "@fluentui/react"
import { useGetDesaByKecamatanQuery } from "../../features/desa/desa-api-slice"
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { setDesa } from "../../features/desa/desa-slice"

const dropdownStyles: Partial<IDropdownStyles> = { dropdown: { width: 300 } };

const desaOptions = [
    { key: '3515110', text: 'SIDOARJO' },
    { key: '3515120', text: 'BUDURAN' },
    { key: '3515130', text: 'SEDATI' },
  ];

export const KabupatenDropDown: React.FunctionComponent = () => {
    const kecamatan = useAppSelector(state => state.kecamatan);
    const [selectedItem, setSelectedItem] = React.useState<IDropdownOption>();
    const { data = [], isFetching } = useGetDesaByKecamatanQuery(kecamatan.id);
    const dispatch = useAppDispatch();

    const onChange = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
        setSelectedItem(item);
        dispatch(setDesa({id: item.key as string, nama: item.text}));
    };

    return (
        <Dropdown 
            label="Desa"
            selectedKey={selectedItem ? selectedItem.key : undefined}
            onChange={onChange}
            placeholder="Pilih Desa"
            options={desaOptions}
            styles={dropdownStyles}
        />
    )
}