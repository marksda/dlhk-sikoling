import React from "react"
import { Dropdown, IDropdownOption, IDropdownStyles } from "@fluentui/react"
import { useGetAllJenisKelaminQuery } from "../../features/jenis-kelamin/jenis-kelamin-api-slice"
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { IJenisKelamin, setJenisKelamin } from "../../features/jenis-kelamin/jenis-kelamin-slice"


const dropdownStyles: Partial<IDropdownStyles> = { dropdown: { width: 300 } };

export const JenisKelaminDropDown: React.FunctionComponent = () => {
    const jeniskelamin = useAppSelector(state => state.jenisKelamin);
    const dispatch = useAppDispatch();
    const { data = [], isFetching } = useGetAllJenisKelaminQuery();
    const dataJenisKelaminOptions = data.map((t) => {
            return {key: t.id as string, text: t.nama as string}; 
        });

    const onChange = (event: React.FormEvent<HTMLDivElement>, item?: IDropdownOption<IJenisKelamin>, index?: number): void => {
        dispatch(setJenisKelamin({id: item?.key as string, nama: item?.text}));
    };

    return (
        <Dropdown 
            label="Jenis Kelamin"
            selectedKey={!isFetching ? jeniskelamin.id : undefined}
            onChange={onChange}
            placeholder="Pilih Jenis Kelamin"
            options={dataJenisKelaminOptions}
            styles={dropdownStyles}
        />
    )
}